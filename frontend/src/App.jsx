import { Routes, Route } from 'react-router'
import { Navbar } from './components/Navbar'
import { Hero } from './components/Hero'
import { About } from './components/About'
import { Services } from './components/Services'
import { Compliance } from './components/Compliance'
import { News } from './components/News'
import { Contact } from './components/Contact'
import { NewsPage } from './pages/NewsPage'
import { ArticlePage } from './pages/ArticlePage'

export default function App() {
  return (
    <>
    <Navbar />
    <Routes>
    <Route path="/" element={
      <>
      <Hero />
      <About />
      <Services />
      <Compliance />
      <News />
      <Contact />
      </>
    } />
    <Route path="/noticias"       element={<NewsPage />} />
    <Route path="/noticias/:slug" element={<ArticlePage />} />
    </Routes>
    </>
  )
}
