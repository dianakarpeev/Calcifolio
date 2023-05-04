import React from "react";
import {Outlet} from "react-router-dom";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { CrudButtons } from "../components/CrudButtons";

function VideoLayout() {
   return <div>
            <Header />
            <CrudButtons/>
            <Outlet />
            <Footer />	
	
          </div>
}  
export {VideoLayout};