import { useEffect, useState } from 'react';
import { Code, Terminal, Zap } from 'lucide-react';

const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing...');

  const loadingSteps = [
    'Initializing...',
    'Loading components...',
    'Compiling code...',
    'Optimizing performance...',
    'Almost ready...'
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15 + 5;

        // Update loading text based on progress
        const stepIndex = Math.floor((newProgress / 100) * loadingSteps.length);
        if (stepIndex < loadingSteps.length) {
          setLoadingText(loadingSteps[stepIndex]);
        }

        if (newProgress >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            onComplete();
          }, 500);
          return 100;
        }
        return newProgress;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-slate-900 z-[9999] flex items-center justify-center">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-20 animate-float-0">
          <Code className="text-cyan-400/20" size={40} />
        </div>
        <div className="absolute top-40 right-32 animate-float-1">
          <Terminal className="text-purple-400/20" size={35} />
        </div>
        <div className="absolute bottom-40 left-32 animate-float-2">
          <Zap className="text-cyan-400/20" size={30} />
        </div>
        <div className="absolute bottom-20 right-20 animate-float-0">
          <Code className="text-purple-400/20" size={25} />
        </div>
      </div>

      <div className="text-center relative z-10">
        {/* Logo */}
        <div className="mb-8">
          <div className="relative inline-block">
            <div className="w-20 h-20 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-2xl flex items-center justify-center transform rotate-12 animate-pulse">
              <Code className="text-white" size={40} />
            </div>
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-2xl blur-lg opacity-50 animate-ping"></div>
          </div>
        </div>

        {/* Name */}
        <h1 className="text-4xl font-bold text-white mb-4">
          <span className="text-cyan-400">Rahat</span> Chowdhury
        </h1>

        {/* Loading text */}
        <p className="text-gray-300 mb-8 font-mono text-lg">{loadingText}</p>

        {/* Progress bar */}
        <div className="w-80 mx-auto mb-6">
          <div className="bg-slate-700 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-cyan-400 to-purple-600 h-full rounded-full transition-all duration-300 ease-out relative"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
            </div>
          </div>
          <div className="text-cyan-400 text-sm mt-2 font-mono">
            {Math.round(progress)}%
          </div>
        </div>

        {/* Spinning loader */}
        <div className="relative">
          <div className="w-12 h-12 border-4 border-slate-600 border-t-cyan-400 rounded-full animate-spin mx-auto"></div>
          <div className="absolute inset-0 w-12 h-12 border-4 border-transparent border-r-purple-400 rounded-full animate-spin mx-auto" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
        </div>
      </div>
    </div>
  );
};

export default Preloader;
