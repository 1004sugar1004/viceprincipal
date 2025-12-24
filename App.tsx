
import React, { useState, useRef, useEffect } from 'react';
import Snowfall from './components/Snowfall.tsx';
import Ornament from './components/Ornament.tsx';
import { ORNAMENT_CONFIGS, PRE_GENERATED_BLESSINGS } from './constants.tsx';
import { Blessing } from './types.ts';

const App: React.FC = () => {
  const [userName] = useState('홍성미 교감선생님');
  const [isStarted, setIsStarted] = useState(false);
  const [clickedIndices, setClickedIndices] = useState<Set<number>>(new Set());
  const [currentBlessing, setCurrentBlessing] = useState<Blessing | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showGallery, setShowGallery] = useState(false);
  const [galleryViewIdx, setGalleryViewIdx] = useState<number | null>(null);
  const [history, setHistory] = useState<Record<number, Blessing>>({});
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const letterCardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsMusicPlaying(true);
    const handlePause = () => setIsMusicPlaying(false);

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
    };
  }, []);

  const handleStart = () => {
    setIsStarted(true);
    if (audioRef.current) {
      audioRef.current.volume = 0.5;
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise.then(() => {
          setIsMusicPlaying(true);
        }).catch(e => {
          console.warn("Audio playback failed initially, will retry on interaction:", e);
          const retryOnInteraction = () => {
            audioRef.current?.play();
            window.removeEventListener('click', retryOnInteraction);
          };
          window.addEventListener('click', retryOnInteraction);
        });
      }
    }
  };

  const handleOrnamentClick = (index: number) => {
    if (isLoading) return;
    
    setIsLoading(true);
    setTimeout(() => {
      const blessing = PRE_GENERATED_BLESSINGS[index % PRE_GENERATED_BLESSINGS.length];
      setCurrentBlessing(blessing);
      setHistory(prev => ({ ...prev, [index]: blessing }));
      setClickedIndices(prev => new Set(prev).add(index));
      setIsLoading(false);
    }, 800);
  };

  const toggleMusic = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play().catch(console.error);
      } else {
        audioRef.current.pause();
      }
    }
  };

  const handleSaveImage = async () => {
    if (!letterCardRef.current || !(window as any).html2canvas) return;
    try {
      const canvas = await (window as any).html2canvas(letterCardRef.current, {
        scale: 2,
        backgroundColor: null,
        logging: false,
        useCORS: true
      });
      const image = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.href = image;
      link.download = `Letter_for_${userName}.png`;
      link.click();
    } catch (err) {
      console.error("Image saving failed:", err);
      alert("이미지 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div 
      className="relative h-screen w-screen bg-cover bg-center bg-no-repeat overflow-hidden transition-all duration-500"
      style={{
        backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(https://i.imgur.com/ccQbw2H.png)',
        fontFamily: "'Nanum Myeongjo', serif"
      }}
    >
      <Snowfall />
      <audio 
        ref={audioRef} 
        loop 
        src="https://ik.imagekit.io/foefnjeua/jazz-christmas-432315.mp3" 
        preload="auto"
        crossOrigin="anonymous"
      />

      {!isStarted && (
        <div className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-black/80 backdrop-blur-md">
          <div className="text-center p-10 max-w-lg animate-in fade-in zoom-in duration-1000">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 tracking-[0.2em] drop-shadow-lg">
              2026, 지혜의 시작
            </h1>
            <p className="text-white/80 text-lg mb-12 leading-relaxed italic">
              "가을의 인연이 지혜의 숲이 되어<br/>선생님의 새해를 축복합니다."
            </p>
            <button 
              onClick={handleStart}
              className="px-12 py-4 bg-white/10 border border-white/30 text-white text-xl tracking-widest hover:bg-white/20 transition-all active:scale-95 shadow-2xl rounded-sm"
            >
              축복의 문 열기
            </button>
            <p className="mt-8 text-white/40 text-sm italic">음악과 함께 감상하시길 권장합니다</p>
          </div>
        </div>
      )}

      {isStarted && (
        <div className="absolute top-6 right-6 z-50 flex gap-4">
          <button 
            onClick={toggleMusic}
            className={`w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 flex items-center justify-center text-white transition-transform hover:scale-110 ${isMusicPlaying ? 'animate-pulse' : ''}`}
          >
            {isMusicPlaying ? '🔊' : '🔇'}
          </button>
        </div>
      )}

      {isStarted && clickedIndices.size > 0 && (
        <button 
          onClick={() => { setShowGallery(true); setGalleryViewIdx(null); }}
          className="absolute bottom-10 right-10 z-[60] bg-white/20 backdrop-blur-xl border border-white/40 text-white px-6 py-3 rounded-full shadow-2xl hover:bg-white/30 transition-all flex items-center gap-3 active:scale-95"
        >
          💌 지혜의 서재 열기
        </button>
      )}

      <div 
        className={`relative z-10 flex flex-col items-center justify-center h-full px-4 transition-all duration-700 ${!isStarted || showGallery || currentBlessing ? 'blur-xl scale-95 opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <div className="text-center mb-4 z-40">
          <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] mb-3 tracking-widest">
            2026, 새로운 시작
          </h1>
          <p className="text-white/90 text-sm md:text-base drop-shadow-md tracking-wider">
            오너먼트를 눌러 {userName}께 드리는 지혜와 축복을 확인하세요
          </p>
        </div>

        <div className="relative h-[70vh] aspect-[0.7] flex items-center justify-center">
          {ORNAMENT_CONFIGS.map((config, idx) => (
            <Ornament 
              key={idx}
              index={idx}
              config={config}
              isClicked={clickedIndices.has(idx)}
              onClick={() => handleOrnamentClick(idx)}
            />
          ))}
          
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} className="absolute w-1 h-1 bg-white rounded-full opacity-60 animate-pulse shadow-[0_0_8px_white]"
              style={{
                top: `${15 + Math.random() * 65}%`,
                left: `${30 + Math.random() * 40}%`,
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      {currentBlessing && (
        <div 
          onClick={() => setCurrentBlessing(null)}
          className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/85 backdrop-blur-sm"
        >
          <div 
            onClick={e => e.stopPropagation()}
            className="relative bg-[#fffcf5] w-full max-w-md rounded-sm shadow-2xl p-10 md:p-14 text-slate-800 border border-[#dcdcdc] animate-slide-in"
          >
            <div className="text-center mb-8">
              <div className="text-4xl mb-4 text-[#b8860b]">{currentBlessing.emoji}</div>
              <h2 className="text-xl md:text-2xl font-bold border-b border-[#eee] pb-4 mb-2 tracking-widest">
                To. {userName}
              </h2>
            </div>
            
            <div className="mb-10 min-h-[120px] flex items-center">
              <p className="text-lg md:text-xl leading-[2.2] text-left whitespace-pre-line break-keep font-medium text-slate-700 w-full italic">
                "{currentBlessing.content}"
              </p>
            </div>
            
            <button 
              onClick={() => setCurrentBlessing(null)}
              className="w-full py-4 bg-[#1a1a1a] text-white font-medium hover:opacity-90 transition-opacity tracking-widest"
            >
              마음에 깊이 새기겠습니다 🙏
            </button>
          </div>
        </div>
      )}

      {showGallery && (
        <div className="fixed inset-0 z-[150] bg-black/95 flex items-center justify-center p-6">
          {galleryViewIdx === null ? (
            <div className="bg-white p-8 md:p-12 rounded-sm w-full max-w-3xl max-h-[85vh] overflow-y-auto flex flex-col items-center">
              <h2 className="text-2xl font-bold text-slate-900 mb-8 border-b-2 border-slate-900 pb-2 tracking-[0.2em]">
                {userName}의 서재
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 w-full">
                {Array.from(clickedIndices).map(idx => (
                  <div 
                    key={idx} 
                    onClick={() => setGalleryViewIdx(idx)}
                    className="bg-slate-50 p-6 flex flex-col items-center justify-center cursor-pointer border border-slate-200 hover:bg-slate-100 transition-all group"
                  >
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📜</div>
                    <span className="text-xs text-slate-500 font-bold">{idx + 1}번째 지혜</span>
                  </div>
                ))}
              </div>
              <button 
                onClick={() => setShowGallery(false)}
                className="mt-12 px-10 py-3 border border-slate-300 text-slate-600 hover:bg-slate-50 transition-all tracking-widest"
              >
                서재 나가기
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center w-full max-w-lg animate-in zoom-in duration-300">
              <div ref={letterCardRef} className="bg-[#fffcf5] p-10 md:p-16 w-full shadow-2xl relative border border-[#dcdcdc]">
                <div className="absolute top-6 right-6 text-2xl opacity-40">{history[galleryViewIdx]?.emoji}</div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 border-b-2 border-slate-900 pb-4 mb-10 text-center tracking-widest">
                  To. {userName}
                </h3>
                <div className="text-lg md:text-xl leading-[2.2] text-slate-800 text-justify whitespace-pre-line break-keep min-h-[140px] italic font-medium">
                  "{history[galleryViewIdx]?.content}"
                </div>
                <div className="mt-12 text-right text-slate-400 text-sm italic">
                  2026년 정월, {userName}을 존경하는 마음을 담아
                </div>
              </div>
              <div className="flex gap-4 mt-8 w-full">
                <button 
                  onClick={handleSaveImage}
                  className="flex-1 py-4 bg-white text-slate-900 font-bold border-2 border-white hover:bg-slate-100 transition-all tracking-widest"
                >
                  이미지로 저장 📸
                </button>
                <button 
                  onClick={() => setGalleryViewIdx(null)}
                  className="flex-1 py-4 border-2 border-white text-white font-bold hover:bg-white/10 transition-all tracking-widest"
                >
                  목록으로 돌아가기
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {isLoading && (
        <div className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
          <p className="text-lg text-white font-medium tracking-[0.3em] animate-pulse italic">지혜의 문장을 여는 중...</p>
        </div>
      )}
    </div>
  );
};

export default App;
