import React, { useState } from "react";
import { X, Loader2, Download } from "lucide-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

const FILTERS = [
    { name: "Grayscale", value: "e_grayscale" },
    { name: "Sepia", value: "e_sepia" },
    { name: "Invert", value: "e_negate" },
    { name: "Blur", value: "e_blur:200" },
    { name: "Brightness", value: "e_brightness:50" },
    { name: "Contrast", value: "e_contrast:50" },
];

const AI_FEATURES = [
    { name: "Background Remove", value: "e_background_removal" },
    { name: "Generative Restore", value: "e_gen_restore" },
];

const ImageEditor = ({ imageUrl, onClose }) => {
    const [selectedFilter, setSelectedFilter] = useState("");
    const [loading, setLoading] = useState(false);
    const [editedUrl, setEditedUrl] = useState(imageUrl);
    const [mode, setMode] = useState("normal");

    const applyFilter = async (filter) => {
        setLoading(true);
        setSelectedFilter(filter);
        const [base, params] = imageUrl.split("/upload/");
        const editedImageUrl = `${base}/upload/${filter}/${params}`;

        try {
            const res = await axios.get(editedImageUrl);
            if (res.status === 200) {
                setEditedUrl(editedImageUrl);
            }
        } catch (error) {
            console.error("Failed to apply filter:", error);
        } finally {
            setLoading(false);
        }
    };

    const applyAIFeature = async (aiFeature) => {
        setLoading(true);
        const [base, params] = imageUrl.split("/upload/");
        const aiImageUrl = `${base}/upload/${aiFeature}/${params}`;

        let count = 0;
        const maxAttempts = 20;

        const ai_interval = setInterval(async () => {
            try {
                const res = await axios.get(aiImageUrl);
                if (res.status === 200) {
                    clearInterval(ai_interval);
                    setEditedUrl(aiImageUrl);
                    setLoading(false);
                    console.log("AI image loaded successfully.");
                }
            } catch (error) {
                if (error.response?.status === 403) {
                    console.log(`Attempt ${count + 1}: Received 403. Retrying...`);
                } else {
                    console.error("Unexpected error:", error);
                }
            }

            count++;

            if (count >= maxAttempts) {
                clearInterval(ai_interval);
                setLoading(false);
                console.log("Max retries reached. Could not load the image.");
            }
        }, 3000);
    };

    const downloadImage = async () => {
        try {
            const response = await axios.get(editedUrl, { responseType: "blob" });
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "edited-image.jpg");
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (error) {
            console.error("Failed to download image:", error);
        }
    };

    return (
        <AnimatePresence>
            <motion.div
                className="fixed inset-0 bg-black/90 z-[9999] flex flex-col justify-center items-center p-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-white bg-red-600 hover:bg-red-700 p-2 rounded-full shadow-md"
                >
                    <X size={24} />
                </button>

                {/* Mode Selector */}
                <div className="flex gap-4 mb-4">
                    <button
                        onClick={() => setMode("normal")}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold ${mode === "normal" ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-300"
                            }`}
                    >
                        Normal Editing
                    </button>
                    <button
                        onClick={() => setMode("ai")}
                        className={`px-4 py-2 rounded-lg text-sm font-semibold ${mode === "ai" ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-300"
                            }`}
                    >
                        AI Features
                    </button>
                </div>

                {/* Image Preview */}
                <div className="relative w-full max-w-4xl flex justify-center items-center mb-4">
                    {loading ? (
                        <Loader2 size={48} className="animate-spin text-white" />
                    ) : (
                        <img
                            src={editedUrl}
                            alt="Preview"
                            className="rounded-lg shadow-lg w-full max-h-[70vh] object-contain"
                        />
                    )}
                </div>

                {/* Filter or AI Feature Options */}
                {mode === "normal" ? (
                    <div className="w-full max-w-4xl bg-gray-800 rounded-lg shadow-lg">
                        <div className="flex justify-center items-center gap-4 p-4 flex-wrap">
                            {FILTERS.map((filter) => (
                                <button
                                    key={filter.value}
                                    onClick={() => applyFilter(filter.value)}
                                    className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${selectedFilter === filter.value
                                            ? "bg-purple-600 text-white"
                                            : "bg-gray-700 text-gray-300 hover:bg-purple-500"
                                        }`}
                                >
                                    {filter.name}
                                </button>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="w-full max-w-4xl bg-gray-800 rounded-lg shadow-lg">
                        <div className="flex justify-center items-center gap-4 p-4 flex-wrap">
                            {AI_FEATURES.map((feature) => (
                                <button
                                    key={feature.value}
                                    onClick={() => applyAIFeature(feature.value)}
                                    className="px-4 py-2 rounded-lg text-sm font-semibold bg-gray-700 text-gray-300 hover:bg-purple-500 transition-all"
                                >
                                    {feature.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Download Button */}
                <div className="mt-4">
                    <button
                        onClick={downloadImage}
                        className="bg-green-500 text-white px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-green-600 transition-all"
                    >
                        <Download size={20} />
                        Download
                    </button>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};

export default ImageEditor;
