const express = require("express");
const {
  contactController,
  contactDeleteById,
  getAllContactList,
  searchContact,
  upload,
  updateContact,
  contactExports,
} = require("../controllers/contactController");

const router = express.Router();


router.post("/contacts", upload.single("image"), contactController);
router.delete("/contacts/:id", contactDeleteById);
router.get("/contacts", getAllContactList);
router.get("/contacts/search", searchContact);
router.patch("/contacts/:id", upload.single("image"), updateContact);
router.get("/contacts/export", contactExports);

module.exports = router;
