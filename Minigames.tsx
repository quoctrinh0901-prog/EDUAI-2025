
import React, { useState, useEffect, useRef } from 'react';
import { User } from '../types';

interface GameProps {
  students: User[];
}

// Reusable Input Component
const GameInput = ({ 
    title, 
    placeholder, 
    onStart, 
    buttonText = "Bắt đầu" 
}: { 
    title: string, 
    placeholder: string, 
    onStart: (list: string[]) => void, 
    buttonText?: string 
}) => {
    const [input, setInput] = useState("");
    
    const handleStart = () => {
        const list = input.split('\n').filter(line => line.trim().length > 0);
        if (list.length === 0) return alert("Vui lòng nhập nội dung!");
        onStart(list);
    };

    return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center max-w-2xl mx-auto">
             <h3 className="text-2xl font-bold mb-6 text-indigo-600">{title}</h3>
             <textarea 
                className="w-full h-48 p-4 border-2 border-indigo-200 rounded-xl focus:ring-4 focus:ring-indigo-100 outline-none resize-none mb-6 text-lg" 
                placeholder={placeholder}
                value={input}
                onChange={e => setInput(e.target.value)}
             />
             <button onClick={handleStart} className="bg-indigo-600 text-white font-bold py-3 px-10 rounded-full shadow-lg hover:bg-indigo-700 transition transform hover:scale-105">
                 {buttonText}
             </button>
        </div>
    );
}

// --- MAIN COMPONENT ---
export const GameCenter: React.FC<GameProps> = ({ students }) => {
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const games = [
    { id: '304', name: 'Tung xúc xắc', icon: '🎲', color: 'bg-green-100 border-green-500', iconColor: 'text-green-600', desc: 'Tung xúc xắc' },
    // Removed Caro
    { id: 'quiz', name: 'Hái Hoa Dân Chủ', icon: '🌸', color: 'bg-pink-100 border-pink-500', iconColor: 'text-pink-600', desc: 'Trả lời câu hỏi' },
    { id: 'ocean', name: 'Đại Dương', icon: '🐠', color: 'bg-cyan-100 border-cyan-500', iconColor: 'text-cyan-600', desc: 'Khám phá biển cả' },
    { id: 'blindbag', name: 'Túi Mù', icon: '🛍️', color: 'bg-purple-100 border-purple-500', iconColor: 'text-purple-600', desc: 'Bất ngờ thú vị' },
    { id: 'mysterybox', name: 'Hộp Bí Ẩn', icon: '🎁', color: 'bg-yellow-100 border-yellow-500', iconColor: 'text-yellow-600', desc: 'Ẩn số may mắn' },
    { id: 'lottery', name: 'Xổ Số', icon: '🎰', color: 'bg-red-100 border-red-500', iconColor: 'text-red-600', desc: 'Quay số trúng thưởng' },
    // Removed Math
    { id: 'wheel', name: 'Vòng Quay', icon: '🎡', color: 'bg-orange-100 border-orange-500', iconColor: 'text-orange-600', desc: 'Quay tên học sinh' },
    { id: 'race', name: 'Đua Xe (BeeRace)', icon: '🐝', color: 'bg-lime-100 border-lime-500', iconColor: 'text-lime-600', desc: 'Ai về đích trước?' },
    { id: 'bomb', name: 'Hẹn Giờ', icon: '💣', color: 'bg-gray-100 border-gray-600', iconColor: 'text-gray-700', desc: 'Đếm ngược nổ bom' },
    { id: 'slot', name: 'Ong Vàng May Mắn', icon: '🍯', color: 'bg-amber-100 border-amber-500', iconColor: 'text-amber-600', desc: 'Chọn tên ngẫu nhiên' },
    { id: 'noise', name: 'Quản Lý Tiếng ồn', icon: '🤫', color: 'bg-slate-100 border-slate-500', iconColor: 'text-slate-800', desc: 'Giữ trật tự lớp học' },
  ];

  const renderGame = () => {
    // Back button wrapper
    const withBack = (component: React.ReactNode) => (
      <div className="animate-fade-in-up h-full flex flex-col">
        <button 
          onClick={() => setActiveGame(null)} 
          className="mb-4 flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-indigo-500 font-bold transition-colors w-fit"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Quay lại Menu
        </button>
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-inner border border-gray-200 dark:border-gray-700 flex-1 overflow-auto relative min-h-[500px]">
          {component}
        </div>
      </div>
    );

    switch (activeGame) {
      case '304': return withBack(<DiceRoller />);
      case 'quiz': return withBack(<QuizGame />);
      case 'ocean': return withBack(<OceanExplore />);
      case 'blindbag': return withBack(<BlindBag />);
      case 'mysterybox': return withBack(<MysteryBox />);
      case 'lottery': return withBack(<Lottery />);
      case 'wheel': return withBack(<LuckyWheel />);
      case 'race': return withBack(<BeeRace />);
      case 'bomb': return withBack(<BombTimer />);
      case 'slot': return withBack(<SlotMachine />);
      case 'noise': return withBack(<NoiseManager />);
      default: return null;
    }
  };

  if (activeGame) {
    return renderGame();
  }

  return (
    <div className="animate-fade-in-up pb-10">
      <h2 className="text-2xl font-bold mb-6 text-center text-indigo-600 dark:text-indigo-400">KHO TRÒ CHƠI LỚP HỌC</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
        {games.map((g) => (
          <div 
            key={g.id}
            onClick={() => setActiveGame(g.id)}
            className={`group cursor-pointer rounded-2xl p-4 border-2 ${g.color} bg-opacity-50 hover:bg-opacity-100 transition-all transform hover:scale-105 shadow-sm hover:shadow-md flex flex-col items-center justify-center h-48 relative overflow-hidden`}
          >
            <div className={`text-6xl mb-2 transform group-hover:rotate-12 transition-transform duration-300`}>{g.icon}</div>
            <h3 className={`font-bold text-lg ${g.iconColor} text-center z-10`}>{g.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- SUB GAMES ---

// 1. Dice Roller (304)
const DiceRoller = () => {
  const [dice, setDice] = useState([6, 1]);
  const [rolling, setRolling] = useState(false);

  const roll = () => {
    setRolling(true);
    let count = 0;
    const interval = setInterval(() => {
      setDice([Math.ceil(Math.random() * 6), Math.ceil(Math.random() * 6)]);
      count++;
      if (count > 10) {
          clearInterval(interval);
          setRolling(false);
      }
    }, 100);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-12 bg-amber-50 rounded-xl relative overflow-hidden">
      <div className="flex gap-12 z-10">
        {dice.map((d, i) => (
          <div key={i} className={`w-32 h-32 bg-white rounded-3xl flex items-center justify-center shadow-2xl transform ${rolling ? 'rotate-180 scale-90' : 'rotate-0 scale-100'} transition-all duration-300 border-4 border-gray-200`}>
             <div className="text-gray-800 text-6xl font-bold font-mono">{d}</div>
          </div>
        ))}
      </div>
      <div className="text-3xl font-bold z-10 bg-white px-8 py-2 rounded-full shadow-lg border-2 border-gray-200 text-gray-800">
          Tổng: <span className="text-red-600">{dice[0] + dice[1]}</span>
      </div>
      <button onClick={roll} disabled={rolling} className="z-10 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full shadow-xl text-xl transform active:scale-95 transition-transform">
          Tung Xúc Xắc
      </button>
    </div>
  );
};

// 2. Quiz Game (Hái Hoa Dân Chủ) - Enhanced Tree Visual
const QuizGame = () => {
    const [questions, setQuestions] = useState<string[]>([]);
    const [currentQ, setCurrentQ] = useState<string | null>(null);
    const [pickedIndices, setPickedIndices] = useState<number[]>([]);

    // Updated positions for a more natural tree look
    const positions = [
        {top: '15%', left: '48%'}, {top: '25%', left: '35%'}, {top: '25%', left: '60%'},
        {top: '40%', left: '25%'}, {top: '38%', left: '50%'}, {top: '40%', left: '72%'},
        {top: '55%', left: '20%'}, {top: '52%', left: '40%'}, {top: '52%', left: '60%'}, {top: '55%', left: '80%'}
    ];

    if (questions.length === 0) {
        return (
            <GameInput 
                title="🌸 Nhập danh sách câu hỏi" 
                placeholder="Nhập từng câu hỏi, mỗi câu một dòng..." 
                onStart={setQuestions} 
            />
        );
    }

    const pick = (index: number) => {
        if(pickedIndices.includes(index)) return;
        setCurrentQ(questions[index % questions.length]);
        setPickedIndices([...pickedIndices, index]);
    };

    return (
        <div className="relative h-[600px] bg-sky-200/50 rounded-xl overflow-hidden flex items-center justify-center border-4 border-pink-200">
             {/* Decorative Background Elements */}
             <div className="absolute bottom-0 w-full h-24 bg-green-200/50 z-0"></div>
             
             {/* Tree Trunk */}
             <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-1/2 bg-[#5D4037] rounded-lg z-0"></div>
             
             {/* Tree Foliage */}
             <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[80%] h-[70%] bg-pink-300/30 rounded-full blur-xl z-0"></div>
             
             {/* Branches */}
             <svg className="absolute inset-0 w-full h-full z-0 pointer-events-none stroke-[#5D4037]" strokeWidth="4">
                 <path d="M 500 600 L 500 300 L 350 200" fill="none" />
                 <path d="M 500 450 L 650 250" fill="none" />
                 <path d="M 500 400 L 400 350 L 300 400" fill="none" />
                 <path d="M 500 350 L 600 350 L 700 450" fill="none" />
             </svg>

             {/* Flowers / Red Envelopes */}
             {positions.map((pos, i) => (
                 <button 
                    key={i}
                    onClick={() => pick(i)}
                    disabled={pickedIndices.includes(i)}
                    className={`absolute transition-all duration-700 transform hover:scale-125 z-10 ${pickedIndices.includes(i) ? 'opacity-0 scale-150 pointer-events-none translate-y-20' : 'opacity-100 animate-pulse'}`}
                    style={{top: pos.top, left: pos.left}}
                 >
                     <div className="w-12 h-12 bg-red-500 rounded-lg shadow-lg flex items-center justify-center border-2 border-yellow-400 rotate-45 hover:rotate-0 transition-transform">
                         <span className="text-yellow-300 text-xs font-bold -rotate-45">Lì xì</span>
                     </div>
                 </button>
             ))}

             {/* Popup Question */}
             {currentQ && (
                 <div className="absolute inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm">
                     <div className="bg-white rounded-2xl p-8 max-w-lg w-full shadow-2xl animate-fade-in-up border-4 border-pink-400 text-center relative bg-[url('https://www.transparenttextures.com/patterns/flower-trail.png')]">
                         <h4 className="text-pink-600 font-bold uppercase tracking-widest mb-6 text-xl">Câu hỏi dành cho bạn</h4>
                         <p className="text-2xl font-bold text-gray-800 mb-8 leading-relaxed">{currentQ}</p>
                         <button onClick={() => setCurrentQ(null)} className="bg-pink-500 text-white px-8 py-3 rounded-full font-bold hover:bg-pink-600 shadow-lg text-lg">Đóng</button>
                     </div>
                 </div>
             )}
             
             <button onClick={() => setQuestions([])} className="absolute top-4 left-4 bg-white/80 hover:bg-white p-2 rounded-lg text-xs z-20 shadow text-pink-600 font-bold">Nhập lại câu hỏi</button>
        </div>
    );
};

// 3. Ocean Explore - Enhanced
const OceanExplore = () => {
    const [students, setStudents] = useState<string[]>([]);
    const [winner, setWinner] = useState<string | null>(null);
    const [fishing, setFishing] = useState(false);
    const [mode, setMode] = useState<'AUTO' | 'MANUAL'>('AUTO');

    if (students.length === 0) {
        return (
            <GameInput 
                title="🐠 Nhập danh sách lớp học" 
                placeholder="Nhập tên học sinh, mỗi em một dòng..." 
                onStart={(list) => {
                    const shuffled = [...list].sort(() => 0.5 - Math.random());
                    setStudents(shuffled);
                }} 
                buttonText="Vào đại dương"
            />
        );
    }

    const fishAuto = () => {
        setFishing(true);
        setWinner(null);
        setTimeout(() => {
            const random = students[Math.floor(Math.random() * students.length)];
            setWinner(random);
            setFishing(false);
        }, 3000);
    };

    const fishManual = (studentName: string) => {
        setWinner(studentName);
    };

    return (
        <div className="h-[600px] bg-gradient-to-b from-cyan-300 via-blue-400 to-blue-800 rounded-xl relative overflow-hidden flex flex-col items-center justify-center text-white border-4 border-blue-900 shadow-inner">
             
             {/* Controls */}
             <div className="absolute top-4 right-4 z-30 flex gap-2">
                 <button 
                    onClick={() => setMode('AUTO')} 
                    className={`px-4 py-2 rounded-full font-bold text-sm shadow ${mode === 'AUTO' ? 'bg-yellow-400 text-yellow-900' : 'bg-white/20 hover:bg-white/40'}`}
                 >
                     Tự động
                 </button>
                 <button 
                    onClick={() => setMode('MANUAL')} 
                    className={`px-4 py-2 rounded-full font-bold text-sm shadow ${mode === 'MANUAL' ? 'bg-yellow-400 text-yellow-900' : 'bg-white/20 hover:bg-white/40'}`}
                 >
                     Tự câu
                 </button>
             </div>

             {/* Fish = Students */}
             {students.map((s, i) => (
                 <div key={i} 
                      onClick={() => mode === 'MANUAL' && !winner && fishManual(s)}
                      className={`absolute transition-all duration-[20s] ease-linear z-10 ${mode === 'MANUAL' ? 'cursor-pointer hover:scale-125' : ''}`}
                      style={{
                          top: `${Math.random() * 60 + 10}%`,
                          left: `${Math.random() * 80 + 10}%`,
                          animation: `float ${Math.random() * 10 + 10}s infinite alternate`
                      }}>
                     <div className="text-6xl md:text-7xl opacity-90 drop-shadow-lg select-none relative group transform transition-transform">
                         {['🐠', '🐡', '🐟', '🦈', '🐬', '🐳'][i % 6]}
                         
                         {/* Name Label: Show on hover for Auto, or only if not manual. In manual mode, name is hidden! */}
                         {mode === 'AUTO' && (
                             <span className="absolute -top-6 left-1/2 -translate-x-1/2 text-sm bg-black/60 px-2 rounded hidden group-hover:block whitespace-nowrap font-bold">
                                 {s}
                             </span>
                         )}
                     </div>
                 </div>
             ))}

             {/* Seabed Decorations */}
             <div className="absolute bottom-0 w-full h-32 z-10 pointer-events-none flex justify-around items-end pb-4 opacity-50">
                 <div className="text-6xl animate-pulse">🪸</div>
                 <div className="text-4xl mb-4">🐚</div>
                 <div className="text-7xl animate-bounce" style={{animationDuration: '3s'}}>🌿</div>
                 <div className="text-5xl mb-2">🐌</div>
                 <div className="text-6xl animate-pulse delay-75">🪸</div>
             </div>
             
             {/* Bubbles */}
             {[...Array(10)].map((_, i) => (
                 <div key={i} className="absolute bg-white/20 rounded-full animate-ping pointer-events-none" 
                      style={{
                          width: Math.random()*20 + 5, height: Math.random()*20+5, 
                          bottom: Math.random()*100, left: `${Math.random()*100}%`,
                          animationDuration: `${Math.random()*3+2}s`
                      }} 
                 />
             ))}

             {winner ? (
                 <div className="z-40 text-center bg-white/95 text-blue-900 p-8 rounded-3xl shadow-2xl animate-fade-in-up border-4 border-yellow-400 max-w-sm">
                     <div className="text-6xl mb-4">🎣</div>
                     <h3 className="text-2xl font-bold mb-2">Bạn đã câu được</h3>
                     <div className="text-4xl font-extrabold text-blue-600 mb-4">{winner}</div>
                     <button onClick={() => setWinner(null)} className="mt-2 text-sm underline text-gray-500 hover:text-blue-500">
                        {mode === 'AUTO' ? 'Thả câu tiếp' : 'Câu con khác'}
                     </button>
                 </div>
             ) : (
                 mode === 'AUTO' && (
                     <div className="z-20 text-center">
                         <h3 className="text-4xl font-bold mb-8 drop-shadow-md text-white border-text">Khám Phá Đại Dương</h3>
                         <button 
                            onClick={fishAuto} 
                            disabled={fishing}
                            className={`bg-yellow-400 hover:bg-yellow-300 text-yellow-900 font-bold py-4 px-12 rounded-full shadow-xl text-2xl transition-transform transform active:scale-95 border-b-4 border-yellow-600 ${fishing ? 'animate-bounce' : ''}`}
                         >
                             {fishing ? 'Đang thả câu...' : 'Bắt đầu câu'}
                         </button>
                     </div>
                 )
             )}

             {mode === 'MANUAL' && !winner && (
                 <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-black/30 px-6 py-2 rounded-full text-white font-bold backdrop-blur-sm z-20 pointer-events-none">
                     👇 Hãy bấm vào một con cá bất kỳ!
                 </div>
             )}
             
             <button onClick={() => setStudents([])} className="absolute top-4 left-4 bg-white/20 hover:bg-white/40 p-2 rounded text-xs z-30 font-bold">Nhập lại danh sách</button>
        </div>
    );
};

// 4. Blind Bag
const BlindBag = () => {
    const [items, setItems] = useState<{id: number, content: string, opened: boolean}[]>([]);
    
    if (items.length === 0) {
        return <GameInput title="🛍️ Túi Mù May Mắn" placeholder="Nhập phần thưởng hoặc tên học sinh..." onStart={(list) => {
            const shuffled = [...list].sort(() => 0.5 - Math.random());
            setItems(shuffled.map((content, i) => ({id: i, content, opened: false})));
        }} />;
    }

    return (
        <div className="text-center p-4">
             <div className="flex justify-between items-center mb-6">
                 <h3 className="text-3xl font-bold text-purple-600">Túi Mù</h3>
                 <button onClick={() => setItems([])} className="text-sm text-gray-500 underline">Làm mới</button>
             </div>
             <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                 {items.map(item => (
                     <div 
                        key={item.id}
                        onClick={() => {
                            if (!item.opened) setItems(items.map(i => i.id === item.id ? {...i, opened: true} : i));
                        }}
                        className={`aspect-square rounded-2xl flex items-center justify-center cursor-pointer transition-all transform hover:scale-105 shadow-md relative overflow-hidden ${item.opened ? 'bg-white border-4 border-purple-300' : 'bg-gradient-to-br from-purple-500 to-indigo-600'}`}
                     >
                         {item.opened ? (
                             <span className="font-bold text-purple-700 p-2 break-words text-sm md:text-lg animate-fade-in-up">{item.content}</span>
                         ) : (
                             <span className="text-4xl text-white opacity-80">?</span>
                         )}
                     </div>
                 ))}
             </div>
        </div>
    );
};

// 5. Mystery Box - Fixed Click Issue
const MysteryBox = () => {
    const [items, setItems] = useState<{id: number, content: string, opened: boolean}[]>([]);

    if (items.length === 0) {
        return <GameInput title="🎁 Hộp Bí Ẩn" placeholder="Nhập danh sách..." onStart={(list) => {
            const shuffled = [...list].sort(() => 0.5 - Math.random());
            setItems(shuffled.map((content, i) => ({id: i, content, opened: false})));
        }} />;
    }

    return (
        <div className="p-4 bg-gray-900 min-h-full rounded-xl">
             <div className="flex justify-between items-center mb-6 text-yellow-500">
                 <h3 className="text-3xl font-bold">Hộp Bí Ẩn</h3>
                 <button onClick={() => setItems([])} className="text-sm underline">Reset</button>
             </div>
             <div className="flex flex-wrap gap-6 justify-center">
                 {items.map((item, i) => (
                     <div 
                        key={item.id}
                        onClick={() => {
                            if(!item.opened) {
                                setItems(prev => prev.map(it => it.id === item.id ? {...it, opened: true} : it));
                            }
                        }}
                        className="w-32 h-32 md:w-40 md:h-40 relative cursor-pointer"
                        style={{perspective: '1000px'}}
                     >
                         <div 
                            className="w-full h-full relative"
                            style={{
                                transformStyle: 'preserve-3d',
                                transition: 'transform 0.6s',
                                transform: item.opened ? 'rotateY(180deg)' : 'rotateY(0deg)'
                            }}
                         >
                             {/* Front (Closed) */}
                             <div 
                                className="absolute inset-0 bg-yellow-600 border-4 border-yellow-400 rounded-xl flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.5)] hover:shadow-[0_0_25px_rgba(234,179,8,0.8)]"
                                style={{backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden'}}
                             >
                                 <span className="text-4xl">⚡</span>
                                 <span className="absolute bottom-2 right-2 text-yellow-200 font-bold">{i+1}</span>
                             </div>

                             {/* Back (Opened) */}
                             <div 
                                className="absolute inset-0 bg-white rounded-xl flex items-center justify-center p-2 text-center border-4 border-yellow-500 shadow-xl"
                                style={{
                                    transform: 'rotateY(180deg)', 
                                    backfaceVisibility: 'hidden', 
                                    WebkitBackfaceVisibility: 'hidden'
                                }}
                             >
                                 <span className="font-bold text-gray-800 break-words">{item.content}</span>
                             </div>
                         </div>
                     </div>
                 ))}
             </div>
        </div>
    );
}

// 6. Lottery (Xổ Số - Updated to be Raffle)
const Lottery = () => {
  const [candidates, setCandidates] = useState<string[]>([]);
  const [rolling, setRolling] = useState(false);
  const [currentName, setCurrentName] = useState("???");
  const [winner, setWinner] = useState<string | null>(null);

  if (candidates.length === 0) {
      return <GameInput title="🎰 Xổ Số May Mắn" placeholder="Nhập tên người tham gia..." onStart={setCandidates} />;
  }

  const roll = () => {
    setRolling(true);
    setWinner(null);
    let count = 0;
    const interval = setInterval(() => {
      setCurrentName(candidates[Math.floor(Math.random() * candidates.length)]);
      count++;
    }, 50);
    
    setTimeout(() => {
      clearInterval(interval);
      setRolling(false);
      const win = candidates[Math.floor(Math.random() * candidates.length)];
      setWinner(win);
      setCurrentName(win);
    }, 2000);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full space-y-8 bg-red-50 rounded-xl p-8 border-4 border-red-200">
       <button onClick={() => setCandidates([])} className="absolute top-4 left-4 text-gray-400 hover:text-red-500 text-sm">Nhập lại</button>
       <h3 className="text-3xl font-bold text-red-600 uppercase tracking-widest mb-8">Quay Số Trúng Thưởng</h3>
       
       <div className="w-full max-w-md h-40 bg-white rounded-2xl border-4 border-red-500 flex items-center justify-center shadow-inner overflow-hidden relative">
           {winner && <div className="absolute inset-0 bg-yellow-100/50 animate-pulse"></div>}
           <span className={`text-4xl md:text-5xl font-extrabold text-gray-800 ${rolling ? 'blur-[1px]' : ''} z-10`}>
               {currentName}
           </span>
       </div>

       <button onClick={roll} disabled={rolling} className={`bg-red-600 text-white font-bold py-4 px-12 rounded-full text-xl shadow-lg hover:bg-red-700 transition-transform active:scale-95 ${rolling ? 'opacity-50 cursor-not-allowed' : ''}`}>
           {rolling ? 'Đang quay...' : 'QUAY SỐ'}
       </button>
       
       {winner && !rolling && <div className="text-xl text-red-500 font-bold animate-bounce">🎉 Chúc mừng: {winner} 🎉</div>}
    </div>
  );
};

// 7. Lucky Wheel
const LuckyWheel = () => {
    const [segments, setSegments] = useState<string[]>([]);
    const [rotation, setRotation] = useState(0);
    const [spinning, setSpinning] = useState(false);
    const [winner, setWinner] = useState<string | null>(null);

    const colors = ["#ef4444", "#f97316", "#f59e0b", "#84cc16", "#06b6d4", "#8b5cf6", "#d946ef", "#f43f5e"];

    if (segments.length === 0) {
        return <GameInput title="🎡 Vòng Quay May Mắn" placeholder="Nhập tên học sinh..." onStart={setSegments} />;
    }

    const spin = () => {
        if(spinning) return;
        setSpinning(true);
        setWinner(null);
        
        const randomDegree = Math.floor(Math.random() * 360) + 1800 + Math.random() * 360; 
        const newRotation = rotation + randomDegree;
        setRotation(newRotation);

        setTimeout(() => {
            setSpinning(false);
            // Simple random winner pick for UI feedback (calculation of exact segment from rotation is complex with CSS conic-gradient)
            setWinner(segments[Math.floor(Math.random() * segments.length)]); 
        }, 5000);
    };

    return (
        <div className="flex flex-col items-center h-full relative overflow-hidden py-4">
             <button onClick={() => setSegments([])} className="absolute top-0 left-0 text-sm text-gray-400">Thiết lập lại</button>
            <h3 className="text-2xl font-bold mb-8 text-orange-600">Vòng Quay May Mắn</h3>
            
            <div className="relative w-[300px] h-[300px] md:w-[400px] md:h-[400px]">
                {/* Pointer */}
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20 w-0 h-0 border-l-[15px] border-l-transparent border-r-[15px] border-r-transparent border-t-[30px] border-t-red-600 drop-shadow-lg"></div>
                
                {/* Wheel */}
                <div 
                    className="w-full h-full rounded-full border-8 border-white shadow-2xl relative overflow-hidden transition-transform cubic-bezier(0.2, 0.8, 0.2, 1)"
                    style={{
                        transform: `rotate(${rotation}deg)`,
                        transitionDuration: spinning ? '5s' : '0s',
                        background: `conic-gradient(${segments.map((_, i) => `${colors[i % colors.length]} ${i * (100/segments.length)}% ${(i+1) * (100/segments.length)}%`).join(', ')})`
                    }}
                >
                    {/* Render text labels if few segments? Hard to do perfectly with just conic gradient, keeping it simple visual */}
                </div>
                
                {/* Center Button */}
                <button 
                    onClick={spin}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 bg-white rounded-full shadow-xl flex items-center justify-center font-bold text-gray-800 border-4 border-orange-200 z-10 hover:scale-110 transition-transform text-sm md:text-base"
                >
                    QUAY
                </button>
            </div>

            {winner && !spinning && (
                <div className="mt-8 bg-white p-6 rounded-2xl text-center shadow-xl border-2 border-orange-100 animate-fade-in-up">
                     <h4 className="text-gray-500 font-bold uppercase text-xs mb-2">Chúc mừng</h4>
                     <div className="text-3xl font-extrabold text-orange-600">{winner}</div>
                </div>
            )}
        </div>
    )
}

// 8. Bee Race
const BeeRace = () => {
    const [racers, setRacers] = useState<{id: number, name: string, progress: number}[]>([]);
    const [racing, setRacing] = useState(false);
    const [winner, setWinner] = useState<string | null>(null);

    if (racers.length === 0) {
        return <GameInput title="🐝 Đua Ong Về Đích" placeholder="Nhập tên các đội / học sinh..." onStart={(list) => setRacers(list.map((n, i) => ({id: i, name: n, progress: 0})))} />;
    }

    const startRace = () => {
        setRacing(true);
        setWinner(null);
        setRacers(prev => prev.map(r => ({...r, progress: 0})));

        const interval = setInterval(() => {
            setRacers(prev => {
                const updated = prev.map(r => ({
                    ...r,
                    progress: Math.min(100, r.progress + Math.random() * 2)
                }));
                
                const win = updated.find(r => r.progress >= 100);
                if (win) {
                    clearInterval(interval);
                    setRacing(false);
                    setWinner(win.name);
                }
                return updated;
            });
        }, 50);
    };

    return (
        <div className="h-full flex flex-col">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-lime-700">Đua Ong 🐝</h3>
                <button onClick={() => setRacers([])} className="text-xs text-gray-500">Thiết lập lại</button>
            </div>
            
            <div className="flex-1 bg-sky-100 rounded-xl p-4 flex flex-col justify-center gap-4 relative border-r-8 border-r-black border-dashed overflow-y-auto">
                <div className="absolute right-0 top-0 bottom-0 w-2 bg-black/10 z-0"></div>

                {racers.map(r => (
                    <div key={r.id} className="relative h-10 bg-white/60 rounded-full flex items-center px-2 shadow-sm">
                        <div 
                            className="absolute h-10 w-10 transition-all duration-100 flex items-center justify-center text-2xl z-10"
                            style={{left: `calc(${r.progress}% - 30px)`}}
                        >
                            {r.name === winner ? '👑' : '🚁'}
                        </div>
                        <span className="absolute left-2 text-xs font-bold text-gray-600 z-0 truncate w-20">{r.name}</span>
                        <div className="h-2 bg-lime-500 rounded-full transition-all duration-100 opacity-60" style={{width: `${r.progress}%`}}></div>
                    </div>
                ))}
            </div>
            
            <div className="text-center mt-6 h-12">
                 {winner ? (
                     <div className="text-2xl font-bold text-green-600 animate-bounce">🏆 Người thắng: {winner}</div>
                 ) : (
                     <button onClick={startRace} disabled={racing} className="bg-lime-600 text-white font-bold py-3 px-8 rounded-full shadow-lg hover:bg-lime-700 disabled:opacity-50">
                        {racing ? 'Đang đua...' : 'Bắt Đầu Đua'}
                     </button>
                 )}
            </div>
        </div>
    )
}

// 9. Bomb Timer
const BombTimer = () => {
    const [time, setTime] = useState(60); 
    const [running, setRunning] = useState(false);
    const [exploded, setExploded] = useState(false);

    useEffect(() => {
        let interval: any;
        if(running && time > 0) {
            interval = setInterval(() => setTime(t => t-1), 1000);
        } else if (time === 0 && running) {
            setRunning(false);
            setExploded(true);
            const audio = new Audio('https://www.soundjay.com/mechanical/sounds/explosion-01.mp3'); // Simple sound effect if allowed
            audio.play().catch(() => {});
        }
        return () => clearInterval(interval);
    }, [running, time]);

    const format = (s: number) => {
        const m = Math.floor(s/60);
        const sec = s % 60;
        return `${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    };

    return (
        <div className={`h-full flex flex-col items-center justify-center transition-colors duration-200 ${exploded ? 'bg-red-500' : 'bg-gray-800'} rounded-xl relative overflow-hidden p-6`}>
             {exploded ? (
                 <div className="text-center animate-ping">
                     <div className="text-9xl">💥</div>
                     <h3 className="text-white font-bold text-4xl mt-4">BOOM!</h3>
                     <button onClick={() => {setExploded(false); setTime(60)}} className="mt-8 bg-white text-red-600 px-6 py-2 rounded-full font-bold shadow-xl">Chơi lại</button>
                 </div>
             ) : (
                 <>
                    <div className="bg-black border-8 border-gray-600 rounded-2xl p-6 md:p-10 shadow-2xl mb-8 relative w-full max-w-md text-center">
                        <span className="font-mono text-6xl md:text-8xl text-red-600 font-bold tracking-widest drop-shadow-[0_0_15px_rgba(220,38,38,0.9)]">
                            {format(time)}
                        </span>
                        {/* Wires */}
                        <div className="absolute -top-8 left-10 w-2 h-10 bg-blue-500 rounded"></div>
                        <div className="absolute -top-8 right-10 w-2 h-10 bg-red-500 rounded"></div>
                        <div className="absolute -top-8 left-1/2 w-2 h-10 bg-green-500 rounded"></div>
                    </div>
                    
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        <div className="flex gap-2">
                             {[10, 30, 60, 120, 300].map(val => (
                                 <button key={val} onClick={() => setTime(val)} disabled={running} className="px-3 py-1 bg-gray-700 text-gray-300 text-xs rounded hover:bg-gray-600">{val}s</button>
                             ))}
                        </div>
                        <div className="flex gap-4">
                            <button onClick={() => setRunning(!running)} className={`px-8 py-3 rounded-lg font-bold text-white shadow-lg text-lg transform active:scale-95 transition-all ${running ? 'bg-yellow-600' : 'bg-green-600'}`}>
                                {running ? 'Dừng' : 'Kích hoạt'}
                            </button>
                            <button onClick={() => {setRunning(false); setTime(60)}} className="px-4 py-3 bg-gray-600 text-white rounded-lg font-bold">↺</button>
                        </div>
                    </div>
                 </>
             )}
        </div>
    )
}

// 10. Slot Machine (Ong Vàng)
const SlotMachine = () => {
    const [candidates, setCandidates] = useState<string[]>([]);
    const [name, setName] = useState("Sẵn sàng?");
    const [spinning, setSpinning] = useState(false);

    if (candidates.length === 0) {
        return <GameInput title="🍯 Ong Vàng May Mắn" placeholder="Nhập danh sách tên..." onStart={setCandidates} />;
    }

    const spin = () => {
        setSpinning(true);
        let count = 0;
        const interval = setInterval(() => {
            setName(candidates[Math.floor(Math.random() * candidates.length)]);
            count++;
            if(count > 30) {
                clearInterval(interval);
                setSpinning(false);
            }
        }, 80);
    }

    return (
        <div className="h-full bg-gradient-to-b from-yellow-400 to-orange-500 rounded-xl flex flex-col items-center justify-center p-8 border-8 border-yellow-600 relative shadow-inner">
             <button onClick={() => setCandidates([])} className="absolute top-2 left-2 text-yellow-800 text-xs underline">Nhập lại</button>
             <div className="absolute top-4 font-bold text-yellow-900 uppercase tracking-widest text-lg bg-yellow-300 px-6 py-1 rounded-full shadow-md border-2 border-yellow-100">Ong Vàng</div>
             
             <div className="w-full max-w-sm h-40 bg-white rounded-xl border-4 border-gray-300 flex items-center justify-center shadow-inner mb-8 overflow-hidden relative">
                 <div className="absolute inset-0 bg-gradient-to-b from-gray-100 to-transparent opacity-50 pointer-events-none"></div>
                 <span className={`text-4xl md:text-5xl font-extrabold text-gray-800 ${spinning ? 'blur-[2px] translate-y-1' : ''}`}>{name}</span>
             </div>

             <div className="flex gap-4 items-center">
                 <div className="w-6 h-32 bg-gray-400 rounded-full shadow-inner border border-gray-500 relative">
                     <div className={`absolute left-0 right-0 h-8 bg-red-500 rounded-full shadow-md transition-all duration-100 ${spinning ? 'top-[80%]' : 'top-0'}`}></div>
                 </div> 
                 <button 
                    onClick={spin}
                    disabled={spinning} 
                    className="w-24 h-24 rounded-full bg-red-600 border-b-8 border-red-800 text-white font-bold text-xl shadow-xl active:scale-95 transition-transform"
                 >
                    QUAY
                </button>
             </div>
        </div>
    )
}

// 11. Noise Manager (Bouncy Balls)
const NoiseManager = () => {
    const [active, setActive] = useState(false);
    const [sensitivity, setSensitivity] = useState(30);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserRef = useRef<AnalyserNode | null>(null);
    const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
    const ballsRef = useRef<{x:number, y:number, vx:number, vy:number, r:number, color:string}[]>([]);
    const animationFrameRef = useRef<number>(0);

    const colors = ["#ef4444", "#f59e0b", "#10b981", "#3b82f6", "#8b5cf6", "#ec4899"];

    // Initialize Balls & Animation on Mount
    useEffect(() => {
        if (!canvasRef.current) return;
        const width = canvasRef.current.clientWidth;
        const height = canvasRef.current.clientHeight;
        
        // Create 20 balls
        ballsRef.current = Array.from({length: 20}).map(() => ({
            x: Math.random() * width,
            y: height - 20,
            vx: (Math.random() - 0.5) * 4,
            vy: 0,
            r: 10 + Math.random() * 20,
            color: colors[Math.floor(Math.random() * colors.length)]
        }));

        // Start animation loop immediately
        animate();

        return () => {
             if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
             stopMic(); // Cleanup mic if active
        };
    }, []);

    const startMic = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
            
            // CRITICAL FIX: Ensure Context is running (often suspended by browser policy)
            await audioCtx.resume();

            const analyser = audioCtx.createAnalyser();
            const source = audioCtx.createMediaStreamSource(stream);
            
            analyser.fftSize = 256;
            source.connect(analyser);
            
            audioContextRef.current = audioCtx;
            analyserRef.current = analyser;
            sourceRef.current = source;
            setActive(true);
        } catch (err) {
            alert("Không thể truy cập Microphone. Vui lòng kiểm tra quyền trình duyệt.");
            console.error(err);
        }
    };

    const stopMic = () => {
        if (sourceRef.current) {
            sourceRef.current.mediaStream.getTracks().forEach(track => track.stop());
            sourceRef.current.disconnect();
        }
        if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
             audioContextRef.current.close().catch(() => {});
        }
        audioContextRef.current = null;
        analyserRef.current = null;
        sourceRef.current = null;
        setActive(false);
    };

    const animate = () => {
        if (!canvasRef.current) return;
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Resize
        if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
            canvas.width = canvas.clientWidth;
            canvas.height = canvas.clientHeight;
        }
        const width = canvas.width;
        const height = canvas.height;

        let force = 0;
        // Get Volume if active
        if (active && analyserRef.current) {
            const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
            analyserRef.current.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((a, b) => a + b) / dataArray.length;
            
            // Sensitivity Factor (Higher sensitivity = Lower threshold)
            // Adjusted logic: Map 0-255 volume to roughly 0-20 force
            const threshold = 100 - sensitivity; // 0 (sensitive) to 100 (hard)
            if (average > threshold / 2) {
                force = (average - (threshold/2)) * 0.5; 
            }
        }

        ctx.clearRect(0, 0, width, height);

        // Warning Text if too loud
        if (force > 30) {
            ctx.fillStyle = "rgba(239, 68, 68, 0.2)"; // Red tint
            ctx.fillRect(0,0,width,height);
            ctx.fillStyle = "white";
            ctx.font = "bold 48px sans-serif";
            ctx.textAlign = "center";
            ctx.fillText("IM LẶNG!", width/2, height/2);
        } else {
             if (active) {
                ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
                ctx.font = "bold 24px sans-serif";
                ctx.textAlign = "center";
                ctx.fillText("Đang lắng nghe...", width/2, height/2);
             } else {
                ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
                ctx.font = "bold 24px sans-serif";
                ctx.textAlign = "center";
                ctx.fillText("Bấm Bắt Đầu để đo tiếng ồn", width/2, height/2);
             }
        }

        // Physics
        ballsRef.current.forEach(ball => {
            // Audio Force (Kick up)
            if (force > 2) { // Lower threshold for movement
                ball.vy -= (force / 8) * Math.random(); 
                ball.vx += (Math.random() - 0.5) * (force / 8);
            }

            // Gravity
            ball.vy += 0.5;
            
            // Friction
            ball.vx *= 0.99;
            ball.vy *= 0.99;

            // Move
            ball.x += ball.vx;
            ball.y += ball.vy;

            // Floor Collision
            if (ball.y + ball.r > height) {
                ball.y = height - ball.r;
                ball.vy *= -0.7; // Bounce
            }
            if (ball.y - ball.r < 0) {
                ball.y = ball.r;
                ball.vy *= -0.7;
            }

            // Wall Collision
            if (ball.x + ball.r > width) {
                ball.x = width - ball.r;
                ball.vx *= -0.7;
            }
            if (ball.x - ball.r < 0) {
                ball.x = ball.r;
                ball.vx *= -0.7;
            }

            // Draw
            ctx.beginPath();
            ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
            ctx.fillStyle = ball.color;
            ctx.fill();
            ctx.strokeStyle = "rgba(0,0,0,0.2)";
            ctx.stroke();
            
            // Highlight
            ctx.beginPath();
            ctx.arc(ball.x - ball.r*0.3, ball.y - ball.r*0.3, ball.r*0.2, 0, Math.PI * 2);
            ctx.fillStyle = "rgba(255,255,255,0.4)";
            ctx.fill();
        });

        animationFrameRef.current = requestAnimationFrame(animate);
    };

    return (
        <div className="h-full min-h-[500px] flex flex-col bg-slate-900 rounded-xl overflow-hidden relative border-8 border-slate-700">
             <canvas ref={canvasRef} className="flex-1 w-full h-full block" />
             
             <div className="bg-slate-800 p-4 flex gap-4 items-center justify-between z-10 border-t border-slate-700">
                 {!active ? (
                     <button onClick={startMic} className="bg-green-600 hover:bg-green-500 text-white font-bold py-2 px-6 rounded-full shadow-lg">
                         Bắt Đầu Đo 🎤
                     </button>
                 ) : (
                     <button onClick={stopMic} className="bg-red-600 hover:bg-red-500 text-white font-bold py-2 px-6 rounded-full shadow-lg">
                         Dừng Lại
                     </button>
                 )}
                 
                 <div className="flex items-center gap-3 flex-1 max-w-xs">
                     <span className="text-white text-xs font-bold">Độ nhạy:</span>
                     <input 
                        type="range" 
                        min="0" 
                        max="100" 
                        value={sensitivity} 
                        onChange={e => setSensitivity(Number(e.target.value))}
                        className="flex-1 h-2 bg-slate-600 rounded-lg appearance-none cursor-pointer"
                     />
                 </div>
             </div>
        </div>
    );
};
