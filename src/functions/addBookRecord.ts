import { APIGatewayProxyResult, APIGatewayEvent } from "aws-lambda";
import axios from "axios";

export const handler = async (
  event: APIGatewayEvent
): Promise<APIGatewayProxyResult> => {
  const requestBody = JSON.parse(event.body);
  const bookId = event.pathParameters.bookId;
  const fromAddress = requestBody.fromAddress;
  const bookStatus = requestBody.status;

  let kaleidoMethod;
  if (bookStatus == "returned") {
    kaleidoMethod = "returnBook";
  } else if (bookStatus == "borrowed") {
    kaleidoMethod = "borrowBook";
  } else {
    throw new Error(
      `'${bookStatus}' is not a valid status. Valid options are 'borrowed' or 'returned'.`
    );
  }

  const kaleidoResponse = await axios.post(
    `${process.env.KALEIDO_GENERATED_API}/${process.env.CONTRACT_ADDRESS}/${kaleidoMethod}`,
    {
      bookId: bookId,
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

  return {
    statusCode: 200,
    body: JSON.stringify({
      status: bookStatus,
    }),
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
  };
};
