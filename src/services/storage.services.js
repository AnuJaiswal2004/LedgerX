// Install: npm install @imagekit/nodejs

import ImageKit from '@imagekit/nodejs';

const client = new ImageKit({
    privateKey: process.env.PRIVATE_KEY,
});

const uploadImage = async (file) => {
    try {
        const response = await client.upload({
            file: file.buffer,
            fileName: file.originalname,
        });
        return response;
    } catch (error) {
        console.error('Error uploading image:', error);
        throw error;
    }
};

module.exports = {
    uploadImage,
};