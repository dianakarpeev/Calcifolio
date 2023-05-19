import { useRef } from "react";
import {useNavigate} from "react-router-dom";
import { Router } from "react-router-dom";
import ReactPlayer from "react-player";
function AddVideoForm(props) {
    const titleRef = useRef(null);
    const urlRef = useRef(null);
    const navigate = useNavigate();

    const border3 = {
        margin: "2rem",
        padding: "2rem 2rem",
        textAlign: "center",
      };
      const label = {
        width: "180px",
        clear: "left",
        textAlign: "center",
        paddingRight: "10px",
        color: "orange",
      };
      const button={
        width: "180px",
        clear: "left",
        textAlign: "center",
        paddingRight: "10px",
      }

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!ReactPlayer.canPlay(urlRef.current.value)) {
            return;
        }
        const requestOptions = {
            method: "POST",
            body: JSON.stringify({
                title: titleRef.current.value,
                url: urlRef.current.value,
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
        <div>
        <h2 style={{color: "orange"}}>Post new video</h2>
        <form onSubmit={handleSubmit}>
        <div style={border3}>
          <label style={label} htmlFor="name">
            Title
          </label>
          <input
            type="text"
            placeholder="Title..."
            ref={titleRef}
            required
          />
          <br />
            <label style={label} htmlFor="url">
            URL
          </label>
          <input
            type="text"
            placeholder="URL..."
            ref={urlRef}
            optional
          />
        </div>
        <button style={button} type="submit">Create</button>
      </form>
      </div>
    );
}
export {AddVideoForm};