
import React, { useState, useEffect } from 'react';
import { AppScreen, GeneratorOptions, GeneratedResult } from './types';
import { QUESTIONS, STYLES, TARGETS, LOADING_MESSAGES } from './constants';
import { generateComeback } from './services/geminiService';

const App: React.FC = () => {
  const [screen, setScreen] = useState<AppScreen>(AppScreen.SETUP);
  const [options, setOptions] = useState<GeneratorOptions>({
    question: QUESTIONS[0],
    style: STYLES[0].label,
    target: '',
  });
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setScreen(AppScreen.LOADING);
    setError(null);
    
    // Cycle loading messages
    const interval = setInterval(() => {
      setLoadingMsg(LOADING_MESSAGES[Math.floor(Math.random() * LOADING_MESSAGES.length)]);
    }, 2000);

    try {
      const generated = await generateComeback(options);
      setResult(generated);
      setScreen(AppScreen.RESULT);
    } catch (err) {
      setError("哎呀，服务器走神了，请稍后再试。");
      setScreen(AppScreen.SETUP);
    } finally {
      clearInterval(interval);
    }
  };

  const reset = () => {
    setScreen(AppScreen.SETUP);
    setResult(null);
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result.response);
      alert("回复已复制到剪贴板！");
    }
  };

  const handleRandomSelect = () => {
    const randomQ = QUESTIONS[Math.floor(Math.random() * QUESTIONS.length)];
    const randomS = STYLES[Math.floor(Math.random() * STYLES.length)].label;
    const randomT = TARGETS[Math.floor(Math.random() * TARGETS.length)];
    setOptions({ question: randomQ, style: randomS, target: randomT });
    handleGenerate();
  };

  return (
    <div className="min-h-screen">
      {screen === AppScreen.SETUP && (
        <div className="max-w-md mx-auto min-h-screen flex flex-col pb-10 festive-red-bg text-gray-900 overflow-y-auto">
          <header className="pt-12 pb-6 px-6 text-center">
            <h1 className="text-white text-3xl font-extrabold mb-3 tracking-tight">
                🧧 春节高情商护体神器
            </h1>
            <p className="text-white/90 text-sm font-medium leading-relaxed max-w-[280px] mx-auto">
                专治长辈灵魂拷问：单身、红包、孩子… 10 秒生成完美回复
            </p>
            <div className="mt-4">
              <span className="inline-block bg-white/10 backdrop-blur-md border border-white/20 text-white/80 text-[10px] uppercase tracking-widest py-1 px-3 rounded-full">
                  完全免费 · 无需注册
              </span>
            </div>
          </header>

          <main className="px-5 space-y-4">
            <div className="px-1">
              <p className="text-white/90 text-sm font-bold flex items-center gap-1">
                  👉 先选一个问题试试看，只需 10 秒
              </p>
            </div>

            <section className="bg-beige rounded-ios p-5 ios-shadow">
              <label className="block text-primary font-bold text-base mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-xl">forum</span>
                亲朋好友问了什么？
              </label>
              <div className="flex flex-wrap gap-2">
                {QUESTIONS.map((q) => (
                  <button
                    key={q}
                    onClick={() => setOptions({ ...options, question: q })}
                    className={`text-sm font-medium px-4 py-2 rounded-full border transition-all ${
                      options.question === q ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200'
                    }`}
                  >
                    {q}
                  </button>
                ))}
              </div>
              <button 
                onClick={handleRandomSelect}
                className="w-full mt-4 bg-white/50 border-2 border-dashed border-primary/30 text-primary font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-white/80 transition-colors"
              >
                🎲 我懒得选，直接生成
              </button>
            </section>

            <section className="bg-beige rounded-ios p-5 ios-shadow">
              <label className="block text-primary font-bold text-base mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-xl">auto_awesome</span>
                你想用什么风格？
              </label>
              <div className="grid grid-cols-2 gap-3">
                {STYLES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setOptions({ ...options, style: s.label })}
                    className={`flex items-center gap-2 p-3 rounded-2xl border-2 transition-all ${
                      options.style === s.label ? 'bg-white border-primary text-primary font-bold' : 'bg-white border-gray-200 text-gray-600 font-medium'
                    }`}
                  >
                    <span className="material-symbols-outlined">{s.icon}</span>
                    {s.label}
                  </button>
                ))}
              </div>
            </section>

            <section className="bg-beige rounded-ios p-5 ios-shadow">
              <label className="block text-primary font-bold text-base mb-4 flex items-center gap-2">
                <span className="material-symbols-outlined text-xl">groups</span>
                对方是谁？（可选）
              </label>
              <div className="flex flex-wrap gap-2 pb-1">
                {TARGETS.map((t) => (
                  <button
                    key={t}
                    onClick={() => setOptions({ ...options, target: t })}
                    className={`whitespace-nowrap text-sm font-medium px-4 py-2 rounded-full border transition-all ${
                      options.target === t ? 'bg-primary text-white border-primary' : 'bg-white text-gray-600 border-gray-200'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </section>

            {error && <p className="text-white bg-red-600/50 p-3 rounded-lg text-sm text-center font-bold">{error}</p>}

            <div className="pt-4 pb-2">
              <button 
                onClick={handleGenerate}
                className="w-full bg-gold hover:opacity-90 active:scale-[0.98] transition-all text-red-900 font-black text-xl py-5 rounded-ios shadow-xl flex items-center justify-center gap-2 border-b-4 border-yellow-600"
              >
                🎯 生成我的完美回复
              </button>
            </div>
          </main>

          <footer className="mt-auto px-6 py-8 text-center">
            <p className="text-white/40 text-[10px] leading-loose">
              温馨提示：本工具仅供娱乐及缓解社交尴尬使用<br/>
              愿大家都能过个清净、舒心、快乐的平安年
            </p>
            <div className="mt-6 flex justify-center opacity-30">
              <div className="w-12 h-1 bg-gold rounded-full"></div>
            </div>
          </footer>

          <div className="fixed top-0 left-0 p-4 opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-8xl text-white">grid_view</span>
          </div>
          <div className="fixed bottom-0 right-0 p-4 opacity-10 pointer-events-none">
            <span className="material-symbols-outlined text-8xl text-white">celebration</span>
          </div>
        </div>
      )}

      {screen === AppScreen.LOADING && (
        <div className="max-w-md mx-auto min-h-screen flex flex-col items-center justify-center festive-red-bg px-6 text-center">
           <div className="relative mb-8">
             <div className="w-24 h-24 border-8 border-white/20 border-t-gold rounded-full animate-spin"></div>
             <span className="absolute inset-0 flex items-center justify-center text-4xl">🧧</span>
           </div>
           <h2 className="text-white text-2xl font-bold mb-4">秘籍生成中...</h2>
           <p className="text-white/80 text-lg animate-pulse">{loadingMsg}</p>
        </div>
      )}

      {screen === AppScreen.RESULT && result && (
        <div className="max-w-md mx-auto min-h-screen flex flex-col relative bg-background-light dark:bg-[#211111] overflow-y-auto">
          <header className="flex flex-col items-center pt-8 pb-4 px-4 sticky top-0 bg-background-light/80 dark:bg-[#211111]/80 backdrop-blur-md z-10">
            <div className="flex items-center justify-between w-full mb-2">
              <button onClick={reset} className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-sm">
                <span className="material-symbols-outlined text-gray-900 dark:text-white">chevron_left</span>
              </button>
              <h2 className="text-primary text-xl font-bold tracking-tight">🧧 你的高情商护体回复</h2>
              <button className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-sm">
                <span className="material-symbols-outlined text-gray-900 dark:text-white">share</span>
              </button>
            </div>
            <p className="text-primary/70 text-sm font-medium tracking-wide">关键时刻，用对一句话</p>
          </header>

          <main className="flex-1 px-4 py-2 space-y-6">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-gold/20 to-primary/20 rounded-xl blur opacity-25"></div>
              <div className="relative bg-beige-card dark:bg-[#2d1b1b] p-6 rounded-xl shadow-sm border border-gold/30 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <span className="bg-primary/10 text-primary text-xs font-bold px-2 py-1 rounded uppercase tracking-wider">推荐回复</span>
                  <span className="material-symbols-outlined text-gold opacity-50">auto_awesome</span>
                </div>
                <div className="py-4">
                  <h3 className="text-[#1b0e0e] dark:text-white text-2xl font-bold leading-relaxed">
                    {result.response}
                  </h3>
                </div>
                <div className="bg-white/50 dark:bg-black/20 p-3 rounded-lg flex items-start gap-3">
                  <span className="material-symbols-outlined text-primary text-sm mt-0.5">lightbulb</span>
                  <p className="text-[#994d51] dark:text-red-200 text-sm font-medium leading-snug">
                    {result.tip}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button onClick={copyToClipboard} className="flex items-center justify-center gap-2 h-14 bg-primary text-white rounded-xl font-bold text-base shadow-lg shadow-primary/20 active:scale-95 transition-transform">
                <span className="material-symbols-outlined text-[20px]">content_copy</span>
                <span>一键复制</span>
              </button>
              <button onClick={handleGenerate} className="flex items-center justify-center gap-2 h-14 bg-[#f3e7e8] dark:bg-red-900/30 text-primary dark:text-red-200 rounded-xl font-bold text-base border border-primary/10 active:scale-95 transition-transform">
                <span>🔁 不满意？再来一个</span>
              </button>
            </div>

            <div className="pt-4">
              <h4 className="text-[#994d51] dark:text-red-300 text-sm font-bold leading-normal tracking-wide text-center mb-4">
                  觉得好用？分享给朋友一起过年不尴尬 👇
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <button className="flex items-center justify-center gap-2 h-12 bg-white dark:bg-gray-800 text-[#1b0e0e] dark:text-white rounded-xl font-semibold text-sm shadow-sm border border-gray-100 dark:border-gray-700">
                  <span className="material-symbols-outlined text-green-500 text-[20px]">chat_bubble</span>
                  <span>微信分享</span>
                </button>
                <button onClick={() => {navigator.clipboard.writeText(window.location.href); alert("链接已复制！")}} className="flex items-center justify-center gap-2 h-12 bg-white dark:bg-gray-800 text-[#1b0e0e] dark:text-white rounded-xl font-semibold text-sm shadow-sm border border-gray-100 dark:border-gray-700">
                  <span className="material-symbols-outlined text-blue-500 text-[20px]">link</span>
                  <span>复制链接</span>
                </button>
              </div>
            </div>

            <div className="pt-6">
              <div className="bg-white/40 dark:bg-gray-800/40 p-4 rounded-xl border border-gold/10 flex flex-col items-center justify-center text-center">
                <p className="text-[#994d51] dark:text-gray-400 text-sm font-medium">发现更多好玩的春节互动工具</p>
              </div>
            </div>
          </main>

          <footer className="py-8 px-4 text-center mt-auto">
            <p className="text-[#994d51]/50 dark:text-gray-500 text-xs font-medium uppercase tracking-widest">
                本工具仅供娱乐与参考
            </p>
            <div className="mt-4 flex justify-center gap-4 text-primary/30">
              <span className="material-symbols-outlined text-sm">stars</span>
              <span className="material-symbols-outlined text-sm">favorite</span>
              <span className="material-symbols-outlined text-sm">celebration</span>
            </div>
          </footer>
        </div>
      )}
    </div>
  );
};

export default App;
