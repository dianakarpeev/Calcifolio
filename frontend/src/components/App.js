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
import {AllArtwork} from './AllArtwork'
import { AllVideos } from './AllVideos';
import { SingleVideo } from './SingleVideo';
import { AddVideo } from './AddVideo';
import { DeleteVideo } from './DeleteVideo';
import { UpdateVideo } from './UpdateVideo';
import { AllDeadlines } from './AllDeadlines';
import { AddDeadline } from './AddDeadline';
import { useState } from "react";

import TwoPanes from "./TwoPanes";
import { AddArtworkForm } from './AddArtworkForm';
import { AddArtwork } from './AddArtWork';
import { UpdateDeadlineByName } from './UpdateDeadlineByName';

/**
 * Displays the navigation bar paths
 * @returns routing of different endpoints
 */
function App() {
  
  const defaultRightPane = <p></p>;
  const [rightPane, setRightPane] = useState(defaultRightPane);
  const defaultLeftPane = <AddDeadline setDisplay={setRightPane} />;
  const [leftPane] = useState(defaultLeftPane);
    <div>
    
    </div>

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
