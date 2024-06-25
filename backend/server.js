const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const dbConfig = require('./config/database.config.js');
const mongoose = require('mongoose');
const { checkBirthdays, checkAnniversaries, checkAttendance } = require('./controllers/user.js');
const UserRoute = require('./routes/user.js');
const HolidayRoute = require('./routes/holiday.js');
const LeaveRoute = require('./routes/leave.js');
const AttendanceRoute = require('./routes/attendance.js');
const notificationRoute = require('./routes/notification.js');
const path = require('path');
const cors = require('cors');
const cron = require('node-cron');
const dotenv = require('dotenv');
dotenv.config();


mongoose.Promise = global.Promise;
mongoose.connect(dbConfig.url).then(() => {
    console.log("Databse Connected Successfully!!");
}).catch(err => {
    console.log('Could not connect to the database', err);
    process.exit();
});

cron.schedule('0 9 * * *', async () => {
    try {
        await checkBirthdays();
        console.log('Birthday checking job ran successfully');
    } catch (error) {
        console.error('Error in birthday checking job:', error.message);
    }
});

cron.schedule('0 9 * * *', async () => {
    try {
        await checkAnniversaries();
        console.log('Anniversaries checking job ran successfully');
    } catch (error) {
        console.error('Error in anniversary checking job:', error.message);
    }
});

cron.schedule('59 59 23 * * *', async () => {
    try {
        await checkAttendance();
        console.log('Attendance checked successfully');
    } catch (error) {
        console.error('Error in attendance checking job:', error.message);
    }
});

const allowedOrigins = ['http://localhost:4200'];

app.use(cors({
    origin: allowedOrigins
}));

app.use('/images', express.static(path.join('public/default')));
app.use('/image', express.static(path.join('public/uploads')));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.get('/', (req, res) => {
    res.json({ "message": "Hello Crud Node Express" });
});

app.use('/user', UserRoute);
app.use('/holiday', HolidayRoute);
app.use('/leave', LeaveRoute);
app.use('/attendance', AttendanceRoute);
app.use('/notification', notificationRoute);
app.listen(3000, () => {
    console.log("Server is listening on port 3000");
});