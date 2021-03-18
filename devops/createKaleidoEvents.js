const fs = require("fs");
const axios = require("axios");
const kaleidoOutputs = require("./outputs/kaleidoOutputs.json");
const serverlessOutputs = require("./outputs/serverlessOutputs.json");
const kaleidoConfig = require("../kaleidoConfig.json");

const createEventStream = async () => {
  const borrowedWebhookEndpoint = new URL(
    "webhook/borrowed",
    serverlessOutputs.HttpApiUrl
  ).href;
  const returnedWebhookEndpoint = new URL(
    "webhook/returned",
    serverlessOutputs.HttpApiUrl
  ).href;
  const eventStreamsEndpoint = `${
    new URL(kaleidoOutputs.generatedApiUrl).origin
  }/eventstreams`;
  const borrowedEventStreamResponse = await axios.post(
    eventStreamsEndpoint,
    {
      type: "webhook",
      batchSize: 1,
      batchTimeoutMS: 5000,
      retryTimeoutSec: 0,
      errorHandling: "block",
      blockedReryDelaySec: 30,
      webhook: {
        url: borrowedWebhookEndpoint,
      },
    },
    {
      auth: {
        username: kaleidoConfig.userId,
        password: kaleidoConfig.password,
      },
    }
  );
  const returnedEventStreamResponse = await axios.post(
    eventStreamsEndpoint,
    {
      type: "webhook",
      batchSize: 1,
      batchTimeoutMS: 5000,
      retryTimeoutSec: 0,
      errorHandling: "block",
      blockedReryDelaySec: 30,
      webhook: {
        url: returnedWebhookEndpoint,
      },
    },
    {
      auth: {
        username: kaleidoConfig.userId,
        password: kaleidoConfig.password,
      },
    }
  );

  const borrowedEventStreamId = borrowedEventStreamResponse.data.id;
  const returnedEventStreamId = returnedEventStreamResponse.data.id;
  kaleidoOutputs.borrowedEventStreamId = borrowedEventStreamId;
  kaleidoOutputs.returnedEventStreamId = returnedEventStreamId;

  fs.writeFileSync(
    "./devops/outputs/kaleidoOutputs.json",
    JSON.stringify(kaleidoOutputs, null, 2)
  );
};

const subscribeToEvents = async () => {
  const borrowedEndpoint = `${kaleidoOutputs.generatedApiUrl}/Borrowed/subscribe`;
  const returnedEndpoint = `${kaleidoOutputs.generatedApiUrl}/Returned/subscribe`;

  let res = await axios.post(
    borrowedEndpoint,
    {
      stream: kaleidoOutputs.borrowedEventStreamId,
    },
    {
      auth: {
        username: kaleidoConfig.userId,
        password: kaleidoConfig.password,
      },
    }
  );
  console.log(res.data);

  res = await axios.post(
    returnedEndpoint,
    {
      stream: kaleidoOutputs.returnedEventStreamId,
    },
    {
      auth: {
        username: kaleidoConfig.userId,
        password: kaleidoConfig.password,
      },
    }
  );
  console.log(res.data);
};

createEventStream().then(async () => {
  console.log("Set up event stream");
  await subscribeToEvents();
  console.log("Subscribed to event streams");
});
