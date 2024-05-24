const express = require('express');
const { create, findAll, findById, findByEmpId, update, deleteById, loginUser, logoutUser,
        forgotPassword, verifyOTP, resetPassword, resendOTP, checkIn, checkOut,
        handleProfilePictureUpload, findUpcomingBirthdays, changePassword,
        handleProfilePictureUploadNew } = require('../controllers/user');
const { validateToken } = require('../middlewares/authentication');
const { storage, resizeImage, resizeImages } = require('../services/storage');
//const upload = require('../services/upload');

const router = express.Router();
const cookieParser = require('cookie-parser');

router.use(cookieParser());

router.get('/', findAll);
router.get('/upcomingBirthdays', findUpcomingBirthdays);
router.get('/:id', findById);
router.post('/empId', findByEmpId);
router.post('/create', create);
router.patch('/update/:id', update);
router.delete('/delete/:id', deleteById);

router.post('/login', loginUser);
router.post('/logout', validateToken, logoutUser);

router.post('/changePassword', changePassword);
router.post('/forgotPassword', forgotPassword);
router.post('/resendOTP', resendOTP);
router.post('/verifyOTP', verifyOTP);
router.post('/resetPassword', resetPassword);

router.post('/check-in', checkIn);
router.post('/check-out', checkOut);

router.post('/update-profile-picture/:id', storage.single('image'), resizeImages, handleProfilePictureUploadNew);

module.exports = router;