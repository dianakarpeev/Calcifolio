import { useParams } from "react-router-dom";

function About(){
    const { employee } = useParams();

    return(
        <div style={{display: "flex", justifyItems: "center", flexDirection: "column"}}>
        <h1>About us message</h1>
       <p style={{fontSize: '24px', width: '40vw'}}>Hello, we are Calcifolio. Our motivation for this website is to let artists have a safe space to create art, whether its videos or a picture, and for a way to let other aspiring artists reach out to one another.        This will help create new connections as well as be a platform that allows you to create a virtual art portfolio. We were inspired by Calcifer from the studio Gibli movie and we hope this website will inspire you to create more art and express yourselves.</p>

        </div>
    );
}
export default About;