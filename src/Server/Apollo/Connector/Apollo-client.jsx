import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import axios from 'axios';

const httpLink = createHttpLink({
  uri: 'http://localhost:5044/graphql',
});

// Auth link to add Authorization header
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
});

// Error handling link for refreshing tokens
const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      for (const err of graphQLErrors) {
        if (err.extensions.code === 'UNAUTHENTICATED') {
          // Attempt to refresh the token
          return axios
            .post('http://localhost:5044/api/Auth/RefreshToken', {
              refreshToken: localStorage.getItem('refreshToken'),
            })
            .then((response) => {
              const newToken = response.data.accessToken;
              localStorage.setItem('token', newToken);

              // Retry the failed request with the new token
              const oldHeaders = operation.getContext().headers;
              operation.setContext({
                headers: {
                  ...oldHeaders,
                  Authorization: `Bearer ${newToken}`,
                },
              });

              return forward(operation);
            })
            .catch((refreshError) => {
              console.error('Token refresh failed', refreshError);
              localStorage.removeItem('token');
              localStorage.removeItem('refreshToken');
              window.location.href = '/auth/login';
            });
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
  link: errorLink.concat(authLink).concat(httpLink),
  cache: new InMemoryCache(),
});

export default client;
