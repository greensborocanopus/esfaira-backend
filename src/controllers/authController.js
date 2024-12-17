const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { allowedCategories } = require('../models/constants');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { AppError, handleError } = require('../utils/errorHandler');

const register = async (req, res) => {
    const { ecode, gender, category_subcategory, place, dob, name, jersey_no, email, password } = req.body;

    const errors = {};

    // Validate ecode
    if (!ecode) {
        return handleError(new AppError('Ecode is required.', 400), res);
    }

    try {
        // Check if the ecode exists and is unused
        const [ecodeRows] = await db.query('SELECT * FROM ecode WHERE ecode = ?', [ecode]);
        if (ecodeRows.length === 0) {
            throw new AppError('Invalid ecode.', 400);
        }

        const ecodeEntry = ecodeRows[0];
        if (ecodeEntry.is_used === 1) {
            throw new AppError('Ecode is already used.', 400);
        }

        

        // Validate each field
        if (!gender) errors.gender = 'Gender is required.';
        if (!category_subcategory) {
            errors.category_subcategory = 'Category/subcategory is required.';
        } else {
            const selectedCategories = category_subcategory.split(',').map(c => c.trim());
            const invalidCategories = selectedCategories.filter(c => !allowedCategories.includes(c));
            if (invalidCategories.length > 0) {
                errors.category_subcategory = `Invalid categories: ${invalidCategories.join(', ')}. Allowed values are ${allowedCategories.join(', ')}.`;
            }
        }
        if (!place) errors.place = 'Place is required.';
        if (!dob) errors.dob = 'Date of birth is required.';
        if (!name) errors.name = 'Name is required.';
        if (!jersey_no) errors.jersey_no = 'Jersey number is required.';
        if (!email) errors.email = 'Email is required.';
        if (!password) errors.password = 'Password is required.';

        // If there are validation errors, return them
        if (Object.keys(errors).length > 0) {
            return handleError(new AppError('Validation errors', 400), res);
        }

        // Check if the email already exists
        const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser.length > 0) {
            throw new AppError('Email already in use.', 400);
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insert the new user into the database
        await db.query(`
            INSERT INTO users (gender, category_subcategory, place, dob, name, jersey_no, email, password)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [gender, category_subcategory, place, dob, name, jersey_no, email, hashedPassword]);

        // Mark the ecode as used
        await db.query('UPDATE ecode SET is_used = 1, used_datetime = NOW() WHERE ecode_id = ?', [ecodeEntry.ecode_id]);

        // Return a success response
        res.status(201).json({ message: 'User registered successfully.' });
    } catch (error) {
        handleError(error, res);
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return handleError(new AppError('Email and password are required.', 400), res);
    }

    try {
        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) {
            throw new AppError('User not found.', 404);
        }

        const user = users[0];
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new AppError('Invalid credentials.', 401);
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        handleError(error, res);
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return handleError(new AppError('Email is required.', 400), res);
    }

    try {
        const [user] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (user.length === 0) {
            throw new AppError('Email not found.', 404);
        }
        console.log('email: ', email);
        const temporaryPassword = crypto.randomBytes(8).toString('hex');
        const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

        await db.query('UPDATE users SET password = ? WHERE email = ?', [hashedPassword, email]);
        console.log('query ran');
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        });
        console.log('mail created');

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset',
            text: `Your new temporary password is: ${temporaryPassword}`,
        });
        console.log('mail sent');

        res.status(200).json({ message: 'Temporary password sent to your email.' });
    } catch (error) {
        handleError(error, res);
    }
};

const updatePassword = async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user.id; // Assuming user ID is available from authentication middleware

    if (!currentPassword || !newPassword || !confirmPassword) {
        return handleError(new AppError('All fields are required.', 400), res);
    }

    if (newPassword !== confirmPassword) {
        return handleError(new AppError('New password and confirm password do not match.', 400), res);
    }

    try {
        // Get the current user and password from the database
        const [user] = await db.query('SELECT * FROM users WHERE id = ?', [userId]);
        if (user.length === 0) {
            throw new AppError('User not found.', 404);
        }

        const userPassword = user[0].password;

        // Verify the current password
        const isPasswordValid = await bcrypt.compare(currentPassword, userPassword);
        if (!isPasswordValid) {
            throw new AppError('Current password is incorrect.', 401);
        }

        // Check if the new password is the same as the old password
        const isNewPasswordSameAsOld = await bcrypt.compare(newPassword, userPassword);
        if (isNewPasswordSameAsOld) {
            throw new AppError('New password cannot be the same as the old password.', 400);
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the password in the database
        await db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, userId]);

        res.status(200).json({ message: 'Password updated successfully.' });
    } catch (error) {
        handleError(error, res);
    }
};

const requestEcode = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
    }

    try {
        // Fetch an unused ecode
        const [unusedEcodes] = await db.query('SELECT * FROM ecode WHERE is_used = 0 LIMIT 1');
        if (unusedEcodes.length === 0) {
            return res.status(404).json({ message: 'No unused ecodes available.' });
        }

        const ecode = unusedEcodes[0];

        // Send the ecode via email
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Your Ecode',
            text: `Here is your ecode: ${ecode.ecode}`,
        });

        return res.status(200).json({ message: 'Ecode sent to your email.' });
    } catch (error) {
        return res.status(500).json({ message: 'Server error.', error });
    }
};



module.exports = { login, register, forgotPassword, updatePassword, requestEcode };
