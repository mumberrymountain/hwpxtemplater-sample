import { useState, useRef, useEffect } from "react";

interface ImagePreviewProps {
  imagePath: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({imagePath}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  const handleZoomToggle = () => {
    if (!isZoomed) {
      setScale(2);
      setPosition({ x: 0, y: 0 });
    } else {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
    setIsZoomed(!isZoomed);
  };

  const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isZoomed) return;
    e.preventDefault();
    const { clientX, clientY } = 'touches' in e 
      ? e.touches[0] 
      : { clientX: e.clientX, clientY: e.clientY };
    setIsDragging(true);
    setDragStart({
      x: clientX - position.x,
      y: clientY - position.y
    });
  };

  useEffect(() => {
    if (!isDragging || !isZoomed) return;

    const handleGlobalMove = (e: MouseEvent | TouchEvent) => {
      if (!containerRef.current || !imageRef.current) return;
      if (e instanceof TouchEvent) {
        e.preventDefault();
        if (e.touches.length === 0) return;
      }
      
      const { clientX, clientY } = e instanceof MouseEvent 
        ? e 
        : e.touches[0];
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const containerWidth = containerRect.width;
      const containerHeight = containerRect.height;
      
      // 이미지의 실제 크기 (scale 적용 전)
      const imageBaseWidth = containerWidth * 0.9;
      const imageBaseHeight = containerHeight * 0.9;
      
      // 확대된 이미지 크기
      const scaledWidth = imageBaseWidth * scale;
      const scaledHeight = imageBaseHeight * scale;
      
      // 이동 가능한 최대 거리
      const maxX = Math.max(0, (scaledWidth - containerWidth) / 2);
      const maxY = Math.max(0, (scaledHeight - containerHeight) / 2);
      
      const newPosX = clientX - dragStart.x;
      const newPosY = clientY - dragStart.y;
      
      setPosition({
        x: Math.max(-maxX, Math.min(maxX, newPosX)),
        y: Math.max(-maxY, Math.min(maxY, newPosY))
      });
    };

    const handleGlobalEnd = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleGlobalMove, { passive: false });
    window.addEventListener('mouseup', handleGlobalEnd, { passive: false });
    window.addEventListener('touchmove', handleGlobalMove, { passive: false });
    window.addEventListener('touchend', handleGlobalEnd, { passive: false });

    return () => {
      window.removeEventListener('mousemove', handleGlobalMove);
      window.removeEventListener('mouseup', handleGlobalEnd);
      window.removeEventListener('touchmove', handleGlobalMove);
      window.removeEventListener('touchend', handleGlobalEnd);
    };
  }, [isDragging, dragStart, isZoomed, scale]);

  return (
    <>
        <div className="flex-1 mt-5 flex flex-col min-h-[200px] lg:min-h-0 relative">
            <div 
              ref={containerRef}
              className="flex-1 border border-[#2a2a2a] bg-[#0a0a0a] rounded-xl flex items-center justify-center min-h-[200px] lg:min-h-0 overflow-hidden relative"
            >
              <div 
                ref={imageRef}
                className="rounded-lg bg-contain bg-center bg-no-repeat transition-transform duration-300 aspect-[3/4] lg:aspect-auto"
                style={{
                  backgroundImage: `url(${imagePath})`,
                  transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                  cursor: isZoomed ? (isDragging ? 'grabbing' : 'grab') : 'default',
                  width: '90%',
                  height: '90%',
                  maxWidth: '90%',
                  maxHeight: '90%'
                }}
                onMouseDown={handleStart}
                onTouchStart={handleStart}
              ></div>
              
              <button
                className="absolute top-4 right-4 bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white rounded-lg p-2 border border-[#2a2a2a] transition-colors z-10"
                onClick={handleZoomToggle}
                aria-label={isZoomed ? "축소" : "확대"}
                title={isZoomed ? "축소" : "확대"}
              >
                <i className={`bi ${isZoomed ? 'bi-zoom-out' : 'bi-zoom-in'} text-lg`}></i>
              </button>
            </div>
        </div>
    </>
  )
}

export default ImagePreview
