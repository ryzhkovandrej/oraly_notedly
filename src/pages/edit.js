import React from 'react';
import { useQuery, useMutation, gql } from '@apollo/client';

import { GET_ME, GET_NOTE } from '../gql/query';
import { EDIT_NOTE } from '../gql/mutation';
import NoteForm from './../components/NoteForm';

const EditNote = props => {
  // Сохраняем id, полученный из url, в виде переменной
  const id = props.match.params.id;

  // Определяем запрос заметки
  const { loading, error, data } = useQuery(GET_NOTE, { variables: { id } });

  const { loading: loadingme, data: userdata } = useQuery(GET_ME, {});

  const [editNote1, { loading: doadingEdit }] = useMutation(EDIT_NOTE, {
    variables: {
      id
    },
    onCompleted: () => {
      props.history.push(`/note/${id}`);
    }
  });

  // Если данные загружаются, выдаем сообщение о загрузке
  if (loading) return 'Loading...';
  // Если при получении данных произошел сбой, выдаем сообщение об ошибке
  if (error) return <p>Error! Note not found</p>;

  if (loadingme) return 'Loading...';

  if (userdata.me.id !== data.note.author.id) {
    return <p>You do not have access to edit this note</p>;
  }
  // В случае успеха передаем данные в компонент note
  return <NoteForm note={data.note.content} action={editNote1} />;
};
export default EditNote;
