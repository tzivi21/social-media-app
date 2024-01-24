import React, { useState, useEffect, useContext } from 'react'
import Album from '../components/Album';
import styles from '../css/Albums.module.css'
import { Link } from 'react-router-dom';

function Albums(props) {
  const [albums, setAlbums] = useState({ allAlbums: [], albumsOnScreen: [] });
  const [searchInput, setSearchInput] = useState('');
  const [add, setAdd] = useState(false);
  const [title, setTitle] = useState('');
  useEffect(() => {
    props.setInfo(false);
    fetch(`http://localhost:3000/users/${props.currentUser.id}/albums`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("failed to find albums");
        }
        return response.json();
      })
      .then((albums) => {
        setAlbums({ allAlbums: albums, albumsOnScreen: albums });
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  function showAdd() {
    setAdd(true);
  }

  function handleSearchInputChange(event) {
    setSearchInput(event.target.value);
  }
  function searchAlbums() {
    if (searchInput.trim() === '') {
      // If search input is empty, reset posts to show all
      fetch(`http://localhost:3000/users/${props.currentUser.id}/albums`)
        .then((response) => response.json())
        .then((albums) => {
          setAlbums({ allAlbums: albums, albumsOnScreen: albums });
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      // Search posts based on ID or title
      const searchTerm = searchInput.toLowerCase().trim();
      const filteredAlbums = albums.allAlbums.filter(
        (album) =>
          album.id.toString().includes(searchTerm) || album.title.toLowerCase().includes(searchTerm)
      );
      setAlbums({ allAlbums: albums.allAlbums, albumsOnScreen: filteredAlbums });
    }
  }
  function handleAdd() {

    const newAlbumData = {
      title: title,
      userId: props.currentUser.id
    };
    fetch('http://localhost:3000/albums', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newAlbumData),
    })
      .then((data) => {
        if (!data.ok) {
          throw new Error("Can't create the todo");
        }
        return data.json();
      })
      .then((response) => {
        let newArray = albums.allAlbums;
        newArray.push(response);
        setAlbums({
          allAlbums: newArray,
          albumsOnScreen: newArray,
        });
        setAdd(false);
        setTitle('');

      }).finally(() => {
        searchAlbums();
      })
      .catch((error) => {
        console.error('Error creating todo:', error);
      });

  }

  return (
    <div>
      <div className={styles.albumsActions}>
        <button onClick={showAdd} className={styles.button}>Add Album</button>
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
        <div className={styles.search}>
        <input
          type="text"
          placeholder="Search by ID or Title"
          value={searchInput}
          onChange={handleSearchInputChange}
          className={styles.input}
        />
        <button className={styles.button} onClick={searchAlbums}>
          Search
        </button>
        </div>
      </div>
      <div className={styles.albumsContainer}>
        {albums.albumsOnScreen.map((a, index) => {
          return <Link className={styles.link} key={a.id} to={`/home/users/${props.currentUser.id}/albums/${a.id}/photos`}><Album currentAlbum={a} /></Link>;
        })}
      </div>
    </div>
  )
}

export default Albums
