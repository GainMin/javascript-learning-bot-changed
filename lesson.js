const LINKS = require("./collector");

class Lesson {
    constructor(objectUser) {
        this.user = {...objectUser.answer}
    }
    getLinksLesson() {
        return LINKS[this.user.lesson]();
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
