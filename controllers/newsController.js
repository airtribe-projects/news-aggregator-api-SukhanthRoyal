const axios = require('axios');
const Users = require('../models/usersModel');

const getNewsForUser = async (userId) => {
  const user = await Users.findById(userId);
  if (!user) throw new Error(`User with ${userId} not found`);

  const preferences = user.preferences;
  const query = preferences.join(" OR ");
  const apiKey = process.env.NEWS_API_KEY;

  const response = await axios.get('https://newsapi.org/v2/everything', {
    params: {
      q: query,
      language: 'en',
      sortBy: 'publishedAt',
      apiKey: apiKey,
    },
  });

  return response.data.articles;
};

module.exports = { getNewsForUser };