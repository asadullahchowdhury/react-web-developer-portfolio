import  { useEffect, useState } from 'react';

const CursorDot = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const updateCursor = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const hideCursor = () => setIsVisible(false);

    document.addEventListener('mousemove', updateCursor);
    document.addEventListener('mouseleave', hideCursor);

    return () => {
      document.removeEventListener('mousemove', updateCursor);
      document.removeEventListener('mouseleave', hideCursor);
    };
  }, []);

  return (
    <div
      className={`fixed top-0 left-0 w-4 h-4 bg-cyan-400 rounded-full pointer-events-none z-[9999] transition-opacity duration-300 ${
        isVisible ? 'opacity-70' : 'opacity-0'
      }`}
      style={{
        transform: `translate(${position.x - 8}px, ${position.y - 8}px)`,
        boxShadow: '0 0 20px rgba(6, 182, 212, 0.6), 0 0 40px rgba(6, 182, 212, 0.3)',
      }}
    >
      <div className="absolute inset-0 bg-cyan-400 rounded-full animate-ping opacity-75"></div>
    </div>
  );
};

export default CursorDot;
