const { exec } = require("child_process");
const serverlessOutputs = require("./outputs/serverlessOutputs.json");

exec(
  `npm run build`,
  {
    cwd: "./frontend",
    env: {
      REACT_APP_BACKEND_URL: serverlessOutputs.HttpApiUrl,
      PATH: process.env.PATH,
    },
  },
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
  }
);
