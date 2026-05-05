// Popular destinations data (can be extended with a DB model)
const popularDestinations = [
  { id: 1, name: 'Goa', country: 'India', category: 'beach', rating: 4.7, image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800', description: 'Sun, sand, and Portuguese charm', bestTime: 'Nov-Mar', avgBudget: 15000, tags: ['beach', 'nightlife', 'relaxing'] },
  { id: 2, name: 'Manali', country: 'India', category: 'mountain', rating: 4.8, image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800', description: 'Snow-capped peaks and adventure trails', bestTime: 'May-Jun, Oct-Nov', avgBudget: 12000, tags: ['adventure', 'mountains', 'snow'] },
  { id: 3, name: 'Jaipur', country: 'India', category: 'heritage', rating: 4.6, image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?w=800', description: 'The Pink City of palaces and forts', bestTime: 'Oct-Mar', avgBudget: 10000, tags: ['heritage', 'culture', 'history'] },
  { id: 4, name: 'Kerala', country: 'India', category: 'nature', rating: 4.9, image: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?w=800', description: 'Gods Own Country - backwaters and spices', bestTime: 'Sep-Mar', avgBudget: 18000, tags: ['nature', 'backwaters', 'relaxing'] },
  { id: 5, name: 'Bali', country: 'Indonesia', category: 'beach', rating: 4.8, image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800', description: 'Tropical paradise with rich culture', bestTime: 'Apr-Oct', avgBudget: 45000, tags: ['beach', 'culture', 'adventure'] },
  { id: 6, name: 'Paris', country: 'France', category: 'city', rating: 4.7, image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800', description: 'The City of Love and art', bestTime: 'Apr-Jun, Sep-Nov', avgBudget: 150000, tags: ['romantic', 'culture', 'food'] },
  { id: 7, name: 'Tokyo', country: 'Japan', category: 'city', rating: 4.9, image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800', description: 'Ultra-modern meets ancient tradition', bestTime: 'Mar-May, Sep-Nov', avgBudget: 120000, tags: ['culture', 'food', 'technology'] },
  { id: 8, name: 'Rajasthan', country: 'India', category: 'heritage', rating: 4.7, image: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800', description: 'Desert kingdom of maharajas', bestTime: 'Oct-Mar', avgBudget: 15000, tags: ['heritage', 'desert', 'culture'] },
  { id: 9, name: 'Ladakh', country: 'India', category: 'mountain', rating: 4.9, image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800', description: 'Land of high passes and monasteries', bestTime: 'Jun-Sep', avgBudget: 25000, tags: ['adventure', 'mountains', 'solo'] },
  { id: 10, name: 'Maldives', country: 'Maldives', category: 'beach', rating: 4.9, image: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800', description: 'Crystal blue waters and overwater villas', bestTime: 'Nov-Apr', avgBudget: 200000, tags: ['luxury', 'beach', 'romantic'] },
  { id: 11, name: 'Rishikesh', country: 'India', category: 'adventure', rating: 4.7, image: 'https://images.unsplash.com/photo-1600298882559-12c8e18d2fcb?w=800', description: 'Yoga capital and rafting paradise', bestTime: 'Sep-Jun', avgBudget: 8000, tags: ['adventure', 'spiritual', 'solo'] },
  { id: 12, name: 'Singapore', country: 'Singapore', category: 'city', rating: 4.8, image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800', description: 'The lion city of food and skyscrapers', bestTime: 'Feb-Apr', avgBudget: 80000, tags: ['city', 'food', 'family'] }
];

// @desc    Get all destinations
// @route   GET /api/destinations
// @access  Public
export const getDestinations = async (req, res) => {
  try {
    const { category, search, limit = 12, page = 1, sortBy = 'rating' } = req.query;

    let filtered = [...popularDestinations];

    if (category) filtered = filtered.filter(d => d.category === category);
    if (search) {
      const q = search.toLowerCase();
      filtered = filtered.filter(d =>
        d.name.toLowerCase().includes(q) ||
        d.country.toLowerCase().includes(q) ||
        d.tags.some(t => t.includes(q))
      );
    }

    // Sort
    if (sortBy === 'rating') filtered.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'budget') filtered.sort((a, b) => a.avgBudget - b.avgBudget);
    else if (sortBy === 'name') filtered.sort((a, b) => a.name.localeCompare(b.name));

    const total = filtered.length;
    const start = (Number(page) - 1) * Number(limit);
    const paginated = filtered.slice(start, start + Number(limit));

    res.json({
      success: true,
      count: paginated.length,
      total,
      destinations: paginated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch destinations.' });
  }
};

// @desc    Get single destination
// @route   GET /api/destinations/:id
// @access  Public
export const getDestination = async (req, res) => {
  try {
    const destination = popularDestinations.find(d => d.id === Number(req.params.id));
    if (!destination) {
      return res.status(404).json({ success: false, message: 'Destination not found.' });
    }
    res.json({ success: true, destination });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch destination.' });
  }
};