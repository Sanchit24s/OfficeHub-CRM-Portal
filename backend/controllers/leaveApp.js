const leaveApp = require('../models/leave');
const UserModel = require('../models/user');
const Attendance = require('../models/attendance');
const notificationModel = require('../models/notification');

const findAll = async (req, res) => {
    try {
        const leave = await leaveApp.find().sort({ date: -1 });
        res.status(200).json(leave);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const findById = async (req, res) => {
    try {
        const employeeId = req.params.id;
        const leave = await leaveApp.find({
            employeeId
        }).sort({ date: -1 });
        res.status(200).json(leave);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const add = async (req, res) => {
    try {
        const employeeId = req.params.id;
        const _id = employeeId;
        const { name, email, startDate, endDate, reason } = req.body;
        const foundEmployee = await UserModel.findOne({ _id });
        if (!foundEmployee) {
            return res.status(404).json({ message: "Invalid employee ID" });
        }
        if (!startDate || !endDate || !reason) {
            return res.status(400).send({ message: "All fields are required!" });
        }
        const date = new Date();
        const newApplication = new leaveApp({ name, email, employeeId, date, startDate, endDate, reason });
        const savedApplication = await newApplication.save();

        let notificationRole;
        if (foundEmployee.role === 'ADMIN') {
            notificationRole = 'EMPLOYEE';
        } else {
            notificationRole = 'ADMIN';
        }

        const notification = {
            employeeId: foundEmployee.employeeId,
            title: `Leave application submitted by ${foundEmployee.employeeId}`,
            description: reason,
            date: date,
            isView: false,
            role: notificationRole
        }

        const newNotification = new notificationModel(notification);
        await newNotification.save();

        res.status(201).send({
            message: `Leave application for ${foundEmployee.firstName} ${foundEmployee.lastName} from ${startDate} to ${endDate} submitted successfully`,
            data: savedApplication
        });
    } catch (error) {
        res.status(500).send(error);
    }
};

const approve = async (req, res) => {
    try {
        const employeeId = req.params.id;
        const _id = employeeId;
        const leaveApplication = await leaveApp.findByIdAndUpdate(
            { _id: employeeId },
            { status: 'Approved' },
            { new: true }
        );

        if (!leaveApplication) {
            return res.status(404).json({ message: 'Leave application not found' });
        }

        const startDate = new Date(leaveApplication.startDate);
        const endDate = new Date(leaveApplication.endDate);

        for (let currentDate = new Date(startDate); currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
            const attendance = new Attendance({
                employeeId: leaveApplication.employeeId,
                date: currentDate,
                checkIn: '',
                checkOut: '',
                status: 'Leave'
            });

            const savedAttendance = await attendance.save();
        }

        const leaveApps = await leaveApp.findById( _id );
        const email = leaveApps.email;
        const foundEmployee = await UserModel.findOne({ email });

        const date = new Date();
        let notificationRole = 'EMPLOYEE';

        const notification = {
            employeeId: foundEmployee.employeeId,
            title: `Leave application approved by HR`,
            description: reason,
            date: date,
            isView: false,
            role: notificationRole
        }

        const newNotification = new notificationModel(notification);
        const newNotice = await newNotification.save();

        res.status(200).json(leaveApplication);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const reject = async (req, res) => {
    try {
        const employeeId = req.params.id;
        const _id = employeeId;
        const leaveApplication = await leaveApp.findByIdAndUpdate(
            { _id: employeeId },
            { status: 'Rejected' },
            { new: true }
        );

        if (!leaveApplication) {
            return res.status(404).json({ message: 'Leave application not found' });
        }

        const leaveApps = await leaveApp.findById( _id );
        const email = leaveApps.email;
        const foundEmployee = await UserModel.findOne({ email });
        const date = new Date();
        let notificationRole = 'EMPLOYEE';

        const notification = {
            employeeId: foundEmployee.employeeId,
            title: `Leave application rejected by HR`,
            description: leaveApps.reason,
            date: date,
            isView: false,
            role: notificationRole
        }

        const newNotification = new notificationModel(notification);
        const newNotice = await newNotification.save();

        res.json(leaveApplication);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { findAll, findById, add, approve, reject };