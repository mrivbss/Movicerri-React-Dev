import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { Toaster } from 'sonner';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';

import Home from './pages/Home';
import Session from './pages/Session';
import Support from './pages/Support';
import Login from './pages/Login';
import Admin from './pages/Admin';

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } }
};

const PageWrapper = ({ children }) => (
  <motion.div
    initial="initial"
    animate="animate"
    exit="exit"
    variants={pageVariants}
  >
    {children}
  </motion.div>
);

const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return null;
    if (!user) return <Navigate to="/login" replace />;
    return children;
};

function AppContent() {
  const location = useLocation();

  return (
    <>
      <Navbar />
      <main style={{ overflowX: 'hidden' }}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
            <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
            <Route path="/sesion" element={<ProtectedRoute><PageWrapper><Session /></PageWrapper></ProtectedRoute>} />
            <Route path="/admin" element={<PageWrapper><Admin /></PageWrapper>} />
            <Route path="/soporte" element={<PageWrapper><Support /></PageWrapper>} />
          </Routes>
        </AnimatePresence>
      </main>
      <Footer />
      <Chatbot />
      <Toaster theme="dark" position="bottom-right" richColors />
    </>
  );
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;