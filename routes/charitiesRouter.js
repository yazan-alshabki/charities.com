const { Router } = require("express");
const charityController = require("../controllers/charitiesController");
const router = Router();
const { requireAuth, checkUser } = require("../middleware/authmiddleware");
const path = require("path");
const multer = require("multer");
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
const cpUpload = upload.fields([{ name: "program", maxCount: 1 }]);

router.get("/:id", requireAuth, charityController.charity_details_get);
router.post("/:id", charityController.charity_details_post);

router.get("/:id/messages", charityController.charity_messages_get);
router.get("/:id/admins", charityController.charity_admins_get);

router.put("/:id/messages", charityController.charity_messages_put);

router.get(
    "/:idCharity/messages/:id",
    charityController.charity_message_details_get
);
router.put(
    "/:idCharity/messages/:id",
    charityController.charity_message_details_put
);
router.post(
    "/:idCharity/messages/:id",
    cpUpload,
    charityController.charity_message_details_post
);

module.exports = router;
