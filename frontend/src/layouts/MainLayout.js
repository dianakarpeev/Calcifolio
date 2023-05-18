import React from "react";
import {Outlet} from "react-router-dom";
import Header from '../components/Header';
import Footer from '../components/Footer';
import { ProSidebarProvider, SubMenu } from "react-pro-sidebar";
import { Sidebar, Menu, MenuItem, useProSidebar } from 'react-pro-sidebar';
import NavButton from "components/NavButton";
import { Link } from "react-router-dom";
import {DiAndroid} from "react-icons/di";
import {VscAccount, VscPlay} from "react-icons/vsc";
import { MdCalendarMonth , MdHome, MdBrush, MdContactPage, MdDensityMedium} from "react-icons/md";
import { createTheme,ThemeProvider } from "@mui/material/styles";
import { orange } from '@mui/material/colors'; 
import { deepOrange } from '@mui/material/colors'; 
import { hover } from "@testing-library/user-event/dist/hover";

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
  const test = {
    menu: {
      menuContent: '#f8fafc',
      icon: '#f8fafc',
      hover: {
        backgroundColor: '#c5e4ff',
        color: '#44596e',
      },
  }
}
  const {collapseSidebar} = useProSidebar();
   return   (
    
   <div style={{ display: 'flex', height: '100%', minHeight: '100vh'}}>
   <Sidebar backgroundColor="#292524" defaultCollapsed="true" collapsedWidth="60px" margin="0%" padding="100%">
     <Menu style = {{ display: "flex", flexDirection :"row", textAlign: "center", justifyContent: "flex-start"}} menuItemStyles={{
          button: {
              backgroundColor: '#292524',
              color: '#f8fafc',
              alignSelf : 'flex-start',
              '&:hover': {
                backgroundColor: '#f8fafc',
                color: '#292524'
            },
          }}}>
      <MenuItem icon={<MdDensityMedium/>} onClick={() => collapseSidebar()}></MenuItem>
     <MenuItem icon={<MdHome/>} component={<Link to="/" label="Home" />}>Home</MenuItem>
     <SubMenu icon={<MdCalendarMonth/>} label="Deadlines">
    <MenuItem icon={<MdCalendarMonth/>} component={<Link to="/deadlines" label="Deadlines" />}>Deadlines</MenuItem>
    <MenuItem icon={<MdCalendarMonth/>} component={<Link to="/deadlines/create" label="Create deadline" />}>Create Deadline</MenuItem>
    </SubMenu>
    <SubMenu icon={<VscPlay/>} label="Videos">
    <MenuItem icon={<VscPlay/>} component={<Link to="/videos" label="Videos"/>}>Videos</MenuItem>
    <MenuItem icon={<VscPlay/>} component={<Link to="/videos/new" label="Videos"/>}>Upload new video</MenuItem>

    </SubMenu>
    <MenuItem icon={<MdBrush/>}component={<Link to="/posts" label="Posts" />}>Art</MenuItem> 
    <MenuItem icon={<VscAccount/>} component={<Link to="/about" label="About us" />}>About us</MenuItem>
    
    <MenuItem icon={<MdContactPage/>} component={<Link to="/contact" label="Contact" />}>Contact</MenuItem>
     </Menu>
   </Sidebar>
   <main style={{ padding: 10 }}> 

   <Header></Header>
   <Outlet></Outlet>
   
   </main>
 </div>
);




            
           
      
}   
export default MainLayout;