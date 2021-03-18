import { convertDynamoItemToBook } from "@libs/utils";
import { APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";
import * as AWS from "aws-sdk";

const dynamodb = new AWS.DynamoDB.DocumentClient();

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  const bookId = event.pathParameters.bookId;
  const params = {
    TableName: process.env.DYNAMO_TABLE_NAME,
    KeyConditionExpression:
      "hash_key = :hkey and begins_with(range_key, :rkey)",
    ExpressionAttributeValues: {
      ":hkey": bookId,
      ":rkey": "record",
    },
  };
  const dynamoResponse = await dynamodb.query(params).promise();

  // const books = [];

  // dynamoResponse.Items.forEach((item) => {
  //   console.log(item);
  //   books.push(convertDynamoItemToBook(item));
  // });

  return {
    statusCode: 200,
    body: JSON.stringify(dynamoResponse.Items),
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
  };
};
