const User = require("../modules/user");
async function getNumberOfNewMessages(user) {
    let numberOfNewMessage = 0;
    user.messages.forEach((element) => {
        if (element.new === "NEW") numberOfNewMessage++;
    });
    return new Promise((resolve) => {
        resolve(numberOfNewMessage);
    });
}
const profile_details_get = async (req, res) => {
    const id = req.params.id;
    console.log(id);
    const user = res.locals.user;
    let numberOfNewMessages = 0;
    let idMessageInUrl = false;
    if (user) {
        numberOfNewMessages = await getNumberOfNewMessages(user);
    }
    let userWhoShowHisProfile = await User.findById(id);
    let userIsOwner = false;
    if (user.id === userWhoShowHisProfile.id) {
        userIsOwner = true;
    }
    try {
        res.render("profile/Profile", {
            numberOfNewMessages,
            idMessageInUrl,
            userWhoShowHisProfile: userWhoShowHisProfile,
            user: user,
            userIsOwner: userIsOwner,
        });
    } catch (err) {
        console.log(err);
    }
};
const profile_details_update_get = async (req, res) => {
    const id = req.params.id;
    const user = res.locals.user;
    let numberOfNewMessages = 0;
    let idMessageInUrl = false;
    if (user) {
        numberOfNewMessages = await getNumberOfNewMessages(user);
    }
    try {
        res.render("profile/edit-profile", {
            numberOfNewMessages,
            idMessageInUrl,
            user,
        });
    } catch (err) {
        console.log(err);
    }
};
const profile_details_update_put = async (req, res) => {
    const userId = req.body.id;
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const phone = req.body.phone;
    const city = req.body.city;
    try {
        const findPhone = await User.find({ phone: phone });
        
        if (findPhone.length !== 0 && findPhone[0].id !== userId) {
            throw Error("ERROR");
        }
        let updateUser = await User.findOneAndUpdate(
            { _id: userId },
            {
                $set: {
                    firstName: firstName,
                    lastName: lastName,
                    phone: phone,
                    city: city,
                },
            },
            { new: true }
        );
        res.status(201).json({ userId: userId });
    } catch (err) {
        res.status(201).json({ error: "error" });
    }
};
module.exports = {
    profile_details_get,
    profile_details_update_get,
    profile_details_update_put,
};
