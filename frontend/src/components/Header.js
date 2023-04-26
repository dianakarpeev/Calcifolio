
import NavButton from "./NavButton";
function Header() {
  return (
    <div id="orange">
      <nav>
        <NavButton to="/" label="Home" />
        <NavButton to="/deadlines" label="Deadlines" />
        <NavButton to="/videos" label="Videos" />
        <NavButton to="/posts" label="Posts" />
        <NavButton to="/about" label="About us" />
        <NavButton to="/contact" label="Contact" />
      </nav>
    
    </div>
  );
}
export default Header;
