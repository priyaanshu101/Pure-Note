
import Home from './routes/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from "./routes/Login";
import SignUp from './routes/SignUp';
import UserBoard from "./routes/UserBoard";
import ForgotPassword from './routes/ForgotPassword';
import PublicVault from './routes/PublicVault';
import PublicBoard from './routes/PublicBoard';
import OtpPage from './components/UI/OTP';
import ResetPassword from './routes/ResetPassword';


export default function App(){
  return (
  <Router>
      <div className='App'>
        <Routes>
          <Route path = "/" element = {<Home/>}/>
          <Route path = "/login" element = {<Login/>}/>
          <Route path = "/signup" element = {<SignUp/>}/>
          <Route path = "/userPage" element = {<UserBoard/>}/>
          <Route path = "/public/vault" element = {<PublicVault/>}/>
          <Route path = "/brain/:hash" element={<PublicBoard />} />
          <Route path = "/otp" element={<OtpPage />} />
          <Route path = "/forgotPass" element={<ForgotPassword/>}/>
          <Route path = "/reset-password" element={<ResetPassword/>}/>
        </Routes>
      </div>
    </Router>
  )
}
