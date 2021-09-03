import React from 'react';
import styled from 'styled-components';
import { useQuery, gql } from '@apollo/client';
import { Link, withRouter } from 'react-router-dom';
import ButtonAsLink from './ButtonAsLink';
import logo from '../img/logo.svg';
const HeaderBar = styled.header`
  width: 100%;
  padding: 0.5em 1em;
  display: flex;
  height: 64px;
  position: fixed;
  align-items: center;
  background-color: #fff;
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.25);
  z-index: 1;
`;
const LogoText = styled.h1`
  margin: 0;
  padding: 0;
  display: inline;
`;
// Локальный запрос
const QUERY_IS_LOGGED_IN = gql`
  {
    isLoggedIn @client
  }
`;
const UserState = styled.div`
  margin-left: auto;
`;
const Header = props => {
  // Хук запроса для проверки состояния авторизации пользователя
  const { data, client } = useQuery(QUERY_IS_LOGGED_IN);
  return (
    <HeaderBar>
      <img src={logo} alt="Notedly Logo" height="40" />
      <LogoText>Notedly</LogoText>
      <UserState>
        {data.isLoggedIn ? (
          <ButtonAsLink
            onClick={() => {
              // Удаляем токен
              localStorage.removeItem('token');
              // Очищаем кэш приложения
              client.resetStore();
              // Обновляем локальное состояние
              client.writeData({
                data: { isLoggedIn: false }
              });
              // Перенаправляем пользователя на домашнюю страницу
              props.history.push('/');
            }}
          >
            Log Out
          </ButtonAsLink>
        ) : (
          <p>
            <Link to={'/signin'}>Sign In</Link> or{' '}
            <Link to={'/signup'}>Sign Up</Link>
          </p>
        )}
      </UserState>
    </HeaderBar>
  );
};
export default withRouter(Header);
