import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @desc    Register user
// @route   POST /api/auth/register
export const register = async (req, res) => {
    const { username, password, secret_animal, display_name, selected_animal_id, selected_avatar_url, territory_cell, seeking_modes } = req.body;

    try {
        // Validation Rules
        const errors = [];
        if (!/^[a-zA-Z0-9_]{3,20}$/.test(username)) {
            errors.push({ field: "username", message: "Username must be 3-20 characters and contain only alphanumeric or underscores" });
        }
        if (password.length < 4) {
            errors.push({ field: "password", message: "Password must be at least 4 characters" });
        }
        if (territory_cell && !/^[A-H][1-6]$/.test(territory_cell.cell_id)) {
            errors.push({ field: "cell_id", message: "Invalid cell format. Use A1-H6" });
        }

        if (errors.length > 0) {
            return res.status(400).json({ status: "error", message: "Validation failed", errors });
        }

        const userExists = await User.findOne({ username });
        if (userExists) {
            return res.status(400).json({
                status: 'error',
                message: 'Validation failed',
                errors: [{ field: "username", message: "Username already exists" }]
            });
        }

        const salt = await bcrypt.genSalt(10);
        const password_hash = await bcrypt.hash(password, salt);

        const user = await User.create({
            username,
            password_hash,
            secret_animal,
            display_name,
            selected_animal_id,
            selected_avatar_url,
            territory_cell,
            seeking_modes
        });

        if (user) {
            res.status(201).json({
                status: 'success',
                message: `Welcome to the forest, ${display_name}!`,
                data: {
                    user: {
                        _id: user._id,
                        username: user.username,
                        display_name: user.display_name,
                        selected_animal_id: user.selected_animal_id,
                        selected_avatar_url: user.selected_avatar_url,
                        territory_cell: user.territory_cell,
                        seeking_modes: user.seeking_modes,
                        created_at: user.created_at
                    },
                    token: generateToken(user._id)
                }
            });
        }
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (user && (await bcrypt.compare(password, user.password_hash))) {
            res.json({
                status: 'success',
                message: 'Login successful',
                data: {
                    user: {
                        _id: user._id,
                        username: user.username,
                        display_name: user.display_name,
                        selected_animal_id: user.selected_animal_id,
                        selected_avatar_url: user.selected_avatar_url,
                        territory_cell: user.territory_cell,
                        seeking_modes: user.seeking_modes,
                        last_login: new Date()
                    },
                    token: generateToken(user._id)
                }
            });
            user.last_login = new Date();
            await user.save();
        } else {
            res.status(401).json({ status: 'error', message: 'Invalid username or password' });
        }
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Forgot password (initiate)
// @route   POST /api/auth/forgot-password
export const forgotPassword = async (req, res) => {
    const { username } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }
        res.json({
            status: 'success',
            message: 'Secret animal verification required',
            data: { hint: 'Enter your secret animal to reset password' }
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Reset password (verify secret)
// @route   POST /api/auth/reset-password
export const resetPassword = async (req, res) => {
    const { username, secret_animal, new_password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ status: 'error', message: 'User not found' });
        }

        if (user.secret_animal.toLowerCase() !== secret_animal.toLowerCase()) {
            return res.status(401).json({ status: 'error', message: 'Secret animal does not match' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password_hash = await bcrypt.hash(new_password, salt);
        await user.save();

        res.json({ status: 'success', message: 'Password reset successful. You can now login with your new password.' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};

// @desc    Check if username exists
// @route   GET /api/auth/check-username
export const checkUsername = async (req, res) => {
    const { username } = req.query;

    try {
        if (!username) {
            return res.status(400).json({ status: 'error', message: 'Username is required' });
        }

        const user = await User.findOne({ username });
        if (user) {
            return res.json({ status: 'success', data: { exists: true, message: 'Username is already taken' } });
        } else {
            return res.json({ status: 'success', data: { exists: false, message: 'Username is available' } });
        }
    } catch (error) {
        res.status(500).json({ status: 'error', message: error.message });
    }
};
