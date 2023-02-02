const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const authorization = require('../middleware/authorization');
const Note = require('../models/Note');
const dotenv = require("dotenv");
dotenv.config();
const BASE_URL = process.env.BASE_URL;
const jwtSecret = process.env.jwtSecret;

// ROUTE-1: @route GET api/notes/fetchallnotes
// @desc fetch all notes
// @access private

router.get('/fetchallnotes', authorization, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

//ROUTE-2: @route POST api/notes/addnote
// @desc add note
//@access private

router.post(
  '/addnote',
  [
    authorization,
    [
      body('title', 'enter a valid title').isLength({ min: 3 }),
      body('description', 'description must be atleast 5 characters').isLength({
        min: 5,
      }),
    ],
  ],

  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { title, description, tag } = req.body;

      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });

      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Server Error');
    }
  }
);

//ROUTE-3: @route PUT api/notes/updatenote/:id
// @desc update note (login required)
//@access private

router.put('/updatenote/:id', authorization, async (req, res) => {
  try {
    const { title, description, tag } = req.body;
    const newnote = {};

    if (title) newnote.title = title;
    if (description) newnote.description = description;
    if (tag) newnote.tag = tag;

    // find the note to be updated and update it
    let note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).send('Not Found');
    }

    // if note's user-id doesn't match with the req.user.id then deny access
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send('Deny access');
    }

    // update the note by setting the note value to newnote.
    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newnote },
      { new: true }
    );

    res.json(note);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

//ROUTE-4: @route GET api/notes/getnote/:id
// @desc get a note (login required)
//@access private

router.get('/getnote/:id', authorization, async (req, res) => {
  try {
    let note = await Note.findById(req.params.id);
    // check note's user-id matches with the req.user.id
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send('Not Authorized');
    }

    res.json(note);
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});

//ROUTE-4: @route DELETE api/notes/deletenote/:id
// @desc delete a note (login required)
//@access private

router.delete('/deletenote/:id', authorization, async (req, res) => {
  try {
    // find the note to be deleted
    let note = await Note.findById(req.params.id);

    if (!note) {
      return res.status(404).send('Note not found');
    }

    // if note found then check if it belongs to the authentic user [Not belongs].
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send('Not Authorized');
    }

    // if note belongs to the user
    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ success: `Note with ${req.user.id} has been deleted` });
  } catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
  }
});
module.exports = router;
