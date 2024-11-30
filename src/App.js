import 'bootstrap/dist/css/bootstrap.min.css';
import Homepage from './components/homepage/Homepage';
import Login from './components/login/login';
import { BrowserRouter, Routes, Route} from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
    
    <Routes>

    < Route path="/" element={<Homepage/>}/>
    <Route path='/login' element={<Login/>} />
    </Routes>
   
    </BrowserRouter>
  );
}

export default App;
