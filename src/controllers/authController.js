const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { allowedCategories } = require('../constants'); // Import allowed categories
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { AppError, handleError } = require('../utils/errorHandler');
const { Ecode } = require('../models'); // Import the Ecode model
const { User } = require('../models'); // Import the User model
const { Op } = require('sequelize');
const path = require('path');


const generateUniqueId = async (name, dob, email) => {
    const baseId = `${name.substring(0, 3)}${dob.split(' ')[1]}${email.split('@')[0].substring(0, 3)}`;
    let uniqueId = baseId;
    let counter = 1;
  
    // Check for uniqueness
    while (await User.findOne({ where: { unique_id: uniqueId } })) {
      uniqueId = `${baseId}${counter}`;
      counter++;
    }
  
    return uniqueId;
};
  
const register = async (req, res) => {
    const { ecode, gender, category_subcategory, place, dob, name, jersey_no, email, password } = req.body;
  
    // Validation errors
    const errors = {};
  
    // Validate fields
    if (!ecode) errors.ecode = 'Ecode is required.';
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

        const ecodeEntry = await Ecode.findOne({ where: { ecode } });
        if (!ecodeEntry) {
            return res.status(400).json({ message: 'Invalid ecode.' });
        }

        if (ecodeEntry.is_used) {
            return res.status(400).json({ message: 'Ecode is already used.' });
        }
      // Check if email already exists
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use.' });
      }

       // Generate a unique ID
      const unique_id = await generateUniqueId(name, dob, email);
  
      // Hash the password
      const hashedPassword = await bcrypt.hash(password, 10);
  
      // Create a new user
      const user = await User.create({
        unique_id: unique_id,
        gender,
        category_subcategory: category_subcategory.join(', '), // Save as comma-separated string
        place,
        dob,
        name,
        jersey_no,
        email,
        password: hashedPassword,
      });

      const newUser = await User.findOne({ where: { email } }); // Find the user by email
      if (!newUser) {
          return res.status(500).json({ message: 'User registration failed. Could not retrieve user details.' });
      }

        // Mark the ecode as used
        ecodeEntry.is_used = true;
        ecodeEntry.used_datetime = new Date();
        ecodeEntry.user_id = newUser.id;
        await ecodeEntry.save();
  
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

        // Generate a password reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // Token valid for 15 minutes

        // Save the token and expiry to the user's record
        try {
            await user.update({ reset_token: resetToken, reset_token_expiry: resetTokenExpiry });
        } catch (error) {
            console.error('Error updating user token:', error);
            return res.status(500).json({ message: 'Unable to update reset token.' });
        }

        // Confirm database update
        const updatedUser = await User.findOne({ where: { email } });
        console.log('Updated User:', updatedUser);

        // Generate the reset link pointing to the backend
        const resetLink = `http://localhost:3100/api/auth/reset-password-form?token=${resetToken}`;

        // Send the reset link via email
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: { user: process.env.ADMIN_EMAIL_USER, pass: process.env.ADMIN_EMAIL_PASS },
        });

        await transporter.sendMail({
            from: process.env.ADMIN_EMAIL_USER,
            to: email,
            subject: 'Password Reset Request',
            text: `You requested a password reset. Click the link below to reset your password:\n\n${resetLink}\n\nIf you did not request this, please ignore this email.`,
        });

        res.status(200).json({ message: 'Password reset link sent to your email.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error.' });
    }
};

const resetPasswordForm = async (req, res) => {
    const { token } = req.query;
    console.log('token==> ', token);

    if (!token) {
        return res.status(400).send('Invalid or missing reset token.');
    }

    const htmlFilePath = path.join(__dirname, '../public/html/resetPassword.html');
    res.sendFile(htmlFilePath, (err) => {
        if (err) {
            console.error('Error serving the reset password form:', err);
            res.status(500).send('Error serving the reset password form.');
        }
    });
};

const resetPassword = async (req, res) => {
    const { token, newPassword, confirmPassword } = req.body;
    console.log("token, newPassword, confirmPassword==>>> ", token, newPassword, confirmPassword);

    if (!token || !newPassword || !confirmPassword) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    if (newPassword !== confirmPassword) {
        return res.status(400).json({ message: 'New password and confirm password do not match.' });
    }

    try {
        const user = await User.findOne({
            where: {
                reset_token: token,
                reset_token_expiry: { [Op.gt]: new Date() }, // Ensure token is valid
            },
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token.' });
        }

        // Check if the new password matches the old password
        const isNewPasswordSameAsOld = await bcrypt.compare(newPassword, user.password);
        if (isNewPasswordSameAsOld) {
            return res.status(400).json({ message: 'New password cannot be the same as the old password.' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password and clear the reset token
        await user.update({
            password: hashedPassword,
            reset_token: null,
            reset_token_expiry: null,
        });

        res.status(200).json({ message: 'Password updated successfully.' });
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
    const { email } = req.body; // Assume user sends their email and name

    if (!email) {
        return handleError(new AppError('email is required.', 400), res);
    }

    try {
        // Email the admin about the ecode request
        const transporter = nodemailer.createTransport({
            service: 'Gmail', // Use your email service provider
            auth: {
                user: process.env.ADMIN_EMAIL_USER, // Admin email credentials
                pass: process.env.ADMIN_EMAIL_PASS,
            },
        });

        const adminEmail = process.env.ADMIN_EMAIL; // Admin's email address

        const mailOptions = {
            from: process.env.ADMIN_EMAIL_USER,
            to: adminEmail,
            subject: 'Ecode Request',
            text: `User Requesting Ecode:\nEmail: ${email}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(200).json({ message: 'Your ecode request has been sent to the admin.' });
    } catch (error) {
        console.error('Error sending email to admin:', error);
        handleError(new AppError('Failed to send email to the admin.', 500), res);
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

    return res.status(200).json({ message: 'Ecode is valid.' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error.' });
  }
};



module.exports = { generateUniqueId, login, register, forgotPassword, resetPasswordForm, resetPassword, updatePassword, requestEcode, verifyEcode, addEcode };
