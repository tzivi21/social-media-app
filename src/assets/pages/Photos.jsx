import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Photo from '../components/Photo';
import PhotoForm from '../components/PhotoForm';
import styles from '../css/Photos.module.css'


function Photos(props) {
  const { id } = useParams();
  const [photos, setPhotos] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [add, setAdd] = useState(false);
  const [loadMore, setLoadMore] = useState(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        setLoading(true);
        const response = await fetch(`http://localhost:3000/albums/${id}/photos?_page=${page}&_limit=10`);
        const data = await response.json();
        console.log(data);
        if (data.length == 0) {
          setLoadMore(false);
        }
        const newPhotosArray = photos.concat(data);
        setPhotos(newPhotosArray);
      } catch (error) {
        console.error('Error fetching photos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPhotos();
  }, [page]);

  const handleLoadPage = () => {
    setPage(prevPage => prevPage + 1);
  };
  function handleAdd(formData) {
    fetch('http://localhost:3000/photos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((data) => {
        if (!data.ok) {
          throw new Error("Can't create the todo");
        }
        return data.json();
      })
      .then((response) => {
        let newArray = photos;
        newArray.push(response);
        setPhotos(newArray);
        setAdd(false);
      })
      .catch((error) => {
        console.error('Error creating todo:', error);
      });
  }

  return (
    <div >
      <h2>Photos for Album {id}</h2>
      <button className={styles.button} onClick={() => setAdd(true)}>
        Add Photo
      </button>
      {add && (
        <div >
          <PhotoForm
            setAdd={setAdd}
            onSubmit={handleAdd} />
        </div>
      )}
      <div className={styles.photosContainer}>
        {photos.map((photo) => (
          <Photo
            key={photo.id}
            currentAlbum={id}
            currentPhoto={photo}
            setPhotos={setPhotos}
            photos={photos}
            currentUser={props.currentUser}
          />
        ))}
      </div>
      {loading && <p >Loading...</p>}
      {loadMore && <button className={styles.loadPhotoes} onClick={handleLoadPage}>Load More Photos</button>}
      {!loadMore && <p>no more photos</p>}
    </div>
  );
}

export default Photos;
