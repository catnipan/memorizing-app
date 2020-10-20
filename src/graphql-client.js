import gql from 'graphql-tag';
import { ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";

const client = new ApolloClient({
  link: createHttpLink({
    uri: 'http://localhost:8080/graphql',
    credentials: 'include'
  }),
  cache: new InMemoryCache(),
});

export default client;