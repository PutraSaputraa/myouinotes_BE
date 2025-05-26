import express from "express";
import {createNotes, deleteNotes, getNotes, getNotesById, updateNotes} from "../controller/NoteController.js";
import { authenticateToken } from "../middleware/AuthMiddleware.js";

const router = express.Router();

router.get('/notes', authenticateToken, getNotes);
router.get('/notes/id', authenticateToken, getNotesById);
router.post('/create-notes', authenticateToken, createNotes);
router.put('/update-notes/:id', authenticateToken, updateNotes);
router.delete('/delete-notes/:id', authenticateToken, deleteNotes);

export default router;