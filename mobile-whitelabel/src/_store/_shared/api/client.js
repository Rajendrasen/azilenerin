import { AWSAppSyncClient } from 'aws-appsync';
import { Auth } from 'aws-amplify';
export const initClient = options => {
  const client = new AWSAppSyncClient({
    ...options,
    complexObjectCredentials: () => Auth.currentCredentials(),
  });
  return client;
};
