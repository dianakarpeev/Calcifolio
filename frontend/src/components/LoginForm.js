import {useRef} from 'react';
import { useCookies } from 'react-cookie';

function LoginForm() {
    const username = useRef(null);
    const pwd = useRef(null);

    const [cookies, setCookie] = useCookies(['user']);
    const handleSubmit = async () => {
        alert("username: " + username.current.value + " password: " + pwd.current.value)

        //get the usernames from the database



        setCookie('user', username.current.value, { path: '/' })
        setCookie('password', pwd.current.value, { path: '/' })
    }
    return (
    <form onSubmit={handleSubmit}>
        <div>
      <h1>Username:</h1>
      <input
         placeholder="Name"
         ref={username} 
         required
      />
      <h1>Password:</h1>
      <input
         type="password"
         placeholder="Password"
         ref={pwd} required
         />
         </div>
         <br></br>
    <button type="submit">Login</button>
    </form>

    )
}
export {LoginForm}