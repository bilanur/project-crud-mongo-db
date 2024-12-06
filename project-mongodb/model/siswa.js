const mongoose = require('mongoose');

const Siswa = mongoose.model('Siswa', {
    nama: {
        type: String,
        required: true,
    },
    jk: {
        type: String,
        required: true,
        enum: ['L', 'P'], 
    },
    nisn: {
        type: String,
        required: true,
    },
    nik: {
        type: String,
        required: true,
    },
    nokk: {
        type: String,
        required: true,
    },
    tingkat: {
        type: String,
        required: true,
        enum: ['X', 'XI', 'XII'], // Pilihan hanya kelas X, XI, atau XII
    },
    rombel: {
        type: String,
        required: true,
        enum: ['PPLG 1', 'PPLG 2', 'RPL 1', 'RPL 2'], // Pilihan rombel
    },
    tanggalMasuk: {
        type: String,
        required: true, 
    },
    terdaftar: {
        type: String,
        required: true,
        enum: ['Siswa Baru', 'Pindahan'], 
        default: 'Siswa Baru',
    },
    tempatLahir: {
        type: String,
        required: true, 
    },
});

module.exports = Siswa;