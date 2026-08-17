const prisma = require('../prismaClient');


async function browseStores(req, res) {
  try {
    const { search, sortBy, order } = req.query;
    const loggedInUserId = req.user.id; 

  
    const where = search
      ? {
          OR: [
            { name: { contains: search } },
            { address: { contains: search } },
          ],
        }
      : {};

    const allowedSortFields = ['name', 'address', 'createdAt'];
    const orderBy = allowedSortFields.includes(sortBy)
      ? { [sortBy]: order === 'desc' ? 'desc' : 'asc' }
      : { name: 'asc' };

    const stores = await prisma.store.findMany({
      where,
      include: {
        ratings: true, 
      },
      orderBy,
    });

   
    const result = stores.map((store) => {
      const overallAvg =
        store.ratings.length > 0
          ? store.ratings.reduce((sum, r) => sum + r.value, 0) / store.ratings.length
          : 0;

     
      const myRating = store.ratings.find((r) => r.userId === loggedInUserId);

      return {
        id: store.id,
        name: store.name,
        address: store.address,
        overallRating: Number(overallAvg.toFixed(1)),
        userRating: myRating ? myRating.value : null,
      };
    });

    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch stores.' });
  }
}

module.exports = { browseStores };
