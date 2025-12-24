import React, { useState, useRef, useEffect } from 'react';
import { createRoot } from 'react-dom/client';

// --- Types ---
interface Blessing {
  id: number;
  title: string;
  content: string;
  emoji: string;
  theme: string;
}

interface OrnamentConfig {
  top: string;
  left: string;
  color: string;
  glow: string;
}

// --- Constants ---
const ORNAMENT_CONFIGS: OrnamentConfig[] = [
  { top: '16%', left: '50%', color: 'rgba(255, 215, 0, 0.4)', glow: '#FFD700' },
  { top: '24%', left: '42%', color: 'rgba(224, 255, 255, 0.4)', glow: '#E0FFFF' },
  { top: '26%', left: '58%', color: 'rgba(255, 105, 180, 0.4)', glow: '#FF69B4' },
  { top: '34%', left: '35%', color: 'rgba(127, 255, 212, 0.4)', glow: '#7FFFD4' },
  { top: '36%', left: '65%', color: 'rgba(255, 165, 0, 0.4)', glow: '#FFA500' },
  { top: '40%', left: '50%', color: 'rgba(221, 160, 221, 0.4)', glow: '#DDA0DD' },
  { top: '48%', left: '28%', color: 'rgba(135, 206, 235, 0.4)', glow: '#87CEEB' },
  { top: '50%', left: '72%', color: 'rgba(240, 128, 128, 0.4)', glow: '#F08080' },
  { top: '54%', left: '40%', color: 'rgba(152, 251, 152, 0.4)', glow: '#98FB98' },
  { top: '56%', left: '60%', color: 'rgba(216, 191, 216, 0.4)', glow: '#D8BFD8' },
  { top: '64%', left: '32%', color: 'rgba(255, 218, 185, 0.4)', glow: '#FFDAB9' },
  { top: '66%', left: '68%', color: 'rgba(240, 230, 140, 0.4)', glow: '#F0E68C' }
];

const GIFT_BOX_COLORS = ['#e74c3c', '#2ecc71', '#f1c40f', '#e67e22', '#3498db', '#9b59b6', '#ff7979', '#1abc9c'];

const PRE_GENERATED_BLESSINGS: Blessing[] = [
  { id: 1, title: '따스한 빛', emoji: '🍂', theme: '빛', content: '증평초의 가을 바람과 함께 오신 교감선생님의 따스한 시선에 감사드립니다.\n타인의 작은 수고를 먼저 알아주시고 다독여 주시는 그 너른 마음 덕분에, 2026년 우리 학교는 더욱 포근한 안식처가 될 것입니다.' },
  { id: 2, title: '인정 어린 마음', emoji: '✨', theme: '인정', content: '부족함을 솔직하게 인정하고 먼저 손 내미시는 교감선생님의 대인배다운 면모는 저희에게 큰 감동이었습니다.\n그 진정성 있는 모습이 2026년에는 더 큰 존경과 사랑의 열매로 되돌아오기를 응원합니다.' },
  { id: 3, title: '유연한 지혜', emoji: '🌳', theme: '지혜', content: '중심을 지키면서도 상대의 목소리를 경청해 주시는 유연한 리더십이야말로 우리가 닮고 싶은 모습입니다.\n교감으로서 내딛으신 이 귀한 발걸음이 2026년에는 눈부신 성취와 보람으로 가득하길 축복합니다.' },
  { id: 4, title: '동행의 향기', emoji: '🌸', theme: '향기', content: '가을에 오셔서 쉼 없이 주변을 챙기시는 선생님의 고운 향기가 학교 곳곳에 스며들었습니다.\n새해에는 무거운 책임감은 잠시 내려놓고, 선생님의 창가에도 따스한 햇살과 평안만이 머물기를 소망합니다.' },
  { id: 5, title: '겸손의 울림', emoji: '🕯️', theme: '겸손', content: '스스로를 낮추어 타인을 빛나게 해주시는 교감선생님의 따뜻한 배려에 깊이 감사드립니다.\n2026년 한 해도 선생님께서 보여주시는 그 겸손의 지혜를 따라 우리가 함께 행복하게 성장하기를 꿈꿔봅니다.' },
  { id: 6, title: '소중한 인연', emoji: '🌾', theme: '인연', content: '증평초의 가을 하늘 아래서 시작된 선생님과의 만남은 우리에게 더할 나위 없는 축복이었습니다.\n교감이라는 새로운 페이지마다 선생님의 진심만큼이나 아름다운 이야기들만 가득 채워지길 빕니다.' },
  { id: 7, title: '따스한 공감', emoji: '☀️', theme: '공감', content: '누군가의 어려움을 자신의 일처럼 공감해 주시던 선생님의 눈빛에서 참된 교육자의 온기를 보았습니다.\n새해에는 선생님의 미소가 우리 모두의 마음을 녹이는 기적 같은 한 해가 되기를 축복합니다.' },
  { id: 8, title: '평안의 선물', emoji: '🎁', theme: '평안', content: '낯선 환경에서도 묵묵히 자리를 지키며 타인의 수고를 격려해 주신 교감선생님, 정말 고생 많으셨습니다.\n2026년에는 선생님의 삶에 화창한 날씨처럼, 맑고 투명한 행복들만 가득하시길 간절히 기도합니다.' },
  { id: 9, title: '신뢰의 중심', emoji: '🍃', theme: '신뢰', content: '선생님만의 단단하면서도 부드러운 리더십은 우리 학교를 지탱하는 가장 든든한 신뢰의 뿌리가 되었습니다.\n교감으로서의 새 인생, 그 찬란한 시작이 선생님께 최고의 자부심과 기쁨이 되는 2026년이 되시길 응원합니다.' },
  { id: 10, title: '솔직한 용기', emoji: '🔥', theme: '용기', content: '자신의 생각을 분명히 전하면서도 타인의 의견을 인정하는 그 솔직한 용기에 깊은 존경을 표합니다.\n그 고결한 성품이 2026년 증평초의 가장 큰 밑거름이 되어, 모두가 웃음 짓는 결실을 맺을 것입니다.' },
  { id: 11, title: '안식과 평화', emoji: '🎍', theme: '평화', content: '가을 부임 이후 쉼 없이 달려오신 선생님, 이제는 선생님 자신의 행복에도 귀 기울이는 시간이 되셨으면 좋겠습니다.\n2026년에는 깊고 푸른 바다 같은 평온 속에서 진정한 자아를 마주하는 소중한 나날들이 가득하시길 바랍니다.' },
  { id: 12, title: '희망찬 시작', emoji: '🌊', theme: '희망', content: '강물처럼 유연하게 흐르지만 목적지를 잃지 않는 선생님과 함께라면 그 어떤 길도 희망찰 것입니다.\n교감선생님의 새로운 출발을 온 마음 다해 축하드리며, 2026년의 눈부신 아침을 기쁨으로 함께 맞이하겠습니다.' }
];

// --- Sub Components ---
const Snowfall: React.FC = () => {
  const snowflakes = Array.from({ length: 40 }).map((_, i) => ({
    id: i,
    left: Math.random() * 100,
    size: Math.random() * 8 + 5,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
    opacity: Math.random() * 0.4 + 0.3,
  }));
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {snowflakes.map((s) => (
        <div key={s.id} className="snowflake"
          style={{
            left: `${s.left}%`, fontSize: `${s.size}px`,
            animationDuration: `${s.duration}s`, animationDelay: `${s.delay}s`,
            opacity: s.opacity,
          }}>❄</div>
      ))}
    </div>
  );
};

const GiftBox: React.FC<{ color: string }> = ({ color }) => (
  <div className="relative w-1/2 h-[45%] flex flex-col items-center justify-end drop-shadow-lg scale-75 md:scale-90 pointer-events-none">
    <div className="absolute top-[10%] w-[110%] h-[25%] rounded-[2px] z-[3] shadow-md" style={{ background: `linear-gradient(to right, ${color}, white 50%, ${color})` }} />
    <div className="absolute top-[-15%] w-[40%] h-[25%] flex justify-center z-[4]">
      <div className="w-1/2 h-full bg-[#ffeb3b] rounded-l-full -rotate-12" />
      <div className="w-1/2 h-full bg-[#ffeb3b] rounded-r-full rotate-12" />
    </div>
    <div className="w-full h-[75%] rounded-b-[2px] relative shadow-inner" style={{ background: color }}>
      <div className="absolute left-1/2 top-0 -translate-x-1/2 w-1/5 h-full bg-[#ffeb3b]" />
    </div>
  </div>
);

// --- Main App Component ---
const App: React.FC = () => {
  const [userName] = useState('홍성미 교감선생님');
  const [clickedIndices, setClickedIndices] = useState<Set<number>>(new Set());
  const [currentBlessing, setCurrentBlessing] = useState<Blessing | null>(null);
  const [showGallery, setShowGallery] = useState(false);
  const [galleryViewIdx, setGalleryViewIdx] = useState<number | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const letterCardRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleFirstInteraction = () => {
      if (audioRef.current && audioRef.current.paused) {
        audioRef.current.play().then(() => {
          setIsMusicPlaying(true);
        }).catch(() => {});
      }
      window.removeEventListener('click', handleFirstInteraction);
    };
    window.addEventListener('click', handleFirstInteraction);
    return () => window.removeEventListener('click', handleFirstInteraction);
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        audioRef.current.play().then(() => setIsMusicPlaying(true)).catch(console.error);
      } else {
        audioRef.current.pause();
        setIsMusicPlaying(false);
      }
    }
  };

  const handleSaveImage = async () => {
    if (!letterCardRef.current || !(window as any).html2canvas) return;
    try {
      const canvas = await (window as any).html2canvas(letterCardRef.current, { scale: 2, backgroundColor: null, useCORS: true });
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `Letter_for_${userName}.png`;
      link.click();
    } catch (err) {
      alert("이미지 저장 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="relative h-screen w-screen bg-cover bg-center bg-no-repeat overflow-hidden"
      style={{ backgroundImage: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(https://i.imgur.com/ccQbw2H.png)' }}>
      <Snowfall />
      <audio ref={audioRef} loop src="https://ik.imagekit.io/foefnjeua/jazz-christmas-432315.mp3" preload="auto" crossOrigin="anonymous" />

      {/* Music Toggle */}
      <button onClick={toggleMusic} className="absolute top-6 right-6 z-50 w-10 h-10 rounded-full bg-black/40 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-transform hover:scale-110 active:scale-95">
        {isMusicPlaying ? '🔊' : '🔇'}
      </button>

      {/* Gallery Button */}
      {clickedIndices.size > 0 && (
        <button onClick={() => { setShowGallery(true); setGalleryViewIdx(null); }}
          className="absolute bottom-10 right-10 z-[60] bg-white/20 backdrop-blur-xl border border-white/40 text-white px-6 py-3 rounded-full shadow-2xl animate-slide-in hover:bg-white/30 transition-all active:scale-95">
          💌 지혜의 서재
        </button>
      )}

      {/* Main UI */}
      <div className={`relative z-10 flex flex-col items-center justify-center h-full transition-all duration-700 ${showGallery || currentBlessing ? 'blur-xl scale-95 opacity-50' : 'opacity-100'}`}>
        <div className="text-center mb-8 px-4">
          <h1 className="text-3xl md:text-5xl font-bold text-white drop-shadow-2xl mb-3 tracking-widest">2026, 새로운 시작</h1>
          <p className="text-white/80 text-sm tracking-widest">오너먼트를 눌러 {userName}께 드리는 지혜를 확인하세요</p>
        </div>

        <div className="relative h-[65vh] aspect-[0.7] flex items-center justify-center">
          {ORNAMENT_CONFIGS.map((config, idx) => !clickedIndices.has(idx) && (
            <div key={idx} onClick={() => {
              setCurrentBlessing(PRE_GENERATED_BLESSINGS[idx]);
              setClickedIndices(new Set(clickedIndices).add(idx));
            }}
            className="absolute cursor-pointer z-30 transition-all hover:scale-125 group"
            style={{ top: config.top, left: config.left, animation: `swing 4s ease-in-out infinite ${idx * 0.3}s` }}>
              <div className="w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center shadow-lg transition-shadow group-hover:shadow-[0_0_25px_rgba(255,255,255,0.8)]"
                style={{ 
                  background: `radial-gradient(circle at 30% 30%, rgba(255,255,255,0.9) 0%, ${config.color} 40%, rgba(0,0,0,0.4) 100%)`, 
                  boxShadow: `0 0 15px ${config.glow}` 
                }}>
                <GiftBox color={GIFT_BOX_COLORS[idx % GIFT_BOX_COLORS.length]} />
              </div>
            </div>
          ))}
          
          {/* 전구 장식 효과 */}
          {Array.from({ length: 25 }).map((_, i) => (
            <div key={i} className="absolute w-1 h-1 bg-white rounded-full opacity-60 animate-pulse"
              style={{
                top: `${15 + Math.random() * 65}%`,
                left: `${35 + Math.random() * 30}%`,
                boxShadow: '0 0 8px white',
                animationDelay: `${Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Blessing Popup */}
      {currentBlessing && (
        <div onClick={() => setCurrentBlessing(null)} className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
          <div onClick={e => e.stopPropagation()} className="bg-[#fffcf5] w-full max-w-md rounded-sm shadow-2xl p-10 md:p-12 text-slate-800 border border-[#dcdcdc] animate-slide-in">
            <div className="text-center mb-6">
              <div className="text-4xl mb-4 text-[#b8860b]">{currentBlessing.emoji}</div>
              <h2 className="text-xl md:text-2xl font-bold border-b border-[#eee] pb-4 tracking-widest text-slate-900">To. {userName}</h2>
            </div>
            <p className="text-lg md:text-xl leading-[2] text-left whitespace-pre-line break-keep font-medium text-slate-700 italic mb-8">"{currentBlessing.content}"</p>
            <button onClick={() => setCurrentBlessing(null)} className="w-full py-4 bg-[#1a1a1a] text-white font-medium hover:opacity-90 tracking-widest transition-opacity">마음에 새기겠습니다 🙏</button>
          </div>
        </div>
      )}

      {/* Library (Gallery) */}
      {showGallery && (
        <div className="fixed inset-0 z-[150] bg-black/95 flex items-center justify-center p-6">
          {galleryViewIdx === null ? (
            <div className="bg-white p-8 md:p-12 rounded-sm w-full max-w-2xl max-h-[80vh] overflow-y-auto flex flex-col items-center">
              <h2 className="text-2xl font-bold text-slate-900 mb-8 border-b-2 border-slate-900 pb-2 tracking-[0.2em]">{userName}의 서재</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 w-full">
                {Array.from(clickedIndices).map(idx => (
                  <div key={idx} onClick={() => setGalleryViewIdx(idx)} className="bg-slate-50 p-6 flex flex-col items-center cursor-pointer border border-slate-200 hover:bg-slate-100 transition-all group">
                    <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📜</div>
                    <span className="text-xs text-slate-500 font-bold">{idx + 1}번째 지혜</span>
                  </div>
                ))}
              </div>
              <button onClick={() => setShowGallery(false)} className="mt-10 px-10 py-3 border border-slate-300 text-slate-600 tracking-widest hover:bg-slate-50 transition-all">서재 나가기</button>
            </div>
          ) : (
            <div className="flex flex-col items-center w-full max-w-lg animate-slide-in">
              <div ref={letterCardRef} className="bg-[#fffcf5] p-10 md:p-14 w-full shadow-2xl relative border border-[#dcdcdc]">
                <h3 className="text-xl md:text-2xl font-bold text-slate-900 border-b-2 border-slate-900 pb-4 mb-8 text-center tracking-widest">To. {userName}</h3>
                <div className="text-lg md:text-xl leading-[2] text-slate-800 text-justify whitespace-pre-line break-keep italic font-medium">"{PRE_GENERATED_BLESSINGS[galleryViewIdx].content}"</div>
                <div className="mt-10 text-right text-slate-400 text-sm italic">2026년 정월, {userName}을 존경하며</div>
              </div>
              <div className="flex gap-4 mt-8 w-full">
                <button onClick={handleSaveImage} className="flex-1 py-4 bg-white text-slate-900 font-bold tracking-widest border-2 border-white hover:bg-slate-100 transition-all">저장 📸</button>
                <button onClick={() => setGalleryViewIdx(null)} className="flex-1 py-4 border-2 border-white text-white font-bold tracking-widest hover:bg-white/10 transition-all">목록</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(<App />);
}
