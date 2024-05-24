const { Schema, model } = require('mongoose');

const holidaySchema = new Schema(
    {
        date: {
            type: Date,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        description: {
            type: String
        }
    }
);

const holiday = new model('Holiday', holidaySchema);
module.exports = holiday;