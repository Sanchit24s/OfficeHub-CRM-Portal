const { Schema, model } = require("mongoose");

const leaveSchema = new Schema(
    {
        employeeId: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        date: {
            type: Date,
            //required: true
        },
        startDate: {
            type: Date,
            required: true
        },
        endDate: {
            type: Date,
            required: true
        },
        reason: {
            type: String,
            required: true
        },
        status: {
            type: String,
            enum: ['Pending', 'Approved', 'Rejected', 'Leave'],
            default: 'Pending',
        },
    },{
        timestamps: true
    }
);

const leave = new model('LeaveApplication', leaveSchema);
module.exports = leave;