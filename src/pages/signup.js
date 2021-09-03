import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { useApolloClient, useMutation, gql } from '@apollo/client';
import UserForm from '../components/UserForm';

const Wrapper = styled.div`
  border: 1px solid #f5f4f0;
  max-width: 500px;
  padding: 1em;
  margin: 0 auto;
`;
const Form = styled.form`
  label,
  input {
    display: block;
    line-height: 2em;
  }
  input {
    width: 100%;
    margin-bottom: 1em;
  }
`;
const SIGNUP_USER = gql`
  mutation signUp($email: String!, $username: String!, $password: String!) {
    signUp(email: $email, username: $username, password: $password)
  }
`;
export default function Signup(props) {
  const [values, setValues] = useState();
  useEffect(() => {
    document.title = 'Sign Up';
  }, []);

  // Apollo Client
  const client = useApolloClient();

  //Добавляем хук мутации
  const [signUp, { loading, error }] = useMutation(SIGNUP_USER, {
    onCompleted: data => {
      // Сохраняем JWT в localStorage
      localStorage.setItem('token', data.signUp);
      // Обновляем локальный кэш
      client.writeData({ data: { isLoggedIn: true } });
      props.history.push('/');
    }
  });

  const onChange = event => {
    setValues({
      ...values,
      [event.target.name]: event.target.value
    });
  };

  return (
    <React.Fragment>
      <UserForm action={signUp} formType="signup" />
      {/* Если данные загружаются, отображаем сообщение о загрузке */}
      {loading && <p>Loading...</p>}
      {/* Если при загрузке произошел сбой, отображаем сообщение об ошибке */}
      {error && <p>Error creating an account!</p>}
    </React.Fragment>
  );
}
