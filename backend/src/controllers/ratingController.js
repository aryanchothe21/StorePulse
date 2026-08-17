const prisma = require('../prismaClient');


async function submitRating(req, res) {
  try {
    const { storeId, value } = req.body;
    const userId = req.user.id;

   
    const numericValue = Number(value);
    if (!Number.isInteger(numericValue) || numericValue < 1 || numericValue > 5) {
      return res.status(400).json({ error: 'Rating value must be an integer from 1 to 5.' });
    }

    
    const store = await prisma.store.findUnique({ where: { id: Number(storeId) } });
    if (!store) {
      return res.status(404).json({ error: 'Store not found.' });
    }

   
    const rating = await prisma.rating.upsert({
      where: {
        userId_storeId: {
          userId,
          storeId: Number(storeId),
        },
      },
      update: {
        value: numericValue,
      },
      create: {
        userId,
        storeId: Number(storeId),
        value: numericValue,
      },
    });

    res.json({ message: 'Rating submitted successfully', rating });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to submit rating.' });
  }
}

module.exports = { submitRating };
