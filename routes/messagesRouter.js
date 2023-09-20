const { Router } = require("express");
const messageController = require("../controllers/messageController");
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


router.get("/:id", messageController.message_details_get);
router.put("/:id", messageController.message_details_put);
router.delete("/:id", messageController.message_delete);
router.get("", messageController.messages_get);
router.post("", requireAuth, cpUpload, messageController.messages_post);
router.put("", messageController.messages_put);
module.exports = router;
