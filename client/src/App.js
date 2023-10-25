import {Routes, Route} from 'react-router-dom';
import './App.css';
import HomePage from './Pages/HomePage';
import AboutUs from './Pages/AboutUs';

function App() {
  return (
    <Routes>
      <Route path='/' element={<HomePage/>} />
      <Route path='/about' element={<AboutUs/>} />
    </Routes>

  );
}

export default App;
