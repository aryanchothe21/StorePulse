const prisma = require('../prismaClient');


async function getStoreOwnerDashboard(req, res) {
  try {
    const ownerId = req.user.id;

    
    const store = await prisma.store.findUnique({
      where: { ownerId },
      include: {
        ratings: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
               
              },
            },
          },
        },
      },
    });

    if (!store) {
      return res.status(404).json({
        error: 'No store is associated with this account.',
      });
    }

    const avgRating =
      store.ratings.length > 0
        ? store.ratings.reduce((sum, r) => sum + r.value, 0) / store.ratings.length
        : 0;

   
    const raters = store.ratings.map((r) => ({
      userId: r.user.id,
      name: r.user.name,
      email: r.user.email,
      ratingGiven: r.value,
    }));

    res.json({
      storeName: store.name,
      averageRating: Number(avgRating.toFixed(1)),
      totalRatings: store.ratings.length,
      raters,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load store owner dashboard.' });
  }
}

module.exports = { getStoreOwnerDashboard };
