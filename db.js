const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const models = {};

async function init(DB_URI) {
    await mongoose.connect(DB_URI);

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
        count: {
            type: Number,
            default: function () {
                return this.log ? this.log.length : 0;
            }
        },
        log: [exerciseSchema],
    });

    // models.Exercise = model('Exercise', exerciseSchema);
    models.Log = model('Log', logSchema);
}

module.exports = { init, models };