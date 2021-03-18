import { APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";
import axios from "axios";
import * as AWS from "aws-sdk";
import { convertDynamoItemToBook } from "@libs/utils";

const dynamodb = new AWS.DynamoDB.DocumentClient();

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  const requestBody = JSON.parse(event.body);
  const bookId = event.pathParameters.bookId;
  const fromAddress = requestBody.fromAddress;

  const kaleidoResponse = await axios.post(
    `${process.env.KALEIDO_GENERATED_API}/${process.env.CONTRACT_ADDRESS}/setBookAvailable`,
    {
      bookId: bookId,
      available: true,
    },
    {
      headers: {
        "x-kaleido-from": fromAddress,
        "x-kaleido-sync": true,
      },
      auth: {
        username: process.env.USER_ID,
        password: process.env.PASSWORD,
      },
    }
  );

  console.log(kaleidoResponse.data);

  const params = {
    TableName: process.env.DYNAMO_TABLE_NAME,
    Item: {
      hash_key: bookId,
      range_key: "book",
      title: requestBody.title,
      author: requestBody.author,
      year: requestBody.year,
      isbn: requestBody.isbn,
      coverUrl: requestBody.coverUrl,
      gsi: "book",
      borrower: "",
    },
  };
  const dynamoResponse = await dynamodb.put(params).promise();
  console.log(dynamoResponse);

  const book = convertDynamoItemToBook(params.Item);

  return {
    statusCode: 200,
    body: JSON.stringify(book),
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
  };
};
