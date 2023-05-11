import { useRef } from "react";
import {useNavigate} from "react-router-dom";
import { Router } from "react-router-dom";
function AddVideoForm(props) {
    const titleRef = useRef(null);
    const lengthRef = useRef(null);
    const imageRef = useRef(null);
    const navigate = useNavigate();



    const handleSubmit = async (event) => {
        event.preventDefault();


        const requestOptions = {
            method: "POST",
            body: JSON.stringify({
                title: titleRef.current.value,
                length: lengthRef.current.value,
                image: imageRef.current.value,

            }),
            headers: {
                "Content-type" : "application/json; charset=UTF-8",
            },
        };

    const response = await fetch("http://localhost:1339/addVideo", requestOptions);
    const result = await response.json();
    console.log(result);
    if (response.status === 400) {
        navigate("/usererror", { state: { error: result.error } });
  
    }else if (response.status === 500) {
        navigate("/systemerror", { state: { error: result.error } });
    }
    else {
    props.setAdded(result);
    }
    };


    return (
        <form onSubmit={handleSubmit}>
            <label htmlFor="title">Title</label>
            <input type="text" placeholder="Title..." ref={titleRef} required/>

            <label htmlFor="length">Length</label>
            <input type="text" placeholder="Length..." ref={lengthRef} required/>

            <label htmlFor="image">Image</label>
            <input type="text" placeholder="Image..." ref={imageRef}/>


            <button className="videoButton" type="submit">Add Video</button>


            
        </form>


    );
}
export {AddVideoForm};