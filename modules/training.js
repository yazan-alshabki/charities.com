const mongoose = require("mongoose");
const Charities = require("../modules/charities");
const TrainingSchema = new mongoose.Schema(
    {
        charity: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Charities",
        },
        trainingType: {
            type: String,
        },
    },
    { timestamps: true }
);

const Training = mongoose.model("Training", TrainingSchema);
module.exports = Training;
