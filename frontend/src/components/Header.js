
import NavButton from "./NavButton";
import { Sidebar, Menu, MenuItem, useProSidebar } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';
function Header() {
  const { collapseSidebar } = useProSidebar();
  return (
    <div id="orange" style={{ display: 'flex', height: '100%' }}>


<Sidebar>
  <Menu>
    <MenuItem component={<NavButton to="/" label="Home" />}/>
    <MenuItem component={<NavButton to="/deadlines" label="Deadlines" />}/> 
    <MenuItem component={<NavButton to="/videos" label="Videos" />}/> 
    <MenuItem component={<NavButton to="/posts" label="Posts" />}/> 
    <MenuItem component={<NavButton to="/about" label="About us" />}/> 
    <MenuItem component={<NavButton to="/contact" label="Contact" />}/>

  </Menu>
</Sidebar>

<main>
        <button onClick={() => collapseSidebar()}>Collapse</button>
      </main>
    </div>
  );
}
export default Header;
