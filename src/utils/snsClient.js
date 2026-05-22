import { SNSClient } from "@aws-sdk/client-sns";

const snsClient = new SNSClient({
  region: "eu-north-1",
});

export default snsClient;