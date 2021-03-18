const axios = require("axios");
const books = require("./sampleBooks.json");
const kaleidoConfig = require("../kaleidoConfig.json");
const serverlessOutputs = require("./outputs/serverlessOutputs.json");

const addBookUrl = `${serverlessOutputs.HttpApiUrl}/books`;
const fromAddress = kaleidoConfig.fromAddress;

const promises = [];

const addBooks = async (books) => {
  for (let i = 0; i < books.length; i++) {
    books[i].fromAddress = fromAddress;
    await axios.put(`${addBookUrl}/${i}`, books[i]);
    console.log(`Added ${books[i].title}`);
  }
};

addBooks(books).then(() => {
  console.log("\nDone adding books!\n");
});
