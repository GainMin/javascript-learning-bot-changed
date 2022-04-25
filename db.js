require('dotenv').config();
const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGODB_URI);
client.connect();

const db = client.db("test"); // перееминовать
const collection = db.collection("users");

class DB {
    constructor({userid, username}) {
        this.id = userid;
        this.username = username;
    }
    async createUser() {
        await collection.insertOne({
            id: this.id,
            username: this.username,
            lesson: "lesson_1", 
            arrayLessonsLearned: [] 
        });
    }
    async getUser() {
        return await collection.findOne({ id: this.id });
    }
    async updateLesson() {
        let user = await collection.findOne({ id: this.id });
        let lesson = Number(user.lesson.split('_')[1]) + 1;
        await collection.updateOne({ id: this.id }, {$set: {lesson: `lesson_${lesson}`}});
        return true;
    }
}

module.exports = DB;