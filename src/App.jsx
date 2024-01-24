import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LogIn from './assets/pages/LogIn'
import SignUp from './assets/pages/SignUp'
import Home from './assets/pages/Home'
import ToDos from './assets/pages/ToDos'
import Albums from './assets/pages/Albums'
import Posts from './assets/pages/Posts'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import NavBar from './assets/components/NavBar'
import Photos from  './assets/pages/Photos'


function App() {
  const [currentUser,setCurrentUser]=useState(null);
  const [info, setInfo] = useState(false);

  return (
<Routes>
  <Route path="/" element={<Navigate to="/login" />} />
  <Route path="/login"  element={<LogIn setCurrentUser={setCurrentUser} />} />
  <Route path="/register" element={<SignUp setCurrentUser={setCurrentUser} />} />
  <Route
    path="/home"
    element={<NavBar info={info} setInfo={setInfo} currentUser={currentUser} setCurrentUser={setCurrentUser} />}
  >
    <Route index element={<Home setInfo={setInfo} currentUser={currentUser} info={info} />} />
    <Route path="users/:id/todos" element={<ToDos currentUser={currentUser} setCurrentUser={setCurrentUser} setInfo={setInfo}/>} />
    <Route path="users/:id/albums" element={<Albums currentUser={currentUser} setCurrentUser={setCurrentUser}setInfo={setInfo} />} />
      <Route path="users/:id/albums/:id/photos" element={<Photos currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
    
    <Route path="users/:id/posts" element={<Posts currentUser={currentUser} setCurrentUser={setCurrentUser} setInfo={setInfo} />} />
  </Route>
</Routes>



  )
}

export default App
