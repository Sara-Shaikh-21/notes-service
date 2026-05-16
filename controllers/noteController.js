const Note = require("../models/Note");
const User = require("../models/User");

exports.getNotes = async (req, res) => {
    try {
        const notes = await Note.find({
            $or: [
                { owner: req.user._id },
                { sharedWith: req.user._id },
            ],
        }).sort({ isPinned: -1, createdAt: -1 });

        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

exports.getNoteById = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({
                message: "Note not found",
            });
        }

        const isOwner =
            note.owner.toString() === req.user._id.toString();

        const isShared = note.sharedWith.some(
            (userId) =>
                userId.toString() === req.user._id.toString()
        );

        if (!isOwner && !isShared) {
            return res.status(403).json({
                message: "Access denied",
            });
        }

        res.status(200).json(note);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

exports.createNote = async (req, res) => {
    try {
        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                message: "Title and content are required",
            });
        }

        const note = await Note.create({
            title,
            content,
            owner: req.user._id,
        });

        res.status(201).json(note);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

exports.updateNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({
                message: "Note not found",
            });
        }

        if (
            note.owner.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                message: "Access denied",
            });
        }

        const { title, content } = req.body;

        if (!title || !content) {
            return res.status(400).json({
                message: "Title and content are required",
            });
        }

        note.title = title;
        note.content = content;

        await note.save();

        res.status(200).json(note);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

exports.deleteNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({
                message: "Note not found",
            });
        }

        if (
            note.owner.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                message: "Access denied",
            });
        }

        await note.deleteOne();

        res.status(204).send();
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

exports.shareNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({
                message: "Note not found",
            });
        }

        // Only owner can share
        if (
            note.owner.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                message: "Only owner can share this note",
            });
        }

        const { share_with_email } = req.body;

        if (!share_with_email) {
            return res.status(400).json({
                message: "share_with_email is required",
            });
        }

        const user = await User.findOne({
            email: share_with_email.toLowerCase(),
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found",
            });
        }

        // Prevent duplicate sharing
        const alreadyShared = note.sharedWith.some(
            (userId) =>
                userId.toString() === user._id.toString()
        );

        if (!alreadyShared) {
            note.sharedWith.push(user._id);
            await note.save();
        }

        res.status(200).json({
            message: "Note shared successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

exports.searchNotes = async (req, res) => {
    try {
        const keyword = req.query.q;

        if (!keyword) {
            return res.status(400).json({
                message: "Search keyword is required",
            });
        }

        const notes = await Note.find({
            owner: req.user._id,
            $or: [
                {
                    title: {
                        $regex: keyword,
                        $options: "i",
                    },
                },
                {
                    content: {
                        $regex: keyword,
                        $options: "i",
                    },
                },
            ],
        });

        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

exports.togglePinNote = async (req, res) => {
    try {
        const note = await Note.findById(req.params.id);

        if (!note) {
            return res.status(404).json({
                message: "Note not found",
            });
        }

        if (
            note.owner.toString() !== req.user._id.toString()
        ) {
            return res.status(403).json({
                message: "Access denied",
            });
        }

        note.isPinned = !note.isPinned;

        await note.save();

        res.status(200).json({
            message: note.isPinned
                ? "Note pinned"
                : "Note unpinned",
            note,
        });

    } catch (error) {
        res.status(500).json({
            message: "Server error",
        });
    }
};