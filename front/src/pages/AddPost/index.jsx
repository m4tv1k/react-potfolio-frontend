import React from 'react';
import TextField from '@mui/material/TextField';
import { useSelector } from 'react-redux';
import {useNavigate, Navigate, useParams } from "react-router-dom";
import axios from '../../axios';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import SimpleMDE from 'react-simplemde-editor';

import 'easymde/dist/easymde.min.css';
import { selectIsAuth } from "../../redux/slices/auth";

import styles from './AddPost.module.scss';

export const AddPost = () => {
  const {id} = useParams();
  const navigate = useNavigate();
  const isAuth = useSelector(selectIsAuth);
  const [isLoading, setLoading] = React.useState(false);
  const [text, setText] = React.useState('');
  const [title, setTitle] = React.useState('');
  const [tags, setTags] = React.useState('');
  const [imageUrl, setImageUrl] = React.useState('');
  const inputFileRef = React.useRef(null);

  const isEditing = Boolean(id);

  const handleChangeFile = async(event) => {
try {
  const formData = new FormData();
  const file = event.target.files[0];
  formData.append('image', file);
  const { data } = await axios.post('/upload', formData);
  setImageUrl(data.url);
} catch (err) {
  console.warm(err);
  alert('Ошибка при загрузке файла');
}
  };

  const onClickRemoveImage = () => {
    setImageUrl('');
  };

  const onChange = React.useCallback((value) => {
    setText(value);
  }, []);

  const onSubmit = async() => {
    try {
      setLoading(true);

      const fields = {
        title,
        imageUrl,
        tags,
        text
      };

      const {data} = isEditing
      ? await axios.patch(`/posts/${id}`, fields)
      : await axios.post(`/posts`, fields);

      const _id = isEditing ? id : data._id;

      navigate(`/posts/${_id}`);
    } catch (err) {
      console.warn(err);
      alert('Ошибка при создании');

    }
  };

  React.useEffect(() => {
    if (id) {
      axios.get(`/posts/${id}`)
      .then(({ data }) =>{
        setTitle(data.title);
        setText(data.text);
        setImageUrl(data.imageUrl);
        setTags(data.tags.join(','));
      })
      .catch(err =>{
        console.warn(err);
        alert('Ошибка при получении статьи');
      })
    }
  }, []);

  const options = React.useMemo(
    () => ({
      spellChecker: false,
      maxHeight: '400px',
      autofocus: true,
      placeholder: 'Введите описание проекта',
      status: false,
      autosave: {
        enabled: true,
        delay: 1000,
      },
    }),
    [],
  );

  if (!window.localStorage.getItem('token') && !isAuth) {
    return <Navigate to="/" />;
  }

  console.log({title, tags, text})

  return (
    <Paper style={{ padding: 30 }}>
      <Button onClick={() => inputFileRef.current.click()} variant="outlined" size="large">
        Загрузить превью
      </Button>
      <input ref={inputFileRef} type="file" onChange={handleChangeFile} hidden />
      {imageUrl && (
        <>
        <Button variant="contained" color="error" onClick={onClickRemoveImage}>
          Удалить
        </Button>
        <div className={styles.imageContainer}>
        <br></br>
        <div className={styles.divimage} style={{backgroundImage: `url(${`http://localhost:4444${imageUrl}`})`}} alt="Uploaded"></div>
        {/* <img className={styles.image}  src={`http://localhost:4444${imageUrl}`} alt="Uploaded" /> */}
        </div>
        </>
      )}
      
      <br />
      <br />
      <TextField
        classes={{ root: styles.title }}
        variant="standard"
        placeholder="Название проекта"
        value ={title}
        onChange={e => setTitle(e.target.value)}
        fullWidth
      />
      <TextField
      value ={tags}
      onChange={e => setTags(e.target.value)}
      classes={{ root: styles.tags }} variant="standard" placeholder="Тэги" fullWidth 
      />
      {/* <p className={styles.desc} >Добавьте описание для вашего проекта</p> */}
      <SimpleMDE className={styles.editor} value={text} onChange={onChange} options={options} />
      
      <div className={styles.buttons}>
        <Button onClick={onSubmit} size="large" variant="contained">
          {isEditing ? 'Сохранить' : 'Опубликовать'}
        </Button>
        <a href="/">
          <Button size="large">Отмена</Button>
        </a>
      </div>
    </Paper>
  );
};
