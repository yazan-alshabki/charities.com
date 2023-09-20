const { Router } = require("express");
const profileController = require("../controllers/profileController");
const router = Router();
const { requireAuth, checkUser } = require("../middleware/authmiddleware");
router.get("/:id", profileController.profile_details_get);
router.get("/:id/update", profileController.profile_details_update_get);
router.put("/:id/update", profileController.profile_details_update_put);
module.exports = router;
