import Note from "../model/NoteModel.js";


//Get All Notes
export const getNotes = async(req, res) =>{
    try {
        const response = await Note.findAll();
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
    }
}

//Get All Notes
export const getNotesById = async(req, res) =>{
    try {
        const user_id = req.user.userId;  // dari middleware authenticateToken
        const response = await Note.findAll({where: 
            {user_id}
        });
        res.status(200).json(response);
    } catch (error) {
        console.log(error.message);
    }
}

//Create
export const createNotes = async (req, res) => {
    try {
        // Tambahkan user_id dari token, jangan dari req.body
        const { judul, isi_catatan } = req.body;
        const user_id = req.user.userId;  // dari middleware authenticateToken

        await Note.create({ judul, isi_catatan, user_id });
        res.status(201).json({ msg: "Note Created" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Failed to create note" });
    }
};


//Update
export const updateNotes = async(req,res)=>{
    try {
        await Note.update(req.body, {
            where: {
                id: req.params.id
            }
        })
        res.status(200).json({msg:"Note Update Successfull!"})
    } catch (error) {
        console.log(error.message)
    }
}

//Delete
export const deleteNotes = async(req, res)=>{
    try {
        await Note.destroy({
            where: {
                id: req.params.id
            }
        })
        res.status(200).json({msg:"Note Delete Successfully!"})
    } catch (error) {
        console.log(error.message)
    }
}