import React, { useContext } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './components/Header/Header.jsx';
import Footer from './components/Footer/Footer.jsx';
import AppRoutes from './router.jsx';
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import { ThemeContext } from './context/ThemeContext.jsx';


function App() {
  const location = useLocation();
  const { theme } = useContext(ThemeContext);

  // Agar path /admin se start hota hai toh header/footer hide
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className={`app-container ${theme}`}>
      {!isAdminPage && <Header />}
      <AppRoutes />
      {!isAdminPage && <Footer />}
    </div>
  );
}

export default App;
