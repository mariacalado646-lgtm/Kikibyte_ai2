import { useState, useEffect } from "react";
// import reactLogo from './assets/react.svg'
// import viteLogo from './assets/vite.svg'
// import heroImg from './assets/hero.png'
import "./App.css";

import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Services } from "./components/Services";
import { Compliance } from "./components/Compliance";
import { News } from "./components/News";
import { Contact } from "./components/Contact";

import api from "./services/api"; // Import our Axios config

export function App() {
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

export default App;
