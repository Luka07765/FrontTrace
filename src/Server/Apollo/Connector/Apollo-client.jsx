import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import axios from 'axios';

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

// Error handling link for refreshing tokens
const errorLink = onError(
  async ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      for (const err of graphQLErrors) {
        if (err.extensions.code === 'UNAUTHENTICATED') {
          try {
            // Attempt to refresh the token
            const refreshResponse = await axios.post(
              'http://localhost:5044/api/Auth/RefreshToken',
              { refreshToken: localStorage.getItem('refreshToken') }
            );

            const newToken = refreshResponse.data.accessToken;
            localStorage.setItem('accessToken', newToken); // Store refreshed token

            // Retry the failed request with the new token
            const oldHeaders = operation.getContext().headers;
            operation.setContext({
              headers: {
                ...oldHeaders,
                Authorization: `Bearer ${newToken}`,
              },
            });

            return forward(operation); // Retry the operation
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError);

            // Clear tokens and redirect to login
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/home/auth/login'; // Redirect to login page
          }
        }
      }
    }

    if (networkError) {
      console.error('Network error:', networkError);
    }
  }
);

// Combine links
const client = new ApolloClient({
  link: errorLink.concat(authLink).concat(httpLink), // Ensure correct order
  cache: new InMemoryCache(),
});

export default client;
