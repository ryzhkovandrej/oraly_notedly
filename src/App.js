import React from 'react';
import ReactDOM from 'react-dom';
import {
  ApolloClient,
  ApolloProvider,
  InMemoryCache,
  createHttpLink
} from '@apollo/client';
import { setContext } from 'apollo-link-context';
import GlobalStyle from './components/GlobalStyle.js';
import Pages from './pages/index.js';

const uri = process.env.API_URI;
const cache = new InMemoryCache();
const httpLink = createHttpLink({ uri });

// Проверяем наличие токена и возвращаем заголовки в контекст
const authLink = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      authorization: localStorage.getItem('token') || ''
    }
  };
});
// Проверяем наличие локального токена
const data = {
  isLoggedIn: !!localStorage.getItem('token')
};
// Записываем данные кэша при начальной загрузке
cache.writeData({ data });
// Создаем клиент Apollo
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache,
  resolvers: {},
  connectToDevTools: true
});

// Записываем данные кэша после его сброса
client.onResetStore(() => cache.writeData({ data }));
const App = () => {
  return (
    <ApolloProvider client={client}>
      <GlobalStyle />
      <Pages />
    </ApolloProvider>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));
