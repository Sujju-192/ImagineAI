import React, { useEffect, useState } from "react";
import { FaFolder, FaImage, FaPlus } from "react-icons/fa";
import { Link, useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { addFolder, getFolderContents, uploadImage } from "../API/user.api";
import { motion, AnimatePresence } from "framer-motion";
import ImageCard from "./ImageCard";

const Home = () => {
  const [showOptions, setShowOptions] = useState(false);
  const [showFolderPrompt, setShowFolderPrompt] = useState(false);
  const [folderName, setFolderName] = useState("");

  //--------------> State for Images & Folders
  const [images, setimages] = useState([]);
  const [folders, setfolders] = useState([]);
  const { parent } = useParams();
  const userId = useSelector(state => state.userId);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showImageUploadPopup, setShowImageUploadPopup] = useState(false);
  const [parentName,setParentName]=useState("")

  //--------------> Fetch Folder Contents
  useEffect(() => {
    const fetch = async () => {
      const response = await getFolderContents(userId, parent);
      if (response) {
        setfolders(response.subFolders);
        setimages(response.images);
        setParentName(response.name)
      }
    };
    fetch();
  }, [parent]);

  //--------------> Handle Adding Folder
  const handleAddFolder = async () => {
    const response = await addFolder(userId, parent, folderName);
    if (response) {
      setfolders(pre => [...pre, response]);
      setShowFolderPrompt(false);
    }
  };

  //--------------> Handle Image Selection
  const handleImageChange = (event) => {
    setSelectedImage(event.target.files[0]);
  };

  //--------------> Handle Image Upload
  const handleUploadImage = async () => {
    if (!selectedImage) {
      alert("Please select an image first.");
      return;
    }

    setIsUploading(true);

    const formData = new FormData();
    formData.append("image", selectedImage);
    formData.append("userId", userId);
    formData.append("folderId", parent);

    try {
      const response = await uploadImage(formData);
      if (response) {
        setimages((prev) => [...prev, response]);
        setSelectedImage(null);
        setShowImageUploadPopup(false);
        alert("Image uploaded successfully!");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6 relative">
      <h1 className="text-2xl font-bold text-purple-900 mb-6">{`AT : ${parentName.toUpperCase()}`}</h1>

      {/* Folders Section */}
      {folders.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-purple-800 mb-4">Folders</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {folders.map((folder) => (
              <Link key={folder.id} to={`/user/home/${folder.id}`}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex flex-col items-center p-4 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <FaFolder className="text-4xl text-purple-900" />
                  <p className="mt-2 text-sm text-purple-900 text-center">{folder.name}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Images Section */}

      {images.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-purple-800 mb-4">Images</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">

            {images.map((image, index) => (
              
              <ImageCard imageUrl={image}/>
              // <motion.div
              //   key={index}
              //   whileHover={{ scale: 1.05 }}
              //   whileTap={{ scale: 0.95 }}
              //   className="relative aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
              // >
              //   <img src={image} alt={`Uploaded ${index + 1}`} className="w-full h-full object-cover" />
              // </motion.div>


            ))}


          </div>
        </div>
      )}

      {/* Floating Add Button */}
      <motion.button
        onClick={() => setShowOptions(!showOptions)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className="fixed bottom-6 right-6 bg-purple-900 text-white p-4 rounded-full shadow-lg hover:bg-purple-700 transition"
      >
        <FaPlus className="text-xl" />
      </motion.button>

      {/* Pop-up Options */}
      <AnimatePresence>
        {showOptions && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 right-6 bg-white shadow-lg rounded-lg p-2 flex flex-col space-y-2"
          >
            <button
              onClick={() => {
                setShowFolderPrompt(true);
                setShowOptions(false);
              }}
              className="flex items-center space-x-2 px-4 py-2 text-purple-900 hover:bg-purple-100 rounded"
            >
              <FaFolder />
              <span>Add Folder</span>
            </button>
            <button
              onClick={() => {
                setShowImageUploadPopup(true);
                setShowOptions(false);
              }}
              className="flex items-center space-x-2 px-4 py-2 text-purple-900 hover:bg-purple-100 rounded"
            >
              <FaImage />
              <span>Add Image</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Upload Popup */}
      <AnimatePresence>
        {showImageUploadPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex justify-center items-center bg-black/60"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white p-6 rounded-lg shadow-lg w-96"
            >
              <h2 className="text-xl font-semibold text-purple-900 mb-4">Upload Image</h2>

              {/* Image Input */}
              <label className="block mb-4">
                <span className="text-sm text-gray-700">Select an image</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full mt-1 text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                />
              </label>

              {/* Upload Button */}
              <button
                onClick={handleUploadImage}
                disabled={!selectedImage || isUploading}
                className="w-full bg-purple-900 text-white py-2 px-4 rounded hover:bg-purple-700 disabled:bg-purple-400"
              >
                {isUploading ? "Uploading..." : "Upload"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Folder Name Prompt */}
      <AnimatePresence>
        {showFolderPrompt && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 flex justify-center items-center bg-black/60"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="bg-white p-6 rounded-lg shadow-lg w-80 text-center"
            >
              <h2 className="text-lg font-semibold mb-4">Enter Folder Name</h2>
              <input
                type="text"
                value={folderName}
                onChange={(e) => setFolderName(e.target.value)}
                className="w-full border rounded px-3 py-2 mb-4"
                placeholder="Folder Name"
              />
              <div className="flex justify-between">
                <button onClick={handleAddFolder} className="bg-purple-900 text-white px-4 py-2 rounded hover:bg-purple-700">
                  Add
                </button>
                <button onClick={() => setShowFolderPrompt(false)} className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400">
                  Cancel
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;