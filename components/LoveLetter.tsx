import React, { useState } from 'react';
import { generateLoveNote } from '../services/geminiService';
import { Sparkles, Heart, RefreshCw } from 'lucide-react';

export const LoveLetter: React.FC = () => {
  const [note, setNote] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [partnerName, setPartnerName] = useState("石雨馨");
  const [showInput, setShowInput] = useState(true);

  const handleGenerate = async () => {
    if (!partnerName.trim()) return;
    setLoading(true);
    const text = await generateLoveNote(partnerName);
    setNote(text);
    setLoading(false);
    setShowInput(false);
  };

  if (showInput) {
    return (
      <div className="mt-8 bg-white/10 backdrop-blur-md p-6 rounded-xl border border-white/20 max-w-md w-full mx-auto text-center animate-fade-in">
        <h3 className="text-xl text-pink-200 font-handwriting mb-4 flex justify-center items-center gap-2">
          <Heart className="w-5 h-5 fill-pink-400 text-pink-400" />
          为她写下新年寄语
        </h3>
        <input
          type="text"
          value={partnerName}
          onChange={(e) => setPartnerName(e.target.value)}
          placeholder="输入名字..."
          className="w-full bg-black/40 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-500 mb-4 transition-all text-center"
        />
        <button
          onClick={handleGenerate}
          disabled={loading || !partnerName}
          className="w-full bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-3 px-6 rounded-lg transition-all transform hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 shadow-lg shadow-pink-900/50"
        >
          {loading ? (
            <RefreshCw className="w-5 h-5 animate-spin" />
          ) : (
            <Sparkles className="w-5 h-5" />
          )}
          {loading ? "正在构思情书..." : "生成专属浪漫"}
        </button>
      </div>
    );
  }

  return (
    <div className="mt-8 bg-black/40 backdrop-blur-md p-8 rounded-xl border border-pink-500/30 max-w-lg w-full mx-auto text-center relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-pink-500 to-transparent opacity-50"></div>
      
      <div className="mb-6">
        <Heart className="w-12 h-12 text-pink-500 mx-auto animate-pulse fill-pink-500/20" />
      </div>
      
      <p className="text-lg md:text-xl text-pink-100 font-handwriting leading-relaxed italic mb-6">
        "{note}"
      </p>

      <button
        onClick={() => setShowInput(true)}
        className="text-sm text-gray-400 hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto"
      >
        <RefreshCw className="w-3 h-3" />
        再写一段
      </button>
    </div>
  );
};