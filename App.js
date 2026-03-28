import React, { useState, useEffect } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Plus, 
  Trash2, 
  Trophy, 
  LayoutDashboard,
  Moon, 
  Sun,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Lightbulb,
  BrainCircuit,
  Zap,
  Settings,
  User,
  Languages,
  ChevronRight,
  PartyPopper,
  GraduationCap,
  Clock
} from 'lucide-react';
import confetti from 'canvas-confetti';

const App = () => {
  // --- Profile & Settings State ---
  const [profile, setProfile] = useState(() => {
    const saved = localStorage.getItem('enjaz_profile');
    return saved ? JSON.parse(saved) : { name: '', age: '', college: '', language: 'ar' };
  });
  
  const [isFirstTime, setIsFirstTime] = useState(!profile.name);
  const [darkMode, setDarkMode] = useState(false);
  
  // --- Core App State ---
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('enjaz_tasks');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [points, setPoints] = useState(() => {
    const saved = localStorage.getItem('enjaz_points');
    return saved ? parseInt(saved) : 0;
  });

  const [activeTab, setActiveTab] = useState('tasks');
  const [newTask, setNewTask] = useState('');
  
  // --- Pomodoro State ---
  const [customMinutes, setCustomMinutes] = useState(25);
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  // --- AI Organizer State ---
  const [aiStep, setAiStep] = useState(0);
  const [aiAnswers, setAiAnswers] = useState({ focus: '', time: '', energy: '' });
  const [isAiProcessing, setIsAiProcessing] = useState(false);

  // --- Persistence ---
  useEffect(() => {
    localStorage.setItem('enjaz_profile', JSON.stringify(profile));
    localStorage.setItem('enjaz_tasks', JSON.stringify(tasks));
    localStorage.setItem('enjaz_points', points.toString());
  }, [profile, tasks, points]);

  // Timer Logic
  useEffect(() => {
    let timer = null;
    if (isActive && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
    return () => clearInterval(timer);
  }, [isActive, timeLeft]);

  const handleResetTimer = () => {
    setIsActive(false);
    setTimeLeft(customMinutes * 60);
  };

  const getFirstName = (fullName) => fullName ? fullName.split(' ')[0] : 'بطل';

  const handleFinishTask = (id) => {
    setTasks(tasks.map(t => {
      if (t.id === id && !t.done) {
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#6366f1', '#a855f7', '#ec4899']
        });
        setPoints(prev => prev + 100);
        return { ...t, done: true };
      }
      return t;
    }));
  };

  const addTask = (text = newTask) => {
    if (!text.trim()) return;
    const item = { id: Date.now(), text, done: false, createdAt: Date.now() };
    setTasks([item, ...tasks]);
    setNewTask('');
  };

  const generateAiSchedule = () => {
    setIsAiProcessing(true);
    setTimeout(() => {
      const suggestedTasks = [
        `تركيز مكثف على ${aiAnswers.focus} (${aiAnswers.time})`,
        `مراجعة أهداف الكلية والمستقبل`,
        `استراحة سريعة لتجديد الطاقة (${aiAnswers.energy})`
      ];
      suggestedTasks.forEach((t, i) => {
        setTimeout(() => addTask(t), i * 100);
      });
      setIsAiProcessing(false);
      setAiStep(0);
      setActiveTab('tasks');
    }, 1500);
  };

  if (isFirstTime) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 text-white font-sans" dir="rtl">
        <div className="max-w-md w-full space-y-6 animate-in fade-in zoom-in duration-500">
          <div className="text-center mb-8">
            <div className="bg-indigo-600 w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-2xl shadow-indigo-500/20">
              <Zap size={40} fill="currentColor" />
            </div>
            <h1 className="text-4xl font-black mb-2">أهلاً بك في إنجاز</h1>
            <p className="text-slate-400 font-bold">لنبني مستقبلك الأكاديمي والمهني</p>
          </div>
          <div className="space-y-4">
            <input 
              className="w-full p-5 bg-slate-900 rounded-2xl border-2 border-slate-800 focus:border-indigo-600 outline-none transition-all font-bold text-white"
              placeholder="الاسم الكامل"
              value={profile.name}
              onChange={e => setProfile({...profile, name: e.target.value})}
            />
            <div className="flex gap-3">
              <input 
                type="number"
                className="w-1/3 p-5 bg-slate-900 rounded-2xl border-2 border-slate-800 focus:border-indigo-600 outline-none transition-all font-bold text-white"
                placeholder="العمر"
                value={profile.age}
                onChange={e => setProfile({...profile, age: e.target.value})}
              />
              <input 
                className="w-2/3 p-5 bg-slate-900 rounded-2xl border-2 border-slate-800 focus:border-indigo-600 outline-none transition-all font-bold text-white"
                placeholder="الكلية / التخصص"
                value={profile.college}
                onChange={e => setProfile({...profile, college: e.target.value})}
              />
            </div>
            <button 
              onClick={() => profile.name && setIsFirstTime(false)}
              className="w-full bg-indigo-600 p-5 rounded-2xl font-black text-xl hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2"
            >
              ابدأ الآن <ChevronRight size={24} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'}`} dir="rtl">
      
      {/* Header */}
      <header className="max-w-6xl mx-auto p-6 md:p-10 flex justify-between items-end">
        <div className={darkMode ? 'text-white' : 'text-slate-900'}>
          <h2 className="text-indigo-600 font-black text-2xl italic mb-1">إنجاز.</h2>
          <h1 className="text-4xl font-black tracking-tight">
            يا هلا، {getFirstName(profile.name)}! 👋
          </h1>
          {profile.college && <p className={`font-bold opacity-70 flex items-center gap-2 mt-1 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}><GraduationCap size={16}/> {profile.college}</p>}
        </div>
        <div className="bg-indigo-600 text-white px-5 py-2 rounded-2xl flex items-center gap-2 shadow-lg h-fit">
          <Trophy size={18} />
          <span className="font-black text-lg">{points}</span>
        </div>
      </header>

      <main className="max-w-6xl mx-auto p-6 grid lg:grid-cols-12 gap-8">
        
        {/* Navigation Sidebar */}
        <nav className="lg:col-span-3 flex lg:flex-col gap-3 overflow-x-auto lg:overflow-visible pb-4 lg:pb-0">
          {[
            { id: 'tasks', label: 'مهامي', icon: LayoutDashboard },
            { id: 'timer', label: 'بومودورو', icon: Clock },
            { id: 'ai', label: 'المنظم الذكي', icon: BrainCircuit },
            { id: 'settings', label: 'الإعدادات', icon: Settings }
          ].map(tab => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id)} 
              className={`p-5 rounded-3xl flex items-center gap-4 transition-all min-w-[140px] lg:min-w-0 ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-xl' : darkMode ? 'bg-slate-900 text-slate-300 border border-slate-800' : 'bg-white text-slate-500 shadow-sm'}`}
            >
              <tab.icon size={20} /> <span className="font-black text-sm lg:text-base">{tab.label}</span>
            </button>
          ))}
        </nav>

        {/* Content Area */}
        <div className="lg:col-span-9">
          
          {/* Tasks View */}
          {activeTab === 'tasks' && (
            <div className="space-y-6 animate-in fade-in duration-500">
              <div className={`flex gap-3 p-3 rounded-[2rem] border-2 shadow-sm ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-indigo-50 text-slate-900'}`}>
                <input 
                  value={newTask}
                  onChange={(e) => setNewTask(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTask()}
                  placeholder="ما هي خطتك التالية؟"
                  className="flex-1 p-4 bg-transparent outline-none font-bold text-xl placeholder:opacity-40"
                />
                <button onClick={() => addTask()} className="bg-indigo-600 text-white p-4 rounded-2xl hover:scale-105 active:scale-95 transition-all">
                  <Plus size={28} />
                </button>
              </div>

              <div className="grid gap-4">
                {tasks.map(t => (
                  <div key={t.id} className={`p-6 rounded-[2.5rem] flex items-center justify-between transition-all border-2 ${t.done ? (darkMode ? 'bg-emerald-900/20 border-emerald-800 opacity-60' : 'bg-emerald-50/50 border-emerald-100 opacity-60') : (darkMode ? 'bg-slate-900 border-slate-800 text-white shadow-md' : 'bg-white border-white shadow-sm text-slate-900')}`}>
                    <div className="flex items-center gap-5 cursor-pointer flex-1" onClick={() => handleFinishTask(t.id)}>
                      {t.done ? <PartyPopper className="text-emerald-500" size={30} /> : <Circle className={darkMode ? 'text-slate-700' : 'text-slate-200'} size={30} />}
                      <span className={`text-xl font-black ${t.done ? (darkMode ? 'line-through text-emerald-500' : 'line-through text-emerald-800') : ''}`}>{t.text}</span>
                    </div>
                    <button onClick={() => setTasks(tasks.filter(x => x.id !== t.id))} className={`p-2 transition-colors ${darkMode ? 'text-slate-600 hover:text-red-400' : 'text-slate-300 hover:text-red-500'}`}>
                      <Trash2 size={20} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Pomodoro View */}
          {activeTab === 'timer' && (
            <div className={`rounded-[3rem] p-10 shadow-sm border flex flex-col items-center animate-in fade-in ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900'}`}>
              <div className="mb-10 text-center">
                <h2 className="text-2xl font-black mb-2 italic">وقت التركيز المخصص</h2>
                <div className="flex items-center gap-3 justify-center">
                   <input 
                    type="number"
                    value={customMinutes}
                    onChange={(e) => setCustomMinutes(Math.max(1, parseInt(e.target.value) || 1))}
                    disabled={isActive}
                    className={`w-20 p-2 rounded-xl border-2 text-center font-black text-xl outline-none ${darkMode ? 'bg-slate-800 border-slate-700 text-white' : 'bg-slate-50 border-indigo-100'}`}
                   />
                   <span className="font-bold opacity-50">دقيقة</span>
                   {!isActive && (
                     <button onClick={handleResetTimer} className="bg-indigo-600 text-white px-4 py-2 rounded-xl font-bold">تطبيق</button>
                   )}
                </div>
              </div>

              <div className={`w-64 h-64 rounded-full border-[12px] flex flex-col items-center justify-center transition-all ${isActive ? 'border-indigo-600 scale-110 shadow-2xl' : darkMode ? 'border-slate-800' : 'border-slate-100'}`}>
                <span className="text-6xl font-black tabular-nums">
                  {Math.floor(timeLeft / 60).toString().padStart(2, '0')}:{(timeLeft % 60).toString().padStart(2, '0')}
                </span>
              </div>

              <div className="flex gap-4 mt-12">
                <button onClick={() => setIsActive(!isActive)} className="bg-indigo-600 text-white px-12 py-5 rounded-2xl font-black text-xl shadow-xl hover:scale-105 active:scale-95 transition-all">
                  {isActive ? <Pause size={24} /> : <Play size={24} />} {isActive ? 'توقف' : 'ابدأ'}
                </button>
                <button onClick={handleResetTimer} className={`p-5 rounded-2xl transition-all hover:rotate-90 ${darkMode ? 'bg-slate-800 text-white' : 'bg-slate-100 text-slate-900'}`}>
                  <RotateCcw size={24} />
                </button>
              </div>
            </div>
          )}

          {/* AI Organizer View */}
          {activeTab === 'ai' && (
            <div className="bg-indigo-600 rounded-[3rem] p-10 text-white shadow-2xl animate-in zoom-in-95 overflow-hidden relative">
              <div className="relative z-10">
                <h2 className="text-3xl font-black mb-8 flex items-center gap-3"><Sparkles /> لننظم يومك بذكاء</h2>
                
                {aiStep === 0 && (
                  <div className="space-y-6">
                    <p className="text-xl font-bold opacity-80">ما هو هدفك الدراسي أو العملي اليوم؟</p>
                    <input 
                      className="w-full p-6 bg-white/10 rounded-3xl border-2 border-white/20 outline-none text-2xl font-black focus:bg-white/20 text-white placeholder:text-white/30"
                      value={aiAnswers.focus}
                      onChange={e => setAiAnswers({...aiAnswers, focus: e.target.value})}
                      placeholder="مثال: مراجعة محاضرة التشريح..."
                    />
                    <button onClick={() => setAiStep(1)} className="bg-white text-indigo-600 px-10 py-5 rounded-2xl font-black text-xl shadow-xl">التالي</button>
                  </div>
                )}

                {aiStep === 1 && (
                  <div className="space-y-6">
                    <p className="text-xl font-bold opacity-80">كم ساعة خصصت لهذا الهدف؟</p>
                    <div className="flex flex-wrap gap-4">
                      {['ساعة واحدة', '3 ساعات', '6 ساعات', 'يوم طويل'].map(t => (
                        <button key={t} onClick={() => {setAiAnswers({...aiAnswers, time: t}); setAiStep(2);}} className="flex-1 min-w-[120px] bg-white/10 p-6 rounded-3xl border-2 border-white/20 hover:bg-white/20 font-black text-white">{t}</button>
                      ))}
                    </div>
                  </div>
                )}

                {aiStep === 2 && (
                  <div className="space-y-6">
                    <p className="text-xl font-bold opacity-80">كيف تشعر بطاقتك الآن؟</p>
                    <div className="flex gap-4">
                      {['مستعد جداً 🔥', 'متوسط ⚡', 'أحتاج للبدء بهدوء ☕'].map(e => (
                        <button key={e} onClick={() => {setAiAnswers({...aiAnswers, energy: e}); generateAiSchedule();}} className="flex-1 bg-white/10 p-6 rounded-3xl border-2 border-white/20 hover:bg-white/20 font-black text-white">{e}</button>
                      ))}
                    </div>
                  </div>
                )}

                {isAiProcessing && (
                  <div className="absolute inset-0 bg-indigo-600 flex flex-col items-center justify-center space-y-4">
                    <RotateCcw className="animate-spin text-white" size={50} />
                    <p className="text-2xl font-black text-white">جاري هندسة جدولك المثالي...</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Settings View */}
          {activeTab === 'settings' && (
            <div className={`rounded-[3rem] p-10 shadow-sm border space-y-10 animate-in slide-in-from-left-4 ${darkMode ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100 text-slate-900'}`}>
              <section>
                <h3 className="text-2xl font-black mb-6 flex items-center gap-3"><User className="text-indigo-600" /> تعديل الحساب والمعلومات</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-black opacity-50 mb-2 uppercase">الاسم بالكامل</label>
                    <input 
                      className={`w-full p-4 rounded-2xl border-2 outline-none font-bold text-lg ${darkMode ? 'bg-slate-800 border-transparent focus:border-indigo-600 text-white' : 'bg-slate-50 border-transparent focus:border-indigo-600 text-slate-900'}`}
                      value={profile.name}
                      onChange={e => setProfile({...profile, name: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black opacity-50 mb-2 uppercase">العمر</label>
                    <input 
                      type="number"
                      className={`w-full p-4 rounded-2xl border-2 outline-none font-bold text-lg ${darkMode ? 'bg-slate-800 border-transparent focus:border-indigo-600 text-white' : 'bg-slate-50 border-transparent focus:border-indigo-600 text-slate-900'}`}
                      value={profile.age}
                      onChange={e => setProfile({...profile, age: e.target.value})}
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-black opacity-50 mb-2 uppercase">الكلية / التخصص</label>
                    <input 
                      className={`w-full p-4 rounded-2xl border-2 outline-none font-bold text-lg ${darkMode ? 'bg-slate-800 border-transparent focus:border-indigo-600 text-white' : 'bg-slate-50 border-transparent focus:border-indigo-600 text-slate-900'}`}
                      value={profile.college}
                      onChange={e => setProfile({...profile, college: e.target.value})}
                    />
                  </div>
                </div>
              </section>

              <section className={`pt-8 border-t ${darkMode ? 'border-slate-800' : 'border-slate-50'}`}>
                <h3 className="text-2xl font-black mb-6 flex items-center gap-3"><Languages className="text-indigo-600" /> مظهر التطبيق واللغة</h3>
                <div className="space-y-4">
                  <div className={`flex items-center justify-between p-5 rounded-2xl ${darkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                    <div className="flex items-center gap-3 font-bold">
                        {darkMode ? <Moon size={20}/> : <Sun size={20}/>}
                        <span>الوضع الليلي</span>
                    </div>
                    <button 
                      onClick={() => setDarkMode(!darkMode)}
                      className={`w-14 h-7 rounded-full transition-all relative ${darkMode ? 'bg-indigo-600' : 'bg-slate-300'}`}
                    >
                      <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${darkMode ? 'left-8' : 'left-1'}`} />
                    </button>
                  </div>
                  <div className={`flex items-center justify-between p-5 rounded-2xl ${darkMode ? 'bg-slate-800' : 'bg-slate-50'}`}>
                    <div className="flex items-center gap-3 font-bold">
                        <Languages size={20}/>
                        <span>اللغة المفضلة</span>
                    </div>
                    <span className="text-indigo-600 font-black">العربية</span>
                  </div>
                </div>
              </section>

              <button 
                onClick={() => { if(window.confirm('هل أنت متأكد من حذف جميع بياناتك؟')) { localStorage.clear(); window.location.reload(); } }}
                className={`w-full p-5 font-black border-2 rounded-2xl transition-all text-center ${darkMode ? 'text-red-400 border-red-900/30 hover:bg-red-900/10' : 'text-red-500 border-red-50 hover:bg-red-50'}`}
              >
                تصفير التطبيق (البدء من جديد)
              </button>
            </div>
          )}

        </div>
      </main>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;700;900&display=swap');
        body { font-family: 'Cairo', sans-serif; overflow-x: hidden; }
        input[type=number]::-webkit-inner-spin-button, input[type=number]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        .animate-in { animation: fadeIn 0.5s ease-out; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default App;
