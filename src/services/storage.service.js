const ImageKit = require("imagekit");

const imageKitClient = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,   
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT 
});

async function uploadFile(file) {
  const result = await imageKitClient.upload({
    file: file,
    fileName: "music_" + Date.now(),
    folder: "spotify-backend",
  });

  return result;
}

module.exports = { uploadFile };