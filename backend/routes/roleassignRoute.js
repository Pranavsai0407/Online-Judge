const express = require('express');
const router = express.Router();

const User = require('../models/user');


router.put('/assign-role/:userId', async (req, res) => {
  const { role } = req.body; // Assuming { "role": "admin" } or { "role": "user" }
  if (!role) return res.status(400).json({ message: 'Role is required.' });

  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    // Update the admin field based on the role value
    user.admin = role === 'admin';

    // Save the updated user document
    await user.save();

    res.json({ message: `Admin role updated successfully for user ${user.username}.`, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
