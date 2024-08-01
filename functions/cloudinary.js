const cloudinary = require('cloudinary').v2;

// Return "https" URLs by setting secure: true
cloudinary.config({
    cloud_name: 'dcv5xyrzn',
    api_key: '641241913635678',
    api_secret: 'eXp8CDnGm3ol9dGNIHjmLeR3i3o',
    secure: true,
});

module.exports = cloudinary;