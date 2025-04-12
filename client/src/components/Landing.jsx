import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  FaArrowRight, FaCloudUploadAlt, FaImage, FaSignInAlt, FaUserPlus, FaCrop,
  FaExchangeAlt, FaMagic, FaTwitter, FaGithub, FaHeart, FaPhotoVideo, FaPalette,
  FaRegSave, FaMobileAlt, FaPaintBrush, FaRobot, FaVectorSquare, FaRegLightbulb,
  FaTextHeight, FaBrain
} from 'react-icons/fa';
import Logo from './Logo';
import { useNavigate } from 'react-router';

const Landing = () => {
  const [email, setEmail] = useState('');
  const [audio, setAudio] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (typeof Audio !== 'undefined') {
      setAudio(new Audio('/sounds/camera.mp3'));
    }
  }, []);

  const flashAndSound = () => {
    if (audio) {
      audio.currentTime = 0;
      audio.play().catch((error) => console.log('Audio play failed:', error));
    }

    const flashDiv = document.createElement('div');
    flashDiv.className = 'fixed inset-0 bg-white opacity-100 z-[9999] transition-opacity duration-400 ease-out';
    document.body.appendChild(flashDiv);

    setTimeout(() => {
      flashDiv.style.opacity = '0';
    }, 150);

    setTimeout(() => {
      document.body.removeChild(flashDiv);
    }, 500);
  };

  const handleLogin = () => {
    flashAndSound();
    setTimeout(() => {
      navigate('/login');
    }, 150);

  }
  const handleSignup = () => {
    flashAndSound();
    setTimeout(() => {
      navigate('/signup');
    }, 150);

  }

  const features = [
    {
      icon: <FaCloudUploadAlt className="text-5xl text-purple-400 mx-auto" />,
      title: "Cloud Upload",
      description: "Seamlessly upload and access your images from anywhere with our secure cloud storage.",
      points: [
        { icon: <FaPhotoVideo />, text: "Drag & drop multiple files at once" },
        { icon: <FaMobileAlt />, text: "Access your images across all devices" },
        { icon: <FaRegSave />, text: "Automatic backup of your original files" }
      ],
      action: handleLogin
    },
    {
      icon: <FaImage className="text-5xl text-purple-400 mx-auto" />,
      title: "Basic Image Filters",
      description: "Apply professional-grade filters with a single click to transform your images instantly.",
      points: [
        { icon: <FaPalette />, text: "Dozens of one-click filter presets" },
        { icon: <FaPaintBrush />, text: "Adjust brightness, contrast, and saturation" },
        { icon: <FaRegSave />, text: "Create and save your custom filters" }
      ],
      action: handleLogin
    },
    {
      icon: <FaExchangeAlt className="text-5xl text-purple-400 mx-auto" />,
      title: "AI Background Replacement",
      description: "Intelligently replace backgrounds with AI-generated scenes or your custom images.",
      points: [
        { icon: <FaVectorSquare />, text: "Smart object detection for perfect cutouts" },
        { icon: <FaBrain />, text: "AI-powered background suggestions" },
        { icon: <FaMagic />, text: "Automatic lighting matching" }
      ],
      action: handleLogin
    },
    {
      icon: <FaMagic className="text-5xl text-purple-400 mx-auto" />,
      title: "AI Image Restoration",
      description: "Revive old or damaged photos with advanced neural network technology.",
      points: [
        { icon: <FaRegLightbulb />, text: "Automatic scratch and damage removal" },
        { icon: <FaPhotoVideo />, text: "Color restoration for vintage photos" },
        { icon: <FaCrop />, text: "4x resolution enhancement" }
      ],
      action: handleLogin
    },
    {
      icon: <FaRobot className="text-5xl text-purple-400 mx-auto" />,
      title: "Text-to-Image Generation",
      description: "Create stunning images from text descriptions using our state-of-the-art AI model.",
      points: [
        { icon: <FaTextHeight />, text: "Natural language understanding" },
        { icon: <FaPalette />, text: "Multiple art style options" },
        { icon: <FaVectorSquare />, text: "High-resolution 4K output" }
      ],
      action: handleLogin
    }
  ];

  const FeatureBlock = ({ feature, isEven }) => {
    const controls = useAnimation();
    const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });

    useEffect(() => {
      if (inView) controls.start('visible');
    }, [controls, inView]);

    const containerVariants = {
      hidden: {},
      visible: { transition: { staggerChildren: 0.2 } }
    };

    const itemVariants = {
      hidden: { x: isEven ? -50 : 50, opacity: 0 },
      visible: { x: 0, opacity: 1, transition: { duration: 0.7, ease: 'easeOut' } }
    };

    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={containerVariants}
        className="grid md:grid-cols-2 gap-12 items-center mb-24 px-4"
      >
        <motion.div
          className={`bg-[#1f1f30] p-6 rounded-xl shadow-2xl ${isEven ? 'md:order-2' : 'md:order-1'}`}
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
        >
          <div className="relative h-72 md:h-96 w-full bg-gradient-to-br from-purple-900/50 to-black/50 rounded-lg overflow-hidden border border-purple-500/30 flex items-center justify-center">
            <div className="text-center p-6 backdrop-blur-sm">
              {feature.icon}
              <p className="text-purple-200 mt-4 text-lg font-medium">{feature.title}</p>
            </div>
          </div>
        </motion.div>
        <motion.div className={`space-y-6 ${isEven ? 'md:order-1' : 'md:order-2'}`} variants={itemVariants}>
          <h3 className="text-3xl font-bold text-purple-200 bg-gradient-to-r from-purple-500/80 to-purple-300/80 bg-clip-text text-transparent">{feature.title}</h3>
          <p className="text-gray-300 text-lg leading-relaxed">{feature.description}</p>
          <ul className="space-y-4">
            {feature.points.map((point, i) => (
              <li key={i} className="flex items-start gap-3 bg-[#1a1a2e]/50 p-3 rounded-lg">
                <span className="text-purple-400 mt-1">{point.icon}</span>
                <span>{point.text}</span>
              </li>
            ))}
          </ul>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium shadow-lg flex items-center gap-2 mt-4 w-fit"
            onClick={feature.action}
          >
            Try Now <FaArrowRight />
          </motion.button>
        </motion.div>
      </motion.div>
    );
  };

  const heroControls = useAnimation();
  const [heroRef, heroInView] = useInView({ threshold: 0.1, triggerOnce: true });

  useEffect(() => {
    if (heroInView) heroControls.start('visible');
  }, [heroControls, heroInView]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-[#1a1a2e] to-[#2a2a40] text-white font-sans overflow-x-hidden">
      <div className="fixed inset-0 z-0 opacity-60 pointer-events-none">
        <spline-viewer url="https://prod.spline.design/TZKgDPemNJ7RI-bE/scene.splinecode" className="w-full h-full" loading="eager" />

        
      </div>

      <div className="fixed top-6 left-6 z-50">
        <Logo />
      </div>

      <div className="relative z-10 container mx-auto px-6 pt-32 pb-20">
        <motion.section className="mb-32 text-center" ref={heroRef} initial="hidden" animate={heroControls} variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.3 } } }}>
          <motion.h1 className="text-5xl md:text-7xl lg:text-8xl font-extrabold bg-gradient-to-r from-purple-500 to-violet-400 bg-clip-text text-transparent mb-6" variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.5 } } }}>
            ImagineAI
          </motion.h1>
          <motion.p className="text-xl md:text-2xl text-purple-200 mb-10 max-w-2xl mx-auto leading-relaxed" variants={{ hidden: { y: 20, opacity: 0 }, visible: { y: 0, opacity: 1, transition: { duration: 0.5 } } }}>
            Transform your images with AI-powered magic
          </motion.p>
          <motion.div className="flex flex-col sm:flex-row justify-center gap-4" variants={{ hidden: {}, visible: {} }}>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium shadow-lg flex items-center justify-center gap-2" onClick={handleSignup}>
              Try It Now <FaArrowRight />
            </motion.button>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white border border-purple-300/30 rounded-lg font-medium shadow-md flex items-center justify-center gap-2 hover:bg-white/20" onClick={handleLogin}>
              Login <FaSignInAlt />
            </motion.button>
          </motion.div>
        </motion.section>

        <motion.h2 className="text-3xl font-bold text-purple-300 mb-16 text-center" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.5 }}>
          ✨ Our Powerful Features
        </motion.h2>

        {features.map((feature, i) => (
          <FeatureBlock key={i} feature={feature} isEven={i % 2 === 0} />
        ))}

        <motion.section className="bg-[#1f1f30] p-10 rounded-xl shadow-xl max-w-4xl mx-auto border border-purple-500/20 backdrop-blur-sm" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} viewport={{ once: true, amount: 0.3 }}>
          <div className="text-center">
            <h2 className="text-3xl font-bold text-purple-300 mb-4">Ready to Create Magic?</h2>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto leading-relaxed">Join thousands of creators using ImagineAI to bring their visions to life.</p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-1 px-4 py-3 rounded-lg bg-[#2b2b42] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 border border-purple-500/20"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-all flex items-center justify-center gap-2" onClick={flashAndSound}>
                Get Started <FaUserPlus />
              </button>
            </div>
          </div>
        </motion.section>
      </div>

      <footer className="bg-[#1a1a2e] text-purple-300 text-sm text-center py-8 border-t border-purple-500/10 relative z-10">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 container mx-auto px-4">
          <p className="flex items-center gap-1">Made with <FaHeart className="text-red-500 animate-pulse" /> by ImagineAI Team</p>
          <div className="flex gap-4">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><FaTwitter className="text-lg" /></a>
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors"><FaGithub className="text-lg" /></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
