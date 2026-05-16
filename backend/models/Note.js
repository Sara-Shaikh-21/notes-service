const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 200,
        },

        content: {
            type: String,
            required: true,
            trim: true,
        },

        isPinned: {
            type: Boolean,
            default: false,
        },

        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        sharedWith: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],


    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Note", noteSchema);