/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useCallback, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, User, HeartHandshake, Languages, Share2, CheckCircle2, MessageCircle, Copy, ExternalLink, RefreshCw, Mail, Phone } from 'lucide-react';

type Language = 'en' | 'hi' | 'mr' | 'te';

const TRANSLATIONS = {
  en: {
    setupTitle: "Love Proposal Setup",
    setupSub: "Make it special for your crush!",
    yourName: "Your Name",
    crushName: "Her/His Name",
    placeholderYour: "Enter your name",
    placeholderCrush: "Enter your crush's name",
    createBtn: "Create Proposal ✨",
    from: "from",
    yes: "Yes",
    no: "No",
    madeWith: "Made with ❤️ for you",
    stages: (name: string) => [
      { text: `Do you love me ${name}? 🥺`, image: "https://media.giphy.com/media/cLS1cfxvGOPVpf9g3y/giphy.gif" },
      { text: "Please think again! 🤨", image: "https://media.giphy.com/media/3o7TKVUn7iM8FMEU24/giphy.gif" },
      { text: "Think one more time! 😫", image: "https://media.giphy.com/media/26BRv0ThflsHCq+JA/giphy.gif" },
      { text: "Beautiful please say yes! How much code will you make me write 😭", image: "https://media.giphy.com/media/l41lTfuxV7l0P3Q76/giphy.gif" }
    ],
    success: (name: string) => `I knew it! You Love me a lot ${name} 🥰`
  },
  hi: {
    setupTitle: "Love Proposal Setup",
    setupSub: "Make it special for your crush!",
    yourName: "Your Name",
    crushName: "Her/His Name",
    placeholderYour: "Enter your name",
    placeholderCrush: "Enter your crush's name",
    createBtn: "Create Proposal ✨",
    from: "from",
    yes: "Yes",
    no: "No",
    madeWith: "Made with ❤️ for you",
    stages: (name: string) => [
      { text: `Do you love me ${name}? 🥺`, image: "https://media.giphy.com/media/cLS1cfxvGOPVpf9g3y/giphy.gif" },
      { text: "Please think again! 🤨", image: "https://media.giphy.com/media/3o7TKVUn7iM8FMEU24/giphy.gif" },
      { text: "Ek aur baar soch lo! 😫", image: "https://media.giphy.com/media/26BRv0ThflsHCqfJA/giphy.gif" },
      { text: "Beautiful pls Man jao na! Kitna code likh waogi 😭", image: "https://media.giphy.com/media/l41lTfuxV7l0P3Q76/giphy.gif" }
    ],
    success: (name: string) => `I knew it! You Love me a lot ${name} 🥰`
  },
  mr: {
    setupTitle: "Love Proposal Setup",
    setupSub: "Make it special for your crush!",
    yourName: "Your Name",
    crushName: "Her/His Name",
    placeholderYour: "Enter your name",
    placeholderCrush: "Enter your crush's name",
    createBtn: "Create Proposal ✨",
    from: "from",
    yes: "Yes",
    no: "No",
    madeWith: "Made with ❤️ for you",
    stages: (name: string) => [
      { text: `Do you love me ${name}? 🥺`, image: "https://media.giphy.com/media/cLS1cfxvGOPVpf9g3y/giphy.gif" },
      { text: "Please think again! 🤨", image: "https://media.giphy.com/media/3o7TKVUn7iM8FMEU24/giphy.gif" },
      { text: "Aankhi ekda vichar kar! 😫", image: "https://media.giphy.com/media/26BRv0ThflsHCqfJA/giphy.gif" },
      { text: "Beautiful pls Manya kar na! Kitna code lihila lavnar 😭", image: "https://media.giphy.com/media/l41lTfuxV7l0P3Q76/giphy.gif" }
    ],
    success: (name: string) => `I knew it! You Love me a lot ${name} 🥰`
  },
  te: {
    setupTitle: "Love Proposal Setup",
    setupSub: "Make it special for your crush!",
    yourName: "Your Name",
    crushName: "Her/His Name",
    placeholderYour: "Enter your name",
    placeholderCrush: "Enter your crush's name",
    createBtn: "Create Proposal ✨",
    from: "from",
    yes: "Yes",
    no: "No",
    madeWith: "Made with ❤️ for you",
    stages: (name: string) => [
      { text: `Do you love me ${name}? 🥺`, image: "https://media.giphy.com/media/cLS1cfxvGOPVpf9g3y/giphy.gif" },
      { text: "Please think again! 🤨", image: "https://media.giphy.com/media/3o7TKVUn7iM8FMEU24/giphy.gif" },
      { text: "Inkokasari alochinchu! 😫", image: "https://media.giphy.com/media/26BRv0ThflsHCqfJA/giphy.gif" },
      { text: "Beautiful pls Oppuko na! Inka entha code rayisthavu 😭", image: "https://media.giphy.com/media/l41lTfuxV7l0P3Q76/giphy.gif" }
    ],
    success: (name: string) => `I knew it! You Love me a lot ${name} 🥰`
  }
};

const SUCCESS_IMAGE = "https://media.giphy.com/media/l0HlIDU8qnwEBvTcA/giphy.gif";

export default function App() {
  const [isSetup, setIsSetup] = useState(true);
  const [lang, setLang] = useState<Language>('en');
  const [userName, setUserName] = useState('');
  const [crushName, setCrushName] = useState('');
  const [userPhone, setUserPhone] = useState('');
  
  const [noCount, setNoCount] = useState(0);
  const [isYesClicked, setIsYesClicked] = useState(false);
  const [noButtonPos, setNoButtonPos] = useState({ x: 0, y: 0 });
  const [isMoving, setIsMoving] = useState(false);
  const [showCopyFeedback, setShowCopyFeedback] = useState(false);
  const [isLinkCreated, setIsLinkCreated] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const noButtonRef = useRef<HTMLButtonElement>(null);

  const t = TRANSLATIONS[lang];
  const stages = t.stages(crushName || 'Beautiful');
  const currentStage = stages[Math.min(noCount, stages.length - 1)];

  const moveNoButton = useCallback(() => {
    if (noCount >= stages.length - 1 && noButtonRef.current) {
      setIsMoving(true);
      
      const btnRect = noButtonRef.current.getBoundingClientRect();
      const btnWidth = btnRect.width;
      const btnHeight = btnRect.height;
      
      const padding = 20;
      const maxX = window.innerWidth - btnWidth - padding;
      const maxY = window.innerHeight - btnHeight - padding;
      
      const newAbsX = Math.max(padding, Math.random() * maxX);
      const newAbsY = Math.max(padding, Math.random() * maxY);
      
      const container = noButtonRef.current.parentElement;
      if (container) {
        const containerRect = container.getBoundingClientRect();
        const naturalX = containerRect.left + (containerRect.width / 2);
        const naturalY = containerRect.top + (containerRect.height / 2);
        
        setNoButtonPos({
          x: newAbsX - naturalX,
          y: newAbsY - naturalY
        });
      }
    }
  }, [noCount, stages.length]);

  const handleNoClick = () => {
    if (noCount < stages.length - 1) {
      setNoCount(prev => prev + 1);
    } else {
      moveNoButton();
    }
  };

  const handleYesClick = () => {
    setIsYesClicked(true);
  };

  const handleStart = (e: FormEvent) => {
    e.preventDefault();
    if (userName.trim() && crushName.trim() && userPhone.trim()) {
      generateLink();
      setIsLinkCreated(true);
    }
  };

  const generateLink = () => {
    const origin = window.location.origin;
    const path = window.location.pathname.endsWith('/') 
      ? window.location.pathname 
      : window.location.pathname + '/';
    
    const baseUrl = origin + path;
    const params = new URLSearchParams({
      u: userName,
      c: crushName,
      l: lang,
      w: userPhone
    });
    const shareUrl = `${baseUrl}?${params.toString()}`;
    setGeneratedLink(shareUrl);
    return shareUrl;
  };

  const handleCopyLink = () => {
    const link = generatedLink || generateLink();
    navigator.clipboard.writeText(link).then(() => {
      setShowCopyFeedback(true);
      setTimeout(() => setShowCopyFeedback(false), 3000);
    });
  };

  const handleWhatsAppShare = () => {
    const link = generatedLink || generateLink();
    const text = `Hey! I made something special for you. Check it out: ${link}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const u = params.get('u');
    const c = params.get('c');
    const l = params.get('l');
    const w = params.get('w');

    if (u && c) {
      setUserName(u);
      setCrushName(c);
      if (w) setUserPhone(w);
      if (l && Object.keys(TRANSLATIONS).includes(l)) {
        setLang(l as Language);
      }
      setIsSetup(false);
      setIsLinkCreated(false);
    }
  }, []);

  const handleWhatsAppResult = () => {
    if (!userPhone) return;
    const message = `Hey ${userName}! I just saw your special proposal and I said YES! ❤️ (It took me ${noCount} tries to decide 😉)`;
    window.open(`https://wa.me/${userPhone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`, '_blank');
  };

  useEffect(() => {
    const handleResize = () => {
      if (isMoving) {
        setNoButtonPos({ x: 0, y: 0 });
        setIsMoving(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMoving]);

  if (isSetup) {
    return (
      <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center p-4 font-sans select-none">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md space-y-6 border-4 border-pink-200"
        >
          {!isLinkCreated ? (
            <>
              <div className="text-center space-y-2">
                <HeartHandshake className="mx-auto text-pink-500 w-12 h-12" />
                <h1 className="text-3xl font-bold text-pink-600">{t.setupTitle}</h1>
                <p className="text-pink-400">{t.setupSub}</p>
              </div>

              <form onSubmit={handleStart} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-pink-600 flex items-center gap-2">
                    <Languages size={16} /> Language
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { id: 'en', label: 'English' },
                      { id: 'hi', label: 'हिन्दी' },
                      { id: 'mr', label: 'मराठी' },
                      { id: 'te', label: 'తెలుగు' }
                    ].map((l) => (
                      <button
                        key={l.id}
                        type="button"
                        onClick={() => setLang(l.id as Language)}
                        className={`px-4 py-2 rounded-xl border-2 transition-all ${
                          lang === l.id 
                            ? 'border-pink-500 bg-pink-50 text-pink-600' 
                            : 'border-pink-100 text-pink-300 hover:border-pink-200'
                        }`}
                      >
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-pink-600 flex items-center gap-2">
                    <User size={16} /> {t.yourName}
                  </label>
                  <input
                    type="text"
                    required
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    placeholder={t.placeholderYour}
                    className="w-full px-4 py-3 rounded-xl border-2 border-pink-100 focus:border-pink-400 outline-none transition-colors text-pink-700 placeholder:text-pink-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-pink-600 flex items-center gap-2">
                    <Heart size={16} /> {t.crushName}
                  </label>
                  <input
                    type="text"
                    required
                    value={crushName}
                    onChange={(e) => setCrushName(e.target.value)}
                    placeholder={t.placeholderCrush}
                    className="w-full px-4 py-3 rounded-xl border-2 border-pink-100 focus:border-pink-400 outline-none transition-colors text-pink-700 placeholder:text-pink-200"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-pink-600 flex items-center gap-2">
                    <Phone size={16} /> Your WhatsApp Number (including country code)
                  </label>
                  <input
                    type="tel"
                    required
                    value={userPhone}
                    onChange={(e) => setUserPhone(e.target.value)}
                    placeholder="e.g., 919876543210 (without +)"
                    className="w-full px-4 py-3 rounded-xl border-2 border-pink-100 focus:border-pink-400 outline-none transition-colors text-pink-700 placeholder:text-pink-200"
                  />
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-pink-200 transition-colors text-lg flex items-center justify-center gap-2"
                >
                  <Share2 size={20} />
                  {t.createBtn}
                </motion.button>
              </form>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-6 py-4"
            >
              <div className="bg-pink-50 p-4 rounded-full w-20 h-20 mx-auto flex items-center justify-center">
                <CheckCircle2 className="text-pink-500 w-10 h-10" />
              </div>
              
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-pink-600">Proposal Ready! 💖</h2>
                <p className="text-pink-400">Share this link with {crushName || 'your crush'} to see their reaction!</p>
              </div>

              <div className="relative group">
                <input
                  type="text"
                  readOnly
                  value={generatedLink}
                  className="w-full bg-pink-50 px-4 py-3 rounded-xl border-2 border-pink-100 text-pink-600 text-sm focus:outline-none"
                />
                <button
                  onClick={handleCopyLink}
                  className="absolute right-2 top-1.5 p-1.5 text-pink-400 hover:text-pink-600 transition-colors bg-white rounded-lg shadow-sm"
                  title="Copy Link"
                >
                  <Copy size={20} />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <button
                  onClick={handleWhatsAppShare}
                  className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 rounded-xl shadow-lg transition-colors flex items-center justify-center gap-2"
                >
                  <MessageCircle size={20} />
                  Share on WhatsApp
                </button>
                
                <button
                  onClick={() => setIsSetup(false)}
                  className="w-full bg-white border-2 border-pink-200 text-pink-500 font-bold py-3 rounded-xl hover:bg-pink-50 transition-colors flex items-center justify-center gap-2"
                >
                  <ExternalLink size={20} />
                  Preview Proposal
                </button>
                
                <button
                  onClick={() => {
                    setIsLinkCreated(false);
                    setGeneratedLink('');
                  }}
                  className="w-full text-pink-300 hover:text-pink-500 text-sm font-medium pt-2 flex items-center justify-center gap-1"
                >
                  <RefreshCw size={14} />
                  Edit Details
                </button>
              </div>

              <AnimatePresence>
                {showCopyFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="text-green-600 text-sm font-semibold flex items-center justify-center gap-1"
                  >
                    <CheckCircle2 size={16} /> Link copied!
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pink-50 flex flex-col items-center justify-center p-4 overflow-hidden font-sans select-none">
      <AnimatePresence mode="wait">
        {!isYesClicked ? (
          <motion.div
            key="question"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex flex-col items-center text-center space-y-6 max-w-md w-full"
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-pink-400 font-medium text-lg italic"
            >
              {t.from} {userName}
            </motion.div>

            <motion.div
              key={noCount}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-64 h-64 relative rounded-2xl overflow-hidden shadow-xl bg-white p-2"
            >
              <img
                src={currentStage.image}
                alt="Cute reaction"
                className="w-full h-full object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            <h1 className="text-3xl md:text-4xl font-bold text-pink-600 px-4 leading-tight">
              {currentStage.text}
            </h1>

            <div className="flex items-center justify-center gap-6 w-full relative h-20">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleYesClick}
                className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-full text-xl font-semibold shadow-lg transition-colors cursor-pointer z-10"
              >
                {t.yes}
              </motion.button>

              <motion.button
                ref={noButtonRef}
                animate={isMoving ? { x: noButtonPos.x, y: noButtonPos.y } : { x: 0, y: 0 }}
                onMouseEnter={moveNoButton}
                onTouchStart={moveNoButton}
                onClick={handleNoClick}
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full text-xl font-semibold shadow-lg transition-colors cursor-pointer"
              >
                {t.no}
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center space-y-8 max-w-md w-full"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-72 h-72 relative rounded-2xl overflow-hidden shadow-2xl bg-white p-2"
            >
              <img
                src={SUCCESS_IMAGE}
                alt="Celebration"
                className="w-full h-full object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="space-y-4"
            >
              <h1 className="text-4xl font-bold text-pink-600 flex items-center justify-center gap-2">
                {t.success(crushName)}
              </h1>
              
              {userPhone && (
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  onClick={handleWhatsAppResult}
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-4 rounded-2xl font-bold shadow-lg transition-colors flex items-center gap-2 text-lg mt-4 cursor-pointer"
                >
                  <MessageCircle size={24} />
                  Tell {userName} on WhatsApp! 💖
                </motion.button>
              )}

              <div className="flex justify-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      scale: [1, 1.2, 1],
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      delay: i * 0.1,
                    }}
                  >
                    <Heart className="text-red-500 fill-red-500" size={32} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="fixed bottom-4 text-pink-300 text-sm font-medium">
        {t.madeWith}
      </footer>
    </div>
  );
}


