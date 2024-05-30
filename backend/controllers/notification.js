const notificationModel = require('../models/notification');

const findAll = async (req, res) => {
    try {
        const notification = await notificationModel.find({ role: 'ADMIN' }).sort({ date: -1 });
        res.status(200).json(notification);
    } catch (error) {
        res.status(200).json({ message: error.message });
    }
}

const findByEmpId = async (req, res) => {
    try {
        const { id } = req.params;

        const notifications = await notificationModel.find({ employeeId: id, role: 'EMPLOYEE' }).sort({ date: -1 });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const markAllAsViewed = async (req, res) => {
    try {
        await notificationModel.updateMany(
            { role: 'ADMIN' },
            { $set: { isView: true } }
        );
        res.status(200).json({ message: "All notifications marked as viewed" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const markAllAsViewedByEmpId = async (req, res) => {
    try {
        const { id } = req.params;


        await notificationModel.updateMany(
            { role: 'EMPLOYEE', employeeId: id },
            { $set: { isView: true } }
        );
        res.status(200).json({ message: "All notifications marked as viewed" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { findAll, markAllAsViewed, findByEmpId, markAllAsViewedByEmpId };