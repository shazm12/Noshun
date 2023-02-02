import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { BASE_URL } from '../constants';

const UserProfile = (props) => {
    const [data, setData] = useState({ name: "", email: "" });
    const handleLogin = async () => {
        const authtoken = localStorage.getItem('token');
        const response = await fetch(`${BASE_URL}/api/auth/getuser`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': authtoken
            }
        })

        const json = await response.json();
        setData(json);
    }



    return (
        <div className="dropdown">
            <button className="btn btn-secondary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false" onClick={handleLogin}>
                {data.name}
            </button>
            <ul className="dropdown-menu">
                <li><Link className="dropdown-item" to="#">{data.email}</Link></li>
            </ul>
        </div>
    )
}

export default UserProfile
