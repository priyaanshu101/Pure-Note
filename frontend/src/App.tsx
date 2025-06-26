
import Home from './routes/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Contact from "./routes/Contact";
import Login from "./routes/Login";
import SignUp from './routes/SignUp';
import About from "./routes/About";
import UserBoard from "./routes/UserBoard";
import ForgotPassword from './routes/ForgotPassword';

export default function App(){
  return (
  <Router>
      <div className='App'>
        <Routes>
          <Route path = "/" element = {<Home/>}/>
          <Route path = "/about" element = {<About/>}/>
          <Route path = "/contact" element = {<Contact/>}/>
          <Route path = "/login" element = {<Login/>}/>
          <Route path = "/signup" element = {<SignUp/>}/>
          <Route path = "/forgotPass" element = {<ForgotPassword/>}/>
          <Route path = "/userPage" element = {<UserBoard/>}/>
        </Routes>
      </div>
    </Router>
  )
}
