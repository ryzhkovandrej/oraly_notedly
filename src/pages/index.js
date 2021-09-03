import React from 'react';
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';

import Home from './home';
import Mynotes from './mynotes';
import Favorites from './favorites';
import Layout from '../components/Layout';
import Signup from './signup';
import SignIn from './signin';
import NotePage from './note';
import NewNote from './new';

import { useQuery, gql } from '@apollo/client';
import EditNote from './edit';
const IS_LOGGED_IN = gql`
  {
    isLoggedIn @client
  }
`;
const Pages = () => {
  return (
    <Router>
      <Layout>
        <Route exact path="/" component={Home} />
        <Route exact path="/signup" component={Signup} />
        <Route path="/signin" component={SignIn} />
        <PrivateRoute path="/mynotes" component={Mynotes} />
        <PrivateRoute path="/favorites" component={Favorites} />
        <PrivateRoute path="/new" component={NewNote} />
        <Route path="/note/:id" component={NotePage} />
        <PrivateRoute path="/edit/:id" component={EditNote} />
      </Layout>
    </Router>
  );
};

const PrivateRoute = ({ component: Component, ...rest }) => {
  const { loading, error, data } = useQuery(IS_LOGGED_IN);
  // Если данные загружаются, выводим сообщение о загрузке
  if (loading) return <p>Loading...</p>;
  // Если при получении данных произошел сбой, выводим сообщение об ошибке
  if (error) return <p>Error!</p>;
  // Если пользователь авторизован, направляем его к запрашиваемому компоненту
  // В противном случае перенаправляем на страницу авторизации
  return (
    <Route
      {...rest}
      render={props =>
        data.isLoggedIn === true ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/signin',
              state: { from: props.location }
            }}
          />
        )
      }
    />
  );
};
export default Pages;
