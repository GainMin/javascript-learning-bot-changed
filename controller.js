const DB = require("./db");
const Lesson = require("./lesson");
const File = require("./file");

async function controllerDb(userInfo, lesson ="", trigger) {
    const db = new DB(userInfo);

    switch(trigger) {
        case "user":
            let user = await db.getUser();
            if(user !== null) {
                return {
                    flag: "oldUser",
                    answer: await db.getUser()
                };
            } else {
                await db.createUser();
                return {
                    flag: "newUser",
                    answer: await db.getUser()
                }
            }  
        case "updateLesson":
            console.log("DB ",lesson)
            await db.updateLesson(lesson);
            return true;
    }
}
async function controllerLesson(user, trigger) {
    const handlerLesson = new Lesson(user);

    switch(trigger) {
        case "getLinks":
            return handlerLesson.getLinksLesson();
        case "prev":
            return handlerLesson.prevLesson();
        case "next":
            return  handlerLesson.nextLesson();
    }
}
async function controllerFile(config, lesson, trigger) {
    const handlerFile = new File(config.userInfo.username, config.userInfo.userid);

    switch(trigger) {
        case "downloadFile":
            return handlerFile.downloadFile(config.userInfo, config.objectMessage.message.document.file_name, config.url);
        case "replayHomeworkFile":
            return handlerFile.replayHomeworkFile(config.userInfo, config.objectMessage.message.document.file_name, lesson);
        case "deleteFile":
            return handlerFile.deleteFile(config.userInfo, config.objectMessage.message.document.file_name);
    }
}

module.exports = {controllerDb, controllerLesson, controllerFile};



