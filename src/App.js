import 'bootstrap/dist/css/bootstrap.min.css';
import Homepage from './components/homepage/Homepage';
import Login from './components/login/login';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './firebase/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import Register from './components/register/register';
import MainPage from './components/mainPage/mainPage';
import ForgotPassword from './components/forgotPassword/ForgotPassword';

function App() {
  const [user] = useAuthState(auth);
  return (
    <BrowserRouter>

      <Routes>



        {/* Public Routes */}
        < Route path="/" element={!user ? <Homepage /> : <Navigate to="/main-page"/>} />
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/main-page" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/main-page" />} />
        <Route path="/forgot-password" element={!user ? <ForgotPassword /> : <Navigate to="/main-page" />} />

        {/* Private Routes */}
        <Route path="/main-page" element={<PrivateRoute user={user}><MainPage /></PrivateRoute>} />
        {/* <Route path="/view-docs" element={<PrivateRoute user={user}><ViewDocs /></PrivateRoute>} /> */}

        {/* Default Redirect */}
        <Route path="*" element={<Navigate to={user ? "/main-page" : "/"} />} />
      </Routes>

    </BrowserRouter>
  );
}

function PrivateRoute({ user, children }) {
  return user ? children : <Navigate to="/login" />;
}

export default App;
