const mongoose = require("mongoose");
const Messages = require("../modules/messages");
const Charities = require("../modules/charities");
const VolunteeringSchema = new mongoose.Schema(
    {
        charity: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Charities",
        },
        available: {
            type: [String],
        },
        hours: {
            type: String,
            required: [true, "Please enter the number of hours"],
            validate: [
                function (value) {
                    const regular = /^(?:[1-9]|[1][0-9]|[2][0-4])$/;
                    const string = value;
                    return regular.test(string);
                },
                "Hours must be a number from 1 to 24",
            ],
        },
        experience: {
            type: String,
            required: [
                true,
                "Please enter how many years of experience you have",
            ],
            validate: [
                function (value) {
                    const regular = /^\d+$/;
                    const string = value;
                    return regular.test(string) && parseInt(value) >= 0;
                },
                " Years of experience must be a positive number",
            ],
        },
        workStatus: {
            type: String,
        },
        Preferences: {
            type: String,
        },
    },
    { timestamps: true }
);
VolunteeringSchema.pre("save", async function (next) {
    const days = this.available;
    if (days.length === 0) {
        next(new Error("not filled days"));
    }
    next();
});

const Volunteering = mongoose.model("Volunteering", VolunteeringSchema);
module.exports = Volunteering;
