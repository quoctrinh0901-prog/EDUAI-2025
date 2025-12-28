
import React, { useState, useEffect, useRef } from 'react';
import { User, UserRole, Subject, Homework, ScoreRecord, Announcement, StudentSubmission, PracticeResult } from './types';
import { PROVINCES, SUBJECTS_LIST, GRADES } from './constants';
import { GameCenter } from './components/Minigames';
import { generateCustomQuiz, gradeStudentQuiz, generateStructuredHomework } from './services/geminiService';
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// --- ICONS (SVG) ---
const Icons = {
  Home: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>,
  Book: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>,
  Pencil: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>,
  Check: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Robot: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
  Game: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  Settings: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
  Logout: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>,
  Menu: () => <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>,
  Users: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>,
  Plus: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
  ArrowLeft: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>,
  Send: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" /></svg>,
  Sparkles: () => <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>,
};

// --- HELPERS ---
const triggerUpdate = () => window.dispatchEvent(new Event('local-data-update'));

// --- STORAGE UTILS ---
const loadUsers = (): User[] => JSON.parse(localStorage.getItem('users') || '[]');
const saveUsers = (users: User[]) => { localStorage.setItem('users', JSON.stringify(users)); triggerUpdate(); };
const loadHomework = (): Homework[] => JSON.parse(localStorage.getItem('homework') || '[]');
const saveHomework = (hw: Homework[]) => { localStorage.setItem('homework', JSON.stringify(hw)); triggerUpdate(); };
const loadSubmissions = (): StudentSubmission[] => JSON.parse(localStorage.getItem('submissions') || '[]');
const saveSubmissions = (s: StudentSubmission[]) => { localStorage.setItem('submissions', JSON.stringify(s)); triggerUpdate(); };

// --- REALTIME HOOK ---
const useData = <T,>(key: string, loader: () => T) => {
    const [data, setData] = useState<T>(loader());
    useEffect(() => {
        const handler = () => setData(loader());
        window.addEventListener('local-data-update', handler);
        return () => window.removeEventListener('local-data-update', handler);
    }, [key, loader]);
    return data;
}

// --- THEME UTILS ---
type ThemeType = 'light' | 'dark' | 'tech' | 'edu';
const getThemeStyles = (theme: ThemeType) => {
  switch (theme) {
    case 'dark': return { bg: 'bg-[#0f1117]', text: 'text-gray-200', sidebarBg: 'bg-[#161b22]', sidebarBorder: 'border-gray-800', panelBg: 'bg-[#161b22]', inputBg: 'bg-gray-700', primary: 'bg-indigo-600', primaryText: 'text-indigo-400', accentText: 'text-gray-400' };
    case 'tech': return { bg: 'bg-[#050b14]', text: 'text-cyan-50', sidebarBg: 'bg-[#0a101f]', sidebarBorder: 'border-cyan-900/30', panelBg: 'bg-[#0a101f]', inputBg: 'bg-[#112240]', primary: 'bg-cyan-600', primaryText: 'text-cyan-400', accentText: 'text-cyan-200/70' };
    case 'edu': return { bg: 'bg-[#f0f9ff]', text: 'text-slate-800', sidebarBg: 'bg-white', sidebarBorder: 'border-sky-100', panelBg: 'bg-white', inputBg: 'bg-sky-50', primary: 'bg-sky-600', primaryText: 'text-sky-600', accentText: 'text-slate-500' };
    default: return { bg: 'bg-gray-50', text: 'text-gray-800', sidebarBg: 'bg-white', sidebarBorder: 'border-gray-200', panelBg: 'bg-white', inputBg: 'bg-white', primary: 'bg-indigo-600', primaryText: 'text-indigo-600', accentText: 'text-gray-500' };
  }
};

const markdownClasses = "prose dark:prose-invert max-w-none prose-p:my-2 prose-headings:mb-2 prose-li:my-1";

// --- MAIN APP ---
function App() {
  const [user, setUser] = useState<User | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [theme, setTheme] = useState<ThemeType>('dark');

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) setUser(JSON.parse(savedUser));
    const savedTheme = localStorage.getItem('appTheme') as ThemeType;
    if (savedTheme) setTheme(savedTheme);
  }, []);

  const handleLogin = (u: User) => {
    localStorage.setItem('currentUser', JSON.stringify(u));
    setUser(u);
    setActiveTab('home');
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
  };

  const currentStyles = getThemeStyles(theme);

  if (!user) {
    return <AuthScreen onLogin={handleLogin} currentTheme={theme} setTheme={(t) => { setTheme(t); localStorage.setItem('appTheme', t); }} styles={currentStyles} />;
  }

  return (
    <div className={`flex h-screen ${currentStyles.bg} ${currentStyles.text} overflow-hidden font-sans transition-colors duration-300`}>
      {/* SIDEBAR */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-20'} flex-shrink-0 ${currentStyles.sidebarBg} border-r ${currentStyles.sidebarBorder} transition-all duration-300 flex flex-col z-20`}>
        <div className="h-16 flex items-center gap-3 px-6 border-b border-gray-800/50">
            <div className={`${currentStyles.primary} p-1.5 rounded-lg text-white`}><Icons.Book /></div>
            <span className={`font-bold text-lg ${!sidebarOpen && 'hidden'}`}>Edu AI</span>
        </div>
        <nav className="flex-1 py-6 px-3 space-y-1">
            {[
                { id: 'home', label: 'Trang chủ', icon: Icons.Home },
                { id: 'homework', label: user.role === UserRole.TEACHER ? 'Quản lý bài tập' : 'Bài tập về nhà', icon: Icons.Pencil },
                { id: 'tutor', label: 'Gia sư AI', icon: Icons.Robot },
                { id: 'games', label: 'Minigames', icon: Icons.Game, role: UserRole.TEACHER },
                { id: 'settings', label: 'Cài đặt', icon: Icons.Settings },
            ].filter(i => !i.role || i.role === user.role).map(item => (
                <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                        activeTab === item.id 
                        ? `${currentStyles.primary} text-white shadow-lg shadow-indigo-500/20` 
                        : `hover:bg-white/5 ${currentStyles.accentText}`
                    }`}
                >
                    <item.icon />
                    <span className={`${!sidebarOpen && 'hidden'}`}>{item.label}</span>
                </button>
            ))}
        </nav>
        <div className="p-4 border-t border-gray-800/50">
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-400/10 rounded-xl transition-colors">
                <Icons.Logout />
                <span className={`${!sidebarOpen && 'hidden'}`}>Đăng xuất</span>
            </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col overflow-hidden">
          <header className={`h-16 flex items-center justify-between px-8 border-b ${currentStyles.sidebarBorder}`}>
              <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 hover:bg-white/5 rounded-lg"><Icons.Menu /></button>
              <div className="flex items-center gap-4">
                  <div className="text-right">
                      <p className="text-sm font-bold">{user.name}</p>
                      <p className={`text-xs ${currentStyles.accentText}`}>{user.role === UserRole.TEACHER ? 'Giáo viên' : `Học sinh lớp ${user.classId}`}</p>
                  </div>
                  <div className={`w-10 h-10 rounded-full ${currentStyles.primary} flex items-center justify-center text-white font-bold`}>{user.name.charAt(0)}</div>
              </div>
          </header>
          <main className="flex-1 overflow-y-auto p-8">
              <div className="max-w-6xl mx-auto animate-fade-in-up">
                  {activeTab === 'home' && <HomeView user={user} styles={currentStyles} setTab={setActiveTab} />}
                  {activeTab === 'homework' && (user.role === UserRole.TEACHER ? <TeacherHomeworkView user={user} styles={currentStyles} /> : <StudentHomeworkView user={user} styles={currentStyles} />)}
                  {activeTab === 'tutor' && <SmartAITutor user={user} styles={currentStyles} />}
                  {activeTab === 'games' && <GameCenter students={[]} />}
              </div>
          </main>
      </div>
    </div>
  );
}

// --- VIEWS ---

const HomeView = ({ user, styles, setTab }: { user: User, styles: any, setTab: (t: string) => void }) => {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold">Chào buổi sáng, {user.name.split(' ').pop()}! 👋</h2>
                    <p className={`${styles.accentText} mt-1`}>Hôm nay bạn muốn bắt đầu học gì nào?</p>
                </div>
                <div className={`${styles.panelBg} px-6 py-3 rounded-2xl border ${styles.sidebarBorder} shadow-sm`}>
                    <p className="text-xs font-bold text-indigo-500 uppercase">Lớp học</p>
                    <p className="text-xl font-bold">{user.classId || user.homeroomClass}</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div onClick={() => setTab('homework')} className={`group cursor-pointer p-6 rounded-3xl border ${styles.sidebarBorder} ${styles.panelBg} hover:border-indigo-500 transition-all shadow-sm`}>
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><Icons.Pencil /></div>
                    <h3 className="text-lg font-bold">Bài tập</h3>
                    <p className={`text-sm ${styles.accentText} mt-1`}>{user.role === UserRole.TEACHER ? 'Quản lý và chấm điểm bài tập' : 'Xem các bài tập cần hoàn thành'}</p>
                </div>
                <div onClick={() => setTab('tutor')} className={`group cursor-pointer p-6 rounded-3xl border ${styles.sidebarBorder} ${styles.panelBg} hover:border-cyan-500 transition-all shadow-sm`}>
                    <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-500 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"><Icons.Robot /></div>
                    <h3 className="text-lg font-bold">Gia sư AI</h3>
                    <p className={`text-sm ${styles.accentText} mt-1`}>Hỏi đáp kiến thức và tạo đề thi thử 24/7</p>
                </div>
                <div className={`p-6 rounded-3xl border ${styles.sidebarBorder} ${styles.panelBg} shadow-sm opacity-60`}>
                    <div className="w-12 h-12 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center mb-4"><Icons.Book /></div>
                    <h3 className="text-lg font-bold">Tài liệu SGK</h3>
                    <p className={`text-sm ${styles.accentText} mt-1`}>Thư viện số bám sát chương trình (Sắp ra mắt)</p>
                </div>
            </div>
        </div>
    );
};

// --- TEACHER: QUẢN LÝ BÀI TẬP ---
const TeacherHomeworkView = ({ user, styles }: { user: User, styles: any }) => {
    const [view, setView] = useState<'LIST' | 'CREATE' | 'GRADE'>('LIST');
    const [topic, setTopic] = useState("");
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [selectedHw, setSelectedHw] = useState<Homework | null>(null);

    const homeworkList = useData('homework', loadHomework).filter(h => h.teacherId === user.id);
    const submissions = useData('submissions', loadSubmissions);

    const handleCreate = async () => {
        setLoading(true);
        const res = await generateStructuredHomework(Subject.MATH, "Khối 9", topic, title);
        setContent(res);
        setLoading(false);
    };

    const handleSave = () => {
        const newHw: Homework = {
            id: Date.now().toString(),
            teacherId: user.id,
            targetType: 'CLASS',
            targetId: user.homeroomClass || "9A1",
            title,
            content,
            subject: 'Toán',
            createdAt: new Date().toISOString()
        };
        saveHomework([...loadHomework(), newHw]);
        setView('LIST');
        setTitle(""); setTopic(""); setContent("");
    };

    if (view === 'CREATE') {
        return (
            <div className="space-y-6">
                <button onClick={() => setView('LIST')} className="flex items-center gap-2 text-sm font-bold text-gray-500"><Icons.ArrowLeft /> Quay lại</button>
                <div className={`${styles.panelBg} p-8 rounded-3xl border ${styles.sidebarBorder} shadow-lg`}>
                    <h2 className="text-2xl font-bold mb-6">Tạo bài tập mới</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                            <label className="block text-sm font-bold mb-2">Tiêu đề bài tập</label>
                            <input value={title} onChange={e=>setTitle(e.target.value)} className={`input-field ${styles.inputBg}`} placeholder="VD: Ôn tập chương 1" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold mb-2">Chủ đề (AI sẽ soạn theo chủ đề này)</label>
                            <input value={topic} onChange={e=>setTopic(e.target.value)} className={`input-field ${styles.inputBg}`} placeholder="VD: Hệ phương trình bậc nhất" />
                        </div>
                    </div>
                    <div className="mb-6">
                        <div className="flex justify-between items-center mb-2">
                            <label className="text-sm font-bold">Nội dung bài tập</label>
                            <button onClick={handleCreate} disabled={loading || !topic} className="text-xs bg-indigo-500/10 text-indigo-500 px-3 py-1 rounded-full font-bold hover:bg-indigo-500/20 transition-all">
                                {loading ? "Đang soạn thảo..." : "✨ AI Tự soạn nội dung"}
                            </button>
                        </div>
                        <textarea value={content} onChange={e=>setContent(e.target.value)} className={`w-full h-64 p-4 border ${styles.sidebarBorder} rounded-2xl ${styles.inputBg} font-mono text-sm`} placeholder="Nội dung hiển thị cho học sinh..." />
                    </div>
                    <button onClick={handleSave} disabled={!content} className={`w-full py-4 rounded-2xl font-bold text-white shadow-xl ${styles.primary} active:scale-[0.98] transition-all`}>Giao bài tập cho lớp {user.homeroomClass}</button>
                </div>
            </div>
        );
    }

    if (view === 'GRADE' && selectedHw) {
        const hwSubs = submissions.filter(s => s.homeworkId === selectedHw.id);
        return (
            <div className="space-y-6">
                <button onClick={() => setView('LIST')} className="flex items-center gap-2 text-sm font-bold text-gray-500"><Icons.ArrowLeft /> Quay lại danh sách</button>
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-bold">{selectedHw.title}</h2>
                    <span className="bg-green-500/10 text-green-500 px-3 py-1 rounded-full text-xs font-bold">Đã nộp: {hwSubs.length}</span>
                </div>
                <div className="space-y-4">
                    {hwSubs.length === 0 && <p className="text-center py-12 text-gray-500">Chưa có học sinh nào nộp bài.</p>}
                    {hwSubs.map(s => (
                        <div key={s.id} className={`${styles.panelBg} p-6 rounded-3xl border ${styles.sidebarBorder} shadow-sm`}>
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h4 className="font-bold text-lg">{s.studentName}</h4>
                                    <p className="text-xs text-gray-500">Nộp lúc: {new Date(s.submittedAt).toLocaleString('vi-VN')}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-bold text-indigo-500">AI Dự đoán</p>
                                    <p className="text-xl font-bold">--/10</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-900/20 p-4 rounded-2xl border border-gray-800">
                                <div>
                                    <p className="text-xs font-bold uppercase mb-2 text-gray-400">Bài làm</p>
                                    <div className="whitespace-pre-wrap text-sm">{s.answer}</div>
                                </div>
                                <div>
                                    <p className="text-xs font-bold uppercase mb-2 text-green-400">AI Nhận xét</p>
                                    <div className={`text-sm ${markdownClasses}`}><ReactMarkdown>{s.aiFeedback || "Đang chấm..."}</ReactMarkdown></div>
                                </div>
                            </div>
                            <div className="mt-4 flex gap-2">
                                <input className={`flex-1 px-4 py-2 rounded-xl text-sm border ${styles.sidebarBorder} ${styles.inputBg}`} placeholder="Lời phê của giáo viên..." />
                                <button className="bg-indigo-600 px-6 py-2 rounded-xl font-bold text-white text-sm">Lưu điểm</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Bài tập đã giao</h2>
                <button onClick={() => setView('CREATE')} className={`${styles.primary} text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-500/20 active:scale-95 transition-all`}><Icons.Plus /> Tạo bài mới</button>
            </div>
            <div className="grid grid-cols-1 gap-4">
                {homeworkList.length === 0 && <p className="text-center py-12 text-gray-500">Bạn chưa giao bài tập nào.</p>}
                {homeworkList.map(h => (
                    <div key={h.id} className={`${styles.panelBg} p-6 rounded-3xl border ${styles.sidebarBorder} flex items-center justify-between shadow-sm group hover:border-indigo-500/50 transition-all`}>
                        <div>
                            <span className="text-xs font-bold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded uppercase">{h.subject}</span>
                            <h4 className="font-bold text-lg mt-1">{h.title}</h4>
                            <p className="text-xs text-gray-500 mt-1">Lớp: {h.targetId} • {new Date(h.createdAt).toLocaleDateString('vi-VN')}</p>
                        </div>
                        <button onClick={() => { setSelectedHw(h); setView('GRADE'); }} className="bg-gray-800 hover:bg-gray-700 px-5 py-2.5 rounded-xl font-bold text-sm transition-colors">Xem bài nộp</button>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- STUDENT: BÀI TẬP VỀ NHÀ ---
const StudentHomeworkView = ({ user, styles }: { user: User, styles: any }) => {
    const homework = useData('homework', loadHomework).filter(h => h.targetId === user.classId);
    const submissions = useData('submissions', loadSubmissions).filter(s => s.studentId === user.id);
    const [selectedHw, setSelectedHw] = useState<Homework | null>(null);
    const [answer, setAnswer] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSumbit = async () => {
        if(!selectedHw || !answer) return;
        setLoading(true);
        const feedback = await gradeStudentQuiz(selectedHw.content, answer);
        const newSub: StudentSubmission = {
            id: Date.now().toString(),
            homeworkId: selectedHw.id,
            studentId: user.id,
            studentName: user.name,
            answer,
            submittedAt: new Date().toISOString(),
            aiFeedback: feedback
        };
        saveSubmissions([...loadSubmissions(), newSub]);
        setLoading(false);
        setSelectedHw(null);
        setAnswer("");
        alert("Đã nộp bài thành công!");
    };

    if (selectedHw) {
        return (
            <div className="space-y-6">
                <button onClick={() => setSelectedHw(null)} className="flex items-center gap-2 text-sm font-bold text-gray-500"><Icons.ArrowLeft /> Quay lại</button>
                <div className={`${styles.panelBg} p-8 rounded-3xl border ${styles.sidebarBorder} shadow-lg`}>
                    <h2 className="text-2xl font-bold mb-2">{selectedHw.title}</h2>
                    <div className="bg-indigo-500/5 p-6 rounded-2xl border border-indigo-500/20 mb-8">
                        <div className={markdownClasses}><ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{selectedHw.content}</ReactMarkdown></div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold mb-2">Bài làm của bạn</label>
                        <textarea value={answer} onChange={e=>setAnswer(e.target.value)} className={`w-full h-64 p-4 border ${styles.sidebarBorder} rounded-2xl ${styles.inputBg} mb-6`} placeholder="Nhập câu trả lời hoặc cách giải của bạn vào đây..." />
                    </div>
                    <button onClick={handleSumbit} disabled={loading || !answer} className={`w-full py-4 rounded-2xl font-bold text-white shadow-xl ${styles.primary} transition-all`}>
                        {loading ? "Đang xử lý nộp bài..." : "Nộp bài cho giáo viên"}
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-bold">Bài tập của tôi</h2>
            <div className="grid grid-cols-1 gap-4">
                {homework.length === 0 && <p className="text-center py-12 text-gray-500">Chưa có bài tập nào được giao cho lớp của bạn.</p>}
                {homework.map(h => {
                    const isSubmitted = submissions.find(s => s.homeworkId === h.id);
                    return (
                        <div key={h.id} className={`${styles.panelBg} p-6 rounded-3xl border ${styles.sidebarBorder} flex items-center justify-between shadow-sm`}>
                            <div>
                                <span className="text-xs font-bold text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded uppercase">{h.subject}</span>
                                <h4 className="font-bold text-lg mt-1">{h.title}</h4>
                                <p className="text-xs text-gray-500 mt-1">Đăng ngày: {new Date(h.createdAt).toLocaleDateString('vi-VN')}</p>
                            </div>
                            {isSubmitted ? (
                                <span className="text-green-500 font-bold flex items-center gap-1"><Icons.Check /> Đã nộp</span>
                            ) : (
                                <button onClick={() => setSelectedHw(h)} className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:scale-105 transition-all">Làm bài</button>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// --- GIA SƯ AI ---
const SmartAITutor = ({ user, styles }: { user: User, styles: any }) => {
    const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => { if(scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight; }, [messages]);

    const handleSend = async () => {
        if(!input.trim()) return;
        const currentIn = input;
        setInput("");
        setMessages(p => [...p, {role: 'user', text: currentIn}]);
        setLoading(true);
        try {
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const result = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `Bạn là gia sư AI cho học sinh Việt Nam. Trả lời câu hỏi sau bằng tiếng Việt, trình bày thoáng, xuống dòng rõ ràng giữa các ý: "${currentIn}"`,
            });
            setMessages(p => [...p, {role: 'model', text: result.text || "Xin lỗi, tôi gặp chút trục trặc."}]);
        } catch (e) { setMessages(p => [...p, {role: 'model', text: "Lỗi kết nối AI."}]); }
        setLoading(false);
    };

    return (
        <div className="flex flex-col h-[70vh] max-w-4xl mx-auto space-y-4">
            <div className={`flex-1 overflow-y-auto p-6 space-y-4 ${styles.panelBg} rounded-3xl border ${styles.sidebarBorder} shadow-lg`} ref={scrollRef}>
                {messages.length === 0 && (
                    <div className="h-full flex flex-col items-center justify-center text-center opacity-50 space-y-4">
                        <div className="text-6xl text-indigo-500"><Icons.Robot /></div>
                        <h3 className="text-xl font-bold">Tôi có thể giúp gì cho bạn?</h3>
                        <p className="text-sm max-w-xs">Hỏi về cách giải toán, soạn văn, hoặc tạo đề thi thử bất cứ lúc nào.</p>
                    </div>
                )}
                {messages.map((m, i) => (
                    <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[85%] p-4 rounded-2xl ${m.role === 'user' ? `${styles.primary} text-white` : 'bg-gray-800/50 border border-gray-700'} ${markdownClasses}`}>
                            <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>{m.text}</ReactMarkdown>
                        </div>
                    </div>
                ))}
                {loading && <div className="text-xs text-indigo-500 animate-pulse font-bold">Gia sư AI đang suy nghĩ...</div>}
            </div>
            <div className="relative">
                <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key === 'Enter' && handleSend()} placeholder="Hỏi AI bất cứ điều gì..." className={`w-full p-5 pr-16 rounded-2xl border ${styles.sidebarBorder} ${styles.inputBg} focus:ring-2 focus:ring-indigo-500 outline-none shadow-lg`} />
                <button onClick={handleSend} className="absolute right-4 top-4 p-2 text-indigo-500 hover:bg-indigo-500/10 rounded-xl transition-all"><Icons.Send /></button>
            </div>
        </div>
    );
};

// --- AUTH SCREEN ---
const AuthScreen = ({ onLogin, currentTheme, setTheme, styles }: { onLogin: (u: User) => void, currentTheme: ThemeType, setTheme: (t: ThemeType) => void, styles: any }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
  const [formData, setFormData] = useState({ phone: '', password: '', name: '', classId: '', homeroomClass: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const users = loadUsers();
    if (isRegister) {
      if (users.find(u => u.phone === formData.phone)) return alert("Số điện thoại đã tồn tại!");
      const newUser: User = { 
          id: Date.now().toString(), phone: formData.phone, province: 'Hà Nội', password: formData.password, role, name: formData.name, status: 'active',
          classId: role === UserRole.STUDENT ? formData.classId : undefined,
          homeroomClass: role === UserRole.TEACHER ? formData.homeroomClass : undefined
      };
      saveUsers([...users, newUser]);
      onLogin(newUser);
    } else {
      const found = users.find(u => u.phone === formData.phone && u.password === formData.password);
      if (found) onLogin(found); else alert("Thông tin đăng nhập không chính xác!");
    }
  };

  return (
    <div className={`min-h-screen ${styles.bg} flex items-center justify-center p-6 transition-all duration-500`}>
      <div className="absolute top-8 right-8 flex gap-2">
           {['light', 'dark', 'tech', 'edu'].map(t => (
               <button key={t} onClick={()=>setTheme(t as ThemeType)} className={`w-8 h-8 rounded-full border-2 ${t === currentTheme ? 'border-indigo-500' : 'border-gray-800'}`} style={{background: t === 'light' ? '#fff' : t === 'dark' ? '#111' : t === 'tech' ? '#050b14' : '#f0f9ff'}} title={t} />
           ))}
      </div>
      <div className={`w-full max-w-lg ${styles.panelBg} border ${styles.sidebarBorder} p-12 rounded-[2.5rem] shadow-2xl`}>
          <div className="text-center mb-10">
              <div className={`inline-block p-4 rounded-3xl ${styles.primary} mb-6 text-white shadow-xl shadow-indigo-500/30`}><Icons.Book /></div>
              <h2 className="text-4xl font-bold tracking-tight">Edu AI</h2>
              <p className={`mt-2 ${styles.accentText}`}>Học tập thông minh hơn mỗi ngày</p>
          </div>
          <div className="flex bg-gray-900/50 p-1 rounded-2xl mb-8 border border-gray-800">
              <button onClick={()=>setIsRegister(false)} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${!isRegister ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400'}`}>Đăng nhập</button>
              <button onClick={()=>setIsRegister(true)} className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${isRegister ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-400'}`}>Đăng ký</button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
              {isRegister && (
                  <div className="flex bg-gray-900/50 p-1 rounded-xl mb-4 border border-gray-800">
                    <button type="button" onClick={()=>setRole(UserRole.STUDENT)} className={`flex-1 py-2 rounded-lg text-xs font-bold ${role === UserRole.STUDENT ? 'bg-indigo-500 text-white' : 'text-gray-400'}`}>Học sinh</button>
                    <button type="button" onClick={()=>setRole(UserRole.TEACHER)} className={`flex-1 py-2 rounded-lg text-xs font-bold ${role === UserRole.TEACHER ? 'bg-indigo-500 text-white' : 'text-gray-400'}`}>Giáo viên</button>
                  </div>
              )}
              {isRegister && <div><label className="block text-xs font-bold mb-2 uppercase text-gray-500">Họ và tên</label><input required className={`input-field p-4 ${styles.inputBg}`} value={formData.name} onChange={e=>setFormData({...formData, name:e.target.value})} /></div>}
              <div><label className="block text-xs font-bold mb-2 uppercase text-gray-500">Số điện thoại</label><input required className={`input-field p-4 ${styles.inputBg}`} value={formData.phone} onChange={e=>setFormData({...formData, phone:e.target.value})} /></div>
              {isRegister && (
                  role === UserRole.STUDENT ? (
                    <div><label className="block text-xs font-bold mb-2 uppercase text-gray-500">Lớp (Mã lớp, VD: 9A1)</label><input required className={`input-field p-4 ${styles.inputBg}`} placeholder="VD: 9A1" value={formData.classId} onChange={e=>setFormData({...formData, classId:e.target.value})} /></div>
                  ) : (
                    <div><label className="block text-xs font-bold mb-2 uppercase text-gray-500">Lớp bạn chủ nhiệm (VD: 9A1)</label><input required className={`input-field p-4 ${styles.inputBg}`} placeholder="VD: 9A1" value={formData.homeroomClass} onChange={e=>setFormData({...formData, homeroomClass:e.target.value})} /></div>
                  )
              )}
              <div><label className="block text-xs font-bold mb-2 uppercase text-gray-500">Mật khẩu</label><input required type="password" className={`input-field p-4 ${styles.inputBg}`} value={formData.password} onChange={e=>setFormData({...formData, password:e.target.value})} /></div>
              <button type="submit" className={`w-full py-4 rounded-2xl font-bold text-white shadow-xl ${styles.primary} hover:scale-[1.02] transition-all mt-4`}>{isRegister ? 'Bắt đầu học ngay' : 'Truy cập tài khoản'}</button>
          </form>
      </div>
    </div>
  );
};

export default App;
