const mongoose = require("mongoose");
const User = require("../modules/user");
const Messages = require("../modules/messages");
const Objects = require("../modules/objects");
const CharitiesSchema = new mongoose.Schema(
    {
        charityName: {
            type: String,
            unique: true,
            required: [true, "Please enter the name of the charity"],
        },
        bankAccount: {
            type: String,
            unique: true,
            required: [true, "Please enter bank account number"],
            validate: [
                function (value) {
                    const regular = /^\d+$/;
                    const string = value;
                    return regular.test(string);
                },
                "Bank account number must be a number",
            ],
        },
        phone: {
            type: String,
            unique: true,
            required: [true, "Please enter the phone number"],
            validate: [
                function (value) {
                    const regular = /^\d+$/;
                    const string = value;
                    return regular.test(string) && value.length == 10;
                },
                "Phone number must be a number with 10 digits",
            ],
        },
        charityType: {
            type: String,
        },
        logo: {
            type: String,
            required: [true, "Please enter the logo"],
            validate: [
                function (value) {
                    if (
                        value.endsWith(".jpg") ||
                        value.endsWith(".jpeg") ||
                        value.endsWith(".png") ||
                        value.endsWith(".gif")
                    ) {
                        return true;
                    } else {
                        return false;
                    }
                },
                "Please enter a valid image (.jpg or .jpeg or .png or .gif) ",
            ],
        },
        users: [{ type: mongoose.Schema.Types.Mixed, ref: "User" }],
        description: {
            type: String,
            required: [true, "Please enter the description"],
        },
        license: {
            type: String,
            required: [true, "Please enter the license"],
            validate: [
                function (value) {
                    if (
                        value.endsWith(".jpg") ||
                        value.endsWith(".jpeg") ||
                        value.endsWith(".png") ||
                        value.endsWith(".gif")
                    ) {
                        return true;
                    } else {
                        return false;
                    }
                },
                "Please enter a valid image (.jpg or .jpeg or .png or .gif) ",
            ],
        },
        messages: [
            {
                type: mongoose.Schema.Types.Mixed,
                ref: "Messages",
            },
        ],
        objects: [
            {
                type: mongoose.Schema.Types.Mixed,
                ref: "Objects",
            },
        ],
        pending: {
            type: String,
        },
    },
    { timestamps: true }
);

CharitiesSchema.pre("save", async function (next) {
    const search1 = await Charities.find({ bankAccount: this.bankAccount });
    const search2 = await Charities.find({ phone: this.phone });
    const search3 = await Charities.find({ charityName: this.charityName });
    if (search1.length) {
        next(new Error("bankAccount was registered"));
    }
    if (search2.length) {
        next(new Error("phone was registered"));
    }
    if (search3.length) {
        next(new Error("charityName was registered"));
    }
    next();
});

const Charities = mongoose.model("Charitie", CharitiesSchema);
module.exports = Charities;
