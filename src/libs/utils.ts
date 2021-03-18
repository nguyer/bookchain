export const convertDynamoItemToBook = (
  dynamoItem: AWS.DynamoDB.DocumentClient.AttributeMap
) => {
  let book = dynamoItem;
  book.bookId = book.hash_key;
  delete book.hash_key;
  delete book.range_key;
  delete book.gsi;
  return book;
};

// export const convertDynamoItemsToBook = (
//   dynamoItems: AWS.DynamoDB.DocumentClient.AttributeMap[]
// ) => {
//   let response = [];
//   dynamoItems.forEach((dynamoItem) => {
//     let book = dynamoItem.Item;
//     book.bookId = book.hash_key;
//     delete book.hash_key;
//     delete book.range_key;
//     delete book.gsi;
//     response.push(book);
//   });
//   return response;
// };
