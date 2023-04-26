import React from "react";
import {Outlet} from "react-router-dom";
import Header from '../components/Header';
import Footer from '../components/Footer';

function MainLayout() {
  const footer={
    position: "fixed",
    left: "0",
    bottom: "0",
    width: "100%",
    color: "black",
    textAlign: "center",
    fontWeight: "bold",
    backgroundColor: "white",
  }

   return <div>
            <Header />
            <br/>
            <div>
            <Outlet/>
            </div>
            <br/>
            <br/>
            <div style={footer}>
            <Footer />	
            </div>
           
          </div>
}   
export default MainLayout;