const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const prisma = require('../prismaClient');
const {
  isValidName,
  isValidAddress,
  isValidPassword,
  isValidEmail,
} = require('../utils/validators');


async function signup(req, res) {
  try {
    const { name, email, password, address } = req.body;

    
    if (!isValidName(name)) {
      return res.status(400).json({
        error: 'Name must be between 20 and 60 characters.',
      });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }
    if (!isValidAddress(address)) {
      return res.status(400).json({
        error: 'Address must be under 400 characters.',
      });
    }
    if (!isValidPassword(password)) {
      return res.status(400).json({
        error:
          'Password must be 8-16 characters, with at least one uppercase letter and one special character.',
      });
    }

  
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered.' });
    }

   
    const hashedPassword = await bcrypt.hash(password, 10);

   
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        address,
        password: hashedPassword,
        role: 'NORMAL',
      },
    });

    
    res.status(201).json({
      message: 'Signup successful',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong during signup.' });
  }
}


async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

   
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
     
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    
    const passwordMatches = await bcrypt.compare(password, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Something went wrong during login.' });
  }
}


async function updatePassword(req, res) {
  try {
    const userId = req.user.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        error: 'Both currentPassword and newPassword are required.',
      });
    }

    if (!isValidPassword(newPassword)) {
      return res.status(400).json({
        error: 'New password must be 8-16 characters, with 1 uppercase letter and 1 special character.',
      });
    }

    const user = await prisma.user.findUnique({ where: { id: userId } });

    
    const passwordMatches = await bcrypt.compare(currentPassword, user.password);
    if (!passwordMatches) {
      return res.status(401).json({ error: 'Current password is incorrect.' });
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to update password.' });
  }
}

module.exports = { signup, login, updatePassword };
