import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';

import Header from './components/experiencefragments/Header.jsx';
import Footer from './components/experiencefragments/Footer.jsx';

import Home from './pages/Home.jsx';
import Gallery from './pages/Gallery.jsx';
import Stories from './pages/Stories.jsx';
import StoryDetail from './pages/StoryDetail.jsx';
import Contact from './pages/Contact.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

/**
 * App = the site shell. Header/Footer (Experience Fragments) wrap the
 * pages outlet. In AEM, this is defined by the editable template + page policy.
 */
export default function App() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main id="main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/stories" element={<Stories />} />
          <Route path="/stories/:slug" element={<StoryDetail />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}
