const AttendanceModel = require('../models/attendance');

const findAll = async (req, res) => {
    try {
        const attendance = await AttendanceModel.find().sort({ date: -1, checkIn: -1 });
        res.status(200).json(attendance);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
}

const findToday = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const attendance = await AttendanceModel.find({
            date: { $gte: today }
        }).sort({ checkIn: -1 });

        if (!attendance) {
            res.status(404).json({ message: 'Attendance Not Found' });
        }

        res.status(200).json(attendance);
    } catch (error) {
        console.error('Error occurred:', error);
        res.status(404).json({ message: error.message });
    }
}

const findOne = async (req, res) => {
    try {
        const employeeId = req.params.id;
        const today = new Date();
        today.setHours(23, 59, 59, 0);

        const attendance = await AttendanceModel.find({
            employeeId,
            date: { $lte: today }
        }).sort({ date: -1 });
        if (!attendance) {
            return res.status(404).json({ message: 'User Attendance Not Found' });
        }
        res.status(200).json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const findAttendanceInRange = async (req, res) => {
    try {
        const { id } = req.params;
        const { startDate, endDate } = req.body;

        // Check if required parameters are provided
        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'Fill the required Fields' });
        }

        // Parse dates and check if they are valid
        const parsedStartDate = new Date(startDate);
        const parsedEndDate = new Date(endDate);
        if (isNaN(parsedStartDate) || isNaN(parsedEndDate)) {
            return res.status(400).json({ message: 'Invalid date format' });
        }

        // Adjust endDate to end of day
        parsedEndDate.setHours(23, 59, 59, 999);

        const attendance = await AttendanceModel.find({
            employeeId: id,
            date: {
                $gte: parsedStartDate,
                $lte: parsedEndDate
            }
        }).sort({ date: -1 });

        if (attendance.length === 0) {
            return res.status(404).json({ message: 'User attendance not found' });
        }

        res.status(200).json(attendance);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


const findTodayAttendance = async (req, res) => {
    try {
        const employeeId = req.params.id;
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        // console.log(employeeId);
        // console.log(today);
        const existingAttendance = await AttendanceModel.findOne({
            employeeId,
            checkIn: { $gte: today },
        });

        return res.status(200).json(existingAttendance);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}



module.exports = { findAll, findOne, findTodayAttendance, findToday, findAttendanceInRange };