const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const { body, validationResult } = require('express-validator');
const methodOverride = require('method-override');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const flash = require('connect-flash');

require('./utils/db');
const Siswa = require('./model/siswa');
const User = require('./model/users');

const app = express();
const port = 3000;

// Setup Method Override
app.use(methodOverride('_method'));

// Setup EJS
app.set('view engine', 'ejs');

// Third-party Middleware
app.use(expressLayouts);

// Built-in Middleware
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// Konfigurasi flash
app.use(cookieParser('secret'));
app.use(session({
    secret: 'secret_key',  // Gantilah dengan kunci yang aman
    resave: false,
    saveUninitialized: true
}));

app.use(flash());

// Middleware untuk melindungi semua halaman setelah login
const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        return next(); // Jika sudah login, lanjutkan ke halaman berikutnya
    } else {
        req.flash('msg', 'Silakan login terlebih dahulu');
        res.redirect('/login'); // Jika belum login, arahkan ke halaman login
    }
};

// Halaman Login
app.get("/login", (req, res) => {
    res.render('login', {
        layout: 'layout/login-layout',
        title: 'Halaman Login',
    });
});

app.post("/login", async (req, res) => {
  try {
      const user = await User.findOne({ username: req.body.username });
      console.log("User  ditemukan:", user); // Log user yang ditemukan

      if (user && user.password === req.body.password) {
          console.log("Login berhasil:", user);
          req.session.user = user;
          req.flash('msg', 'Login berhasil');
          return res.redirect('/'); 
      } else {
          console.log("Username atau password salah");
          req.flash('msg', 'Username atau Password salah');
          return res.redirect('/login'); 
      }
  } catch (err) {
      console.error("Terjadi kesalahan:", err);
      req.flash('msg', 'Terjadi kesalahan, coba lagi');
      return res.redirect('/login');
  }
});

// Halaman Home
app.get('/', isAuthenticated, (req, res) => {
    res.render('home', {
        nama: req.session.user.username, 
        layout: 'layout/main-layout',
        title: 'Halaman Home',
        msg: req.flash('msg'),
    });
});

// Halaman About
app.get('/about', isAuthenticated, (req, res) => {
    res.render('about', {
        layout: 'layout/main-layout',
        title: 'Halaman About',
        msg: req.flash('msg'),
    });
});

// Halaman Siswa
app.get('/siswa', isAuthenticated, async (req, res) => {
    const siswas = await Siswa.find();

    res.render('siswa', {
        layout: 'layout/main-layout',
        title: 'Halaman Siswa Siswa',
        siswas,
        msg: req.flash('msg'),
    });
});

// Halaman Form Tambah Siswa
app.get('/siswa/add', isAuthenticated, (req, res) => {
    res.render('add-siswa', {
        title: 'Form Tambah Siswa',
        layout: 'layout/main-layout',
    });
});

// Proses Tambah Siswa
app.post('/siswa', isAuthenticated, [
    body('nisn').custom(async (value) => {
        const duplikat = await Siswa.findOne({ nisn: value });
        if (duplikat) {
            throw new Error('NISN tidak boleh sama!');
        }
        return true;
    }),
    body('nik').custom(async (value) => {
        const duplikat = await Siswa.findOne({ nik: value });
        if (duplikat) {
            throw new Error('NIK tidak boleh sama!');
        }
        return true;
    }),
    // Validasi Tanggal Masuk
    body('tanggalMasuk').custom((value) => {
        const tanggalMasuk = new Date(value);
        const tanggalBatas = new Date('2024-12-06');
        if (tanggalMasuk > tanggalBatas) {
            throw new Error('Tanggal masuk tidak boleh lebih dari 6 Desember 2024');
        }
        return true;
    }),
], (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        res.render('add-siswa', {
            title: 'Form Tambah Siswa Siswa',
            layout: 'layout/main-layout',
            errors: errors.array(),
        });
    } else {
        Siswa.insertMany(req.body, (error, result) => {
            req.flash('msg', 'Data siswa berhasil ditambahkan!');
            res.redirect('/siswa');
        });
    }
});

// Proses Delete Siswa berdasarkan NISN
app.delete('/siswa', (req, res) => {
    const { nisn } = req.body; // Ambil nisn dari form
    Siswa.deleteOne({ nisn: nisn }).then((result) => {
        req.flash('msg', 'Data siswa berhasil dihapus!');
        res.redirect('/siswa');
    }).catch(err => {
        req.flash('msg', 'Terjadi kesalahan saat menghapus data.');
        res.redirect('/siswa');
    });
});

// app.delete('/siswa', (req, res) => {
//     Siswa.deleteOne({ nama: req.body.nama }).then((result) => {
//       req.flash('msg', 'Data siswa berhasil dihapus!');
//       res.redirect('/siswa');
//     });
//   });

// Halaman form edit data siswa
app.get('/siswa/edit/:nama', async(req, res) => {
    const siswa = await Siswa.findOne({ nama: req.params.nama });
  
    res.render('edit-siswa', {
      title: 'Form Edit Data Siswa',
      layout: 'layout/main-layout',
      siswa,
    });
  });
  
  // proses ubah data
  app.put(
    '/siswa',
    [
      body('nisn').custom(async (value, { req }) => {
        const duplikat = await Siswa.findOne({ nisn: value });
        if (duplikat && duplikat._id.toString() !== req.body._id) {
          throw new Error('NISN siswa sudah digunakan!');
        }
        return true;
      }),
      body('nik').custom(async (value, { req }) => {
        const duplikat = await Siswa.findOne({ nik: value });
        if (duplikat && duplikat._id.toString() !== req.body._id) {
          throw new Error('NIK siswa sudah digunakan!');
        }
        return true;
      }),
    ],
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.render('edit-siswa', {
          title: 'Form Edit Data Siswa',
          layout: 'layout/main-layout',
          errors: errors.array(),
          siswa: req.body,
        });
      } else {
        Siswa.updateOne(
          { _id: req.body._id },
          {
            $set: {
              nama: req.body.nama,
              jk: req.body.jk,
              nisn: req.body.nisn,
              nik: req.body.nik,
              nokk: req.body.nokk,
              tingkat: req.body.tingkat,
              rombel: req.body.rombel,
              tanggalMasuk: req.body.tanggalMasuk,
              terdaftar: req.body.terdaftar,
              tempatLahir: req.body.tempatLahir,
            },
          }
        ).then(() => {
          req.flash('msg', 'Data siswa berhasil diedit!');
          res.redirect('/siswa');
        });
      }
    }
  );

// Route Logout
app.get('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.redirect('/');
        }
        res.redirect('/'); // Setelah logout, arahkan ke halaman login
    });
});

app.listen(port, () => {
    console.log(`Project CRUD NodeJS | Listening at http://localhost:${port}`);
});