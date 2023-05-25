import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../constants';

const Signup = () => {
    const [credentials, setCredentials] = useState({ name: "", email: "", password: "", cpassword: "" });
    const [loading, setLoading ] = useState(false);
    let navigate = useNavigate();

    const onChange = (e) => {
        setCredentials({
            ...credentials, [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {

        if(credentials.email ==="" || credentials.password === "" || credentials.cpassword === "") {
            alert("Please enter all the fields!");
        }

        
        setLoading(true);
        
        try {
            const response = await fetch(`${BASE_URL}/api/auth/createUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },

                body: JSON.stringify({ name: credentials.name, email: credentials.email, password: credentials.password }) // body data type must match "Content-Type" header
            });

            const json = await response.json();

            if (json.success) {
                localStorage.setItem('token', json.authtoken);
                navigate('/');
            } else {
                alert('User already exists');
            }
        }
        catch (err) {
            console.error(err);
            alert(err);
        }

        setLoading(false);


    }
    return (
        <div>
            <form onSubmit={handleSubmit} >
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Username</label>
                    <input type="text" className="form-control" id="name" name="name" value={credentials.name} onChange={onChange} aria-describedby="emailHelp" required minLength={3} />

                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" className="form-control" id="email" name="email" value={credentials.email} onChange={onChange} aria-describedby="emailHelp" required minLength={5} />

                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" name="password" value={credentials.password} onChange={onChange} id="password" required minLength={3} />
                </div>

                <div className="mb-3">
                    <label htmlFor="cpassword" className="form-label">Confirm Password</label>
                    <input type="password" className="form-control" name="cpassword" value={credentials.cpassword} onChange={onChange} id="cpassword" required minLength={3} />
                </div>

                <button type="submit" disabled={loading} className="btn btn-primary">{!loading ? "Submit": "Submitting"}</button>
            </form>
        </div>
    )
}

export default Signup
