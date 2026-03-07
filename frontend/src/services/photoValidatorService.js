// src/services/photoValidatorService.js

import axios from 'axios';  // Import axios to make HTTP requests

const API_BASE_URL = 'http://localhost:8000/api/v1/photo';  // API base URL

const validatePhoto = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  try {
    // Send the POST request to the backend
    const response = await axios.post(`${API_BASE_URL}/validate`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',  // Proper header for file uploads
      },
    });

    return response.data;  // Return the validation result
  } catch (error) {
    console.error('Error uploading and validating photo:', error);
    throw new Error('Validation failed');
  }
};

export default {
  validatePhoto,
};