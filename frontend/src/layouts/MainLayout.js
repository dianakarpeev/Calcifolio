import React from "react";
import {Outlet} from "react-router-dom";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ProSidebarProvider } from "react-pro-sidebar";
import { Sidebar, Menu, MenuItem, useProSidebar } from 'react-pro-sidebar';
import NavButton from "components/NavButton";
import { Link } from "react-router-dom";
import {DiAndroid} from "react-icons/di";
import {VscAccount, VscPlay} from "react-icons/vsc";
import { MdCalendarMonth , MdHome, MdBrush} from "react-icons/md";

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
  const { toggleSidebar, collapseSidebar} = useProSidebar();
   return   (
    
   <div style={{ display: 'flex', height: '100%', minHeight: '100vh'}}>
   <Sidebar defaultCollapsed="true" collapsedWidth="4%" onMouseEnter={() =>collapseSidebar()} onMouseLeave={() =>collapseSidebar()}>
     <Menu style = {{textAlign: "left"}}>
     <MenuItem icon={<MdHome/>} component={<Link to="/" label="Home" />}>Home</MenuItem>
    <MenuItem icon={<MdCalendarMonth/>} component={<Link to="/deadlines" label="Deadlines" />}>Deadlines</MenuItem>
    <MenuItem icon={<VscPlay/>} component={<Link to="/videos" label="Videos" />}>Videos</MenuItem>
    <MenuItem icon={<MdBrush/>}component={<Link to="/posts" label="Posts" />}>Art</MenuItem> 
    <MenuItem icon={<VscAccount/>} component={<Link to="/about" label="About us" />}>About us</MenuItem>
    
    <MenuItem component={<Link to="/contact" label="Contact" />}>Contact</MenuItem>
     </Menu>
   </Sidebar>
   <main style={{ padding: 10 }}> 
   <Outlet></Outlet>
   
   </main>
 </div>
);




            
           
      
}   
export default MainLayout;