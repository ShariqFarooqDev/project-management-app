const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});

// Check if the model already exists before defining it.
// This prevents the OverwriteModelError.
module.exports = mongoose.models.User || mongoose.model('User', userSchema);
