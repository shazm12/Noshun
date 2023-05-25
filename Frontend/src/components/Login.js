import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../constants'

const Login = (props) => {
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [loading, setLoading ] = useState(false);
    let navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(credentials.email === "" || credentials.password ===  "") {
            alert("Please enter your credentials!");
            return;
        }

        setLoading(true);
            
        try {
            const response = await fetch(`${BASE_URL}/api/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: credentials.email, password: credentials.password })
            });
            const json = await response.json();
            console.log(json);
            if (json.success) {
                // setting the token value to token variable
                localStorage.setItem('token', json.authtoken);
                navigate('/');

            } else {
                alert("Invalid credentials");
            }
        
        }
         catch(err) {
            console.error(err);
            alert(err);
        }
        setLoading(false);
    }

    const onChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value })
    }




    return (
        <div>
            <form >
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" name="email" value={credentials.email} onChange={onChange} aria-describedby="emailHelp" />

                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" name="password" value={credentials.password} onChange={onChange} id="password" />
                </div>

                <button type="submit" className="btn btn-primary" disabled={loading} onClick={handleSubmit}>{!loading ? "Submit" : "Submitting"}</button>
            </form>
        </div>
    )
}

export default Login
