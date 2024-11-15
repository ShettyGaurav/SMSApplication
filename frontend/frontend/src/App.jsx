import { useState } from 'react'
import ClientList from './components/ClientLists.jsx'
import './App.css'
import Login from './components/Login.jsx'

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Manage login state

  // Callback function to handle successful login
  
  return (
    <>
     {isLoggedIn ? (
        <ClientList />
      ) : (
        <Login setIsLoggedIn={setIsLoggedIn} />
      )}
    </>
  )
}

export default App
