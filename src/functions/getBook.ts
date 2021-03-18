import { convertDynamoItemToBook } from "@libs/utils";
import { APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";
import * as AWS from "aws-sdk";

const dynamodb = new AWS.DynamoDB.DocumentClient();

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  const bookId = event.pathParameters.bookId;
  var params = {
    TableName: process.env.DYNAMO_TABLE_NAME,
    Key: {
      hash_key: bookId,
      range_key: "book",
    },
  };
  const dynamoResponse = await dynamodb.get(params).promise();
  const book = convertDynamoItemToBook(dynamoResponse.Item);

  return {
    statusCode: 200,
    body: JSON.stringify(book),
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
  };
};
