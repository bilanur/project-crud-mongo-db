// // const express = require('express');
// const expressLayouts = require('express-ejs-layouts');
// const { body, validationResult } = require('express-validator');
// const methodOverride = require('method-override');
// const session = require('express-session');
// const cookieParser = require('cookie-parser');
// const flash = require('connect-flash');
// require('./utils/db'); // Pastikan koneksi database telah diatur
// const Login = require('./model/data'); // Gunakan model Login

// const app = express();
// const port = 3000;

// // Setup Method Override
// app.use(methodOverride('_method'));

// // Setup EJS
// app.set('view engine', 'ejs');

// // Middleware
// app.use(express.static('public'));
// app.use(express.urlencoded({ extended: false }));

// // Konfigurasi Flash
// app.use(cookieParser('secret'));
// app.use(
//   session({
//     cookie: { maxAge: 6000 },
//     secret: 'secret',
//     resave: false,
//     saveUninitialized: true,
//   })
// );
// app.use(flash());

// // Rute Halaman Login
// app.get("/", (req, res) => {
//   res.render('login', {
//     layout: 'layout/main-layout',
//     title: 'Halaman Login',
//     msg: req.flash('msg'), // Flash message ditampilkan
//   });
// });

// // Proses Login
// app.post(
//   "/login",
//   [
//     body('username', 'Username tidak boleh kosong').notEmpty(),
//     body('password', 'Password tidak boleh kosong').notEmpty(),
//   ],
//   async (req, res) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       // Tampilkan error jika validasi gagal
//       return res.render('login', {
//         layout: 'layout/main-layout',
//         title: 'Halaman Login',
//         msg: errors.array().map(err => err.msg).join('<br>'),
//       });
//     }

//     try {
//       const { username, password } = req.body;
//       const user = await Login.findOne({ username });

//       // Cek apakah user ditemukan dan password cocok
//       if (user && user.password === password) {
//         req.flash('msg', 'Login berhasil!');
//         return res.redirect("/home"); // Redirect ke halaman home jika berhasil login
//       } else {
//         req.flash('msg', 'Username atau password salah!');
//         return res.redirect("/"); // Redirect ke halaman login jika login gagal
//       }
//     } catch (error) {
//       req.flash('msg', 'Terjadi kesalahan saat login!');
//       res.redirect("/"); // Redirect ke halaman login jika terjadi error
//     }
//   }
// );

// // Halaman Home (Contoh)
// app.get('/home', (req, res) => {
//   res.render('home', {
//     layout: 'layout/main-layout',
//     title: 'Halaman Home',
//   });
// });

// // Jalankan Server
// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });
