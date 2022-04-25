const { Telegraf, session, Markup } = require('telegraf');
const { URL } = require('url');
const commandsList = require('./constComands');
const {controllerDb, controllerLesson, controllerFile} = require("./controller");
require('dotenv').config();

const bot = new Telegraf(process.env.BOT_TOKEN);

bot.use(session());

bot.command("/start", async ctx => {
    try {
        const user = await controllerDb(handlerUserData(ctx), "", "user");// исправить аргумент пустую ссылку

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
        let arrayLinks = await controllerLesson(await controllerDb(handlerUserData(ctx), "", "user"), "getLinks"); // исправить аргумент пустую ссылку
        await ctx.answerCbQuery();
        // const url = new URL("https://drive.google.com/file/d/1gvydkKyr-O6DFHojB9zYXhNR00AL3mgS/view?usp=sharing");
        const url = new URL(arrayLinks[1]);
        const urlPath = url.pathname.split(/\//);
        const id = urlPath[urlPath.length - 2];

        await bot.telegram.sendDocument(
            ctx.chat.id,
            `https://docs.google.com/uc?export=download&id=${id}`
        );
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
                    if(resultReplayHomeworkFile.result === true) {
                        await controllerFile(controllerConfig, "", "deleteFile"); // удаление файла
                        await controllerDb(handlerUserData(ctx), lesson, "updateLesson");

                        await ctx.replyWithHTML(`${resultReplayHomeworkFile.message}`, Markup.inlineKeyboard([
                            [Markup.button.callback(`перейти к уроку ${Number(lesson.split("_")[1]) + 1}`, (await controllerDb(handlerUserData(ctx), "", "user")).answer.lesson)]
                        ]));
                    } else {
                        await controllerFile(controllerConfig, "", "deleteFile"); // удаление файла
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







































// const { Telegraf, session, Markup } = require('telegraf');
// const { URL } = require('url');
// const DB = require("./db");
// const Lesson = require("./lesson");
// const File = require("./file");
// const comandsList = require('./constComands');
// const bot = new Telegraf(process.env.BOT_TOKEN);
// require('dotenv').config();

// bot.use(session());

// bot.command("/start", async ctx => {
//     try {
//         const userInfo = await handlerUserData(ctx);
//         console.log(userInfo);
//         const managmentDB = new DB(userInfo);       
//         await managmentDB.createUser();

//         await ctx.replyWithHTML("<b>меню</b>", Markup.inlineKeyboard([
//             [Markup.button.callback("как проходит обучение?", "howStudy")],
//             [Markup.button.callback("начать обучение", "startCourse")],
//         ]));


//     } catch(err) {
//         console.error(err);
//     }
// });

// // начало курса
// bot.action("startCourse", async ctx => { 
//     //! необходима проверка на поле lrssen для того что бы предложить определенный урок
//     try {
//         const userInfo = await handlerUserData(ctx);
//         await ctx.answerCbQuery();
//         const managmentDB = new DB(userInfo);       
//         const user = await managmentDB.getUser();
//         if(user === null) await managmentDB.createUser(); // если нет user создать 
//         await ctx.replyWithHTML(`${userInfo.username} добро пожаловать на курс по изучению языка программирования JavaScript`);

//         setTimeout(() => {
//             ctx.replyWithHTML(`видео с началом курса`, Markup.inlineKeyboard([
//                 [Markup.button.callback("урок 1", "lesson_1")] // предложить урок
//             ]));
//         }, 1000);
//     } catch(err) {
//         console.error(err);
//     }
// });

// // обработка первого урока 
// //! создание новой таблицы в бд с id, progress  
// bot.action("lesson_1", async ctx => {
//     try {
//         await ctx.answerCbQuery();
//         await ctx.replyWithHTML("пришло обучающее видео 1" );
//         // comand receive home work
//         setTimeout(() => {
//             ctx.replyWithHTML(`получить домашнее задание`, Markup.inlineKeyboard([
//                 [Markup.button.callback("получить", "getHomeWork")]
//             ]))
//         }, 2000);

//         // bot.sendVideo(5148026987, "https://vk.com/video173604987_167765316")
//     } catch(err) {
//         console.error(err);
//     }
// });

// // обработка второго урока
// bot.action("lesson_2", async ctx => {
//     try {
//         await ctx.answerCbQuery();
//         await ctx.replyWithHTML("пришло обучающее видео 2" );
//         // comand receive home work
//         setTimeout(() => {
//             ctx.replyWithHTML(`получить домашнее задание`, Markup.inlineKeyboard([
//                 [Markup.button.callback("получить", "getHomeWork")]
//             ]))
//         }, 2000);
//         // bot.sendVideo(5148026987, "https://vk.com/video173604987_167765316")
//     } catch(err) {
//         console.error(err);
//     }
// });

// bot.action("getHomeWork", async ctx => {
//     // сделать запрос к бд проверить название урока и в соответствии с названием обработать ссылку и прислать соответствующее задание
//     let userInfo = handlerUserData(ctx);
//     const managmentDB = new DB(userInfo); // использовать контекст из функции прокладки
//     const handlerlesson = new Lesson(await managmentDB.getUser());
//     let arrayLinks =  handlerlesson.getLinksLesson();
//     // получили ссылку обработать и предложить скачать клиенту архив с заданием
//     try {
//         await ctx.answerCbQuery();
//         // const url = new URL("https://drive.google.com/file/d/1gvydkKyr-O6DFHojB9zYXhNR00AL3mgS/view?usp=sharing");
//         const url = new URL(arrayLinks[1]);
//         const urlpath = url.pathname.split(/\//);
//         const id = urlpath[urlpath.length - 2];

//         await bot.telegram.sendDocument(
//             ctx.chat.id,
//             `https://docs.google.com/uc?export=download&id=${id}`
//         );

//         setTimeout(() => {
//             // ctx.replyWithHTML(`загрузите домашнее задание, отправте файл в ответ на это уведомление`);
//             ctx.replyWithHTML(`загрузить домашнее задание`, Markup.inlineKeyboard([
//                 [Markup.button.callback("загрузить", "uploadHomeWork")]
//             ]))
//         }, 2000);
//     } catch(err) {
//         console.error(err);
//     }
// });

// bot.action("uploadHomeWork", async ctx => {
//     try {
//         await ctx.answerCbQuery();
//         await ctx.replyWithHTML(`пришлите файл с домашним заданием в ответ на это сообщение или`);

//         //! запрос к БД для отката урока
//         let userInfo = handlerUserData(ctx);
//         const managmentDB = new DB(userInfo); // использовать контекст из функции прокладки
//         const user = await managmentDB.getUser();
//         const handlerLesson = new Lesson(user);
//         let currentLesson = handlerLesson.currentLesson();
//         setTimeout(() => {
//             // ctx.replyWithHTML(`загрузите домашнее задание, отправте файл в ответ на это уведомление`);
//             ctx.replyWithHTML(`вернуться к уроку`, Markup.inlineKeyboard([
//                 [Markup.button.callback("повторить урок", currentLesson)]
//             ]))
//         }, 1000);

//         bot.on("message", async ctx => {
//             try {
//                 const userInfo = handlerUserData(ctx);
//                 const handlerFile = new File(userInfo.username, userInfo.userid);
//                 const arrayObjects = await ctx.telegram.getUpdates(ctx.update.update_id);
//                 const urlDownload = await handlerFile.linkDownloadFile(ctx, arrayObjects[0]);

//                 if (!ctx.update.message.document) await handlerFile.reapeatDownloadFile(ctx); // написать уневирсальну функцию которая определитт что не правильно формат или тип файла(документа)
//                 let flag = await handlerFile.downoladFile(urlDownload, userInfo, arrayObjects[0]);

//                 // console.log(ctx.update.message.document); //! тут проверить пришёл документ или нет если нет флаг false

//                 //! verifay on Document on format file

//                 if(flag) {
//                     let resultatReplayHomeworkFile = await handlerFile.replayHomeworkFile(userInfo, arrayObjects[0], handlerLesson.currentLesson());
//                     // await handlerFile.resultHandler(result);
//                     let nextLesson = await handlerLesson.newxtLesson();
//                     let prevLesson = await handlerLesson.prevLesson();
//                     let currentLesson = await handlerLesson.currentLesson();

//                     if(resultatReplayHomeworkFile.result === true) {
//                         await handlerFile.deleteFile(userInfo, arrayObjects[0]); // удаление файла
//                         await managmentDB.updateLesson(nextLesson);
//                         ctx.replyWithHTML(`${resultatReplayHomeworkFile.message}`, Markup.inlineKeyboard([
//                             [Markup.button.callback(`перейти к уроку ${nextLesson.split("_")[1]}`, nextLesson)]
//                         ]));
//                     } else {
//                         await handlerFile.deleteFile(userInfo, arrayObjects[0]); // удаление файла
//                         ctx.replyWithHTML(`${resultatReplayHomeworkFile.message}`, Markup.inlineKeyboard([ // если не правильно то повоторить
//                             [Markup.button.callback("отправить файл повторно", "uploadHomeWork")],
//                             [Markup.button.callback("повторить урок", currentLesson)]
//                         ])); 
//                     }  
//                 } else {
//                     ctx.replyWithHTML(`${userInfo.username} пришлите файл который соответсвует требованием из вводного занятия`);
//                     await ctx.replyWithHTML(`неверное формат файла`, Markup.inlineKeyboard([
//                         [Markup.button.callback("отправить файл", "uploadHomeWork")],
//                         [Markup.button.callback("повторить вводное занятие", "howStudy")],
//                         [Markup.button.callback("повторить урок", currentLesson)]
//                     ]));
//                     // await handlerFile.reapeatDownloadFile(ctx);
//                 }
//             } catch(err) {
//                 console.error(err);
//             }
//         });
//     } catch(err) {
//         console.error(err);
//     }
// });

// bot.help(ctx => ctx.reply(comandsList.comands));

// bot.launch();

// // Enable graceful stop
// process.once('SIGINT', () => bot.stop('SIGINT'));
// process.once('SIGTERM', () => bot.stop('SIGTERM'));

// // переопределение ctx
// function handlerUserData(ctx) {
//     let userData = {
//         userid: ctx.from.id,
//         username: ctx.from.username
//     }
//     return userData;
// };













////////////////////////////////////////////////
// const { Telegraf, session, Markup } = require('telegraf');

// const { MongoClient } = require('mongodb');
// // const { session } = require('telegraf-session-mongodb');

// const comandsList = require('./constComands');
// const LINKS = require("./collector");

// const fs = require('fs');
// const axios = require('axios').default;

// const { URL } = require('url');
// // const { LINKS } = require('./collector');

// require('dotenv').config();



// const bot = new Telegraf(process.env.BOT_TOKEN);
// const client = new MongoClient(process.env.MONGODB_URI);

// client.connect();
// const db = client.db("test"); // перееминовать
// const collection = db.collection("users" );

// bot.use(session());

// bot.command("/start", async ctx => {
//     try {
//         await ctx.replyWithHTML("<b>меню</b>", Markup.inlineKeyboard([
//             [Markup.button.callback("как проходит обучение?", "howStudy")],
//             [Markup.button.callback("начать обучение", "startCourse")],
//         ]));


//     } catch(err) {
//         console.error(err);
//     }
// })

// // начало курса
// bot.action("startCourse", async ctx => { 
//     try {

//         const user = await collection.findOne({ id: ctx.from.id }); // or null

//         if (user === null) {
//             await ctx.answerCbQuery();
//             await createNewUser(ctx.from.id, ctx.from.username);

//             // bot.context.db = {
//             //     id: ctx.from.id.id,
//             //     status: true
//             // };
            
            
//             await ctx.replyWithHTML(`${ctx.from.username} добро пожаловать на курс по изучению языка программирования JavaScript`);
//             setTimeout(() => {
//                 ctx.replyWithHTML(`видео с началом курса`, Markup.inlineKeyboard([
//                     [Markup.button.callback("урок 1", "lesson_1")]
//                 ]));
//             }, 2000);
//         } else {
//             await ctx.answerCbQuery();
//             ctx.replyWithHTML(`видео с началом курса`, Markup.inlineKeyboard([
//                 [Markup.button.callback("урок 1", "lesson_1")]
//             ]));
//         }
//     } catch(err) {
//         console.error(err);
//     }
// });

// /*
//     * взаимодействие с БД
// */
// // функция добовления пульзователя в бд
// async function createNewUser(...args) {
//     await collection.insertOne({
//         id: args[0],
//         username: args[1],
//         lesson: "", // флаг для вызова функций, соответсвует наванию уроков
//         arrayLessonsLearned: [] // массив который должен пополоняться прошедшими уроками, для получения списка уроков
//     });
// };

// // функция обнавления в бд прогересса
// async function updateProgress(...args) {

//     let objUser = await collection.findOne({ id: args[0] }); 
    
//     if(objUser.lesson === "" || objUser.lesson !== args[1]) {
//         // objUser.lesson = args[1];
//         await collection.updateOne({ id: args[0] }, {$set: {lesson: args[1]}})
//     }
// }

// /*
//     * ------------ *
// */


// /*
//     * поиск ссылок *
// */
// async function getLinks(id) {
//     let objUser = await collection.findOne({ id: id }); 

//     let lesson = objUser.lesson;

//     for (let key in LINKS) {
//         if(key === lesson) {
//             let arrLinks = [LINKS[key].lesson, LINKS[key].task];
//             return arrLinks
//         }
//     }
// }
// /*
//     * ------------ *
// */

// // обработка первого урока 
// //! создание новой таблицы в бд с id, progress  
// bot.action("lesson_1", async ctx => {
//     try {
//         await ctx.answerCbQuery();
//         await ctx.replyWithHTML("пришло обучающее видео 1" );


//         // функция обнавления в бд прогересса
//         await updateProgress(ctx.from.id, "lesson_1");

//         // comand receive home work
//         setTimeout(() => {
//             ctx.replyWithHTML(`получить домашнее задание`, Markup.inlineKeyboard([
//                 [Markup.button.callback("получить", "getHomeWork")]
//             ]))
//         }, 2000);

//         // bot.sendVideo(5148026987, "https://vk.com/video173604987_167765316")
//     } catch(err) {
//         console.error(err);
//     }
// });

// // обработка второго урока
// bot.action("lesson_2", async ctx => {
//     console.log(2342424);
//     // try {
//     //     await ctx.answerCbQuery();
//     //     await ctx.replyWithHTML("пришло обучающее видео" );


//     //     // функция обнавления в бд прогересса
//     //     await updateProgress(ctx.from.id, "lesson_1");

//     //     // comand receive home work
//     //     setTimeout(() => {
//     //         ctx.replyWithHTML(`получить домашнее задание`, Markup.inlineKeyboard([
//     //             [Markup.button.callback("получить", "getHomeWork")]
//     //         ]))
//     //     }, 2000);

//     //     // bot.sendVideo(5148026987, "https://vk.com/video173604987_167765316")
//     // } catch(err) {
//     //     console.error(err);
//     // }
// });


// bot.action("getHomeWork", async ctx => {
//     // сделать запрос к бд проверить название урока и в соответствии с названием обработать ссылку и прислать соответствующее задание
//     let links = await getLinks(ctx.from.id);

//     // получили ссылку обработать и предложить скачать клиенту архив с заданием
//     try {
//         await ctx.answerCbQuery();
//         // const url = new URL("https://drive.google.com/file/d/1gvydkKyr-O6DFHojB9zYXhNR00AL3mgS/view?usp=sharing");
//         const url = new URL(links[1]);
//         const urlpath = url.pathname.split(/\//);
//         const id = urlpath[urlpath.length - 2];

//         await bot.telegram.sendDocument(
//             ctx.chat.id,
//             `https://docs.google.com/uc?export=download&id=${id}`
//         );
        
//         // await ctx.replyWithHTML(`загрузите домашнее задание отправив файл в ответ на это уведомдение`);

//         setTimeout(() => {
//             // ctx.replyWithHTML(`загрузите домашнее задание, отправте файл в ответ на это уведомление`);
//             ctx.replyWithHTML(`загрузить домашнее задание`, Markup.inlineKeyboard([
//                 [Markup.button.callback("загрузить", "uploadHomeWork")]
//             ]))
//         }, 2000);
//     } catch(err) {
//         console.error(err);
//     }
// });

// // upload homework
// // todo
// //! дать возможность отправить файл ещё раз
// //! протестировать 
// bot.action("uploadHomeWork", async ctx => {
//     try {
//         await ctx.answerCbQuery();
//         await ctx.replyWithHTML(`пришлите файл с домашним заданием в ответ на это сообщение или`);

//         //! запрос к БД для отката урока
//         let prevLesson = await lessonNumberHandler(ctx, 'current');
//         setTimeout(() => {
//             // ctx.replyWithHTML(`загрузите домашнее задание, отправте файл в ответ на это уведомление`);
//             ctx.replyWithHTML(`вернуться к уроку`, Markup.inlineKeyboard([
//                 [Markup.button.callback("повторить урок", prevLesson)]
//             ]))
//         }, 1000);

//         bot.on("message", async ctx => {
//             let flag;
//             const arrayObjects = await ctx.telegram.getUpdates(ctx.update.update_id);

//             // console.log(ctx.update.message.document); //! тут проверить пришёл документ или нет если нет флаг false
//             if (!ctx.update.message.document) await reapeatDownloadFile(ctx);

//             //! verifay on Document on format file
//             const file = await ctx.telegram.getFile(arrayObjects[0].message.document.file_id); // объект с полями о документе

//             const urlDownolad = `https://api.telegram.org/file/bot${process.env.BOT_TOKEN}/${file.file_path}`;

//             await ['js', 'html'].some((el) => el === arrayObjects[0].message.document.file_name.split('.').pop()) ? flag = await downoladFile(urlDownolad, ctx, arrayObjects[0]) : flag = false


//             flag ?  await replayHomeworkFile(ctx, arrayObjects[0]) : await reapeatDownloadFile(ctx);

//             //! прочитать файл и удалить

//             });

//     } catch(err) {
//         console.error(err);
//     }
// });

// // verifay homework
// // bot.action("verifayHomeWork", async ctx => {
// //     try {
// //         await ctx.replyWithHTML(`verifay`);
// //     } catch(err) {
// //         console.error(err);
// //     }
// // });

// // загрузка файла
// function downoladFile(url, ctx, object) {
//     return new Promise((res, rej) => {
//         axios({
//             method: "get",
//             url: url,
//             responseType: "stream"
//         })
//         .then(async (response) => {
//            await response.data.pipe(fs.createWriteStream(`${ctx.from.username}_${ctx.from.id}.${object.message.document.file_name.split('.').pop()}`));
//            res(true)
//         })
//         .catch((error) => res(false));
//     })
// }

// // replay file
// async function replayHomeworkFile(ctx, object) {
//     let objUser = await collection.findOne({ id: ctx.from.id });

//     for (let key in CHECKINGHOMEWORK) {
//         if(objUser.lesson === key) {
//             let resulObj = await CHECKINGHOMEWORK[key].check(ctx, object);
//             return await resultsHandlet(ctx, resulObj); 
//         }
//     }
//     // await ctx.replyWithHTML(`${ctx.from.username} начинаем проверку`);
//     // await await ctx.replyWithHTML(`${ctx.from.username}, ${message}`);
// }

// // обработка объекта результатов
// async function resultsHandlet(ctx, obj) {
//     if(obj.result === false) {
//         await ctx.replyWithHTML(`${obj.message}`);
//         //! предложить повторить видео или переслать задание
//         // await ctx.replyWithHTML(`неверное выполнение задания`, Markup.inlineKeyboard([
//         //     [Markup.button.callback("отправить файл повторно", "uploadHomeWork")],
//         //     [Markup.button.callback("повторить урок", "lesson_1")]
//         // ]))
//     } else {
//         let numberLesson = await lessonNumberHandler(ctx, 'next'); /* эта функция принимает строку next current prev  и возвращает строку с номером урока */

//         await ctx.replyWithHTML(`${obj.message}`);
//         // //! перейти к следующему уроку
//         await ctx.replyWithHTML(`задание выполнено успешно`, Markup.inlineKeyboard([
//             [Markup.button.callback("перейти к следующему уроку", numberLesson)]
//         ]))        
//     }
// }

// // обработчик номера занятия
// async function lessonNumberHandler(ctx, str) {
//     // next
//     // current
//     // prev
//         try{
//             const objUser = await collection.findOne({ id: ctx.from.id }); 

//         if(str === "next") {
//             let lesson = Number(objUser.lesson.split('_')[1]) + 1;
//             await collection.updateOne({ id: ctx.from.id }, {$set: {lesson: `lesson_${lesson}`}});

//             return `lesson_${lesson}`;

//         } else if(str === "current") {

//             return String(objUser.lesson);

//         } else if(str === "prev") {
//             let lesson = Number(objUser.lesson.split('_')[1]) - 1;

//             await collection.updateOne({ id: ctx.from.id }, {$set: {lesson: `lesson_${lesson}`}});
            
//             return `lesson_${lesson}`;
//         }
//     } catch(err) {
//         console.error(err);
//     }
// }

// // проверка файла на соответсвие требованиям
// //! протестировать
// async function reapeatDownloadFile(ctx) {
//     ctx.replyWithHTML(`${ctx.from.username} пришлите файл который соответсвует требованием из вводного занятия`);
//     await ctx.replyWithHTML(`неверное выполнение задания`, Markup.inlineKeyboard([
//         [Markup.button.callback("отправить подходящий файл", "uploadHomeWork")],
//         [Markup.button.callback("повторить вводное занятие", "howStudy")]
//     ]))
    
// }







// bot.help(ctx => ctx.reply(comandsList.comands));

// bot.launch();

// // Enable graceful stop
// process.once('SIGINT', () => bot.stop('SIGINT'))
// process.once('SIGTERM', () => bot.stop('SIGTERM'))




// const CHECKINGHOMEWORK = {
//     lesson_1: {
//         check: async function(ctx, object) {
//             let name = `${ctx.from.username}_${ctx.from.id}.${object.message.document.file_name.split('.').pop()}`
//             let taskArray = require(`./${name}`);
        
//             let res = await taskArray([-1, -2, -4, -5, 5, 5, 0]);
        
//             if(res.toString() === [5, 5].toString()) {
//                 return {
//                     result: true,
//                     message: "задание выполнено верно"
//                 }
//             } else {
//                 return {
//                     result: false,
//                     message: "задание выполнено не верно"
//                 }
//             }
//         }
//     },
    
//     lesson_2: {
//         check: function() {
//             // let name = `${ctx.from.username}_${ctx.from.id}.${object.message.document.file_name.split('.').pop()}`
//             // let taskArray = require(`./${name}`);
        
//             // let res = await taskArray([-1, -2, -4, -5, 5, 5, 0]);
        
//             // let message = res.toString() === [5, 5].toString() ? "norm" : "ne norm";
//             console.log('lesson_2');
//         }
//     },
//     lesson_3: {
//         check: function() {
//             // let name = `${ctx.from.username}_${ctx.from.id}.${object.message.document.file_name.split('.').pop()}`
//             // let taskArray = require(`./${name}`);
        
//             // let res = await taskArray([-1, -2, -4, -5, 5, 5, 0]);
        
//             // let message = res.toString() === [5, 5].toString() ? "norm" : "ne norm";
//             console.log('lesson_3');
//         }
//     },
//     lesson_4: {
//         check: function() {
//             // let name = `${ctx.from.username}_${ctx.from.id}.${object.message.document.file_name.split('.').pop()}`
//             // let taskArray = require(`./${name}`);
        
//             // let res = await taskArray([-1, -2, -4, -5, 5, 5, 0]);
        
//             // let message = res.toString() === [5, 5].toString() ? "norm" : "ne norm";
//             console.log('lesson_4');
//         }
//     },
// }