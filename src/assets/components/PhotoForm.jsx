import React, { useState } from 'react';
import styles from '../css/PhotoFom.module.css';

function PhotoForm({ onSubmit, setAdd }) {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    thumbnailUrl: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className={styles.form}>
      <button onClick={() => setAdd(false)}>✖️</button>
      <h2>Enter Photo Information</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Title:
          <input className={styles.input} type="text" name="title" value={formData.title} onChange={handleChange} required />
        </label>
        <br />
        <label>
          URL:
          <input className={styles.input} type="url" name="url" value={formData.url} onChange={handleChange} required />
        </label>
        <br />
        <label>
          Thumbnail URL:
          <input className={styles.input} type="url" name="thumbnailUrl" value={formData.thumbnailUrl} onChange={handleChange} required />
        </label>
        <br />
        <button type="submit">Add</button>
      </form>
    </div>
  );
}

export default PhotoForm;
