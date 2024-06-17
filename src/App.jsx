import React from 'react';
import { BrowserRouter, Routes ,Route} from 'react-router-dom';
import Header from './Components/Header';
import Home from './Pages/Home';
import About from './Pages/About';
import Dashboard from './Pages/Dashboard';
import Blogs from './Pages/Blogs';
import SignIn from './Pages/SignIn';
import SignUp from './Pages/SignUp';
import PrivateRoute from './Components/PrivateRoute';
import OnlyAdminPrivateRoute from './Components/OnlyAdminPrivateRoute';
import CreatePost from './Pages/CreatePost';
const App = () => {
  return (
    <>
    <BrowserRouter>
    <Header />
    <Routes>
      <Route path="/about" element={<About />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
      <Route element={<PrivateRoute />}>
      <Route path="/" element={<Home />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/blogs" element={<Blogs />} />
      </Route>
      <Route element={<OnlyAdminPrivateRoute />}>
      <Route path="createpost" element={<CreatePost/>} />
      </Route>

    </Routes>
    </BrowserRouter>
    </>
  );
};

export default App;