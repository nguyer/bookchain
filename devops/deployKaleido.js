const fs = require("fs");
const kaleidoConfig = require("../kaleidoConfig.json");
const axios = require("axios");
const FormData = require("form-data");
const archiver = require("archiver");

if (!kaleidoConfig.restApiGateway) {
  console.error("ERROR: restApiGateway must be defined in kaleidoConfig.json");
  process.exit(1);
}

if (!kaleidoConfig.userId) {
  console.error("ERROR: userId must be defined in kaleidoConfig.json");
  process.exit(1);
}

if (!kaleidoConfig.password) {
  console.error("ERROR: password must be defined in kaleidoConfig.json");
  process.exit(1);
}

if (!kaleidoConfig.fromAddress) {
  console.error("ERROR: fromAddress must be defined in kaleidoConfig.json");
  process.exit(1);
}

const init = async () => {
  // Zip up the contract
  const archive = archiver("zip");
  const form = new FormData();
  archive.directory("contracts", "");
  await archive.finalize();
  form.append("file", archive, "smartcontract.zip");

  // Deploy to Kaleido API
  const res = await axios.post(
    new URL("/abis", kaleidoConfig.restApiGateway).href,
    form,
    {
      params: {
        compiler: "0.5",
        source: "Book.sol",
        contract: "Book.sol:Book",
      },
      headers: form.getHeaders(),
      auth: {
        username: kaleidoConfig.userId,
        password: kaleidoConfig.password,
      },
    }
  );

  const generatedApiUrl = new URL(res.data.path, kaleidoConfig.restApiGateway)
    .href;
  console.log(`\nYour Kaleido generated API path is:\n${generatedApiUrl}\n`);
  const constructorResponse = await callConstructor(generatedApiUrl);
  console.log(
    `Contract initialized at address: ${constructorResponse.data.contractAddress}`
  );
  const outputs = {
    generatedApiUrl: generatedApiUrl,
    contractAddress: constructorResponse.data.contractAddress,
  };
  fs.writeFileSync(
    "./devops/outputs/kaleidoOutputs.json",
    JSON.stringify(outputs, null, 2)
  );
};

const callConstructor = (url) => {
  console.log("Calling smart contract constructor...");
  return axios.post(
    url,
    {},
    {
      headers: {
        "x-kaleido-from": kaleidoConfig.fromAddress,
        "x-kaleido-sync": true,
      },
      auth: {
        username: kaleidoConfig.userId,
        password: kaleidoConfig.password,
      },
    }
  );
};

init().then(() => {
  console.log("Done deploying to Kaleido");
});
