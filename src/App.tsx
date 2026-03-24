import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import * as React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Studio from './pages/Studio';
import Gallery from './pages/Gallery';
import Print from './pages/Print';
import Decks from './pages/Decks';
import { motion, AnimatePresence } from 'motion/react';
import { AuthProvider } from './hooks/useAuth';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <main className="flex-1 max-w-screen-2xl mx-auto px-6 w-full">
            <AnimatePresence mode="wait">
              <Routes>
                <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
                <Route path="/studio" element={<PageWrapper><Studio /></PageWrapper>} />
                <Route path="/gallery" element={<PageWrapper><Gallery /></PageWrapper>} />
                <Route path="/print" element={<PageWrapper><Print /></PageWrapper>} />
                <Route path="/decks" element={<PageWrapper><Decks /></PageWrapper>} />
              </Routes>
            </AnimatePresence>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

