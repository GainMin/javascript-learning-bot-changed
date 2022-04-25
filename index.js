const { Telegraf, session, Markup } = require('telegraf');
const { URL } = require('url');
const commandsList = require('./constComands');
const {controllerDb, controllerLesson, controllerFile} = require("./controller");
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);


var Controller = new Controller();


bot.use(session());

bot.command("/start", async ctx => {
    try {
        var user = Controller.setUser(handlerUserData(ctx))

        if(user.flag === "newUser") {
            await ctx.replyWithHTML("<b>меню</b>", Markup.inlineKeyboard([
                [Markup.button.callback("как проходит обучение?", "howStudy")],
                [Markup.button.callback("начать обучение", "startCourse")],
            ]));
        } else if(user.flag === "oldUser") {
            await ctx.replyWithHTML(`вы остановились на ${user.answer.lesson.split("_")[1]} уроке`, Markup.inlineKeyboard([
                [Markup.button.callback("продолжить обучение", `${user.answer.lesson}`)] // предложить урок
            ]));
        }
    } catch(err) {
        console.error(err);
    }
});

// начало курса
bot.action("startCourse", async ctx => {
    //! необходима проверка на поле lessen для того что бы предложить определенный урок
    try {
        const userInfo = handlerUserData(ctx);
        await ctx.answerCbQuery();

        await ctx.replyWithHTML(`${userInfo.username} добро пожаловать на курс по изучению языка программирования JavaScript`);

        setTimeout(() => {
            ctx.replyWithHTML(`видео с началом курса`, Markup.inlineKeyboard([
                [Markup.button.callback("урок 1", "lesson_1")] // предложить урок
            ]));
        }, 1000);
    } catch(err) {
        console.error(err);
    }
});

// обработка первого урока
bot.action("lesson_1", async ctx => {
    try {
        await ctx.answerCbQuery();
        await ctx.replyWithHTML("пришло обучающее видео 1" );
        // command receive home work
        setTimeout(() => {
            ctx.replyWithHTML(`получить домашнее задание`, Markup.inlineKeyboard([
                [Markup.button.callback("получить", "getHomeWork")]
            ]))
        }, 2000);
        // bot.sendVideo(5148026987, "https://vk.com/video173604987_167765316")
    } catch(err) {
        console.error(err);
    }
});

// обработка второго урока
bot.action("lesson_2", async ctx => {
    try {
        await ctx.answerCbQuery();
        await ctx.replyWithHTML("пришло обучающее видео 2" );
        // command receive home work
        setTimeout(() => {
            ctx.replyWithHTML(`получить домашнее задание`, Markup.inlineKeyboard([
                [Markup.button.callback("получить", "getHomeWork")]
            ]));
        }, 2000);
        // bot.sendVideo(5148026987, "https://vk.com/video173604987_167765316")
    } catch(err) {
        console.error(err);
    }
});

// обработка третьего урока
bot.action("lesson_3", async ctx => {
    try {
        await ctx.answerCbQuery();
        await ctx.replyWithHTML("пришло обучающее видео 3" );
        // command receive home work
        setTimeout(() => {
            ctx.replyWithHTML(`получить домашнее задание`, Markup.inlineKeyboard([
                [Markup.button.callback("получить", "getHomeWork")]
            ]));
        }, 2000);
        // bot.sendVideo(5148026987, "https://vk.com/video173604987_167765316")
    } catch(err) {
        console.error(err);
    }
});

// обработка четвертого урока
bot.action("lesson_4", async ctx => {
    try {
        await ctx.answerCbQuery();
        await ctx.replyWithHTML("пришло обучающее видео 4" );
        // command receive home work
        setTimeout(() => {
            ctx.replyWithHTML(`получить домашнее задание`, Markup.inlineKeyboard([
                [Markup.button.callback("получить", "getHomeWork")]
            ]));
        }, 2000);
        // bot.sendVideo(5148026987, "https://vk.com/video173604987_167765316")
    } catch(err) {
        console.error(err);
    }
});

bot.action("getHomeWork", async ctx => {
    // сделать запрос к бд проверить название урока и в соответствии с названием обработать ссылку и прислать соответствующее задание
    // получили ссылку обработать и предложить скачать клиенту архив с заданием
    try {
        await ctx.answerCbQuery();

        await bot.telegram.sendDocument(ctx.chat.id, await controllerLesson(await controllerDb(handlerUserData(ctx), "", "user"), "getLinks").downloadLInk);

        setTimeout(() => {
            ctx.replyWithHTML(`загрузить домашнее задание`, Markup.inlineKeyboard([
                [Markup.button.callback("загрузить", "uploadHomeWork")]
            ]))
        }, 2000);
    } catch(err) {
        console.error(err);
    }
});

bot.action("uploadHomeWork", async ctx => {
    try {
        await ctx.answerCbQuery();
        await ctx.replyWithHTML(`пришлите файл с домашним заданием в ответ на это сообщение или`);

        //! запрос к БД для отката урока
        const user = await controllerDb(handlerUserData(ctx), "", "user"); // исправить аргумент пустую ссылку

        setTimeout(() => {
            ctx.replyWithHTML(`вернуться к уроку`, Markup.inlineKeyboard([
                [Markup.button.callback("повторить урок", user.answer.lesson)]
            ]))
        }, 1000);

        bot.on("message", async ctx => {
            try {
                const arrayObjects = await ctx.telegram.getUpdates(ctx.update.update_id);
                const file = await ctx.telegram.getFile(arrayObjects[0].message.document.file_id); // объект с полями о документе

                const controllerConfig = {
                    userInfo: handlerUserData(ctx),
                    ctx: ctx,
                    objectMessage: arrayObjects[0],
                    url: `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`,
                    user: user
                }
                //! переделать
                // if (!ctx.update.message.document) await controllerFile(ctx, "reapit"); // написать уневирсальну функцию которая определитт что не правильно формат или тип файла(документа)
                let flag = await controllerFile(controllerConfig, "","downloadFile");
                // console.log(flag)
                //! verifay on Document on format file
                // console.log(ctx.update.message.document); //! тут проверить пришёл документ или нет если нет флаг false
                const lesson = (await controllerDb(handlerUserData(ctx), "", "user")).answer.lesson;



                if(flag) {
                    let resultReplayHomeworkFile = await controllerFile(controllerConfig, lesson, "replayHomeworkFile");
                    await controllerFile(controllerConfig, "", "deleteFile"); // удаление файла
                    if(resultReplayHomeworkFile.result === true) {
                        await controllerDb(handlerUserData(ctx), lesson, "updateLesson");
                        await ctx.replyWithHTML(`${resultReplayHomeworkFile.message}`, Markup.inlineKeyboard([
                            [Markup.button.callback(`перейти к уроку ${Number(lesson.split("_")[1]) + 1}`, (await controllerDb(handlerUserData(ctx), "", "user")).answer.lesson)]
                        ]));
                    } else {
                        await ctx.replyWithHTML(`${resultReplayHomeworkFile.message}`, Markup.inlineKeyboard([ // если не правильно то повоторить
                            [Markup.button.callback("отправить файл повторно", "uploadHomeWork")],
                            [Markup.button.callback("повторить урок", lesson)]
                        ]));
                    }
                } else {
                    await ctx.replyWithHTML(`${handlerUserData(ctx).username} пришлите файл который соответсвует требованием из вводного занятия`);
                    await ctx.replyWithHTML(`неверное формат файла`, Markup.inlineKeyboard([
                        [Markup.button.callback("отправить файл", "uploadHomeWork")],
                        [Markup.button.callback("повторить вводное занятие", "howStudy")],
                        [Markup.button.callback("повторить урок", lesson)]
                    ]));
                }
            } catch(err) {
                console.error(err);
            }
        });
    } catch(err) {
        console.error(err);
    }
});

bot.help(ctx => ctx.reply(commandsList.comands));

bot.launch();

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM'));

// переопределение ctx
function handlerUserData(ctx) {
    let userData = {
        userid: ctx.from.id,
        username: ctx.from.username
    }
    return userData;
};
