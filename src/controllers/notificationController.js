const { Notification, User } = require('../models');
const { Op, where } = require('sequelize');

exports.getNotifications = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming the authenticated user's ID is available in req.user

        // Fetch notifications where the logged-in user is either the receiver or sender
        const notifications = await Notification.findAll({
            where: {
                [Op.or]: [
                    { reg_id: userId },         // User is the receiver
                    { sentby_reg_id: userId }  // User is the sender
                ]
            },
            order: [['datetime', 'DESC']]  // Optional: Sort notifications by the latest first
        });

        if (notifications.length === 0) {
            return res.status(404).json({ message: 'No notifications found for this user.' });
        }

        // Send the retrieved notifications
        res.status(200).json({ notifications });
    } catch (error) {
        console.error('Error fetching notifications:', error);
        res.status(500).json({ message: 'Server error occurred.' });
    }
};

exports.acceptOrRejectLeagueRequest = async (req, res) => {
    try {
        const { notificationId, action } = req.body; // action should be 'accept' or 'reject'
        const userId = req.user.id; // Assuming authenticated user info is available in req.user

        // Validate input
        if (!['accept', 'reject'].includes(action.toLowerCase())) {
            return res.status(400).json({ message: 'Invalid action. Use "accept" or "reject".' });
        }

        // Fetch the notification by ID and ensure the user has permission to modify it
        const notification = await Notification.findByPk(notificationId, {
            where: {
                notif_id: notificationId,
                reg_id: userId // Only the recipient (reg_id) can accept or reject the request
            }
        });

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found or unauthorized access.' });
        }

        // Update the notification status based on action
        const updatedNotifFlag = action.toLowerCase() === 'accept' ? 'Accepted' : 'Rejected';

        await notification.update({
            notif_flag: updatedNotifFlag,
            is_done: true, // Marking the request as completed
            is_seen: true  // Marking the request as seen since it has been acted upon
        });

        res.status(200).json({
            message: `Request has been successfully ${updatedNotifFlag.toLowerCase()}.`,
            notification
        });
    } catch (error) {
        console.error('Error processing league request:', error);
        res.status(500).json({ message: 'Server error occurred.' });
    }
};

exports.acceptOrRejectTeamRequest = async (req, res) => {
    try {
        const userId = req.user.id; // Assuming authenticated user info is available in req.user

        const { notification_id, action } = req.body;

        // Validate input
        if (!['accept', 'reject'].includes(action.toLowerCase())) {
            return res.status(400).json({ message: 'Invalid action. Use "accept" or "reject".' });
        }

        // Fetch the notification
        const notification = await Notification.findByPk(notification_id, {
            where: { reg_id: userId },
            include: [{ model: User, as: 'sender' }]
        });

        if (!notification) {
            return res.status(404).json({ message: 'Notification not found.' });
        }

        // Check if the request is already processed
        if (notification.notif_flag !== 'Pending') {
            return res.status(400).json({ message: 'This request has already been processed.' });
        }

        // // If action is accepted, add the player to the team
        // if (action === 'Accepted') {
        //     await TeamPlayer.create({
        //         team_id: notification.team_id,
        //         player_id: notification.sentby_reg_id, // The user who requested to join the team
        //         first_name: notification.sender.name, // Assuming the sender has a 'name' field
        //         last_name: '', // If needed, fetch this field separately
        //         dob: notification.sender.dob, // Assuming the sender has a 'dob' field
        //         jersey_no: 0 // You can adjust how jersey numbers are handled
        //     });
        // }

        const updatedNotifFlag = action.toLowerCase() === 'accept' ? 'Accepted' : 'Rejected';

        // Update the notification status
        await notification.update({
            notif_flag: updatedNotifFlag,
            is_done: true,
            is_seen: true
        });

        //res.status(200).json({ message: `Team join request has been ${action.toLowerCase()} successfully.` });
        res.status(200).json({
            message: `Request has been successfully ${updatedNotifFlag.toLowerCase()}.`,
            notification
        });
    } catch (error) {
        console.error('Error processing team join request:', error);
        res.status(500).json({ message: 'Server error', error });
    }
};
