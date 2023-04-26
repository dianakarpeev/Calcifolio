import { NavLink,useResolvedPath,useMatch } from "react-router-dom";
//import Button from 'react-bootstrap/Button';
import Button from "@mui/material/Button";
import { createTheme,ThemeProvider } from "@mui/material/styles";
import { orange } from '@mui/material/colors'; 
import { deepOrange } from '@mui/material/colors'; 
const theme = createTheme({
  palette: {
    primary: {
      main: deepOrange[500],
    },
    secondary: {
  
      main: orange[500],
    },
  },
});

function NavButton(props) {
    let resolved = useResolvedPath(props.to);
    let match = useMatch({ path: resolved.pathname, end: true });
  
    
      return(
        <NavLink to={props.to}>
          <ThemeProvider theme={theme}>
          <Button variant={match ? "contained" : "contained"} color={match ? "primary": "secondary"}>{props.label}</Button>
          </ThemeProvider>
         
        </NavLink>
      )
}  
export default NavButton;