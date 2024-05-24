const { Schema, model } = require('mongoose');
const User = require('./user');
const moment = require('moment');

const attendanceSchema = new Schema(
    {
        employeeId: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }, // Reference to User model
        userName: { 
            type: String, 
            required: true 
        },
        date: {
            type: Date
        },
        checkIn: {
            type: Date
        },
        checkOut: {
            type: Date
        },
        status: {
            type: String,
            enum: ['Present', 'Absent', 'Late', 'Excused', 'Leave'],
            default: 'Present',
            required: true
        },
        profileImage: {
            type: String
        },
    },
    {
        timestamps: true
    }
);

// attendanceSchema.pre('save', async function(next) {
//     date = moment(this.date).format('DD/MM/YYYY');
//     next();
// });


// attendanceSchema.virtual('formattedDate').get(function () {
//     return moment(this.date).format('DD/MM/YYYY');
// });

// attendanceSchema.virtual('formattedCheckInTime').get(function () {
//     return this.checkIn ? moment(this.checkIn).format('hh:mm:ss A') : null;
// });

// attendanceSchema.virtual('formattedCheckOutTime').get(function () {
//     return this.checkOut ? moment(this.checkOut).format('hh:mm:ss A') : null;
// });

const attendance = new model('Attendance', attendanceSchema)
module.exports = attendance;