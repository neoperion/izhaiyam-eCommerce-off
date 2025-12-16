const axios = require('axios');

async function checkApi() {
  try {
    const response = await axios.get('http://localhost:5000/api/v1/products?featured=true&limit=4');
    console.log('Status:', response.status);
    console.log('Products:', response.data.products.length);
    console.log('First Product:', response.data.products[0]?.title);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

checkApi();
