const mongoose = require('mongoose');

// Membuat Schema Login
const User = mongoose.model('User', {
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
})

module.exports = User;

// Menambah 1 data
// const admin = new User({
//     username: 'admin',
//     password: 'admin',
// });

// // Simpan ke collection
// admin.save().then((admin) => console.log(admin));