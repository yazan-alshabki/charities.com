const mongoose = require("mongoose");
const Messages = require("../modules/messages");
const Charities = require("../modules/charities");
const ObjectsSchema = new mongoose.Schema(
    {
        charity: {
            type: mongoose.Schema.Types.Mixed,
            ref: "Charities",
        },

        quantity: {
            type: String,
            required: [true, "Please enter the quantity"],
            validate: [
                function (value) {
                    const regular = /^\d+$/;
                    const string = value;
                    return regular.test(string) && parseInt(value) > 0;
                },
                "quantity must be a number greater than zero",
            ],
        },
        objectType: {
            type: String,
        },
        objectClass: {
            type: String,
        },
        objectPerishability: {
            type: String,
        },
        numberOfFamily: {
            type: String,
        },
    },
    { timestamps: true }
);

ObjectsSchema.pre("save", async function (next) {
    const objectType = this.objectType;
    if (objectType.length === 0) {
        next(new Error("not filled"));
    }
    next();
});

const Objects = mongoose.model("Object", ObjectsSchema);
module.exports = Objects;
