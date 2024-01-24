import React, { useEffect, useState } from 'react';
import styles from '../css/ToDo.module.css';
const ToDo = (props) => {
  const [isChecked, setChecked] = useState(props.currentTodo.completed);
  const [edit, setEdit] = useState(false);
  const [updatedTitle, setUpdatedTitle] = useState(props.currentTodo.title);
  const handleCheckboxChange = () => {

    const updatedTodo = {
      userId: props.currentUser.id,
      id: props.currentTodo.id,
      title: props.currentTodo.title,
      completed: !isChecked, 
    };

    fetch(`http://localhost:3000/todos/${props.currentTodo.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTodo),
    })
      .then(response => response.json())
      .then(updatedTodo => {
        console.log('Updated Todo:', updatedTodo);
        const newTodosOnScreenArray = props.todos.todosOnScreen.map(obj => {
          if (obj.id === props.currentTodo.id) {
            obj.completed = updatedTodo.completed;
          }
          return obj;
        });
        const newTodosArray = props.todos.allTodos.map(obj => {
          if (obj.id === props.currentTodo.id) {
            obj.completed = updatedTodo.completed;
          }
          return obj;
        });
        props.setTodos({ allTodos: newTodosArray, todosOnScreen: newTodosOnScreenArray });
        setChecked(!isChecked); // Update local state after successful API update

      })
      .finally(()=>{
        props.filterTodos();
        props.searchTodos();
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };

  function handleEdit() {
    const updatedTodo = {
      userId: props.currentUser.id,
      id: props.currentTodo.id,
      title: updatedTitle,
      completed: isChecked
    }
    fetch(`http://localhost:3000/todos/${props.currentTodo.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTodo),
    })
      .then(response => response.json())
      .then(updatedTodo => {
        const newTodosOnScreenArray = props.todos.todosOnScreen.map(obj => {
          if (obj.id === props.currentTodo.id) {
            obj.title = updatedTodo.title;
          }
          return obj;
        });
        const newTodosArray = props.todos.allTodos.map(obj => {
          if (obj.id === props.currentTodo.id) {
            obj.title = updatedTodo.title;
          }
          return obj;
        });
        props.setTodos({ allTodos: newTodosArray, todosOnScreen: newTodosOnScreenArray });
      }).finally(() => {
        props.searchTodos();
        props.filterTodos();
      })
      .catch(error => {
        console.error('Error:', error);
      });
    setEdit(false);
  }
  function handleEditForm() {
    setEdit(!edit);
  }
  function handleDelete() {
    const todoIdToDelete = props.currentTodo.id; // Replace 1 with the ID of the post you want to delete
    fetch(`http://localhost:3000/todos/${todoIdToDelete}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          const newTodosArray = props.todos.allTodos.filter(obj => obj.id != props.currentTodo.id);
          const newTodosOnScreenArray = props.todos.todosOnScreen.filter(obj => obj.id != props.currentTodo.id);
          props.setTodos({ allTodos: newTodosArray, todosOnScreen: newTodosOnScreenArray });
        } else {
          throw new Error('Failed to delete the post.');
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });

  }
  return (
    <>
      <div className={styles.toDosContainer}>
        <div className={styles.todoContent}>
          <p>ID: {props.currentTodo.id}</p>
          <h2>{props.currentTodo.title}</h2>
          <label>
            Completed:
            <input
              type="checkbox"
              checked={props.currentTodo.completed}
              onChange={handleCheckboxChange}
              className={styles.input}
            />
          </label>
          <div className={styles.todoActions}>
            <button onClick={handleDelete} className={styles.button}>🗑️</button>
            <button onClick={handleEditForm} className={styles.button}>{edit ? '❌' : '🖊️'}</button>
          </div>
          {edit && <div className={styles.editContainer}>

            <label>
              EditTitle:
              <input
                type="text"
                value={updatedTitle}
                onChange={(e) => setUpdatedTitle(e.target.value)}
                className={styles.input}
              />
            </label>
            <button onClick={handleEdit} className={styles.edit}>Edit</button>
          </div>}
        </div>
      </div>
    </>
  );
};

export default ToDo;
