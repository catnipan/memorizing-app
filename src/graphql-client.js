import gql from 'graphql-tag';
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

let uri;
if (process.env.NODE_ENV == 'development') {
  uri = 'http://localhost:8080/graphql';
} else {
  uri = `https://${location.host}/api/memorizing/graphql`;
}

const client = new ApolloClient({
  link: createHttpLink({
    uri,
    credentials: 'include'
  }),
  cache: new InMemoryCache(),
});

export default client;