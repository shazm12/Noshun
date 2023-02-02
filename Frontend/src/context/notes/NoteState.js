import NoteContext from './NoteContext';
import { useState } from 'react';
import { BASE_URL } from '../../constants';

const NoteState = (props) => {

    const notesIntial = [];

    const [notes, setNotes] = useState(notesIntial)

    const getNotes = async () => {
        const url = `${BASE_URL}/api/notes/fetchallnotes`;
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            }
        })

        const json = await response.json();
        // console.log(json);
        setNotes(json);
    }

    //add note
    const addNote = async (title, description, tag) => {

        const url = `${BASE_URL}/api/notes/addnote`
        const response = await fetch(url, {
            method: 'POST',
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },

            body: JSON.stringify({ title, description, tag }) // body data type must match "Content-Type" header
        });
        const note = await response.json();
        setNotes(notes.concat(note));
    }

    // delete note
    const deleteNote = async (id) => {
        console.log(`Deleting the note with id: ${id}`);
        const url = `${BASE_URL}/api/notes/deletenote/${id}`
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },
        });

        console.log(`The deleteNote response is ${response} `);

        // Method-2: make use of filter function
        const newNotes = notes.filter((note) => { return note._id !== id })
        setNotes(newNotes);

    }

    // update note
    const editNote = async (id, title, description, tag) => {
        // Example POST method implementation:
        const url = `${BASE_URL}/api/notes/updatenote/${id}`
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'auth-token': localStorage.getItem('token')
            },

            body: JSON.stringify({ title, description, tag }) // body data type must match "Content-Type" header
        });

        console.log(`The editNote response is ${response} `);
        // const json = response.json(); // parses JSON response into native JavaScript objects



        let newNotes = JSON.parse(JSON.stringify(notes));    // let newNotes = notes [but refresh shd be done]
        for (let index = 0; index < newNotes.length; index++) {
            if (newNotes[index]._id === id) {
                if (title) newNotes[index].title = title;
                if (description) newNotes[index].description = description;
                if (tag) newNotes[index].tag = tag;
                break;
            }
        }

        setNotes(newNotes);


    }

    return (
        <NoteContext.Provider value={{ notes, getNotes, addNote, deleteNote, editNote }}>
            {props.children}
        </NoteContext.Provider>);
};

export default NoteState;



/* // Method-1: for deleteNote
     let newNotes = notes;
     for (let index = 0; index <= notes.length; index++) {
         if (notes[index]._id === id)
             newNotes = notes.splice(index, 1);
     }
     setNotes(newNotes);
     */