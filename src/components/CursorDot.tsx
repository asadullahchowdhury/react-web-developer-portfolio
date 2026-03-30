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
      className={`fixed top-0 left-0 h-3 w-3 rounded-full border border-subtle bg-accent/80 pointer-events-none z-[9999] transition-opacity duration-300 ${
        isVisible ? 'opacity-60' : 'opacity-0'
      }`}
      style={{
        transform: `translate(${position.x - 6}px, ${position.y - 6}px)`,
      }}
    />
  );
};

export default CursorDot;
