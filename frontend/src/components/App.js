import './App.css';
import Home from "../pages/Home";
import { Route, Routes, Navigate } from "react-router-dom";
import About from "../pages/About";
import Contact from "../pages/Contact";
import MainLayout from "../layouts/MainLayout";
import SystemError from "../pages/SystemError";
import UserError from "../pages/UserError";
import Deadlines from "../pages/Deadlines";
import Posts from 'pages/Posts';
import Videos from 'pages/Videos';

/**
 * Displays the navigation bar paths
 * @returns routing of different endpoints
 */
function App() {
  return (
    <div className="App">
      <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="deadlines" element={<Deadlines />} />
        <Route path="videos" element={<Videos />} />
        <Route path="posts" element={<Posts />} />
        <Route path="about" element={<About />} />
        <Route path="usererror" element={<UserError />} />
        <Route path="systemerror" element={<SystemError />} />
        <Route path="contact" element={<Contact />} />
      </Route>
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
    </div>
  );
  }

export default App;
