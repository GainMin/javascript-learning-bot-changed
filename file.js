const axios = require('axios').default;
const fs = require('fs');
const CHECKINGHOMEWORK = require('./checkingHomework.js');
require('dotenv').config();

class File {
    constructor(username, id) {
        this.username = username;
        this.id = id;
    }
    downloadFile({username, userid}, name, url) {
        return (['js', 'html'].some((el) => el === name.split('.').pop())) ? new Promise((res, rej) => {
            axios({
                method: "get",
                url: url,
                responseType: "stream"
            })
            .then((response) => {
                let ws = fs.createWriteStream(`${username}_${userid}.${name.split('.').pop()}`);
                ws
                .on("close", () => res(true))
                .on("error", () => res(false))
                response.data.pipe(ws);
            })
            .catch((error) => { console.log(error); return res(false)});
        }) : false
    }
    async replayHomeworkFile({username, userid}, fileName, currentLesson) {
        return await CHECKINGHOMEWORK[currentLesson].check(username, userid, fileName);
    }
    deleteFile({username, userid}, name) {
        fs.unlink(`${username}_${userid}.${name.split('.').pop()}`, (err) => err ? console.log(err) : console.log("Файл удалён"));
    }
}

module.exports = File;

