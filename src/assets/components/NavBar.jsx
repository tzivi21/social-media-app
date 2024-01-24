import React, { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import styles from '../css/NavBar.module.css'; // Import your updated CSS module

function NavBar(props) {
  const location = useLocation();
  const navigate = useNavigate();

  function handleLogOut() {
    localStorage.clear();
    props.setCurrentUser(null);
    navigate('/login');

  }
  function handleInfo() {
    navigate('/home');
    props.setInfo((info) => !info);
  }
  return (
    <>
      <div className={styles.navbar}>
        <div className={styles['navbar-links']}>
          <Link to={`users/${props.currentUser.id}/posts`} className={location.pathname === `users/${props.currentUser.id}/posts` ? styles.active : ''}>
            Posts
          </Link>
          <Link to={`users/${props.currentUser.id}/albums`} className={location.pathname === `users/${props.currentUser.id}/albums` ? styles.active : ''}>
            Albums
          </Link>
          <Link to={`users/${props.currentUser.id}/todos`} className={location.pathname === `users/${props.currentUser.id}/todos` ? styles.active : ''}>
            ToDos
          </Link>
          <button onClick={handleInfo}>Info</button>
        </div>
        <div >Hello {props.currentUser.name}</div>
        <button className={styles['logout-btn']} onClick={handleLogOut}>
          Log Out
        </button>
      </div>
      <Outlet />
    </>
  );
}

export default NavBar;
