const User = require("../models/User");
const bcrypt = require("bcryptjs");
const generateToken = require("../utils/generateToken");

exports.register = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        const normalizedEmail = email.toLowerCase();

        const userExists = await User.findOne({
            email: normalizedEmail,
        });

        if (userExists) {
            return res.status(400).json({
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        await User.create({
            email: normalizedEmail,
            password: hashedPassword,
        });

        res.status(201).json({
            message: "User registered successfully",
        });
    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                message: "Email and password are required",
            });
        }

        const user = await User.findOne({
            email: email.toLowerCase(),
        });

        if (
            user &&
            (await bcrypt.compare(password, user.password))
        ) {
            return res.status(200).json({
                access_token: generateToken(user._id),
            });
        }

        return res.status(401).json({
            message: "Invalid email or password",
        });

    } catch (error) {
        res.status(500).json({
            message: error.message,
        });
    }
};