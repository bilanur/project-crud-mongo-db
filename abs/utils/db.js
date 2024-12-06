const mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/dapodik', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
});


// const mongoose = require('mongoose')

// mongoose.connect('mongodb://127.0.0.1:27017/dapodik')
// .then(() => {
//     console.log("MongoDB is connected")
// })
// .catch(() => {
//     console.log("MongoDB failed to connect")
// })

// // Membuat Schema Login
// const Login = new mongoose.Schema({
//     username: {
//         type: String,
//         required: true,
//     },
//     password: {
//         type: String,
//         required: true,
//     },
// })


// // Menambah 1 data
// const siswa1 = new Siswa({
//     nama: 'Nisa',
//     jk: 'P',
//     nisn: '12329363',
//     nik: '3209334207070004',
//     nokk: '3209222502066331',
//     tingkat: 'X',
//     rombel: 'PPLG 1',
//     tanggalMasuk: new Date('2023-08-13'), // Format tanggal diperbaiki
//     terdaftar: 'Siswa Baru', // Nilai enum disesuaikan
//     tempatLahir: 'Bandung', // Properti sesuai schema
// });

// // Simpan ke collection
// siswa1.save().then((siswa) => console.log(siswa));
