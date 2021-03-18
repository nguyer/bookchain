import { convertDynamoItemToBook } from "@libs/utils";
import { APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";
import * as AWS from "aws-sdk";

const dynamodb = new AWS.DynamoDB.DocumentClient();

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  const params = {
    TableName: process.env.DYNAMO_TABLE_NAME,
    IndexName: "SecondaryIndex",
    KeyConditionExpression: "gsi = :hkey",
    ExpressionAttributeValues: {
      ":hkey": "book",
    },
  };
  const dynamoResponse = await dynamodb.query(params).promise();

  const books = [];

  dynamoResponse.Items.forEach((item) => {
    console.log(item);
    books.push(convertDynamoItemToBook(item));
  });

  return {
    statusCode: 200,
    body: JSON.stringify(books),
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
  };
};
