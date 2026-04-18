import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Registration />} />
      <Route path="/employment-request" element={<EmploymentRequest />} />
      <Route path="/news" element={<News />} />
      <Route path="/wellness" element={<Wellness />} />
      <Route path="/levels" element={<Levels />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
