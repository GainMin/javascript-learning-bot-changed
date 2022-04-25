const CHECKINGHOMEWORK = {
    lesson_1: {
        check: async function(username, userid, fileName) {
            const name = `${username}_${userid}.${fileName.split('.').pop()}`;
            const taskArrayLesson_1 = require(__dirname + `/${name}`);
            
            let res = await taskArrayLesson_1([-1, -2, -4, -5, 5, 5, 0]);
    
            if(res.toString() === [5, 5].toString()) {
                return {
                    result: true,
                    message: "задание выполнено верно"
                }
            } else {
                return {
                    result: false,
                    message: "задание выполнено не верно"
                }
            }
        }
    },
    lesson_2: {
        check: async function(username, userid, fileName) {
            const name = `${username}_${userid}.${fileName.split('.').pop()}`;
            const taskArrayLesson_2 = require(__dirname + `/${name}`);

            const res = await taskArrayLesson_2([-1, -2, -4, -5, 5, 5, 0]);

            if(res.toString() === [5, 5].toString()) {
                return {
                    result: true,
                    message: "задание выполнено верно"
                }
            } else {
                return {
                    result: false,
                    message: "задание выполнено не верно"
                }
            }
            console.log('lesson_2');
        }
    },
    lesson_3: {
        check: async function(username, userid, fileName) {
            const name = `${username}_${userid}.${fileName.split('.').pop()}`;
            const taskArrayLesson_3 = require(__dirname + `/${name}`);

            const res = await taskArrayLesson_3([-1, -2, -4, -5, 5, 5, 0]);

            if(res.toString() === [5, 5].toString()) {
                return {
                    result: true,
                    message: "задание выполнено верно"
                }
            } else {
                return {
                    result: false,
                    message: "задание выполнено не верно"
                }
            }
            console.log('lesson_3');
        }
    },
    lesson_4: {
        check: async function(username, userid, fileName) {
            const name = `${username}_${userid}.${fileName.split('.').pop()}`;
            const taskArrayLesson_4 = require(__dirname + `/${name}`);

            const res = await taskArrayLesson_4([-1, -2, -4, -5, 5, 5, 0]);

            if(res.toString() === [5, 5].toString()) {
                return {
                    result: true,
                    message: "задание выполнено верно"
                }
            } else {
                return {
                    result: false,
                    message: "задание выполнено не верно"
                }
            }
            console.log('lesson_4');
        }
    },
}

module.exports = CHECKINGHOMEWORK;