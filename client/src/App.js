import './App.css';
import Home from './Components/Home';
import Navbar from './Components/Navbar';
import { BrowserRouter as Router, Switch, Route, Routes } from "react-router-dom";
import Cart from './Components/Cart';
import SignIn from './Components/SignInForm';
import Signup from './Components/SignUpForm';
import Orders from './Components/Orders';

function App() {
  return (
    <div className="App">
      <Router>
      <Navbar />
      <Routes>
        <Route exact path="/" element={<Home/>} />
        <Route exact path="/home" element={<Navbar/>} />
        <Route exact path="/cart" element={<Cart/>} />
        <Route exact path="/signin" element={<SignIn/>} />
        <Route exact path="/signup" element={<Signup/>} />
        <Route exact path='order' element={<Orders/>} />
      </Routes>
    </Router>
    </div>
  );
}

export default App;
