import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Shop from './pages/Shop';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Shop/>}></Route>
        <Route path='/cart' element={<Cart/>}></Route>
        <Route path='/checkout' element={<Checkout/>}></Route>
        <Route path="*" element={<h1>404 not found</h1>}></Route>
      </Routes>
    </Router>
  );
}

export default App;
