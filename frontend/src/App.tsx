
import Home from './routes/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Contact from "./routes/Contact";
import Login from "./routes/Login";
import SignUp from './routes/SignUp';
import About from "./routes/About";
import UserBoard from "./routes/UserBoard";
import ForgotPassword from './routes/ForgotPassword';
import PublicVault from './routes/PublicVault';
import PublicBoard from './routes/PublicBoard';
import OtpPage from './components/UI/OTP';

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
          <Route path = "/public/vault" element = {<PublicVault/>}/>
          <Route path = "/brain/:hash" element={<PublicBoard />} />
          <Route path = "/otp" element={<OtpPage />} />
        </Routes>
      </div>
    </Router>
  )
}
