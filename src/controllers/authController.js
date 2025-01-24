const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { allowedCategories } = require('../constants'); // Import allowed categories
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const { AppError, handleError } = require('../utils/errorHandler');
const { Ecode, User, Invitation } = require('../models'); // Import the Ecode model
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');


const generateUniqueId = async (name, dob) => {
  const baseId = `${name.substring(0, 3)}${dob.split(' ')[1]}`;
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
  const { ecode, gender, place, dob, name, jersey_no, email, password } = req.body;
  if (typeof req.body.category_subcategory === 'string') {
    req.body.category_subcategory = JSON.parse(req.body.category_subcategory);
  }
  const category_subcategory = req.body.category_subcategory;
  console.log('req.file: ', req.file);
  const photo = req.file; 
  // Validation errors
  const errors = {};

  // Validate fields
  if (!ecode) errors.ecode = 'Ecode is required.';
  if (!gender) errors.gender = 'Gender is required.';

  if (!Array.isArray(category_subcategory) || category_subcategory.length === 0) {
    errors.category_subcategory = 'Category/subcategory is required and must be an array.';
  } else {
    const invalidCategories = category_subcategory.filter((c) => !allowedCategories.includes(c));
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
    const unique_id = await generateUniqueId(name, dob);

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

     // File upload handling
     let photoPath = null; // Default to null if no photo uploaded
     if (req.file) {
       const uploadDir = path.join(__dirname, '../../uploads/Profile');
       if (!fs.existsSync(uploadDir)) {
         fs.mkdirSync(uploadDir, { recursive: true });
       }
 
       const newFileName = `${Date.now()}-${req.file.originalname}`;
       photoPath = path.join(uploadDir, newFileName);
 
       // Move the file from temp to the final upload directory
       fs.renameSync(req.file.path, photoPath);
     }

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
      photo: photoPath,
    });

    const newUser = await User.findOne({ where: { email } }); // Find the user by email
    if (!newUser) {
      return res.status(500).json({
        message: 'User registration failed. Could not retrieve user details.',
      });
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

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
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
      await user.update({
        reset_token: resetToken,
        reset_token_expiry: resetTokenExpiry,
      });
    } catch (error) {
      console.error('Error updating user token:', error);
      return res.status(500).json({ message: 'Unable to update reset token.' });
    }

    // Confirm database update
    const updatedUser = await User.findOne({ where: { email } });
    console.log('Updated User:', updatedUser);

    // Generate the reset link pointing to the backend
    const resetLink = `http://35.89.29.41:3000/api/auth/reset-password-form?token=${resetToken}`;

    const emailHTML = `
        <div style="width: 700px; margin: 0 auto;">
            <div style="background: #2f353a; padding: 15px 10px; text-align: left;">
                <a href="http://localhost:3100/register">
                    <img src="http://localhost:3100/assets/register/image/form-logo.png" alt="Esfaira" style="height:30px;">
                </a>
            </div>
            <div style="padding: 15px; border: #CCC 1px solid; border-top: none; border-bottom: none; text-align: center;">
                <div>
                    <strong style="font-size: 18px;">Dear: ${user.name}</strong>
                </div>
                <div style="padding-top:5px; font-size: 16px;">
                    Please click the below button to reset your account password.
                </div>
                <div style="padding-top:20px;">
                    <a href="${resetLink}" 
                       style="background: #2f353a; color: #FFF; font-weight: 700; padding: 10px 15px; 
                              display: inline-block; border-radius: 5px; text-decoration: none; font-size: 15px;">
                        Click Here to Reset Password
                    </a>
                </div>
            </div>
            <div style="background: #F4F4F4; padding: 15px; text-align: center; border: #CCC 1px solid; border-top: none;">
                Powered by
                <a href="http://localhost:3100" style="color:#ffae00;">ESFAIRA</a>
            </div>
        </div>`;
    // Send the reset link via email
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.ADMIN_EMAIL_USER,
        pass: process.env.ADMIN_EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: process.env.ADMIN_EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: emailHTML, // ✅ Sending the HTML content here
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

  const htmlFilePath = path.join(__dirname, '../public/html/resetScreen.html');
  res.sendFile(htmlFilePath, (err) => {
    if (err) {
      console.error('Error serving the reset password form:', err);
      res.status(500).send('Error serving the reset password form.');
    }
  });
};

const resetPassword = async (req, res) => {
  const { token, password, cpassword } = req.body;
  console.log('req.body==>>>', req.body);
  console.log('token, newPassword, confirmPassword==>>> ', token, password, cpassword);

  if (!token || !password || !cpassword) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  if (password !== cpassword) {
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
      return res.redirect('http://localhost:3100/api/auth/invalid-token');
    }

    // Check if the new password matches the old password
    const isNewPasswordSameAsOld = await bcrypt.compare(password, user.password);
    if (isNewPasswordSameAsOld) {
      return res.status(400).json({
        message: 'New password cannot be the same as the old password.',
      });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Update the user's password and clear the reset token
    await user.update({
      password: hashedPassword,
      reset_token: null,
      reset_token_expiry: null,
    });

    res.redirect('http://localhost:3100/api/auth/reset-password-success');
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

const resetPasswordSuccess = (req, res) => {
  const htmlFilePath = path.join(__dirname, '../public/html/passwordResetSuccess.html');
  res.sendFile(htmlFilePath, (err) => {
    if (err) {
      console.error('Error serving the success page:', err);
      res.status(500).send('Error serving the success page.');
    }
  });
};

const invalidToken = (req, res) => {
  const htmlFilePath = path.join(__dirname, '../public/html/invalidToken.html');
  res.sendFile(htmlFilePath, (err) => {
    if (err) {
      console.error('Error serving the invalid token page:', err);
      res.status(500).send('Error serving the invalid token page.');
    }
  });
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
      return res.status(400).json({
        message: 'New password cannot be the same as the old password.',
      });
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
      ecode, // Ecode value
      is_used: false, // Default to not used
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
    const existingUsedInvitation = await Ecode.findOne({ where: { email, is_used: true } });
    if (existingUsedInvitation) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    let unusedEcode = await Ecode.findOne({ where: { email, is_used: false } });
    if (!unusedEcode) {
        unusedEcode = await Ecode.findOne({
        where: { is_used: false },
      });
      if (!unusedEcode) {
        return handleError(new AppError('No unused e-codes are available.', 404), res);
      }    
    }


    // Email the admin about the ecode request
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // Use your email service provider
      auth: {
        user: process.env.ADMIN_EMAIL_USER, // Admin email credentials
        pass: process.env.ADMIN_EMAIL_PASS,
      },
    });

    const emailHTML = `<html>
      <body>
      <div style='width: 700px; margin: 0 auto;'>
      <div style='background: #2f353a; padding: 15px 10px; text-align: left;'>
        <a><img src='/assets/register/image/form-logo.png' alt='Esfaira' style='height:30px;'></a>	
      </div>
      <div style='padding: 15px; border: #CCC 1px solid; border-top: none; border-bottom: none;'>
      <div>
      <strong style='font-size: 18px;'>Your E-code is: <span style='text-transform: capitalize;'>${unusedEcode.ecode}</span></strong>
      </div></br></br>
      </div>
      <div style='background: #F4F4F4; padding: 15px; text-align: center; border: #CCC 1px solid; border-top: none;'>Powered by 
      <a style='color:#ffae00;'>ESFAIRA</a>
      </div>
      </div>
      </body>
      </html>`

    //const adminEmail = process.env.ADMIN_EMAIL; // Admin's email address

    const mailOptions = {
      from: process.env.ADMIN_EMAIL_USER,
      to: email,
      subject: 'Ecode Request',
      html: emailHTML,
    };

    await transporter.sendMail(mailOptions);

    unusedEcode.is_send = true;
    console.log(email);
    unusedEcode.email = email;

    await unusedEcode.save();

    res.status(200).json({
      message: 'E-code sent successfully to the user.',
      ecode: unusedEcode.ecode,
    });  
  } catch (error) {
    console.error('Error sending email to admin:', error);
    handleError(new AppError('Failed to send email to the admin.', 500), res);
  }
};

const sendInvitation = async (req, res) => {
  const userId = req.user.id;
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  if (!userId) {
    return res.status(400).json({ message: 'User ID is required' });
  }

  try {
    const existingUsedInvitation = await Ecode.findOne({ where: { email, is_used: true } });
    if (existingUsedInvitation) {
      return res.status(400).json({ message: 'User already exists.' });
    }

    let unusedEcode = await Ecode.findOne({ where: { email, is_used: false } });
    if (!unusedEcode) {
        unusedEcode = await Ecode.findOne({
        where: { is_used: false },
      });
      if (!unusedEcode) {
        return handleError(new AppError('No unused e-codes are available.', 404), res);
      }    
    }

    if (!unusedEcode) {
      return handleError(new AppError('No unused e-codes are available.', 404), res);
    }

    // Check if the email is already invited
    const existingInvitation = await Invitation.findOne({ where: { email } });
    if (existingInvitation) {
      return res.status(409).json({ message: 'Invitation already sent to this email.' });
      // // Save the invitation in the database
      // const newInvitation = await Invitation.create({ email });
    }

    const emailHTML = `<html>
    <body>
    <div style='width: 700px; margin: 0 auto;'>
    <div style='background: #2f353a; padding: 15px 10px; text-align: left;'>
      <a><img src='/assets/register/image/form-logo.png' alt='Esfaira' style='height:30px;'></a>	
    </div>
    <div style='padding: 15px; border: #CCC 1px solid; border-top: none; border-bottom: none;'>
    <div>
    <strong style='font-size: 18px;'>Your E-code is: <span style='text-transform: capitalize;'>${unusedEcode.ecode}</span></strong>
    </div></br></br>
    </div>
    <div style='background: #F4F4F4; padding: 15px; text-align: center; border: #CCC 1px solid; border-top: none;'>Powered by 
    <a style='color:#ffae00;'>ESFAIRA</a>
    </div>
    </div>
    </body>
    </html>`

    // Nodemailer configuration
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.ADMIN_EMAIL_USER,
        pass: process.env.ADMIN_EMAIL_PASS,
      },
    });

    //const invitationLink = `https://huarisnaque.com/esfaira/index.php/register`;
    const mailOptions = {
      from: process.env.ADMIN_EMAIL_USER,
      to: email,
      subject: 'Invitation to Join Esfaira',
      html: emailHTML,
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    // Save the invitation in the database
    const newInvitation = await Invitation.create({
      reg_id: userId,
      email,
    });

    const EcodeId = unusedEcode.id;
    await Ecode.update({ is_send: true, email: email }, { where: { id: EcodeId } });

    res.status(200).json({
      message: 'Invitation sent successfully',
      invitation: newInvitation,
    });
  } catch (error) {
    console.error('Error sending invitation:', error);
    res.status(500).json({ message: 'Failed to send invitation', error: error.message });
  }
};

const verifyEcode = async (req, res) => {
  const { ecode } = req.body;

  if (!ecode) {
    return res.status(400).json({ message: 'Ecode is required.' });
  }

  try {
    // Find the ecode in the database
    const ecodeEntry = await Ecode.findOne({ where: { ecode } });

    if (!ecodeEntry) {
      return res.status(400).json({ message: 'Invalid ecode.' });
    }

    if (!ecodeEntry.email) {
      return res.status(400).json({ message: 'No email associated with this ecode.' });
    }

    if (ecodeEntry.is_used) {
      return res.status(400).json({ message: 'Ecode is already used.' });
    }

    // Send an email to the user confirming the ecode verification
    const transporter = nodemailer.createTransport({
      service: 'Gmail', // Use your email service provider
      auth: {
        user: process.env.ADMIN_EMAIL_USER, // Admin email credentials
        pass: process.env.ADMIN_EMAIL_PASS,
      },
    });

    const emailHTML = `<html>
      <body>
      <div style='width: 700px; margin: 0 auto;'>
      <div style='background: #2f353a; padding: 15px 10px; text-align: left;'>
        <a><img src='/assets/register/image/form-logo.png' alt='Esfaira' style='height:30px;'></a>	
      </div>
      <div style='padding: 15px; border: #CCC 1px solid; border-top: none; border-bottom: none;'>
      <div>
      <strong style='font-size: 18px;'>Congratulations! Your E-code <span style='text-transform: capitalize;'>${ecodeEntry.ecode}</span> has been successfully verified.</strong>
      </div></br></br>
      </div>
      <div style='background: #F4F4F4; padding: 15px; text-align: center; border: #CCC 1px solid; border-top: none;'>Powered by 
      <a style='color:#ffae00;'>ESFAIRA</a>
      </div>
      </div>
      </body>
      </html>`;

    const mailOptions = {
      from: process.env.ADMIN_EMAIL_USER,
      to: ecodeEntry.email, // Use the email associated with the ecode
      subject: 'Ecode Verified Successfully',
      html: emailHTML,
    };

    await transporter.sendMail(mailOptions);

    // Mark ecode as used
    ecodeEntry.is_used = true;
    ecodeEntry.used_datetime = new Date(); // Save the timestamp
    await ecodeEntry.save();

    return res.status(200).json({ message: 'Ecode is valid and email sent successfully.' });
  } catch (error) {
    console.error('Error verifying ecode:', error);
    return res.status(500).json({ message: 'Server error.' });
  }
};

const getEcode = async (req, res) => {
  try {
    const ecode = await Ecode.findAll();
    res.status(200).json({ ecode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

const getUnusedEcode = async (req, res) => {
  try {
    const ecode = await Ecode.findAll();
    const unusedEcode = ecode.filter((ecode) => !ecode.is_used);
    res.status(200).json({ unusedEcode });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = {
  generateUniqueId,
  login,
  register,
  forgotPassword,
  resetPasswordForm,
  resetPassword,
  resetPasswordSuccess,
  invalidToken,
  updatePassword,
  requestEcode,
  sendInvitation,
  verifyEcode,
  addEcode,
  getEcode,
  getUnusedEcode,
};
