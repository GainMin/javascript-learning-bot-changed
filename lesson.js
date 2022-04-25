const LINKS = require("./collector");

class Lesson {
    constructor(objectUser) {
        this.user = {...objectUser.answer}
    }
    getLinksLesson() {
        let numberLesson = this.user.lesson;
        for (let key in LINKS) {
            if(key === numberLesson) {
                let arrLinks = [LINKS[key].lesson, LINKS[key].task];
                return arrLinks;
            }
        }
    }
    prevLesson() {
        let lesson = Number(this.user.lesson.split('_')[1]) - 1;
        return `lesson_${lesson}`;
    }
    nextLesson() {
        let lesson = Number(this.user.lesson.split('_')[1]) + 1;
        return `lesson_${lesson}`;
    }
}

module.exports = Lesson;
