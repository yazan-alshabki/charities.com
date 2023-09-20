const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRouter");
const cookieParser = require("cookie-parser");
const { checkUser, requireAuth } = require("./middleware/authmiddleware");
const bodyParser = require("body-parser");
const messageRoutes = require("./routes/messagesRouter");
const charitiesRoutes = require("./routes/charitiesRouter");
const profileRoutes = require("./routes/profileRouter");
const app = express();

// database connection
const dbURI =
    "mongodb+srv://yazan:yazan1234@database.pk2k6ll.mongodb.net/charity";
let Port = 4000;
let connectPort = async (port) => {
    try {
        await mongoose.connect(dbURI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useCreateIndex: true, //make this true
            autoIndex: true,
            useFindAndModify: true,
        });
        app.listen(port);
        console.log("connect to database");
    } catch (err) {
        console.log(err);
    }
};
connectPort(Port);
app.use(bodyParser.text({ type: "/" }));
// to get information from url
app.use(express.urlencoded({ extended: true }));
// for Object formData
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
// for read jwt properties
app.use(cookieParser());
// to use middleware
app.use(checkUser);
// check user for all pages
app.get("*", checkUser);
// for working with json
app.use(express.json());
// middleware
app.use(express.static("public"));
// view engine
app.set("view engine", "ejs");
// home
app.get("/", (req, res) => {
    res.redirect("/index");
});
// use other routes
app.use(authRoutes);
app.use("/messages", messageRoutes);
app.use("/charities", charitiesRoutes);
app.use("/profile", profileRoutes);
