import React from 'react'
import styles from '../css/Album.module.css'
function Album(props) {
  return (
    <div className={styles.albumContainer}>
      <h1>id:{props.currentAlbum.id}</h1>
      <p>title:{props.currentAlbum.title}</p>
    </div>
  )
}

export default Album
