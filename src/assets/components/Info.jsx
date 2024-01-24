import React from 'react';
import styles from '../css/Info.module.css'; // Import CSS module

function Info(props) {
  function handleCloseInfo() {
    props.setInfo(false);
  }
  return (
    <div className={styles.infoContainer}>
      <p className={styles.x} onClick={handleCloseInfo}>✖️</p>
      <h1>My Information</h1>
      <table className={styles.infoTable}>
        <tbody>
          <tr>
            <th>Field</th>
            <th>Value</th>
          </tr>
          <tr>
            <td>ID</td>
            <td>{props.currentUser.id}</td>
          </tr>
          <tr>
            <td>Name</td>
            <td>{props.currentUser.name}</td>
          </tr>
          <tr>
            <td>Username</td>
            <td>{props.currentUser.username}</td>
          </tr>
          <tr>
            <td>Email</td>
            <td>{props.currentUser.email}</td>
          </tr>
          <tr>
            <td>Address</td>
            <td>
              <ul>
                <li>{props.currentUser.address.street}</li>
                <li>{props.currentUser.address.city}</li>
                <li>{props.currentUser.address.zipcode}</li>
              </ul>
            </td>
          </tr>
          <tr>
            <td>Phone</td>
            <td>{props.currentUser.phone}</td>
          </tr>
          <tr>
            <td>Website</td>
            <td>{props.currentUser.website}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default Info;
