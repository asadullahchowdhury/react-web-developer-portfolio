import { useEffect, useState } from 'react';
import { Code } from 'lucide-react';

const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState('Initializing...');

  const loadingSteps = ['Loading…', 'Almost there…', 'Welcome.'];

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + Math.random() * 15 + 5;

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
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background-primary">
      <div className="relative z-10 text-center">
        <div className="mb-8">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-accent shadow-soft">
            <Code className="text-foreground-primary" size={40} />
          </div>
        </div>

        <h1 className="mb-4 text-4xl font-bold text-foreground-primary">
          <span className="text-accent">Rahat</span> Chowdhury
        </h1>

        <p className="mb-8 font-mono text-lg text-foreground-secondary">{loadingText}</p>

        <div className="mx-auto mb-6 w-full max-w-xs sm:max-w-sm px-4">
          <div className="h-2 overflow-hidden rounded-full border border-subtle bg-background-secondary">
            <div
              className="h-full rounded-full bg-accent transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <div className="mt-2 font-mono text-sm text-foreground-secondary">
            {Math.round(progress)}%
          </div>
        </div>

        <div className="mx-auto h-10 w-10 rounded-full border-2 border-subtle border-t-accent animate-spin" />
      </div>
    </div>
  );
};

export default Preloader;
