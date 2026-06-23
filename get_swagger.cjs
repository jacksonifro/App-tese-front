const axios = require('axios');

async function getModelInfo() {
  try {
    const response = await axios.get('http://localhost:8080/api/model');
    console.log(JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error("Error fetching model info:", error.message);
  }
}

getModelInfo();
