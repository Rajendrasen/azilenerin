import React from 'react';
import AwsAppSyncClient from 'aws-appsync';
import { ApolloProvider } from 'react-apollo';
import { Rehydrated } from 'aws-appsync-react';
import awsMeta from './aws-exports';

const client = new AwsAppSyncClient(awsMeta);

export function WithApiProvider(Component) {
  return (
    <ApolloProvider client={client}>
      <Rehydrated>
        <Component />
      </Rehydrated>
    </ApolloProvider>
  );
}
