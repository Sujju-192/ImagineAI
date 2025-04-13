import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaSpinner, FaDownload, FaImage, FaTimes } from "react-icons/fa";
import { FiImage } from "react-icons/fi";
import { useSelector } from "react-redux";

const TextToImage = () => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImage, setGeneratedImage] = useState(null);
  const [error, setError] = useState(null);
  const userId = useSelector((state) => state.userId);
  const rootFolderId = useSelector((state) => state.rootFolderId);

  const handleGenerateImage = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    setIsGenerating(true);
    setError(null);
    
    try {
      // Using Stable Diffusion API for image generation
      const response = await fetch("https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_STABILITY_API_KEY}`,
        },
        body: JSON.stringify({
          text_prompts: [
            {
              text: prompt,
              weight: 1
            },
            {
              text: "blurry, bad quality, distorted, disfigured, bad anatomy, bad proportions",
              weight: -1
            }
          ],
          cfg_scale: 7,
          height: 1024,
          width: 1024,
          samples: 1,
          steps: 30,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      
      // The API returns base64 encoded images
      if (data.artifacts && data.artifacts.length > 0) {
        const imageUrl = `data:image/png;base64,${data.artifacts[0].base64}`;
        setGeneratedImage(imageUrl);
        
        // Save the image to the user's gallery
        await saveImageToGallery(imageUrl);
      } else {
        throw new Error("No image generated");
      }
    } catch (err) {
      console.error("Error generating image:", err);
      setError("Failed to generate image. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const saveImageToGallery = async (imageUrl) => {
    try {
      // Convert base64 to blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      
      // Create a file from the blob
      const file = new File([blob], `generated-${Date.now()}.png`, { type: 'image/png' });
      
      // Create FormData
      const formData = new FormData();
      formData.append("image", file);
      formData.append("userId", userId);
      formData.append("folderId", rootFolderId);
      
      // Upload to your API
      const uploadResponse = await fetch("/api/upload-image", {
        method: "POST",
        body: formData,
      });
      
      if (!uploadResponse.ok) {
        console.error("Failed to save image to gallery");
      }
    } catch (err) {
      console.error("Error saving image to gallery:", err);
    }
  };

  const handleDownload = () => {
    if (!generatedImage) return;
    
    // Create a link element
    const link = document.createElement('a');
    link.href = generatedImage;
    link.download = `generated-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-6 relative bg-gray-50 min-h-screen text-gray-800">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">
          <span className="text-purple-600">Text to Image</span> Generation
        </h1>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto">
        {/* Prompt Input */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Enter Your Prompt</h2>
          <div className="mb-4">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to generate..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent min-h-[120px]"
              disabled={isGenerating}
            />
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-600 rounded-lg">
              {error}
            </div>
          )}
          
          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGenerateImage}
              disabled={isGenerating || !prompt.trim()}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-white font-medium ${
                isGenerating || !prompt.trim()
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-purple-600 hover:bg-purple-700"
              }`}
            >
              {isGenerating ? (
                <>
                  <FaSpinner className="animate-spin" />
                  <span>Generating...</span>
                </>
              ) : (
                <>
                  <FiImage />
                  <span>Generate Image</span>
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* Generated Image Display */}
        {generatedImage && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl shadow-sm p-6 border border-gray-200"
          >
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-700">Generated Image</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleDownload}
                className="flex items-center space-x-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg"
              >
                <FaDownload />
                <span>Download</span>
              </motion.button>
            </div>
            
            <div className="flex justify-center">
              <img
                src={generatedImage}
                alt="Generated from text prompt"
                className="max-w-full rounded-lg shadow-md"
              />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default TextToImage; 