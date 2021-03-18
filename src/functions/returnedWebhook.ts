import { APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";
import * as AWS from "aws-sdk";

const dynamodb = new AWS.DynamoDB.DocumentClient();

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  const requestBody = JSON.parse(event.body);
  console.log(requestBody);
  const bookId = requestBody[0].data.bookId.toString();
  const returnedBy = requestBody[0].data.returnedBy;

  const updateParams = {
    TableName: process.env.DYNAMO_TABLE_NAME,
    Key: { hash_key: bookId, range_key: "book" },
    UpdateExpression: "set borrower = :x",
    ExpressionAttributeValues: {
      ":x": "",
    },
  };

  const updateResponse = await dynamodb.update(updateParams).promise();
  console.log(updateResponse);

  const putParams = {
    TableName: process.env.DYNAMO_TABLE_NAME,
    Item: {
      hash_key: bookId,
      range_key: `record${Date.now()}`,
      time: new Date().toISOString(),
      event: "returned",
      returnedBy: returnedBy,
    },
  };

  const dynamoResponse = await dynamodb.put(putParams).promise();
  console.log(dynamoResponse);

  return {
    statusCode: 200,
    body: "",
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
  };
};
