import { useEffect, useState } from 'react';

const TypewriterCode = () => {
  const [currentCodeIndex, setCurrentCodeIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isTyping, setIsTyping] = useState(true);

  const codeSnippets = [
    "const lead = 'Rahat Chowdhury';",
    "const stack = ['TypeScript', 'Laravel', 'React'];",
    "function ship(feature) {",
    "  return test(feature) && merge(feature);",
    "}",
    "// Jashore, BD — open to remote collaboration",
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
    <div className="ui-card ui-card--interactive mx-auto max-w-md p-6 font-mono text-sm">
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-3 h-3 bg-foreground-secondary/45 rounded-full"></div>
        <div className="w-3 h-3 bg-accent/70 rounded-full"></div>
        <div className="w-3 h-3 bg-foreground-primary/35 rounded-full"></div>
        <span className="ml-2 text-xs text-foreground-secondary/90">~ console</span>
      </div>
      <div className="text-accent min-h-[1.5rem]">
        <span className="text-foreground-secondary">$</span> {currentText}
        <span className="text-foreground-secondary">|</span>
      </div>
    </div>
  );
};

export default TypewriterCode;