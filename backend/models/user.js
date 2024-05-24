const { Schema, model } = require("mongoose");
const bcrypt = require('bcrypt');

const defaultMaleImage = "http://localhost:3000/images/default-male1.jpg";
const defaultFemaleImage = "http://localhost:3000/images/default-female1.jpg";

const userSchema = new Schema(
    {
        employeeId: {
            type: String,
            unique: true
        },
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        phone: String,
        email: {
            type: String,
            required: true,
            unique: true
        },
        salt: {
            type: String,
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ["EMPLOYEE", "ADMIN"],
        },
        designation: {
            type: String,
            required: true
        },
        gender: {
            type: String,
            required: true
        },
        currentAddress: String,
        currentCity: String,
        currentState: String,
        currentCountry: String,
        currentPinCode: String,
        permanentAddress: String,
        permanentCity: String,
        permanentState: String,
        permanentCountry: String,
        permanentPinCode: String,
        bloodGroup: String,
        marriedStatus: String,
        anniversaryDate: Date,
        partnerName: String,
        haveChildren: String,
        childrenNames: String,
        workExperience: String,
        educationalQualifications: String,
        certifications: String,
        skills: String,
        dateOfBirth: Date,
        age: String,
        createdAt: {
            type: Date,
            default: Date.now
        },
        updatedAt: {
            type: Date,
            default: Date.now
        },
        isActive: {
            type: Boolean,
            default: true
        },
        otp: {
            type: String,
            default: null
        },
        otpExpiration: {
            type: Date,
            default: null
        },
        profileImage: {
            type: String,
            default: function () {
                return this.gender === "Male" ? defaultMaleImage : defaultFemaleImage;
            }
        }
    },
    {
        timestamps: true
    }
);

userSchema.pre('save', async function (next) {
    if (!this.employeeId) {
        const lastEmployee = await this.constructor.findOne({}, {}, { sort: { 'createdAt': -1 } });
        if (lastEmployee) {
            const lastId = parseInt(lastEmployee.employeeId.slice(3));
            this.employeeId = `EMP${(lastId + 1).toString().padStart(4, '0')}`;
        } else {
            this.employeeId = 'EMP0001';
        }
    }
    next();
});

userSchema.pre('save', async function (next) {
    const user = this;

    if (!user.isModified("password")) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);
        user.salt = salt;

        next();
    } catch (error) {
        next(err);
    }
});

const user = new model('User', userSchema);
module.exports = user;