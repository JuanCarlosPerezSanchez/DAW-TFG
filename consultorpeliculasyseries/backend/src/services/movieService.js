const axios = require('axios');

const getMovieDetails = async (movieId) => {
    const response = await axios.get(`https:// /${movieId}?api_key=!!apiKey!!`);
    return response.data;
};

module.exports = { getMovieDetails };