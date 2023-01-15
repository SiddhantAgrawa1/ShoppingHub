import './App.css';
import Home from './Components/Home';
import Navbar from './Components/Navbar';
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Cart from './Components/Cart';
import SignIn from './Components/SignInForm';
import Signup from './Components/SignUpForm';
import Orders from './Components/Orders';
import Address from './Components/Address'
import About from './Components/About';
import Contact from './Components/Contact';
import Profile from './Components/Profile';


function App() {
  return (
    <div className="App">
      {/* Managing the routes */}
      <Router>
        <Navbar />
        <Routes>
          <Route exact path="/" element={<Home/>} />
          <Route exact path="/home" element={<Navbar/>} />
          <Route exact path="/cart" element={<Cart/>} />
          <Route exact path="/signin" element={<SignIn/>} />
          <Route exact path="/signup" element={<Signup/>} />
          <Route exact path='order' element={<Orders/>} />
          <Route exact path='/address' element={<Address/>} />
          <Route exact path='/about' element={<About/>} />
          <Route exact path='/contact' element={<Contact/>} />
          <Route exact path='/profile' element={<Profile/>} />
          <Route exact path='/address' element={<Address/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
