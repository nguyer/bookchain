import { APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";
import axios from "axios";

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
      available: fromAddress,
    },
    {
      headers: {
        "x-kaleido-from": requestBody.fromAddress,
        "x-kaleido-sync": true,
      },
      auth: {
        username: process.env.USER_ID,
        password: process.env.PASSWORD,
      },
    }
  );

  console.log(kaleidoResponse.data);

  return {
    statusCode: 200,
    body: JSON.stringify({
      available: requestBody.available,
    }),
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
  };
};
