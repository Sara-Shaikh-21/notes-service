const express = require("express");

const router = express.Router();

const protect = require("../middleware/authMiddleware");

const {
    getNotes,
    getNoteById,
    createNote,
    updateNote,
    deleteNote,
    shareNote,
    togglePinNote,
    searchNotes,
} = require("../controllers/noteController");

// Search notes
router.get("/search", protect, searchNotes);

// Get all notes
router.get("/notes", protect, getNotes);

router.patch("/notes/:id/pin", protect, togglePinNote);

// Get single note
router.get("/notes/:id", protect, getNoteById);

// Create note
router.post("/notes", protect, createNote);

// Update note
router.put("/notes/:id", protect, updateNote);

// Delete note
router.delete("/notes/:id", protect, deleteNote);

// Share note
router.post("/notes/:id/share", protect, shareNote);

module.exports = router;