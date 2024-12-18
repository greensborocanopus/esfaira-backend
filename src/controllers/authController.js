const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { allowedCategories } = require('../constants'); // Import allowed categories
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { AppError, handleError } = require('../utils/errorHandler');
const { Ecode } = require('../models'); // Import the Ecode model
const { User } = require('../models'); // Import the User model


const register = async (req, res) => {
    const { gender, category_subcategory, place, dob, name, jersey_no, email, password } = req.body;
  
    // Validation errors
    const errors = {};
  
    // Validate fields
    if (!gender) errors.gender = 'Gender is required.';
    if (!Array.isArray(category_subcategory) || category_subcategory.length === 0) {
      errors.category_subcategory = 'Category/subcategory is required and must be an array.';
    } else {
      const invalidCategories = category_subcategory.filter(c => !allowedCategories.includes(c));
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
  
    // Return validation errors if any
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: 'Validation errors', errors });
    }
  
    try {
      // Check if email already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use.' });
      }
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user
      const user = await User.create({
        gender,
        category_subcategory: category_subcategory.join(', '), // Save as comma-separated string
        place,
        dob,
        name,
        jersey_no,
        email,
        password: hashedPassword,
      });
  
      return res.status(201).json({ message: 'User registered successfully.', user });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error.' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required.' });
    }

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials.' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

const forgotPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
    }

    try {
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'Email not found.' });
        }

        const temporaryPassword = crypto.randomBytes(8).toString('hex');
        const hashedPassword = await bcrypt.hash(temporaryPassword, 10);

        await user.update({ password: hashedPassword });

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset',
            text: `Your new temporary password is: ${temporaryPassword}`,
        });

        res.status(200).json({ message: 'Temporary password sent to your email.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

const updatePassword = async (req, res) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!currentPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    try {
        // Find the user by ID
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // Check if the current password is correct
        const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Current password is incorrect.' });
        }

        // Check if the new password matches the old password
        const isNewPasswordSameAsOld = await bcrypt.compare(newPassword, user.password);
        if (isNewPasswordSameAsOld) {
            return res.status(400).json({ message: 'New password cannot be the same as the old password.' });
        }

        // Check if the new password and confirm password match
        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: 'New password and confirm password do not match.' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the password in the database
        await user.update({ password: hashedPassword });

        // Respond with success
        res.status(200).json({ message: 'Password updated successfully.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

const addEcode = async (req, res) => {
    const { ecode } = req.body;

    // Validate input
    if (!ecode) {
        return res.status(400).json({ message: 'Ecode is required.' });
    }

    try {
        // Check if the ecode already exists
        const existingEcode = await Ecode.findOne({ where: { ecode } });
        if (existingEcode) {
            return res.status(400).json({ message: 'Ecode already exists.' });
        }

        // Add the new ecode to the database
        const newEcode = await Ecode.create({
            ecode,           // Ecode value
            is_used: false,  // Default to not used
        });

        res.status(201).json({ message: 'Ecode added successfully.', ecode: newEcode });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.', error });
    }
};

const requestEcode = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required.' });
    }

    try {
        const ecode = await Ecode.findOne({ where: { is_used: false } });
        if (!ecode) {
            return res.status(404).json({ message: 'No unused ecodes available.' });
        }

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

        res.status(200).json({ message: 'Ecode sent to your email.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

const verifyEcode = async (req, res) => {
  const { ecode } = req.body;

  if (!ecode) {
    return res.status(400).json({ message: 'Ecode is required.' });
  }

  try {
    // Find the ecode
    const ecodeEntry = await Ecode.findOne({ where: { ecode } });
    if (!ecodeEntry) {
      return res.status(400).json({ message: 'Invalid ecode.' });
    }

    if (ecodeEntry.is_used) {
      return res.status(400).json({ message: 'Ecode is already used.' });
    }

    // Mark the ecode as used
    ecodeEntry.is_used = true;
    ecodeEntry.used_datetime = new Date();
    await ecodeEntry.save();

    return res.status(200).json({ message: 'Ecode is valid.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error.' });
  }
};



module.exports = { login, register, forgotPassword, updatePassword, requestEcode, verifyEcode, addEcode };
