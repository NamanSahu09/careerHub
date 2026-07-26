const express = require("express");
const { chat } = require("../controllers/chatController");

const router = express.Router();

// POST /api/chat — no auth required, anyone (including guests) can use the chatbot
router.post("/", chat);

module.exports = router;
