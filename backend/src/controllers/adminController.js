const bcrypt = require('bcrypt');
const prisma = require('../prismaClient');
const {
  isValidName,
  isValidAddress,
  isValidPassword,
  isValidEmail,
} = require('../utils/validators');


async function getDashboard(req, res) {
  try {

    const [totalUsers, totalStores, totalRatings] = await Promise.all([
      prisma.user.count(),
      prisma.store.count(),
      prisma.rating.count(),
    ]);

    res.json({ totalUsers, totalStores, totalRatings });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load dashboard stats.' });
  }
}


async function createUser(req, res) {
  try {
    const { name, email, password, address, role } = req.body;

    if (!isValidName(name)) {
      return res.status(400).json({ error: 'Name must be 20-60 characters.' });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'Invalid email format.' });
    }
    if (!isValidAddress(address)) {
      return res.status(400).json({ error: 'Address must be under 400 characters.' });
    }
    if (!isValidPassword(password)) {
      return res.status(400).json({
        error: 'Password must be 8-16 characters, 1 uppercase, 1 special character.',
      });
    }

    const allowedRoles = ['ADMIN', 'NORMAL', 'STORE_OWNER'];
    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        error: `Role must be one of: ${allowedRoles.join(', ')}.`,
      });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { name, email, address, password: hashedPassword, role },
    });

    res.status(201).json({
      message: 'User created successfully',
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create user.' });
  }
}


async function listUsers(req, res) {
  try {
    const { name, email, address, role, sortBy, order } = req.query;

   
    const where = {
      role: role ? role : { in: ['ADMIN', 'NORMAL'] },
      ...(name && { name: { contains: name } }),
      ...(email && { email: { contains: email } }),
      ...(address && { address: { contains: address } }),
    };

   
    const allowedSortFields = ['name', 'email', 'address', 'role', 'createdAt'];
    const orderBy = allowedSortFields.includes(sortBy)
      ? { [sortBy]: order === 'desc' ? 'desc' : 'asc' }
      : { createdAt: 'desc' };

    const users = await prisma.user.findMany({
      where,
      orderBy,
      select: {
        id: true,
        name: true,
        email: true,
        address: true,
        role: true,
       
      },
    });

    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch users.' });
  }
}


async function listStores(req, res) {
  try {
    const { name, email, address, sortBy, order } = req.query;

    const where = {
      ...(name && { name: { contains: name } }),
      ...(email && { email: { contains: email } }),
      ...(address && { address: { contains: address } }),
    };

    const allowedSortFields = ['name', 'email', 'address', 'createdAt'];
    const orderBy = allowedSortFields.includes(sortBy)
      ? { [sortBy]: order === 'desc' ? 'desc' : 'asc' }
      : { createdAt: 'desc' };

    const stores = await prisma.store.findMany({
      where,
      orderBy,
      include: {
        ratings: true, 
      },
    });

   
    const storesWithRating = stores.map((store) => {
      const avg =
        store.ratings.length > 0
          ? store.ratings.reduce((sum, r) => sum + r.value, 0) / store.ratings.length
          : 0;

      return {
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        rating: Number(avg.toFixed(1)),
      };
    });

    res.json(storesWithRating);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch stores.' });
  }
}


async function getUserDetail(req, res) {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: {
        store: {
          include: { ratings: true },
        },
      },
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const response = {
      id: user.id,
      name: user.name,
      email: user.email,
      address: user.address,
      role: user.role,
    };

   
    if (user.role === 'STORE_OWNER' && user.store) {
      const ratings = user.store.ratings;
      const avg =
        ratings.length > 0
          ? ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length
          : 0;
      response.rating = Number(avg.toFixed(1));
    }

    res.json(response);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch user detail.' });
  }
}

async function createStore(req, res) {
  try {
    const { name, email, address, ownerId } = req.body;

    if (!isValidName(name)) {
      return res.status(400).json({ error: 'Name must be 20-60 characters.' });
    }
    if (!isValidAddress(address)) {
      return res.status(400).json({ error: 'Address must be under 400 characters.' });
    }
    if (!ownerId) {
      return res.status(400).json({ error: 'ownerId is required.' });
    }

    
    const owner = await prisma.user.findUnique({ where: { id: Number(ownerId) } });
    if (!owner || owner.role !== 'STORE_OWNER') {
      return res.status(400).json({
        error: 'ownerId must belong to an existing user with role STORE_OWNER.',
      });
    }

    
    const existingStore = await prisma.store.findUnique({ where: { ownerId: Number(ownerId) } });
    if (existingStore) {
      return res.status(409).json({ error: 'This owner already has a store.' });
    }

    const newStore = await prisma.store.create({
      data: { name, email, address, ownerId: Number(ownerId) },
    });

    res.status(201).json({ message: 'Store created successfully', store: newStore });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create store.' });
  }
}

module.exports = {
  getDashboard,
  createUser,
  createStore,
  listUsers,
  listStores,
  getUserDetail,
};
