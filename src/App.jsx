import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import About from './pages/About'
import Games from './pages/Games'
import Apollo11Game from './games/Apollo11'
import Apollo15Game from './games/Apollo15'
import ArtemisGame from './games/Artemis'
import MarsGame from './games/Mars'
import Stars from './components/Stars'
import AccessibilityWidget from './components/AccessibilityWidget'

export default function App() {
  return (
    <BrowserRouter>
      <Stars />
      <Navbar />
      <main>
        <Routes>
          <Route path="/"           element={<Home />} />
          <Route path="/about"      element={<About />} />
          <Route path="/games"      element={<Games />} />
          <Route path="/play/apollo11"  element={<Apollo11Game />} />
          <Route path="/play/apollo15"  element={<Apollo15Game />} />
          <Route path="/play/artemis"   element={<ArtemisGame />} />
          <Route path="/play/mars"      element={<MarsGame />} />
        </Routes>
      </main>
      <Footer />
      <AccessibilityWidget />
    </BrowserRouter>
  )
}
