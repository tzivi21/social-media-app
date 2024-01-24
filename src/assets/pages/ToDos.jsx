import React from 'react'
import { useState, useEffect } from 'react';
import styles from '../css/Todos.module.css'
import ToDo from '../components/ToDo';
function ToDos(props) {
  const [todos, setTodos] = useState({ allTodos: [], todosOnScreen: [] });
  const [add, setAdd] = useState(false);
  const [title, setTitle] = useState('');
  const [filterBy, setFilterBy] = useState('Sequential');
  const [searchInput, setSearchInput] = useState('');

  useEffect(() => {
    props.setInfo(false);
    fetch(`http://localhost:3000/users/${props.currentUser.id}/todos`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("failed to find todos");
        }
        return response.json();
      })
      .then((todos) => {
        setTodos({ allTodos: todos, todosOnScreen: todos });
      })
      .catch(error => {
        console.log(error);
      });
  }, []);
  useEffect(() => {
    filterTodos();
  }, [filterBy]);
  function filterTodos() {
    let filteredTodos = [...todos.todosOnScreen];

    switch (filterBy) {
      case 'Sequential':
        break;
      case 'Completed':
        // Sort by completion status
        filteredTodos = filteredTodos.sort((a, b) => (a.completed === b.completed ? 0 : !a.completed ? 1 : -1));
        break;
      case 'Alphabetical':
        // Sort alphabetically by title
        filteredTodos = filteredTodos.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'Random':
        // Shuffle the todos randomly
        for (let i = filteredTodos.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [filteredTodos[i], filteredTodos[j]] = [filteredTodos[j], filteredTodos[i]];
        }
        break;
      default:
        break;
    }
    setTodos((prev) => { return { allTodos: prev.allTodos, todosOnScreen: filteredTodos } });
  }
  function handleSearchInputChange(event) {
    setSearchInput(event.target.value);
  }

  function searchTodos() {
    if (searchInput.trim() === '') {
      // If search input is empty, reset posts to show all
      fetch(`http://localhost:3000/users/${props.currentUser.id}/todos`)
        .then((response) => response.json())
        .then((todos) => {
          setTodos({ allTodos: todos, todosOnScreen: todos });
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      // Search posts based on ID or title
      const searchTerm = searchInput.toLowerCase().trim();
      let status = null;
      if (searchInput == 'completed') {
        status = true;
      }
      if (searchInput == 'not completed') {
        status = false;
      }
      const filteredTodos = todos.allTodos.filter(
        (todo) =>
          todo.id.toString().includes(searchTerm) || todo.title.toLowerCase().includes(searchTerm) || todo.completed === status
      );
      setTodos({ allTodos: todos.allTodos, todosOnScreen: filteredTodos });
    }
  }

  function showAddTodo() {
    setAdd(true);
  }
  function handleAdd() {

    const newTodoData = {
      title: title,
      completed: false,
      userId: props.currentUser.id
    };
    fetch('http://localhost:3000/todos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTodoData),
    })
      .then((data) => {
        if (!data.ok) {
          throw new Error("Can't create the todo");
        }
        return data.json();
      })
      .then((response) => {
        let newArray = todos.allTodos;
        newArray.push(response);
        setTodos({
          allTodos: newArray,
          todosOnScreen: newArray,
        });
        setAdd(false);
        setTitle('');
      }).finally(() => {
        searchTodos();
        filterTodos();
      })
      .catch((error) => {
        console.error('Error creating todo:', error);
      });

  }


  return (
    <>
      <div >
        <div className={styles.actions}>
          <div className={styles.addActions}>
            <button className={styles.button} onClick={showAddTodo}>Add Todo</button>
            {add && <div className={styles.add}>
              <button className={styles.button} onClick={() => { setAdd(false); setTitle(''); }}>❌</button>
              <input
                type="text"
                value={title}
                placeholder='Title'
                onChange={(e) => setTitle(e.target.value)}
                className={styles.input}
              />

              <button className={styles.button} onClick={handleAdd}>Add</button>
            </div>}
            <div className={styles.filter}>
              <label htmlFor="filterSelect">Filter By:</label>
              <select id="filterSelect" value={filterBy} onChange={(e) => setFilterBy(e.target.value)}>
                <option value="Sequential">Sequential</option>
                <option value="Completed">Completed</option>
                <option value="Alphabetical">Alphabetical</option>
                <option value="Random">Random</option>
              </select>
            </div>
          </div>
          <div className={styles.search}>
            <input
              type="text"
              placeholder="Search by ID, Title or Status"
              value={searchInput}
              onChange={handleSearchInputChange}
              className={styles.input}
            />
            <button className={styles.button} onClick={searchTodos}>
              Search
            </button>
          </div>
        </div>
        <div className={styles.todosContainer}>
          {todos.allTodos.length === 0 && <p>You have no todos, feel free to create a new todo</p>}
          {todos.todosOnScreen.map((t, index) => {
            return <ToDo
            filterTodos={filterTodos}
              todos={todos}
              setTodos={setTodos}
              key={t.id}
              currentTodo={t}
              className={styles.todo}
              currentUser={props.currentUser}
              searchTodos={searchTodos} />;
          })}
        </div>
      </div>

    </>
  )
}

export default ToDos
