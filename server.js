const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 3000;
const SECRET = 'rahasiaSuper123!';
const ALLOWED_SECRET_CODE = 'nvidia009';

app.use(cors());
app.use(bodyParser.json());

const users = {}; // Simulasi database sementara

// Register endpoint
app.post('/register', async (req, res) => {
  const { username, password, secret } = req.body;

  if (secret !== ALLOWED_SECRET_CODE) {
    return res.status(403).json({ message: 'Kode rahasia salah!' });
  }

  if (users[username]) {
    return res.status(400).json({ message: 'Username sudah terdaftar' });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  users[username] = { username, password: hashedPassword };
  res.json({ message: 'Registrasi berhasil' });
});

// Login endpoint
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users[username];

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ message: 'Username atau password salah' });
  }

  const token = jwt.sign({ username }, SECRET, { expiresIn: '1h' });
  res.json({ message: 'Login berhasil', token });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});