import logo from './logo.svg';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import RegisterPage from './components/auth/RegisterPage';
import LoginPage from './components/auth/LoginPage';
import HomePage from './components/home_menu/HomePage';
import CategoriesPage from './components/home_menu/CategoriesPage';

function App() {
  return (
    <BrowserRouter>
      <Navbar/>
      <div className='content'>
    <Routes>
      {<Route path='/home' element={<HomePage/>}/>}
      {<Route path='/register' element={<RegisterPage/>}/>}
      {<Route path='/login' element={<LoginPage/>}/>}
      {<Route path='/categories' element={<CategoriesPage/>}/>}
    </Routes>
      </div>
      <Footer/>
    </BrowserRouter>
  );
}

export default App;
