import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import RegisterPage from './components/auth/RegisterPage';
import LoginPage from './components/auth/LoginPage';

function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <div className='content'>
    <Routes>
      {/* <Route path='/home' element={<Home/>}/> */}
      {<Route path='/register' element={<RegisterPage/>}/>}
      {<Route path='/login' element={<LoginPage/>}/>}
    </Routes>
      </div>
      <Footer/>
    </BrowserRouter>
  );
}

export default App;
