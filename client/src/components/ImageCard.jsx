import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import ImageEditor from "./ImageEditor";

const ImageCard = ({ imageUrl }) => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [disableHover, setDisableHover] = useState(false);
  const [edit, setEdit] = useState(false);

  const toggleFullScreen = () => {
    if (isFullScreen) {
      setDisableHover(true);
      setTimeout(() => setDisableHover(false), 300); 
    }
    setIsFullScreen((prev) => !prev);
  };

  const toggleEdit = () => {
    setEdit((prev) => !prev);
  };

  const closeEditor = () => {
    setEdit(false);
  };

  return (
    <>
      {/* Main Image Card */}
      <div
        className={`relative w-full max-w-sm bg-white rounded-2xl shadow-lg overflow-hidden transition-transform ${
          !isFullScreen && !disableHover && "hover:scale-105 hover:shadow-2xl"
        }`}
      >
        {/* Image */}
        <motion.img
          src={imageUrl}
          alt="Display"
          className="w-full h-60 object-cover"
          whileHover={!isFullScreen && !disableHover ? { scale: 1.05 } : {}}
          transition={{ duration: 0.3 }}
        />

        {/* Overlay Buttons */}
        {!isFullScreen && (
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70 opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
            <button
              onClick={toggleFullScreen}
              className="bg-purple-600 text-white px-5 py-2 rounded-full shadow-md hover:bg-purple-700 transition-all"
            >
              View
            </button>

            <button
              onClick={toggleEdit}
              className="bg-purple-600 text-white px-5 py-2 rounded-full shadow-md hover:bg-purple-700 transition-all"
            >
              Edit
            </button>
          </div>
        )}
      </div>

      {/* Full-Screen Modal */}
      <AnimatePresence>
        {isFullScreen && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.img
              src={imageUrl}
              alt="Full Screen"
              className="max-w-[90vw] max-h-[90vh] rounded-lg shadow-2xl"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              transition={{ duration: 0.4 }}
            />

            {/* Close Button */}
            <button
              onClick={toggleFullScreen}
              className="absolute top-5 right-5 text-white bg-red-600 hover:bg-red-700 p-2 rounded-full shadow-md"
            >
              <X size={24} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Image Editor Popup (Rendered outside to prevent trapping) */}
      {edit && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80">
          <ImageEditor imageUrl={imageUrl} onClose={closeEditor} />
        </div>
      )}
    </>
  );
};

export default ImageCard;
