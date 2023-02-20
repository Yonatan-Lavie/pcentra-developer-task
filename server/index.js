// Import required modules
const express = require('express');
const path = require('path');
const axios = require('axios');

// Create Express app
const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname + '/build')));

// Define search API route
app.get('/api/search', async (req, res) => {
  const query = req.query; // Get search query from URL parameter
  // console.log(req.query);
  // TODO: Implement search logic here
  const response = await axios.get(
    `https://ravkavonline.co.il/api/pos/service-station/search/`,
    {
      params: query,
    }
  );
  // console.log(response.data.data.results);
  // Send search results as JSON response
  res.json({
    results: response.data.data.results,
  });
});

// Serve React app for any other routes
app.get('/', (req, res) => {
  res.sendFile(join(__dirname + '/client/build/index.html'));
});

// Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
