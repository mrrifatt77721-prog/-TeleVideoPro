import React, { useState } from 'react';
import { 
  X, Download, Github, Globe, FileCode2, Terminal, Check, Copy, 
  ExternalLink, Sparkles, FolderArchive, ArrowRight, ShieldCheck, HelpCircle
} from 'lucide-react';
import { triggerHaptic } from '../utils/telegram';

interface AppExportModalProps {
  onClose: () => void;
  theme?: 'dark' | 'light';
}

export const AppExportModal: React.FC<AppExportModalProps> = ({
  onClose,
  theme = 'dark',
}) => {
  const isLight = theme === 'light';
  const [copiedCmd, setCopiedCmd] = useState(false);
  const [activeTab, setActiveTab] = useState<'download' | 'guide'>('download');

  const gitCommands = `# ১. প্রজেক্ট ফোল্ডারে টার্মিনাল খুলুন
git init
git add .
git commit -m "TeleVideo Pro Source Code"
git branch -M main

# ২. আপনার GitHub Repository লিংক বসিয়ে পুশ করুন
git remote add origin https://github.com/<YOUR-USERNAME>/televideo-pro.git
git push -u origin main`;

  const handleCopyCommands = () => {
    triggerHaptic('medium');
    if (navigator.clipboard) {
      navigator.clipboard.writeText(gitCommands);
      setCopiedCmd(true);
      setTimeout(() => setCopiedCmd(false), 2500);
    }
  };

  const handleDownload = (filename: string) => {
    triggerHaptic('heavy');
    const link = document.createElement('a');
    link.href = `./downloads/${filename}`;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className={`relative w-full max-w-lg max-h-[92vh] overflow-y-auto rounded-3xl border shadow-2xl p-4 sm:p-6 transition-all ${
          isLight 
            ? 'bg-white text-slate-900 border-slate-200' 
            : 'bg-[#121829] text-slate-100 border-purple-900/50'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-900/30 mb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-600/20 border border-purple-500/40 flex items-center justify-center text-purple-400">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm sm:text-base font-extrabold flex items-center gap-1.5">
                <span>অ্যাপ ফাইল ডাউনলোড ও GitHub হোস্টিং</span>
                <span className="px-1.5 py-0.2 rounded bg-emerald-950 border border-emerald-500/50 text-emerald-400 text-[9px] font-bold">
                  Free
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">
                পুরো প্রজেক্টের কোড ডাউনলোড করে গিটহাবে ফ্রিতে হোস্ট করুন
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              triggerHaptic('light');
              onClose();
            }}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-[#0b101e] border border-purple-900/40 mb-3.5">
          <button
            onClick={() => setActiveTab('download')}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'download'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Download className="w-3.5 h-3.5" />
            <span>ফাইল ডাউনলোড (.ZIP)</span>
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`py-1.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'guide'
                ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>GitHub হোস্টিং গাইড</span>
          </button>
        </div>

        {/* TAB 1: DOWNLOAD OPTIONS */}
        {activeTab === 'download' && (
          <div className="space-y-3">
            {/* 1. Full Source Code ZIP (For GitHub Repo) */}
            <div className="p-3.5 rounded-2xl bg-[#0b101e] border border-purple-500/40 space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-600/20 text-purple-400 flex items-center justify-center">
                    <FileCode2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1">
                      <span>সম্পূর্ণ সোর্স কোড (Source Code .ZIP)</span>
                      <span className="text-[10px] text-amber-400 font-mono">Recommended</span>
                    </h4>
                    <p className="text-[10.5px] text-slate-400 mt-0.5">
                      GitHub রিপোজিটরিতে আপলোড করার জন্য সম্পূর্ণ React + Vite সোর্স কোড।
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 text-[10px] text-slate-300 font-mono bg-black/40 p-2 rounded-lg border border-purple-900/30">
                <span>📁 src/</span>
                <span>•</span>
                <span>⚙️ package.json</span>
                <span>•</span>
                <span>⚡ .github/workflows/deploy.yml (অটো হোস্টিং)</span>
              </div>

              <button
                onClick={() => handleDownload('televideo-pro-source.zip')}
                className="w-full py-2 px-3 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-all glow-btn-purple"
              >
                <Download className="w-4 h-4" />
                <span>📥 সোর্স কোড জিপ ডাউনলোড করুন (televideo-pro-source.zip)</span>
              </button>
            </div>

            {/* 2. Pre-Built Static Dist ZIP (Direct Hosting Drop) */}
            <div className="p-3.5 rounded-2xl bg-[#0b101e] border border-emerald-500/40 space-y-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                    <FolderArchive className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-white flex items-center gap-1">
                      <span>রেডি-টু-হোস্ট বিল্ড (Production Build .ZIP)</span>
                      <span className="text-[10px] text-emerald-400 font-mono">Instant Live</span>
                    </h4>
                    <p className="text-[10.5px] text-slate-400 mt-0.5">
                      কম্পাইল্ড প্রোডাকশন ফাইল (index.html, assets)। সরাসরি ড্র্যাগ অ্যান্ড ড্রপ করে লাইভ করার জন্য।
                    </p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => handleDownload('televideo-pro-gh-pages-dist.zip')}
                className="w-full py-2 px-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs rounded-xl shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-98 transition-all glow-btn-green"
              >
                <Download className="w-4 h-4" />
                <span>🚀 বিল্ড ফাইল জিপ ডাউনলোড করুন (dist.zip)</span>
              </button>
            </div>

            {/* Free Hosting Badges */}
            <div className="p-2.5 bg-purple-950/30 rounded-xl border border-purple-900/30 flex items-center justify-between text-[11px] text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>GitHub Pages, Vercel ও Netlify-তে ১০০% ফ্রি হোস্টিং সাপোর্ট।</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: STEP-BY-STEP GITHUB HOSTING GUIDE */}
        {activeTab === 'guide' && (
          <div className="space-y-3 animate-fadeIn text-xs">
            {/* Step 1 */}
            <div className="p-3 bg-[#0b101e] rounded-xl border border-purple-900/30 space-y-1">
              <div className="flex items-center gap-2 text-amber-400 font-bold">
                <span className="w-5 h-5 rounded-full bg-amber-500/20 flex items-center justify-center text-[10px]">১</span>
                <span>GitHub এ নতুন Repository তৈরি করুন</span>
              </div>
              <p className="text-slate-300 text-[11px] pl-7">
                <a 
                  href="https://github.com/new" 
                  target="_blank" 
                  rel="noreferrer"
                  className="text-purple-400 hover:underline font-bold inline-flex items-center gap-1"
                >
                  github.com/new <ExternalLink className="w-2.5 h-2.5" />
                </a> 
                -এ যান এবং প্রজেক্টের নাম দিন (যেমন: <code>televideo-pro</code>) এবং <strong>Public</strong> রেখে Create বাটনে চাপুন।
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-3 bg-[#0b101e] rounded-xl border border-purple-900/30 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-purple-400 font-bold">
                  <span className="w-5 h-5 rounded-full bg-purple-500/20 flex items-center justify-center text-[10px]">২</span>
                  <span>কোড গিটহাবে পুশ করার কমান্ড</span>
                </div>
                <button
                  onClick={handleCopyCommands}
                  className="px-2 py-1 bg-purple-900/60 hover:bg-purple-800 text-purple-200 rounded-md text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                >
                  {copiedCmd ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copiedCmd ? 'কপি হয়েছে!' : 'কমান্ড কপি করুন'}</span>
                </button>
              </div>

              <pre className="p-2.5 bg-black/70 rounded-lg text-emerald-400 font-mono text-[10px] overflow-x-auto border border-slate-800 leading-relaxed">
                {gitCommands}
              </pre>
              <p className="text-[10px] text-slate-400 pl-1">
                (অথবা GitHub পেজে সরাসরি <strong>Upload files</strong> বাটনে ক্লিক করে জিপ আনজিপ করে সব ফাইল টেনে ছেড়ে দিলেও হবে)
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-3 bg-[#0b101e] rounded-xl border border-purple-900/30 space-y-1.5">
              <div className="flex items-center gap-2 text-emerald-400 font-bold">
                <span className="w-5 h-5 rounded-full bg-emerald-500/20 flex items-center justify-center text-[10px]">৩</span>
                <span>GitHub Pages এ অটোমেটিক হোস্টিং চালু করুন</span>
              </div>
              <ul className="text-slate-300 text-[11px] pl-7 space-y-1 list-disc">
                <li>আপনার রিপোজিটরির <strong>Settings</strong> ট্যাবে যান।</li>
                <li>বাম পাশের মেনু থেকে <strong>Pages</strong> এ ক্লিক করুন।</li>
                <li><strong>Build and deployment → Source</strong> এ <strong>"GitHub Actions"</strong> সিলেক্ট করুন।</li>
                <li>আমরা ইতিমধ্যেই <code>.github/workflows/deploy.yml</code> দিয়ে রেখেছি, ফলে এটি স্বয়ংক্রিয়ভাবে লাইভ সাইট তৈরি করে দেবে!</li>
              </ul>
            </div>

            {/* Live Domain Box */}
            <div className="p-2.5 bg-gradient-to-r from-emerald-950/50 to-teal-950/50 rounded-xl border border-emerald-500/40 flex items-center gap-2 text-[11px] text-emerald-300">
              <Globe className="w-4 h-4 shrink-0 text-emerald-400" />
              <span>আপনার লাইভ ডোমেইন হবে: <strong>https://&lt;username&gt;.github.io/televideo-pro/</strong></span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
