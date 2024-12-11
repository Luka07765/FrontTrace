import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

const httpLink = createHttpLink({
  uri: 'http://localhost:5044/graphql', // Replace with your GraphQL endpoint
});

// Auth link to add Authorization header
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('accessToken'); // Use 'accessToken' consistently
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink), // No need for errorLink anymore
  cache: new InMemoryCache(),
});

export default client;
