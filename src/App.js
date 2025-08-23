import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <div className='content'>
    <Routes>
      {/* <Route path='/home' element={<Home/>}/> */}
    </Routes>
      </div>
      <Footer/>
    </BrowserRouter>
  );
}

export default App;
