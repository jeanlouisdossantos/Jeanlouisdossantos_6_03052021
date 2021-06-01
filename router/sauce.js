const { Router } = require("express");
const express = require("express");
const router = express.Router();

const saucecontrol = require("../controllers/sauce");
const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

router.get("/", auth, saucecontrol.getAllSauce);
router.get("/:id", auth, saucecontrol.getOneSauce);
router.post("/", auth, multer, saucecontrol.createOneSauce);
router.put('/:id',auth, multer, saucecontrol.updateOneSauce)
router.delete('/:id', auth, multer , saucecontrol.deleteOneSauce )
router.post("/:id/like", auth, saucecontrol.updatelikes);
module.exports = router;
