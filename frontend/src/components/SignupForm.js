import {useRef} from 'react'

function SignupForm() {
    const usernameRef = useRef(null);
    const pwd = useRef(null);
    const handleSubmit = async () => {
        alert("username: " + usernameRef.current.value + " password: " + pwd.current.value)

        //get the usernames from the database

    }
    return (
    <form onSubmit={handleSubmit}>
        <div>
      <h1>Username:</h1>
      <input
         placeholder="Name"
         ref={usernameRef} 
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
    <button type="submit">Create account</button>
    </form>

    )
}
export {SignupForm}