import React, { useState } from 'react';
import { FileCode, Copy, Check, Download, X, ExternalLink, Sheet } from 'lucide-react';

interface GoogleSheetCodeModalProps {
  onClose: () => void;
}

export const GoogleSheetCodeModal: React.FC<GoogleSheetCodeModalProps> = ({ onClose }) => {
  const [activeFile, setActiveFile] = useState<'Code.gs' | 'Index.html'>('Code.gs');
  const [copied, setCopied] = useState(false);

  // We can fetch or provide the code
  const [codeGsContent, setCodeGsContent] = useState<string>('');
  const [indexHtmlContent, setIndexHtmlContent] = useState<string>('');
  const [loading, setLoading] = useState(true);

  React.useEffect(() => {
    Promise.all([
      fetch('/Code.gs').then(r => r.text()).catch(() => ''),
      fetch('/Index.html').then(r => r.text()).catch(() => '')
    ]).then(([gs, html]) => {
      setCodeGsContent(gs);
      setIndexHtmlContent(html);
      setLoading(false);
    });
  }, []);

  const currentContent = activeFile === 'Code.gs' ? codeGsContent : indexHtmlContent;

  const handleCopy = () => {
    navigator.clipboard.writeText(currentContent).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleDownload = () => {
    const blob = new Blob([currentContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = activeFile;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-3xl w-full border border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Sheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>গুগল শীট কোড (Code.gs & Index.html)</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">রেডি</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Google Sheets &gt; Extensions &gt; Apps Script-এ ব্যবহার করার জন্য তৈরি
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector & Copy Actions */}
        <div className="px-4 sm:px-5 py-2.5 bg-slate-50 dark:bg-slate-800/40 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveFile('Code.gs')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeFile === 'Code.gs'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Code.gs (Backend)</span>
            </button>
            <button
              onClick={() => setActiveFile('Index.html')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeFile === 'Index.html'
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>Index.html (Frontend)</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                copied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'কপি হয়েছে!' : `${activeFile} কপি করুন`}</span>
            </button>
            <button
              onClick={handleDownload}
              className="p-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
              title="ফাইল ডাউনলোড করুন"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Code Viewer */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-950 font-mono text-xs text-slate-200 leading-relaxed select-all">
          {loading ? (
            <div className="text-slate-500 py-10 text-center">কোড লোড হচ্ছে...</div>
          ) : (
            <pre className="whitespace-pre overflow-x-auto">{currentContent}</pre>
          )}
        </div>

        {/* Footer instruction */}
        <div className="p-3 sm:p-4 bg-slate-50 dark:bg-slate-800/60 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600 dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span>Google Apps Script-এ Deploy &gt; Web app নির্বাচন করে Deploy করুন।</span>
          </div>
          <a
            href="https://script.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline flex items-center gap-1"
          >
            <span>Google Apps Script খুলুন</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

      </div>
    </div>
  );
};
