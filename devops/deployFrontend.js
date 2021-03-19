const { exec } = require("child_process");
const serverlessOutputs = require("./outputs/serverlessOutputs.json");

exec(
  `aws s3 sync frontend/build s3://${serverlessOutputs.BucketName}`,
  (error, stdout, stderr) => {
    if (error) {
      console.error(error);
      return;
    }
    if (stderr) {
      console.log(stderr);
      return;
    }
    console.log(stdout);

    console.log(
      `\nFrontend deployed and available at:\n\nhttps://${serverlessOutputs.Domain}\n`
    );
  }
);
