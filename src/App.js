import 'bootstrap/dist/css/bootstrap.min.css';
import Homepage from './components/homepage/Homepage';
import Login from './components/login/login';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Register from './components/register/register';

function App() {
  return (
    <BrowserRouter>
    
    <Routes>

    < Route path="/" element={<Homepage/>}/>
    <Route path='/login' element={<Login/>} />
    <Route path='/register' element={<Register/>} />
    </Routes>
   
    </BrowserRouter>
  );
}

export default App;
