// Импортируем мутацию
import { EDIT_NOTE } from '../gql/mutation';
import NoteForm from './NoteForm';

const EditNote = props => {
  // Сохраняем id, полученный из url, в виде переменной
  const id = props.match.params.id;
  // Определяем запрос заметки
  const { loading, error, data } = useQuery(GET_NOTE, { variables: { id } });
  // Получаем информацию о текущем пользователе
  const { data: userdata } = useQuery(GET_ME);
  // Определяем мутацию
  const [editNote] = useMutation(EDIT_NOTE, {
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
  if (error) return <p>Error!</p>;
  // Если текущий пользователь не соответствует автору заметки
  if (userdata.me.id !== data.note.author.id) {
    return <p>You do not have access to edit this note</p>;
  }
  // передаем данные и мутацию в компонент формы
  return <NoteForm content={data.note.content} action={editNote} />;
};
export default EditNote;
