const User = require("../modules/user");
const MessageAddCharity = require("../modules/messages");
const Charities = require("../modules/charities");
const jwt = require("jsonwebtoken");
const { name } = require("ejs");
const crypto = require("crypto");
require("dotenv").config();
const Token = require("../modules/token");
const authenticationWithGoogle = require("../utils/email/sendEmail");
const bcryptjs = require("bcryptjs");

async function getNumberOfNewMessages(user) {
    let numberOfNewMessage = 0;
    user.messages.forEach((element) => {
        if (element.new === "NEW") numberOfNewMessage++;
    });
    return new Promise((resolve) => {
        resolve(numberOfNewMessage);
    });
}

const maxAge = 60 * 60 * 24;

const createToken = (id) => {
    return jwt.sign({ id }, process.env.HASH, { expiresIn: maxAge });
};
const errorHandler = (err) => {
    let error = {
        email: "",
        password: "",
        phone: "",
        idNumber: "",
        firstName: "",
        lastName: "",
    };

    if (err.message === "incorrect password") {
        error.password = "The password or email is incorrect";
    }
    if (err.message === "not activated") {
        error.email =
            "Please open your gmail account and click on the link that we have sent";
    }
    if (err.message === "incorrect email") {
        error.email = "This email is not registered";
    }

    if (err.message === "phone was registered") {
        error.phone = "This phone is already registered";
    }
    if (err.message === "idNumber was registered") {
        error.idNumber = "This idNumber is already registered";
    }
    if (err.message === "email was registered") {
        error.email = "This email is already registered";
    }

    if (err.code === 11000) {
        Object.keys(err.keyPattern).forEach((properties) => {
            error[properties] = `This ${properties} is already registered`;
        });
        return error;
    }

    if (err.message.includes("user validation failed")) {
        Object.values(err.errors).forEach(({ properties }) => {
            error[properties.path] = properties.message;
        });
    }
    return error;
};

const signup_get = (req, res) => {
    res.render("signup");
};
const login_get = (req, res) => {
    res.render("login");
};
const about_get = async (req, res) => {
    const user = res.locals.user;
    let numberOfNewMessages = 0;
    if (user) {
        numberOfNewMessages = await getNumberOfNewMessages(user);
    }
    res.render("about", {
        numberOfNewMessages: numberOfNewMessages,
        idMessageInUrl: true,
    });
};
const policy_get = async (req, res) => {
    const user = res.locals.user;
    let numberOfNewMessages = 0;
    if (user) {
        numberOfNewMessages = await getNumberOfNewMessages(user);
    }
    res.render("Policy", {
        numberOfNewMessages: numberOfNewMessages,
        idMessageInUrl: true,
    });
};
const terms_get = async (req, res) => {
    const user = res.locals.user;
    let numberOfNewMessages = 0;
    if (user) {
        numberOfNewMessages = await getNumberOfNewMessages(user);
    }
    res.render("Terms", {
        numberOfNewMessages: numberOfNewMessages,
        idMessageInUrl: true,
    });
};

const index_get = async (req, res) => {
    const user = res.locals.user;
    let numberOfNewMessages = 0;
    if (user) {
        numberOfNewMessages = await getNumberOfNewMessages(user);
    }
    try {
        charities = await Charities.find({}).sort({
            createdAt: -1,
        });
        res.render("index", {
            idMessageInUrl: true,
            charities: charities,
            numberOfNewMessages: numberOfNewMessages,
        });
    } catch (err) {
        console.log(err);
    }
};
const logout_get = (req, res) => {
    res.cookie("jwt", "", { maxAge: 1 });
    res.redirect("/");
};

const signup_post = async (req, res) => {
    const {
        email,
        password,
        passwordForSure,
        city,
        accountType,
        firstName,
        lastName,
        phone,
        idNumber,
    } = req.body;

    try {
        const user = await User.create({
            firstName,
            lastName,
            idNumber,
            phone,
            email,
            password,
            passwordForSure,
            city,
            accountType,
        });
        const hashCode = await crypto.randomBytes(32).toString("hex");
        const token = await Token.create({
            userId: user._id,
            token: hashCode,
            createdAt: Date.now(),
        });
        await authenticationWithGoogle(
            user.email,
            user.firstName,
            hashCode,
            user._id
        );
        res.status(201).json({ user: user._id });
    } catch (err) {
        const error = errorHandler(err);
        res.status(400).json({ error });
    }
};

const login_post = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie("jwt", token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id });
    } catch (err) {
        const error = errorHandler(err);
        console.log(error);
        res.status(400).json({ error });
    }
};
const sendEmail_get = async (req, res) => {
    let userId = req.params.id;
    let token = req.params.token;
    try {
        let findToken = await Token.findOne({ userId: userId });
        if (findToken) {
            const isValid = await bcryptjs.compare(token, findToken.token);
            if (isValid) {
                const updateUser = await User.updateOne(
                    { _id: userId },
                    { $set: { activated: true } },
                    { new: true }
                );
                res.redirect("/login");
            } else {
                res.status(200).json({ error: "error" });
            }
        } else {
            res.status(200).json({ error: "error" });
        }
    } catch (err) {
        console.log(err);
    }
};
module.exports = {
    signup_get,
    login_get,
    index_get,
    signup_post,
    login_post,
    logout_get,
    getNumberOfNewMessages,
    sendEmail_get,
    about_get,
    policy_get,
    terms_get,
};
