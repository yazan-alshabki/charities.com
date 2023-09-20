const User = require("../modules/user");
const Message = require("../modules/messages");
const Charities = require("../modules/charities");
const jwt = require("jsonwebtoken");
const { name } = require("ejs");
const Messages = require("../modules/messages");
const adminEmail = "yazanalshabki2001@gmail.com";
const AnyObject = require("../modules/objects");
const Volunteering = require("../modules/volunteering");
const Training = require("../modules/training");

const errorHandlerForCharities = (err) => {
    let error = {
        type: "",
        quantity: "",
        experience: "",
        hours: "",
        available: "",
    };
    if (err.message.includes("There is only")) {
        error.quantity = err.message;
    }
    if (err.message === "not filled") {
        error.type = "Please enter new option";
    } else if (err.message === "not filled days") {
        error.available = "Please check at least one day";
    }
    if (err.message.includes("Object validation failed")) {
        Object.values(err.errors).forEach(({ properties }) => {
            error[properties.path] = properties.message;
        });
    }
    if (err.message.includes("Volunteering validation failed")) {
        Object.values(err.errors).forEach(({ properties }) => {
            error[properties.path] = properties.message;
        });
    }
    return error;
};

async function getNumberOfNewMessages(user) {
    let numberOfNewMessage = 0;
    user.messages.forEach((element) => {
        if (element.new === "NEW") numberOfNewMessage++;
    });
    return new Promise((resolve) => {
        resolve(numberOfNewMessage);
    });
}

const charity_details_post = async (req, res) => {
    const id = req.params.id;
    const user = res.locals.user;
    let numberOfNewMessages = 0;
    if (user) {
        numberOfNewMessages = await getNumberOfNewMessages(user);
    }
    if (req.body.form === "Donation") {
        try {
            let charity = await Charities.findById(req.body.charity);
            let object;
            if (
                charity.charityType.trim() === "Hunger Releif" ||
                charity.charityType.trim() === "Personal-need"
            ) {
                object = await AnyObject.create({
                    charity: charity,
                    quantity: req.body.quantity,
                    objectType: req.body.type,
                    objectPerishability: req.body.Perishability,
                });
            } else {
                object = await AnyObject.create({
                    charity: charity,
                    quantity: req.body.quantity,
                    objectType: req.body.type,
                    objectPerishability: req.body.Perishability,
                    objectClass: req.body.class,
                });
            }
            let content;
            if (charity.charityType.trim() === "Hunger Releif") {
                content = `
                Food type : ${object.objectType}
Quantity :  ${object.quantity}
Perishability : ${object.objectPerishability}`;
            } else if (charity.charityType.trim() === "Personal-need") {
                content = `
Object type: ${object.objectType}
Quantity :  ${object.quantity}`;
            } else {
                if (req.body.class === "Medicine") {
                    content = `
Medicine : ${object.objectType}
Quantity :  ${object.quantity}`;
                } else {
                    content = `
Medical Supplies : ${object.objectType}
Quantity :  ${object.quantity}`;
                }
            }

            const message = await Message.create({
                fromId: user._id,
                charityId: req.body.charity,
                objectId: object._id,
                from: `${user.firstName} ${user.lastName}`,
                subject: "Donation Request",
                content: content.trim(),
                new: "NEW",
            });

            const update = await Charities.findOneAndUpdate(
                { _id: object.charity._id },
                { $push: { messages: [message] } }
            );
            res.status(201).json({ message: message });
        } catch (err) {
            const error = errorHandlerForCharities(err);
            res.status(400).json({ error });
        }
    } else if (req.body.form === "Volunteering") {
        try {
            const object = await Volunteering.create({
                charity: req.body.charity,
                hours: req.body.availableHours,
                available: req.body.days,
                experience: req.body.VolunteerExperience,
                workStatus: req.body.WorkStatus,
                Preferences: req.body.RolePreferences,
            });
            let content = `
Available days: ${object.available}
Available hours in day: ${object.hours}
Volunteer experience: ${object.experience}
Work status:${object.workStatus}
Preferences:${object.Preferences}`;

            const message = await Message.create({
                fromId: user._id,
                charityId: req.body.charity,
                objectId: object._id,
                from: `${user.firstName} ${user.lastName}`,
                subject: "Volunteering Request",
                content: content.trim(),
                new: "NEW",
            });
            const update = await Charities.findOneAndUpdate(
                { _id: object.charity._id },
                { $push: { messages: [message] } }
            );
            res.status(201).json({ message: message });
        } catch (err) {
            const error = errorHandlerForCharities(err);
            res.status(400).json({ error });
        }
    } else if (req.body.form === "Training") {
        try {
            const object = await Training.create({
                charity: req.body.charity,
                trainingType: req.body.TrainingType,
            });
            let content = `Training Type: ${object.trainingType}`;
            const message = await Message.create({
                fromId: user._id,
                charityId: req.body.charity,
                objectId: object._id,
                from: `${user.firstName} ${user.lastName}`,
                subject: "Training Request",
                content: content.trim(),
                new: "NEW",
            });
            const update = await Charities.findOneAndUpdate(
                { _id: object.charity._id },
                { $push: { messages: [message] } }
            );
            res.status(201).json({ message: message });
        } catch (err) {
            const error = errorHandlerForCharities(err);
            res.status(400).json({ error });
        }
    } else if (
        req.body.form === "Health Course" ||
        req.body.form === "Food Course" ||
        req.body.form === "Object Course"
    ) {
        try {
            let content = `I want to enroll in the course you offer`;

            if (req.body.form === "Object Course") {
                let course = "";

                if (req.body.courseType === "ComputerSkills") {
                    course = `Basic Computer Skills Training`;
                } else if (req.body.courseType === "Sewing") {
                    course = "Sewing and Clothing Repair Workshops";
                } else if (req.body.courseType === "HomeRepairing") {
                    course = "Home Maintenance and Repair Training";
                } else if (req.body.courseType === "CreativeSkills") {
                    course = " Artistic and Creative Skills Training";
                }
                content = `I want to enroll in the course : ( ${course} ) you offer`;
            }
            const message = await Message.create({
                fromId: user._id,
                charityId: req.body.charity,
                from: `${user.firstName} ${user.lastName}`,
                subject: "Training Request",
                content: content.trim(),
                new: "NEW",
            });
            const update = await Charities.findOneAndUpdate(
                { _id: message.charityId },
                { $push: { messages: [message] } }
            );
            res.status(201).json({ message: message });
        } catch (err) {
            const error = errorHandlerForCharities(err);
            res.status(400).json({ error });
        }
    } else if (
        req.body.form === "Request Food" ||
        req.body.form === "Request Object" ||
        req.body.form === "Request Medicine" ||
        req.body.form === "Request Medical Supplies"
    ) {
        console.log("request medicine");
        try {
            let charity = await Charities.findById(req.body.charity);
            for (let i = 0; i < charity.objects.length; i++) {
                if (charity.objects[i].objectType === req.body.objectType) {
                    console.log(charity.objects[i].objectType);

                    if (
                        parseInt(charity.objects[i].quantity) <
                        parseInt(req.body.requestQuantity)
                    ) {
                        throw new Error(
                            `There is only ${charity.objects[i].quantity} ${charity.objects[i].objectType} `
                        );
                    }
                }
            }

            let object;
            if (charity.charityType.trim() === "Hunger Releif") {
                object = await AnyObject.create({
                    charity: charity,
                    quantity: req.body.requestQuantity,
                    objectType: req.body.objectType,
                    numberOfFamily: req.body.familyMember,
                });
            } else {
                object = await AnyObject.create({
                    charity: charity,
                    quantity: req.body.requestQuantity,
                    objectType: req.body.objectType,
                });
            }

            let content;
            let message;
            if (charity.charityType.trim() === "Hunger Releif") {
                content = `
Food type : ${object.objectType}
Quantity :  ${object.quantity}
Number of family : ${object.numberOfFamily}`;
                message = await Message.create({
                    fromId: user._id,
                    charityId: req.body.charity,
                    objectId: object._id,
                    from: `${user.firstName} ${user.lastName}`,
                    subject: "Food Request",
                    content: content.trim(),
                    new: "NEW",
                });
            } else if (charity.charityType.trim() === "Personal-need") {
                content = `
Object type: ${object.objectType}
Quantity :  ${object.quantity}`;
                message = await Message.create({
                    fromId: user._id,
                    charityId: req.body.charity,
                    objectId: object._id,
                    from: `${user.firstName} ${user.lastName}`,
                    subject: "Personal-Need Request",
                    content: content.trim(),
                    new: "NEW",
                });
            } else {
                if (req.body.class === "Medicine") {
                    console.log("medicine");
                    content = `
Medicine : ${object.objectType}
Quantity :  ${object.quantity}`;
                    message = await Message.create({
                        fromId: user._id,
                        charityId: req.body.charity,
                        objectId: object._id,
                        from: `${user.firstName} ${user.lastName}`,
                        subject: "Medicine Request",
                        content: content.trim(),
                        new: "NEW",
                    });
                } else {
                    content = `
Medical Supplies : ${object.objectType}
Quantity :  ${object.quantity}`;
                    message = await Message.create({
                        fromId: user._id,
                        charityId: req.body.charity,
                        objectId: object._id,
                        from: `${user.firstName} ${user.lastName}`,
                        subject: "Medical Supplies Request",
                        content: content.trim(),
                        new: "NEW",
                    });
                }
            }
            const update = await Charities.findOneAndUpdate(
                { _id: object.charity._id },
                { $push: { messages: [message] } }
            );
            res.status(201).json({ message: message });
        } catch (err) {
            const error = errorHandlerForCharities(err);
            res.status(400).json({ error });
        }
    }
};

const charity_details_get = async (req, res) => {
    const id = req.params.id;
    const user = res.locals.user;
    let numberOfNewMessages = 0;
    if (user) {
        numberOfNewMessages = await getNumberOfNewMessages(user);
    }
    try {
        let charity = await Charities.findById(id);
        let objects = await charity.objects;
        let admin = false;
        await charity.users.forEach((userInCharity) => {
            if (
                new String(userInCharity._id).valueOf() ===
                new String(user._id).valueOf()
            ) {
                admin = true;
            }
        });
        if (charity.charityType.trim() === "Hunger Releif") {
            res.render("charities/food-charity-page", {
                charity: charity,
                idMessageInUrl: false,
                numberOfNewMessages: numberOfNewMessages,
                admin: admin,
                objects: objects,
                type: user.accountType,
            });
        } else if (charity.charityType.trim() === "Personal-need") {
            res.render("charities/object-charity-page", {
                charity: charity,
                idMessageInUrl: false,
                numberOfNewMessages: numberOfNewMessages,
                admin: admin,
                objects: objects,
                type: user.accountType,
            });
        } else {
            let medicine = 0;
            let medicalSupplies = 0;

            for (let i = 0; i < objects.length; i++) {
                if (objects[i].objectClass === "Medicine") {
                    medicine++;
                } else {
                    medicalSupplies++;
                }
            }
            res.render("charities/medicine-charity-page", {
                charity: charity,
                idMessageInUrl: false,
                numberOfNewMessages: numberOfNewMessages,
                admin: admin,
                objects: objects,
                type: user.accountType,
                medicine: medicine,
                medicalSupplies: medicalSupplies,
            });
        }
    } catch (err) {
        console.log(err);
    }
};
const charity_messages_put = async (req, res) => {
    const id = req.body.id;
    const user = res.locals.user;
    const charity = req.body.charity;

    try {
        const oldMessage = await Messages.findById(id);

        if (oldMessage.new === "NEW") {
            const update = await Messages.updateOne(
                { _id: id },
                { $set: { new: "OLD" } },
                { new: true }
            );
            const newMessage = await Messages.findById(id);
            const updateMessagesInUser = await Charities.findOneAndUpdate(
                { _id: charity, "messages._id": oldMessage._id },
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

const charity_messages_get = async (req, res) => {
    const user = res.locals.user;
    if (user) {
        numberOfNewMessages = await getNumberOfNewMessages(user);
    }
    let charity = await Charities.findById(req.params.id);
    try {
        const messages = await charity.messages.sort(
            (a, b) => b.createdAt - a.createdAt
        );
        res.render("charities/charity-messages", {
            messages: messages,
            idMessageInUrl: true,
            numberOfNewMessages: numberOfNewMessages,
        });
    } catch (err) {
        console.log(err);
    }
};
const charity_admins_get = async (req, res) => {
    const user = res.locals.user;
    if (user) {
        numberOfNewMessages = await getNumberOfNewMessages(user);
    }
    let charity = await Charities.findById(req.params.id);
    try {
        const admins = await charity.users.sort(
            (a, b) => b.createdAt - a.createdAt
        );
        res.render("charities/charity-admins-list", {
            admins: admins,
            idMessageInUrl: true,
            numberOfNewMessages: numberOfNewMessages,
        });
    } catch (err) {
        console.log(err);
    }
};

const charity_message_details_get = async (req, res) => {
    const id = req.params.id;
    const user = res.locals.user;
    let numberOfNewMessages = 0;
    let acceptOrRefuse = false;
    if (user) {
        numberOfNewMessages = await getNumberOfNewMessages(user);
    }
    try {
        let resultInMessage = await Messages.findById(id);
        if (
            (resultInMessage.new === "NEW" || resultInMessage.new === "OLD") &&
            !resultInMessage.subject.includes("Response")
        ) {
            acceptOrRefuse = "NOT RESPONSE";
        } else if (resultInMessage.new === "ACCEPTED") {
            acceptOrRefuse = "ACCEPTED";
        } else if (resultInMessage.new === "REJECTED") {
            acceptOrRefuse = "REJECTED";
        } else if (resultInMessage.new === "CONFIRMED") {
            acceptOrRefuse = "CONFIRMED";
        }
        let response = 1;
        if (!resultInMessage.subject.includes("Response")) {
            response = 0;
        }
        let license = null;
        res.render("charities/charity-message-details", {
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

/*

            
*/
const charity_message_details_put = async (req, res) => {
    const id = req.body.id;
    const user = res.locals.user;
    if (req.body.subject === "Donation Request") {
        try {
            const oldMessage = await Messages.findById(id);
            let object = await AnyObject.findById(oldMessage.objectId);
            const charity = await Charities.findById(oldMessage.charityId);
            let update;
            if (req.body.accept === "ACCEPT") {
                update = await Messages.updateOne(
                    { _id: id },
                    { $set: { new: "ACCEPTED" } },
                    { new: true }
                );
            } else if (req.body.accept === "REJECT") {
                update = await Messages.updateOne(
                    { _id: id },
                    { $set: { new: "REJECTED" } },
                    { new: true }
                );
                const deleteObjectFromSchema = await AnyObject.deleteOne({
                    _id: object._id,
                });
            } else {
                update = await Messages.updateOne(
                    { _id: id },
                    { $set: { new: "CONFIRMED" } },
                    { new: true }
                );
                let findObject = false;
                let quantity = parseInt(object.quantity);
                let idObjectInCharity = -1;
                // search if the object is in the charity
                await charity.objects.forEach(async (objectInCharity) => {
                    if (
                        new String(objectInCharity.objectType).valueOf() ===
                        new String(object.objectType).valueOf()
                    ) {
                        findObject = true;
                        quantity += parseInt(objectInCharity.quantity);
                        idObjectInCharity = objectInCharity._id;
                    }
                });
                let updateObject = await AnyObject.updateOne(
                    { _id: object._id },
                    { $set: { quantity: quantity.toString() } },
                    { quantity: true }
                );
                object = await AnyObject.findById(oldMessage.objectId);
                // add new object to the database of the charity
                if (findObject === false) {
                    const updateCharityAddObject =
                        await Charities.findOneAndUpdate(
                            { _id: oldMessage.charityId },
                            { $push: { objects: [object] } }
                        );
                } else {
                    // add the donation quantity to the previous one

                    const updateCharityAddObject =
                        await Charities.findOneAndUpdate(
                            {
                                _id: oldMessage.charityId,
                                "objects._id": idObjectInCharity,
                            },
                            {
                                $set: {
                                    "objects.$.quantity": object.quantity,
                                },
                            }
                        );
                }
                const deleteObjectFromSchema = await AnyObject.deleteOne({
                    _id: object._id,
                });
            }

            const newMessage = await Messages.findById(id);
            const updateMessagesInCharity = await Charities.findOneAndUpdate(
                { _id: newMessage.charityId, "messages._id": oldMessage._id },
                {
                    $set: {
                        "messages.$": newMessage,
                    },
                },
                { new: true }
            );
            let content = `We accept your request to donate in charity { ${charity.charityName} }
if you want to confirm it please come to any department of our charity`;
            if (req.body.accept === "REJECT") {
                content = `We reject your request to donate in charity { ${charity.charityName} }`;
            } else if (req.body.accept === "CONFIRM") {
                content = `We confirmed your request to donate in charity { ${charity.charityName} }`;
            }
            const message = await Message.create({
                charityId: null,
                fromId: user._id,
                from: `${charity.charityName}`,
                subject: "Response For Donation",
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
    } else if (req.body.subject === "Volunteering Request") {
        const oldMessage = await Messages.findById(id);
        let object = await Volunteering.findById(oldMessage.objectId);
        const charity = await Charities.findById(oldMessage.charityId);
        let update;
        try {
            if (req.body.accept === "REJECT") {
                update = await Messages.updateOne(
                    { _id: id },
                    { $set: { new: "REJECTED" } },
                    { new: true }
                );
            } else {
                update = await Messages.updateOne(
                    { _id: id },
                    { $set: { new: "CONFIRMED" } },
                    { new: true }
                );
                const userToAdd = await User.findById(oldMessage.fromId);
                if (object.Preferences === "Administrative") {
                    let updateAdmins = await Charities.findOneAndUpdate(
                        { _id: charity._id },
                        { $push: { users: [userToAdd] } }
                    );
                }
            }
            const deleteObjectFromSchema = await Volunteering.deleteOne({
                _id: object._id,
            });

            const newMessage = await Messages.findById(id);

            const updateMessagesInCharity = await Charities.findOneAndUpdate(
                { _id: newMessage.charityId, "messages._id": oldMessage._id },
                {
                    $set: {
                        "messages.$": newMessage,
                    },
                },
                { new: true }
            );

            let content = ``;
            if (req.body.accept === "REJECT") {
                content = `We reject your request to volunteer in charity { ${charity.charityName} }`;
            } else if (req.body.accept === "CONFIRM") {
                content = `We confirmed your request to volunteer in charity { ${charity.charityName} }`;
            }
            const message = await Message.create({
                charityId: null,
                fromId: user._id,
                from: `${charity.charityName}`,
                subject: "Response For Volunteer",
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
    } else if (
        req.body.subject === "Food Request" ||
        req.body.subject === "Personal-Need Request" ||
        req.body.subject === "Medicine Request" ||
        req.body.subject === "Medical Supplies Request"
    ) {
        console.log("yazan");
        try {
            const oldMessage = await Messages.findById(id);
            let object = await AnyObject.findById(oldMessage.objectId);
            const charity = await Charities.findById(oldMessage.charityId);
            let update;
            if (req.body.accept === "ACCEPT") {
                update = await Messages.updateOne(
                    { _id: id },
                    { $set: { new: "ACCEPTED" } },
                    { new: true }
                );
            } else if (req.body.accept === "REJECT") {
                update = await Messages.updateOne(
                    { _id: id },
                    { $set: { new: "REJECTED" } },
                    { new: true }
                );
                const deleteObjectFromSchema = await AnyObject.deleteOne({
                    _id: object._id,
                });
            } else {
                update = await Messages.updateOne(
                    { _id: id },
                    { $set: { new: "CONFIRMED" } },
                    { new: true }
                );
                let quantity = parseInt(object.quantity);
                let idObjectInCharity = -1;
                await charity.objects.forEach(async (objectInCharity) => {
                    if (
                        new String(objectInCharity.objectType).valueOf() ===
                        new String(object.objectType).valueOf()
                    ) {
                        quantity =
                            parseInt(objectInCharity.quantity) - quantity;
                        idObjectInCharity = objectInCharity._id;
                    }
                });
                if (quantity === 0) {
                    const updateCharityObject =
                        await Charities.findOneAndUpdate(
                            { _id: oldMessage.charityId },
                            {
                                $pull: {
                                    objects: { _id: idObjectInCharity },
                                },
                            },
                            { new: true }
                        );

                    const deleteObjectFromSchema = await AnyObject.deleteOne({
                        _id: object._id,
                    });
                } else {
                    let updateObject = await AnyObject.updateOne(
                        { _id: object._id },
                        { $set: { quantity: quantity.toString() } },
                        { quantity: true }
                    );
                    object = await AnyObject.findById(oldMessage.objectId);
                    const updateCharityObject =
                        await Charities.findOneAndUpdate(
                            {
                                _id: oldMessage.charityId,
                                "objects._id": idObjectInCharity,
                            },
                            {
                                $set: {
                                    "objects.$.quantity": object.quantity,
                                },
                            }
                        );
                }
            }
            const newMessage = await Messages.findById(id);
            const updateMessagesInCharity = await Charities.findOneAndUpdate(
                { _id: newMessage.charityId, "messages._id": oldMessage._id },
                {
                    $set: {
                        "messages.$": newMessage,
                    },
                },
                { new: true }
            );
            let content;
            let message;
            if (req.body.subject === "Food Request") {
                content = `We accept your request to get food in charity { ${charity.charityName} }
if you want to confirm it please come to any department of our charity`;
                if (req.body.accept === "REJECT") {
                    content = `We reject your request to get food in charity { ${charity.charityName} }`;
                } else if (req.body.accept === "CONFIRM") {
                    content = `We confirmed your request to get food in charity { ${charity.charityName} }`;
                }
                message = await Message.create({
                    charityId: null,
                    fromId: user._id,
                    from: `${charity.charityName}`,
                    subject: "Response For Request Food",
                    content: content.trim(),
                    new: "NEW",
                });
            } else if (req.body.subject === "Personal-Need Request") {
                content = `We accept your request to get object in charity { ${charity.charityName} }
if you want to confirm it please come to any department of our charity`;
                if (req.body.accept === "REJECT") {
                    content = `We reject your request to get object in charity { ${charity.charityName} }`;
                } else if (req.body.accept === "CONFIRM") {
                    content = `We confirmed your request to get object in charity { ${charity.charityName} }`;
                }
                message = await Message.create({
                    charityId: null,
                    fromId: user._id,
                    from: `${charity.charityName}`,
                    subject: "Response For Request object",
                    content: content.trim(),
                    new: "NEW",
                });
            } else if (req.body.subject === "Medicine Request") {
                content = `We accept your request to get Medicine in charity { ${charity.charityName} }
if you want to confirm it please come to any department of our charity`;
                if (req.body.accept === "REJECT") {
                    content = `We reject your request to get Medicine in charity { ${charity.charityName} }`;
                } else if (req.body.accept === "CONFIRM") {
                    content = `We confirmed your request to get Medicine in charity { ${charity.charityName} }`;
                }
                message = await Message.create({
                    charityId: null,
                    fromId: user._id,
                    from: `${charity.charityName}`,
                    subject: "Response For Request Medicine",
                    content: content.trim(),
                    new: "NEW",
                });
            } else if (req.body.subject === "Medical Supplies Request") {
                content = `We accept your request to get Medical supplies in charity { ${charity.charityName} }
if you want to confirm it please come to any department of our charity`;
                if (req.body.accept === "REJECT") {
                    content = `We reject your request to get Medical supplies in charity { ${charity.charityName} }`;
                } else if (req.body.accept === "CONFIRM") {
                    content = `We confirmed your request to get Medical supplies in charity { ${charity.charityName} }`;
                }
                message = await Message.create({
                    charityId: null,
                    fromId: user._id,
                    from: `${charity.charityName}`,
                    subject: "Response For Request Medical supplies",
                    content: content.trim(),
                    new: "NEW",
                });
            }
            const updateUser = await User.findOneAndUpdate(
                { _id: newMessage.fromId },
                { $push: { messages: [message] } }
            );
            res.status(201).json({ update: newMessage._id });
        } catch (err) {
            console.log(err);
        }
    }
};
const charity_message_details_post = async (req, res) => {
    const id = req.params.id;
    const user = res.locals.user;
    let numberOfNewMessages = 0;
    let acceptOrRefuse = false;
    if (user) {
        numberOfNewMessages = await getNumberOfNewMessages(user);
    }
    const oldMessage = await Messages.findById(id);
    const charity = await Charities.findById(oldMessage.charityId);
    try {
        let content = ``;
        if (req.body.accept === "REJECT") {
            content = `We reject your request to train in charity { ${charity.charityName} }`;
            update = await Messages.updateOne(
                { _id: id },
                { $set: { new: "REJECTED" } },
                { new: true }
            );
        } else if (req.body.accept === "CONFIRM") {
            content = `We confirmed your request to train in charity { ${charity.charityName} }`;
            update = await Messages.updateOne(
                { _id: id },
                { $set: { new: "CONFIRMED" } },
                { new: true }
            );
        }
        const newMessage = await Messages.findById(id);

        const updateMessagesInCharity = await Charities.findOneAndUpdate(
            { _id: newMessage.charityId, "messages._id": oldMessage._id },
            {
                $set: {
                    "messages.$": newMessage,
                },
            },
            { new: true }
        );
        let message;
        if (req.body.accept === "CONFIRM") {
            message = await Message.create({
                charityId: null,
                fromId: user._id,
                from: `${charity.charityName}`,
                subject: "Response For Training",
                content: content.trim(),
                image: req.files[`program`][0].filename,
                new: "NEW",
            });
        } else {
            message = await Message.create({
                charityId: null,
                fromId: user._id,
                from: `${charity.charityName}`,
                subject: "Response For Training",
                content: content.trim(),
                new: "NEW",
            });
        }
        const updateUser = await User.findOneAndUpdate(
            { _id: newMessage.fromId },
            { $push: { messages: [message] } }
        );
        res.status(201).json({ update: newMessage._id });
    } catch (err) {
        console.log(err);
    }
};
module.exports = {
    charity_details_get,
    charity_details_post,
    charity_messages_get,
    charity_admins_get,
    charity_messages_put,
    charity_message_details_get,
    charity_message_details_put,
    charity_message_details_post,
};
