import React, { useContext, useEffect } from 'react'
import noteContext from "../context/notes/NoteContext"
import AddNote from './Addnote';
import { useNavigate } from 'react-router-dom';

const Notes = () => {
    let navigate = useNavigate();
    const context = useContext(noteContext);
    const { getNotes } = context;
    useEffect(() => {
        if (localStorage.getItem('token')) {
            console.log(localStorage.getItem('token'));
            getNotes()
        } else {
            console.log("Go to login");
            navigate("/login");
        }

        // eslint-disable-next-line
    }, [])




    return (
        <>
            <AddNote />
        </>
    )
}

export default Notes