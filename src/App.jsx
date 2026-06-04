import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Registration from './pages/Registration';
import EmploymentRequest from './pages/EmploymentRequest'
import News from './pages/News'
import Wellness from './pages/Wellness'
import Levels from './pages/Levels'
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Gallery from './pages/Gallery';
import AdminPanel from './pages/AdminPanel';
import Footer from './components/Footer';

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register" element={<Registration />} />
        <Route path="/employment-request" element={<EmploymentRequest />} />
        <Route path="/news" element={<News />} />
        <Route path="/wellness" element={<Wellness />} />
        <Route path="/levels" element={<Levels />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
