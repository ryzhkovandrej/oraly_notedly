import React, { useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import NoteFeed from '../components/NoteFeed';
import { GET_MY_FAVORITES } from '../gql/query';

export default function Favorites() {
  useEffect(() => {
    document.title = 'My favorites';
  }, []);

  const { loading, error, data } = useQuery(GET_MY_FAVORITES);

  if (loading) return 'Loading...';
  // Если при получении данных произошел сбой, выдаем сообщение об ошибке
  if (error) return `Error! ${error.message}`;
  // Если запрос выполнен успешно и содержит заметки, возвращаем их в ленту
  // Если же запрос выполнен успешно, но заметок не содержит,
  // выдаем сообщение "No favorites yet"
  if (data.me.favorites.length !== 0) {
    return <NoteFeed notes={data.me.favorites} />;
  } else {
    return <p>No favorites yet</p>;
  }
}
