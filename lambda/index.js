const { SSMClient, GetParameterCommand } = require("@aws-sdk/client-ssm");
const ssm = new SSMClient();

exports.handler = async () => {
  const name = process.env.PARAM_NAME;
  const result = await ssm.send(new GetParameterCommand({ Name: name }));
  const greeting = result.Parameter.Value;
  console.log("Retrieved from SSM:", greeting);
  return { status: "Success", greeting };
};