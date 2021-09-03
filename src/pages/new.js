import React, { useEffect } from 'react';
import { useMutation, gql } from '@apollo/client';
import NoteForm from '../components/NoteForm';
import { GET_NOTES, GET_MY_NOTES } from '../gql/query';
// Запрос new note
const NEW_NOTE = gql`
  mutation newNote($content: String!) {
    newNote(content: $content) {
      id
      content
      createdAt
      favoriteCount
      favoritedBy {
        id
        username
      }
      author {
        username
        id
      }
    }
  }
`;
const NewNote = props => {
  useEffect(() => {
    // Обновляем заголовок документа
    document.title = 'New Note';
  });
  const [data, { loading, error }] = useMutation(NEW_NOTE, {
    refetchQueries: [{ query: GET_MY_NOTES }, { query: GET_NOTES }],
    onCompleted: data => {
      // После завершения перенаправляем пользователя на страницу заметки
      props.history.push(`note/${data.newNote.id}`);
    }
  });
  return (
    <React.Fragment>
      {/* Во время загрузки мутации выдаем сообщение о загрузке */}
      {loading && <p>Loading...</p>}
      {/* В случае сбоя выдаем сообщение об ошибке*/}
      {error && <p>Error saving the note</p>}
      {/* Компонент формы, передающий мутацию данных в качестве prop */}
      <NoteForm action={data} />
    </React.Fragment>
  );
};
export default NewNote;
