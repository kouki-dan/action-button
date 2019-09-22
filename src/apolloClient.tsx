import ApolloClient from 'apollo-boost';
import { getToken } from './auth';


export const client = new ApolloClient({
  uri: 'https://api.github.com/graphql',
  request: (operation) => {
    operation.setContext({
      headers: {
        Authorization: getToken()
      }
    })
  },
});
