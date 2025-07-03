import React, { useEffect, useState } from 'react';

const TypewriterCode = () => {
  const [currentCodeIndex, setCurrentCodeIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const codeSnippets = [
    "const developer = 'Rahat Chowdhury';",
    "function createAmazingApps() {",
    "  return innovation + creativity;",
    "}",
    "// Building the future, one line at a time",
    "export default Excellence;"
  ];

  useEffect(() => {
    const currentSnippet = codeSnippets[currentCodeIndex];
    
    if (isTyping) {
      if (currentText.length < currentSnippet.length) {
        const timeout = setTimeout(() => {
          setCurrentText(currentSnippet.slice(0, currentText.length + 1));
        }, 50 + Math.random() * 50);
        return () => clearTimeout(timeout);
      } else {
        const timeout = setTimeout(() => {
          setIsTyping(false);
        }, 2000);
        return () => clearTimeout(timeout);
      }
    } else {
      if (currentText.length > 0) {
        const timeout = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1));
        }, 30);
        return () => clearTimeout(timeout);
      } else {
        setCurrentCodeIndex((prev) => (prev + 1) % codeSnippets.length);
        setIsTyping(true);
      }
    }
  }, [currentText, isTyping, currentCodeIndex, codeSnippets]);

  return (
    <div className="bg-slate-900/80 backdrop-blur-sm border border-cyan-400/30 rounded-lg p-6 font-mono text-sm max-w-md mx-auto">
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
        <span className="text-gray-400 text-xs ml-2">terminal</span>
      </div>
      <div className="text-cyan-400 min-h-[1.5rem]">
        <span className="text-purple-400">$</span> {currentText}
        <span className="animate-pulse">|</span>
      </div>
    </div>
  );
};

export default TypewriterCode;