const UserModel = require('../models/user');
const Attendance = require('../models/attendance');
const mongoose = require('mongoose');
const { createTokenForUser } = require('../services/authentication');
const { generateOTP } = require('../services/otp');
const { sendOTP, sendUserCredentials, sendAnniversaryEmail, sendBirthdayEmail } = require('../services/emailService');
const multer = require('multer');
const bcrypt = require('bcrypt');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs/promises');


// Create and Save a new user
const create = async (req, res) => {
    try {
        const { email, firstName, lastName, phone, password, designation, gender, role } = req.body;

        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(404).json({ message: "User Already Exist" });
        }

        if (!email || !firstName || !lastName || !phone || !password || !designation || !gender || !role) {
            return res.status(400).send({ message: "All fields are required!" });
        }

        const user = new UserModel({
            email,
            firstName,
            lastName,
            phone,
            password,
            designation,
            gender,
            role
        });

        const savedUser = await user.save();

        try {
            await sendUserCredentials(email, password, firstName, lastName);
            return res.status(200).json({
                message: "User Credentials sent successfully",
                user: savedUser
            });
        } catch (error) {
            return res.status(500).json(error);
        }
    } catch (err) {
        res.status(500).send({
            message: err.message || "Some error occurred while creating user",
        });
    }
};

const findAll = async (req, res) => {
    try {
        const user = await UserModel.find();
        res.status(200).json(user);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const findById = async (req, res) => {
    const { id } = req.params;
    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const user = await UserModel.findById(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const findByEmpId = async (req, res) => {
    const { employeeId } = req.body;
    try {
        const user = await UserModel.findOne({
            employeeId: employeeId
        })
        if (!user) {
            return res.status(200).json({ message: 'User not found' });
        }
        res.status(200).json(user._id);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const update = async (req, res) => {
    if (!req.body) {
        return res.status(400).json({
            message: "Data to update can not be empty!"
        });
    }

    const { id } = req.params;
    const { gender, ...fieldsToUpdate } = req.body;

    const defaultMaleImage = "http://localhost:3000/images/default-male1.jpg";
    const defaultFemaleImage = "http://localhost:3000/images/default-female1.jpg";

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const currentUser = await UserModel.findById(id);
        if (!currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        let updateObj = { ...fieldsToUpdate };

        if (gender) {
            updateObj.gender = gender;
            if (
                currentUser.profileImage === defaultMaleImage ||
                currentUser.profileImage === defaultFemaleImage
            ) {
                if (gender === 'Male') {
                    updateObj.profileImage = defaultMaleImage;
                } else if (gender === 'Female') {
                    updateObj.profileImage = defaultFemaleImage;
                }
            }
        }

        const user = await UserModel.findByIdAndUpdate(id, updateObj, { useFindAndModify: false, new: true });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        console.log('Updated user:', user);

        return res.status(200).json({ message: 'User updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const deleteById = async (req, res) => {
    const id = req.params.id;

    try {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: 'Invalid user ID' });
        }

        const user = await UserModel.findByIdAndDelete(id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        return res.status(200).json({ message: 'User Deleted Successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        res.status(400).json({ message: "All fields are mandatory" });
    }

    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "Incorrect Email or Password" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(401).json({ message: "Incorrect Email or Password" });
        }

        const token = createTokenForUser(user);
        return res.status(200).json(token);
    } catch (error) {
        return res.status(500).json({ message: error });
    }
}

const logoutUser = async (req, res) => {
    try {
        const token = req.cookies.jwt;

        if (!token) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const user = await UserModel.findOne({ token });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.clearCookie('jwt');

        return res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error logging out', error: error.message });
    }
};


const forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Please enter email" });
    }

    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }

        const { OTP, expirationTime } = generateOTP();

        user.otp = OTP;
        user.otpExpiration = expirationTime;
        await user.save();

        try {
            await sendOTP(user.email, user.otp);
            return res.status(200).json({ message: "OTP sent successfully" });
        } catch (error) {
            return res.status(500).json(error);
        }

    } catch (error) {
        return res.status(500).json({ message: error });
    }
}

const resendOTP = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: "Please enter email" });
    }

    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }

        const { OTP, expirationTime } = generateOTP();

        user.otp = OTP;
        user.otpExpiration = expirationTime;
        await user.save();

        try {
            await sendOTP(user.email, user.otp);
            return res.status(200).json({ message: "OTP sent successfully" });
        } catch (error) {
            return res.status(500).json(error);
        }

    } catch (error) {
        return res.status(500).json({ message: error });
    }
}

const verifyOTP = async (req, res) => {
    const { email, enteredOTP } = req.body;

    if (!enteredOTP) {
        return res.status(400).json({ message: "Please enter the OTP " });
    }

    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }

        if (user.otp !== enteredOTP) {
            return res.status(400).json({ message: "Incorrect OTP" });
        }

        if (user.otpExpiration < new Date()) {
            return res.status(400).json({ message: "OTP has expired. Please request a new OTP" })
        }

        user.otp = null;
        user.otpExpiration = null;
        await user.save();

        return res.status(200).json({ message: "OTP verified successfully" });
    } catch (error) {
        return res.status(500).json(error);
    }
}

const resetPassword = async (req, res) => {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword || !confirmPassword) {
        return res.status(400).json({ message: "Please provide all the fields" });
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: "New password and confirm password do not match" });
    }

    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }

        try {
            user.password = newPassword;
            await user.save();

            return res.status(200).json({ message: "Password reset successfully" });
        } catch (error) {
            return res.status(500).json(error);
        }
    } catch (error) {
        return res.status(500).json(error);
    }
}

const changePassword = async (req, res) => {
    const { email, currentPassword, newPassword, confirmNewPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmNewPassword) {
        return res.status(400).json({ message: "Please provide all the fields" });
    }

    try {
        const user = await UserModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }

        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ message: "Incorrect Current Password" });
        }

        if (newPassword !== confirmNewPassword) {
            return res.status(400).json({ message: "New password and confirm password do not match" });
        }

        try {
            user.password = newPassword;
            await user.save();

            return res.status(200).json({ message: "Password changed successfully" });
        } catch (error) {
            return res.status(500).json(error);
        }
    } catch (error) {
        return res.status(500).json(error);
    }
}

const checkIn = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "All fields are mandatory" });
    }

    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0); // Start of today

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999); // End of today

        // Check if the user has already checked in today
        const existingAttendance = await Attendance.findOne({
            employeeId: user._id,
            checkIn: {
                $gte: startOfDay,
                $lt: endOfDay
            },
        });

        if (existingAttendance) {
            return res.status(403).json({
                message: "User already checked in today",
                checkInTime: existingAttendance.checkIn,
                checkOutTime: existingAttendance.checkOut || null,
            });
        }

        const userName = `${user.firstName} ${user.lastName}`;

        // If no attendance today, proceed to record the check-in
        const attendanceEntry = new Attendance({
            date: startOfDay,
            employeeId: user._id,
            userName: userName,
            profileImage: user.profileImage,
            checkIn: new Date(), // Records the check-in time
        });
        await attendanceEntry.save();

        return res.status(200).json({
            message: "CheckIn Successfully",
            checkInTime: attendanceEntry.checkIn,
            checkOutTime: null,
        });
    } catch (error) {
        return res.status(500).json({ message: "Error during check-in", error: error.toString() });
    }
};

const checkOut = async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({ message: "All fields are mandatory" });
    }

    try {
        const user = await UserModel.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: "User Not Found" });
        }

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0); // Start of today

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999); // End of today

        // Find today's attendance record for the user
        const attendanceRecord = await Attendance.findOne({
            employeeId: user._id,
            checkIn: {
                $gte: startOfDay,
                $lt: endOfDay
            },
        });

        if (!attendanceRecord) {
            return res.status(404).json({ message: "No check-in record found for today. Cannot check out." });
        }

        // If the user has already checked out today, prevent another checkout
        if (attendanceRecord.checkOut) {
            return res.status(403).json({ message: "User has already checked out today" });
        }

        // Update the record with the checkout time
        attendanceRecord.checkOut = new Date();
        await attendanceRecord.save();

        return res.status(200).json({
            message: "CheckOut Successfully",
            checkOutTime: attendanceRecord.checkOut
        });
    } catch (error) {
        return res.status(500).json({ message: "Error during check-out", error: error.toString() });
    }
};

const handleProfilePictureUpload = async (req, res) => {

    const { id } = req.params;
    console.log('file name ' + req.file.filename);
    try {
        const user = UserModel.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const imagePath = 'http://localhost:3000/image/' + req.file.filename;
        // user.profileImage = imagePath;

        const userData = await UserModel.findByIdAndUpdate(id, { $set: { profileImage: imagePath } }, { new: true });
        res.status(200).json({ message: 'Image upload successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while uploading the profile picture' });
    }
}

const handleProfilePictureUploadNew = async (req, res) => {
    const { id } = req.params;

    try {
        // Check if a file was uploaded
        if (!req.file) {
            return res.status(400).json({ error: 'No file was uploaded' });
        }

        const user = await UserModel.findById(id);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Get the resized file path and filename
        const resizedFilePath = req.file.path;
        const resizedFileName = req.file.filename;

        // Construct the image URL based on the resized file details
        const imagePath = `http://localhost:3000/image/${resizedFileName}`;

        // Update the user's profile image with the resized image URL
        const userData = await UserModel.findByIdAndUpdate(
            id,
            { $set: { profileImage: imagePath } },
            { new: true }
        );

        res.status(200).json({ message: 'Image upload successfully', userData });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while uploading the profile picture' });
    }
};

const findUpcomingBirthdays = async (req, res) => {
    try {
        const today = new Date();
        const currentMonth = today.getMonth(); // zero-based month (0-11)
        const currentDay = today.getDate();

        // Fetch all users
        const users = await UserModel.find();

        // Filter users whose birthday is in the current month and on or after today
        const upcomingBirthdays = users.filter(user => {
            const dob = new Date(user.dateOfBirth);
            const dobMonth = dob.getMonth();
            const dobDay = dob.getDate();

            // Check if the birthday is in the current month and on or after today
            return dobMonth === currentMonth && dobDay >= currentDay;
        });

        // Send response with users having upcoming birthdays this month
        res.status(200).json(upcomingBirthdays);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const checkBirthdays = async () => {
    try {
        const today = new Date();
        const currentMonth = today.getMonth() + 1;
        const currentDay = today.getDate();

        const usersWithDateOfBirth = await UserModel.find({
            dateOfBirth: { $exists: true, $ne: null }
        });

        const users = usersWithDateOfBirth.filter(user => {
            const userDate = new Date(user.dateOfBirth);
            return userDate.getMonth() + 1 === currentMonth && userDate.getDate() === currentDay;
        });

        const birthdayPromises = users.map(async (user) => {
            await sendBirthdayEmail(user);
        });

        await Promise.all(birthdayPromises);

        return users;
    } catch (error) {
        console.error('Error fetching users with birthdays today:', error);
        throw new Error('An error occurred while fetching users with birthdays today');
    }
}

const checkAnniversaries = async () => {
    try {
        const today = new Date();
        const currentMonth = today.getMonth() + 1;
        const currentDay = today.getDate();

        const usersWithAnniversaryDate = await UserModel.find({
            anniversaryDate: { $exists: true, $ne: null }
        });

        const users = usersWithAnniversaryDate.filter(user => {
            const anniversaryDate = new Date(user.anniversaryDate);
            return anniversaryDate.getMonth() + 1 === currentMonth && anniversaryDate.getDate() === currentDay;
        });

        if (users.length === 0) {
            return 'No anniversaries today';
        }

        const anniversaryPromises = users.map(user => sendAnniversaryEmail(user));

        await Promise.all(anniversaryPromises);

        return users;
    } catch (error) {
        throw new Error(error.message);
    }
}


const checkAttendance = async () => {
    try {
        const users = await UserModel.find();
        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0); // Start of today

        const endOfDay = new Date();
        endOfDay.setHours(23, 59, 59, 999); // End of today

        for (const user of users) {
            const userName = `${user.firstName} ${user.lastName}`;
            await Attendance.findOneAndUpdate(
                {
                    employeeId: user._id,
                    date: { $gte: startOfDay, $lt: endOfDay }
                },
                {
                    $setOnInsert: {
                        employeeId: user._id,
                        userName: userName,
                        status: "Absent",
                        date: startOfDay
                    }
                },
                { upsert: true }
            );
        }

    } catch (error) {
        console.log(error);
    }
}



module.exports = {
    create,
    findAll,
    findById,
    findByEmpId,
    update,
    deleteById,
    loginUser,
    logoutUser,
    forgotPassword,
    verifyOTP,
    resetPassword,
    resendOTP,
    changePassword,
    checkIn,
    checkOut,
    handleProfilePictureUpload,
    findUpcomingBirthdays,
    checkBirthdays,
    checkAnniversaries,
    checkAttendance,
    handleProfilePictureUploadNew
};