import React from 'react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import UserData from '../components/userData';
import styles from '../css/SignUp.module.css'; // Import your CSS file

//import styles from './SignUp.module.css'
function SignUp(props) {
    const [password, setPassword] = useState('');
    const [verifyPassword, setVerifyPassword] = useState('');
    const [username, setUsername] = useState('');
    const [sign_up_error, setSign_up_error] = useState('');
    const [signedUp, setSignedUp] = useState(false);

    const navigate = useNavigate();
    const handleSignup = () => {
        if (password != verifyPassword) {
            setSign_up_error("invalid data");
            return;
        }
        fetch(`http://localhost:3000/users/?username=${username}`)
            .then((response) => {
                if (!response.ok) {
                    throw new Error("unable to do request");
                }

                return response.json();
            })
            .then((data) => {
                if (data.length == 0) {
                    setSignedUp(true);
                }
                else {
                    setSign_up_error("invalid input");
                    throw new Error("invalid input");
                }

            })
            .catch(error => {
                console.log(error);
            });

    };

    return (
        <>
            {!signedUp ? (
                <div className={styles.container}>
                    <h1>Sign Up</h1>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <input
                        type="password"
                        placeholder="verify password"
                        value={verifyPassword}
                        onChange={(e) => setVerifyPassword(e.target.value)}
                    />
                    <p className={styles.sign_up_error}>{sign_up_error}</p>
                    <button onClick={handleSignup}>Sign Up</button>
                    <Link to="/login" className={styles.link}>Log In</Link>

                </div>
            ) : (
                <UserData
                    setCurrentUser={props.setCurrentUser}
                    password={password}
                    username={username}
                    setSignedUp={setSignedUp}
                    setSign_up_error={setSign_up_error} />
            )

            }
        </>
    )

}

export default SignUp
