const mongoose = require("mongoose");
const User = require("./user");
const Charity = require("./charities");
const MessageSchema = new mongoose.Schema(
    {
        fromId: {
            type: String,
        },
        charityId: {
            type: String,
        },
        objectId: {
            type: String,
        },
        from: {
            type: String,
        },
        subject: {
            type: String,
        },
        content: {
            type: String,
        },
        image: {
            type: String,
        },
        new: {
            type: String,
        },
    },
    { timestamps: true }
);

const Messages = mongoose.model("Message", MessageSchema);
module.exports = Messages;
