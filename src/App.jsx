import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import Home from './pages/Home'
import LayerPage from './pages/LayerPage'
import DesignProcess from './pages/DesignProcess'

export default function App() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/layer/:id" element={<LayerPage />} />
        <Route path="/design-process/:id" element={<DesignProcess />} />
      </Routes>
    </AnimatePresence>
  )
}
