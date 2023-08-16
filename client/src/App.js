import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom';
import HomePage from 'scenes/homePage/HomePage';
import LoginPage from 'scenes/loginPage/LoginPage';
import ProfilePage from 'scenes/profilePage/ProfilePage';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { CssBaseline, ThemeProvider } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { themeSettings } from './theme.js';
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

function App() {
  const mode = useSelector(state => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode])
  const isAuth = Boolean(useSelector((state)=>state.token))

  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/home" element={isAuth?<HomePage />:<Navigate to="/"/>} />
            <Route path="/profile/:userId" element={isAuth?<ProfilePage />:<Navigate to="/"/>} />
          </Routes>
          <ToastContainer
            position="top-center"
            autoClose={2000}
            limit={2}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss={false}
            draggable
            pauseOnHover={false}
            theme="light"
          />
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
