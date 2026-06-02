import { useState, useEffect } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
import './App.css'

import { Navbar } from './components/Navbar'; 
import { Hero } from './components/Hero';
import { About } from './components/About';
import { Services } from './components/Services';
import { Compliance } from './components/Compliance';
import { News } from './components/News';
import { Contact } from './components/Contact';

import api from './services/api'; // Import our Axios config

export function App() {
  // const [data, setData] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null); // 1. Add error state

  // useEffect(() => {
  //   api.get('hello/')
  //   .then(response => {
  //     setData(response.data);
  //     setLoading(false);
  //   })
  //   .catch(error => {
  //     console.error("Error fetching data from Django:", error);
  //     setError("Could not connect to the backend."); // 2. Catch the error
  //     setLoading(false);
  //   });
  // }, []);

  // if (loading) return <p>Loading data from backend...</p>;

  // // 3. Conditional rendering if Django is offline
  // if (error) {
  //   return (
  //     <div className="App error-state">
  //     <h1>Connection Failed</h1>
  //     <p>{error}</p>
  //     <p>Is your Django server running at http://127.0.0.1:8000?</p>
  //     </div>
  //   );
  // }

  return (
    <>
    <Navbar />
    <Hero />
    <About />
    <Services />
    <Compliance />
    <News />
    <Contact />
    </>
  );
  

}


export default App
