import "components/Card.css"
/**
 * Manages data and state presentation
 * @param {object} props children
 * @returns 
 */
function Card({ children}) {
    return (    
       <div className="card">   
          {children}   
       </div>  
    );
  }
  
  export default Card;