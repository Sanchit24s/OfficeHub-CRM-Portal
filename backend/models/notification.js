const { Schema, model } = require("mongoose");

const notificationSchema = new Schema(
    {
        employeeId: {
            type: String,
            required: true
        },
        title: {
            type: String,
            required: true
        },
        description: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            required: true
        },
        isView: {
            type: Boolean,
            required: true
        },
        role: {
            type: String,
            enum: ['EMPLOYEE', 'ADMIN'],
        }
    },
    {
        timestamps: true
    }
);

const notification = new model('notification', notificationSchema);
module.exports = notification;