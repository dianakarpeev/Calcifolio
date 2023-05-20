import './App.css';
import Home from "../pages/Home";
import { Route, Routes, Navigate } from "react-router-dom";
import About from "../pages/About";
import MainLayout from "../layouts/MainLayout";
import SystemError from "../pages/SystemError";
import UserError from "../pages/UserError";
import Deadlines from "../pages/Deadlines";
import {AllArtwork} from './AllArtwork'
import { AllVideos } from './AllVideos';
import { SingleVideo } from './useless/SingleVideo';
import { AddVideo } from './AddVideo';
import { DeleteVideo } from './DeleteVideo';
import { UpdateVideo } from './UpdateVideo';
import { AddDeadline } from './AddDeadline';
import { useState } from "react";
import { useCookies } from 'react-cookie';

import TwoPanes from "./TwoPanes";
import { AddArtwork } from './AddArtWork';
import { UpdateArtwork } from './UpdateArtwork';
import { Signup } from './Signup';
import {Login} from './Login';
import { Welcome } from './Welcome';
import { Success } from './Success';

/**
 * Displays the navigation bar paths
 * @returns routing of different endpoints
 */
function App() {
  const [cookies, setCookie] = useCookies('[user]')
  const defaultRightPane = <p></p>;
  const [rightPane, setRightPane] = useState(defaultRightPane);
  const defaultLeftPane = <AddDeadline setDisplay={setRightPane} />;
  const [leftPane] = useState(defaultLeftPane);
    <div>
    
    </div>
  if (cookies.user == null) {
    return (
    <div className="App">
    <Routes>
    <Route path="/" element={<MainLayout />}>
      <Route index element={<Welcome />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path="about" element={<About />} />
      <Route path="success" element={<Success />} />
      </Route>
    </Routes>
    </div>
    );
  }
  else {
  return (
    <div className="App">
      <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="deadlines" element={<Deadlines />} />
        <Route path="deadlines/create" element={ <div>
      <TwoPanes leftPane={leftPane} rightPane={rightPane} />{"      "}
    </div>  } />
    <Route path="videos" element={<AllVideos />} />
    <Route path="videos/new" element={<AddVideo />} />
        <Route path="videos/delete" element={<DeleteVideo />} />
        <Route path="video" element={<SingleVideo />} />
        <Route path="videos/edit" element={<UpdateVideo />} />
        <Route path="artworks" element={<AllArtwork />} />
        <Route path="artworks/post" element={<AddArtwork />} />
        <Route path="artworks/update" element={<UpdateArtwork />} />
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
        <Route path="about" element={<About />} />
        <Route path="usererror" element={<UserError />} />
        <Route path="systemerror" element={<SystemError />} />
        
      </Route>

      <Route path="*" element={<Navigate to="/" />} />
      

    </Routes>
    </div>
  );
  }
}
export default App;
