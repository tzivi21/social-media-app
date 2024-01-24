import React, { useEffect } from 'react'
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../css/Login.module.css'; // Import your CSS file
//import styles from './LogIn.module.css';

function LogIn(props) {
    const [userName, setUserName] = useState('');
    const [password, setPassword] = useState('');
    const [log_in_error, setLog_in_error] = useState('');
    const navigate = useNavigate();

    const handleLogin = () => {
        fetch(`http://localhost:3000/users/?username=${userName}`)
            .then((response) => {
                if (!response.ok) {
                    setLog_in_error("invalid data!");
                    throw new Error("invalid data");
                }
                return response.json()
            })
            .then((user) => {
                if (user.length == 0) {
                    setLog_in_error("invalid data!");
                    throw new Error("invalid data");
                }
                if (user[0].website == password) {
                    console.log(user[0]);
                    localStorage.setItem('current_user', JSON.stringify(user[0]));
                    props.setCurrentUser(user[0]);
                    navigate('/home');
                }
                else {
                    setLog_in_error("invalid data!");
                }
            })
            .catch(error => {
                console.log(error);
            });
    };

    return (
        <div className={styles.container}>
            <h1>Login</h1>
            <input
                type="text"
                placeholder="UserName"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <p className={styles.log_in_error}>{log_in_error}</p>
            <button onClick={handleLogin}>Login</button>
            <Link to="/register" className={styles.link}>Sign Up</Link>
        </div>
    )
}

export default LogIn
