const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: String,
    googleId: String,
    secret: String,
    fullName: String,
    profileImage: String,
    bio: String,
    trips: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Trip',
        },
    ],
});

userSchema.plugin(passportLocalMongoose, {
    usernameField: 'email' // Use 'email' as the unique identifier
});

const User = mongoose.model('User', userSchema);

module.exports = User;
