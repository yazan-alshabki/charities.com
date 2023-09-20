const { Router } = require("express");
const authController = require("../controllers/authController");
const router = Router();
const path = require("path");
const multer = require("multer");
const { requireAuth, checkUser } = require("../middleware/authmiddleware");

let nameOfImage = null;
const Storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "public/uploads");
    },
    filename: (req, file, cb) => {
        nameOfImage =
            file.fieldname + "-" + Date.now() + path.extname(file.originalname);
        cb(null, nameOfImage);
    },
});
const upload = multer({
    storage: Storage,
});
const cpUpload = upload.fields([
    { name: "uploadImage", maxCount: 1 },
    { name: "uploadLicense", maxCount: 1 },
]);
router.get("/about", authController.about_get);
router.get("/policy", authController.policy_get);
router.get("/terms", authController.terms_get);


router.get("/login", authController.login_get);
router.get("/signup", authController.signup_get);
router.get("/index", authController.index_get);
router.get("/logout", authController.logout_get);
router.get("/login/:token/:id", authController.sendEmail_get);


router.post("/signup", authController.signup_post);
router.post("/login", authController.login_post);

// router.get("/messages/:id", authController.message_details_get);
// router.get("/messages", authController.messages_get);
// router.post("/messages", requireAuth, cpUpload, authController.messages_post);

module.exports = router;
