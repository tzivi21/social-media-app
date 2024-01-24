import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../css/UserData.module.css'

const UserData = (props) => {
  const navigate = useNavigate();
  const phoneRef = useRef();
  const emailRef = useRef();
  const NameRef = useRef();
  const streetRef = useRef();
  const cityRef = useRef();
  const zipCodeRef = useRef();

  function handleSubmit(e) {
    e.preventDefault();
    const userData = {
      name: NameRef.current.value,
      username: props.username,
      email: emailRef.current.value,
      address: {
        street: streetRef.current.value,
        city: cityRef.current.value,
        zipcode: zipCodeRef.current.value
      },
      phone: phoneRef.current.value,
      website: props.password
    };
    fetch('http://localhost:3000/users', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    })
      .then((data) => {
        if (!data.ok) {
          props.setSignedUp(false);
          props.setSign_up_error("can't create the user,try again");
          throw new Error("can't create the user");
        }
        return data.json();
      })
      .then((response) => {
        props.setCurrentUser(response);
        localStorage.setItem('current_user', JSON.stringify(response));
        navigate('/home');
      })
      .catch(error => {
        console.error('Error creating user:', error);
      });
  };

  return (
    <div className={styles.container}>
      <h2>User Information Form</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Email:
          <input type="text" ref={emailRef} />
        </label>
        <label>
          Name:
          <input type="text" ref={NameRef} />
        </label>
        <label>
          Street:
          <input type="text" ref={streetRef} />
        </label>
        <label>
          City:
          <input type="text" ref={cityRef} />
        </label>
        <label>
          ZipCode:
          <input type="text" ref={zipCodeRef} />
        </label>
        <label>
          Phone:
          <input type="tel" ref={phoneRef} />
        </label>
        <button type="submit">Sign Up</button>
      </form>
    </div>
  );
};

export default UserData;
