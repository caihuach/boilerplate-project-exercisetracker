const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const models = {};

async function init(DB_URI) {
    await mongoose.connect(DB_URI);

    const userSchema = new Schema({
        username: String
    })

    const exerciseSchema = new Schema({
        description: String,
        duration: Number,
        date: {
            type: Date,
            default: Date.now,
            get: (date) => date.toDateString()
        },
    }, {
        toJSON: { getters: true },
        toObject: { getters: true }
    })

    const logSchema = new Schema({
        username: String,
        count: Number,
        log: [exerciseSchema],
    });

    models.User = model('User', userSchema);
    models.Exercise = model('Exercise', exerciseSchema);
    models.Log = model('Log', logSchema);
}

const userService = {
    create: async function (body) {
        const user = new models.User(body);
        await user.save();
    }
}

const exerciseService = {
    create: async function (body) {
        const exercise = new models.Exercise(body);
        await exercise.save();
    }
}

module.exports = { init, models, userService, exerciseService };