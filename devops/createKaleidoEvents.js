const fs = require("fs");
const axios = require("axios");
const kaleidoOutputs = require("./outputs/kaleidoOutputs.json");
const serverlessOutputs = require("./outputs/serverlessOutputs.json");
const kaleidoConfig = require("../kaleidoConfig.json");

const init = async () => {
  const borrowedWebhookEndpoint = new URL(
    "webhook/borrowed",
    serverlessOutputs.HttpApiUrl
  ).href;
  const returnedWebhookEndpoint = new URL(
    "webhook/returned",
    serverlessOutputs.HttpApiUrl
  ).href;
  const borrowedEventStreamResponse = await createEventStream(
    borrowedWebhookEndpoint
  );
  const returnedEventStreamResponse = await createEventStream(
    returnedWebhookEndpoint
  );

  console.log("Set up event streams");
  const borrowedEventStreamId = borrowedEventStreamResponse.data.id;
  const returnedEventStreamId = returnedEventStreamResponse.data.id;

  await subscribe(
    `${kaleidoOutputs.generatedApiUrl}/Borrowed/subscribe`,
    borrowedEventStreamId
  );
  await subscribe(
    `${kaleidoOutputs.generatedApiUrl}/Returned/subscribe`,
    returnedEventStreamId
  );

  kaleidoOutputs.borrowedEventStreamId = borrowedEventStreamId;
  kaleidoOutputs.returnedEventStreamId = returnedEventStreamId;

  fs.writeFileSync(
    "./devops/outputs/kaleidoOutputs.json",
    JSON.stringify(kaleidoOutputs, null, 2)
  );
};

const createEventStream = (webhookUrl) => {
  const eventStreamsEndpoint = `${
    new URL(kaleidoOutputs.generatedApiUrl).origin
  }/eventstreams`;
  return axios.post(
    eventStreamsEndpoint,
    {
      type: "webhook",
      batchSize: 1,
      batchTimeoutMS: 5000,
      retryTimeoutSec: 0,
      errorHandling: "block",
      blockedReryDelaySec: 30,
      webhook: {
        url: webhookUrl,
      },
    },
    {
      auth: {
        username: kaleidoConfig.userId,
        password: kaleidoConfig.password,
      },
    }
  );
};

const subscribe = async (eventEndpoint, streamId) => {
  const res = axios.post(
    eventEndpoint,
    {
      stream: streamId,
    },
    {
      auth: {
        username: kaleidoConfig.userId,
        password: kaleidoConfig.password,
      },
    }
  );
  return res.data;
};

init().then(async () => {
  console.log("Subscribed to event streams");
});
