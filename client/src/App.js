import './App.css';
import PinPoint from './components/PinPoint';
import React from 'react';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
const PORT = process.env.PORT || 3001;
const httpLink = createHttpLink({
  uri: `http://localhost:${PORT}/graphql`,
  port: PORT
});

const authLink = setContext((_, { headers }) => {
  // get the authentication token from local storage if it exists
  const token = localStorage.getItem('id_token');
  // return the headers to the context so httpLink can read them
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <section>
          <PinPoint client={client}/>
        </section>
      </div>
    </ApolloProvider>
  );
}

export default App;