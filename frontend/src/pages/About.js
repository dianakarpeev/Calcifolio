import { useParams } from "react-router-dom";

function About(){
    const { employee } = useParams();

    return(
        <div>
        <h1>About us message</h1>
        {employee === "Jane" && <h2>Jane is a software architect who loves Jenga</h2>}
        {employee === "Joe" && <h2>Joe is a farmer and has a dog named bingo</h2>}

        </div>
    );
}
export default About;