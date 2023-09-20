const User = require("../modules/user");
const Message = require("../modules/messages");
const Charities = require("../modules/charities");
const jwt = require("jsonwebtoken");

const { name } = require("ejs");
const Messages = require("../modules/messages");

const adminEmail = "yazanalshabki2001@gmail.com";
async function getNumberOfNewMessages(user) {
    let numberOfNewMessage = 0;
    user.messages.forEach((element) => {
        if (element.new === "NEW") numberOfNewMessage++;
    });
    return new Promise((resolve) => {
        resolve(numberOfNewMessage);
    });
}

const errorHandlerFormessage = (err) => {
    let error = {
        description: "",
        license: "",
        logo: "",
        bankAccount: "",
        charityName: "",
        phone: "",
    };
    if (err.message === "phone was registered") {
        error.phone = "This phone is already registered";
    }
    if (err.message === "bankAccount was registered") {
        error.bankAccount = "This bank account is already registered";
    }
    if (err.message === "charityName was registered") {
        error.charityName = "This charity name is already registered";
    }
    if (err.code === 11000) {
        Object.keys(err.keyPattern).forEach((properties) => {
            error[properties] = `This ${properties} is already registered`;
        });
        return error;
    }
    if (err.message.includes("Charitie validation failed")) {
        Object.values(err.errors).forEach(({ properties }) => {
            error[properties.path] = properties.message;
        });
    }
    return error;
};

const message_details_get = async (req, res) => {
    const id = req.params.id;
    const user = res.locals.user;
    let numberOfNewMessages = 0;
    let response = 1;
    let acceptOrRefuse = false;
    if (user) {
        numberOfNewMessages = await getNumberOfNewMessages(user);
    }
    try {
        let resultInMessage = await Messages.findById(id);
        if (
            resultInMessage.new !== "ACCEPTED" &&
            !resultInMessage.subject.includes("Response")
        ) {
            acceptOrRefuse = true;
        }
        if (!resultInMessage.subject.includes("Response")) {
            response = 0;
        }
        let license = null;
        if (resultInMessage.charityId) {
            const charity = await Charities.findById(resultInMessage.charityId);
            license = charity.license;
        }
        res.render("messages/details", {
            message: resultInMessage,
            idMessageInUrl: false,
            acceptOrRefuse: acceptOrRefuse,
            numberOfNewMessages: numberOfNewMessages,
            license: license,
            response: response,
        });
    } catch (err) {
        console.log(err);
    }
};
const messages_get = async (req, res) => {
    const user = res.locals.user;
    if (user) {
        numberOfNewMessages = await getNumberOfNewMessages(user);
    }
    try {
        const messages = await user.messages.sort(
            (a, b) => b.createdAt - a.createdAt
        );
        res.render("messages/messages", {
            messages: messages,
            idMessageInUrl: true,
            numberOfNewMessages: numberOfNewMessages,
        });
    } catch (err) {
        console.log(err);
    }
};
const messages_put = async (req, res) => {
    const id = req.body.id;
    const user = res.locals.user;
    try {
        const oldMessage = await Messages.findById(id);
        if (oldMessage.new === "NEW") {
            const update = await Messages.updateOne(
                { _id: id },
                { $set: { new: "OLD" } },
                { new: true }
            );
            const newMessage = await Messages.findById(id);
            const updateMessagesInUser = await User.findOneAndUpdate(
                { _id: user._id, "messages._id": oldMessage._id },
                {
                    $set: {
                        "messages.$": newMessage,
                    },
                },
                { new: true }
            );
        }
        res.status(201).json({ newMessage: oldMessage._id });
    } catch (err) {
        console.log(err);
    }
};

const message_details_put = async (req, res) => {
    const id = req.body.id;
    const user = res.locals.user;
    try {
        const oldMessage = await Messages.findById(id);
        const update = await Messages.updateOne(
            { _id: id },
            { $set: { new: "ACCEPTED" } },
            { new: true }
        );
        const newMessage = await Messages.findById(id);
        const updateMessagesInUser = await User.findOneAndUpdate(
            { _id: user._id, "messages._id": oldMessage._id },
            {
                $set: {
                    "messages.$": newMessage,
                },
            },
            { new: true }
        );
        if (newMessage.charityId) {
            const updateCharity = await Charities.updateOne(
                { _id: newMessage.charityId },
                { $set: { pending: "accept" } }
            );
        }
        const charity = await Charities.findById(newMessage.charityId);
        const content = `We accept your request to add the charity { ${charity.charityName} }`;
        const message = await Message.create({
            charityId: null,
            fromId: user._id,
            from: `HopeHive`,
            subject: "Response For Add Charity Request",
            content: content.trim(),
            new: "NEW",
        });

        const updateUser = await User.findOneAndUpdate(
            { _id: newMessage.fromId },
            { $push: { messages: [message] } }
        );

        res.status(201).json({ update: newMessage._id });
    } catch (err) {
        console.log(err);
    }
};
const messages_post = async (req, res) => {
    const user = res.locals.user;
    let uploadImage = null;
    let uploadLicense = null;
    if (req.files[`uploadImage`]) {
        uploadImage = req.files[`uploadImage`][0].filename;
    }
    if (req.files[`uploadLicense`]) {
        uploadLicense = req.files[`uploadLicense`][0].filename;
    }

    try {
        const charity = await Charities.create({
            bankAccount: req.body.bankAccount,
            charityName: req.body.charityName,
            phone: req.body.phone,
            charityType: req.body.charityType,
            logo: uploadImage,
            description: req.body.description,
            license: uploadLicense,
            pending: "pending",
            users: [user],
            messages: [],
        });
        let content = `
Description : ${charity.description}
The name of charity : ${charity.charityName}
Phone : ${charity.phone}
Bank account : ${charity.bankAccount}
Charity Type : ${charity.charityType}`;
        const message = await Message.create({
            charityId: charity._id,
            fromId: user._id,
            from: `${user.firstName} ${user.lastName}`,
            subject: "Request Add Charity",
            content: content.trim(),
            new: "NEW",
        });

        const update = await User.findOneAndUpdate(
            { email: adminEmail },
            { $push: { messages: [message] } }
        );
        res.status(201).json({ message: message });
    } catch (err) {
        const error = errorHandlerFormessage(err);
        console.log(error);
        res.status(400).json({ error });
    }
};

const message_delete = async (req, res) => {
    const user = res.locals.user;
    const id = req.params.id;
    let message = await Messages.findById(id);
    let charityId = message.charityId;
    const charity = await Charities.findById(charityId);
    if (charityId) {
        let deleteFromCharities = await Charities.findByIdAndDelete(charityId);
    }
    const updateUser = await User.updateOne(
        { _id: user._id },
        { $pull: { messages: { $eq: message } } }
    );

    const content = `We reject your request to add the charity { ${charity.charityName} }`;
    const response = await Message.create({
        charityId: null,
        fromId: user._id,
        from: `HopeHive`,
        subject: "Response For Add Charity Request",
        content: content.trim(),
        new: "NEW",
    });
    const sendMessageToUser = await User.findOneAndUpdate(
        { _id: message.fromId },
        { $push: { messages: [response] } }
    );
    Messages.findByIdAndDelete(id)
        .then((result) => {
            res.json({ response: "/messages" });
        })
        .catch((err) => {
            console.log(err);
        });
};
module.exports = {
    messages_get,
    messages_post,
    messages_put,
    message_details_get,
    message_details_put,
    message_delete,
};
