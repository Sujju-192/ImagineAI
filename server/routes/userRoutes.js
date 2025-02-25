import { Router } from "express";
import upload from '../multer.js'
import { addUserToDataBase, getFirebaseUser, addFolderAtFirebase, getFolderDetailsFromFirebase, addImageAtFirebase } from "../Utils/firebase.database.js";
import { uploadToCloudinary } from "../Utils/cloudinary.upload.js";

const userRoute = Router()

userRoute.post("/adduser", async (req, res) => {
    const response = await addUserToDataBase(req.body)
    if (response) return res.status(200)
    else return res.status(500)
})


userRoute.post("/getuser", async (req, res) => {
    const response = await getFirebaseUser(req.body?.userId)
    console.log(response);
    if (response) return res.status(200).json({ name: response.name, profilePic: response.profilePic, rootFolderId: response.rootFolderId })
    else return res.status(500).json({ message: "Something went wrong" })
})

userRoute.post("/addfolder", async (req, res) => {
    const { userId, parentId, name } = req.body;
    const response = await addFolderAtFirebase(userId, parentId, name)
    if (response) {
        return res.status(200).json(response)
    }
    else {
        return res.status(500).json({ message: "server error" })
    }
})

userRoute.post("/getfolderdetails", async (req, res) => {
    const { userId, folderId } = req.body
    const response = await getFolderDetailsFromFirebase(userId, folderId)

    if (response) return res.status(200).json(response);
    else return res.status(500).json({ message: "internal server error" })
})

userRoute.post("/addimage", upload.single("image"), async (req, res) => {
    const { userId, folderId } = req.body
    const path = req.file.path
    const uploadResult = await uploadToCloudinary(path)

    if (uploadResult) {
        const response = await addImageAtFirebase(userId, folderId, `${uploadResult.url}`)
        if (response) return res.status(200).json({ url: uploadResult.url })
        else return res.status(500).json({ message: "internal server error" })
    }
    else return res.status(500).json({ message: "inter server error" })
})



export default userRoute