const mongoose = require("mongoose");
const { isEmail } = require("validator");

const bcryptjs = require("bcryptjs");
const Messages = require("../modules/messages");
const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: [true, "Please enter the first name"],
    },
    lastName: {
        type: String,
        required: [true, "Please enter the last name"],
    },
    idNumber: {
        type: String,
        required: [true, "Please enter id number"],
        unique: true,
        validate: [
            function (value) {
                const regular = /^\d+$/;
                const string = value;
                return regular.test(string) && string.length == 11;
            },
            "ID number must be an 11 digits number",
        ],
    },
    phone: {
        type: String,
        required: [true, "Please enter the phone number"],
        validate: [
            function (value) {
                const regular = /^\d+$/;
                const string = value;
                return regular.test(string) && value.length == 10;
            },
            "Phone number must be an integer number with 10 digits",
        ],
    },
    email: {
        type: String,
        required: [true, "Please enter an email"],
        unique: true,
        validate: [isEmail, "Please enter a valid email"],
    },
    password: {
        type: String,
        required: [true, "Please enter an password"],
        minlength: [8, "Password length must be at least 8 characters long"],
    },
    city: {
        type: String,
    },
    accountType: {
        type: String,
    },
    messages: [
        {
            type: mongoose.Schema.Types.Mixed,
            ref: "Messages",
        },
    ],
    activated: {
        type: Boolean,
        default: false,
    },
});
userSchema.pre("save", async function (next) {
    const search1 = await User.find({ email: this.email });
    const search2 = await User.find({ phone: this.phone });
    const search3 = await User.find({ idNumber: this.idNumber });
    if (search1.length) {
        next(new Error("email was registered"));
    }
    if (search2.length) {
        next(new Error("phone was registered"));
    }
    if (search3.length) {
        next(new Error("idNumber was registered"));
    }

    const salt = await bcryptjs.genSalt();
    this.password = await bcryptjs.hash(this.password, salt);
    next();
});

userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    if (user) {
        if (user.activated) {
            const auth = await bcryptjs.compare(password, user.password);
            if (auth) {
                return user;
            }
            throw new Error("incorrect password");
        } else {
            throw new Error("not activated");
        }
    }
    throw new Error("incorrect email");
};
const User = mongoose.model("user", userSchema);
module.exports = User;
