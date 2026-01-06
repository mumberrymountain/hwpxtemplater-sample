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

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isZoomed) return;
    e.preventDefault();
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y
    });
  };

  useEffect(() => {
    if (!isDragging || !isZoomed) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!containerRef.current || !imageRef.current) return;
      
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
      
      const newPosX = e.clientX - dragStart.x;
      const newPosY = e.clientY - dragStart.y;
      
      setPosition({
        x: Math.max(-maxX, Math.min(maxX, newPosX)),
        y: Math.max(-maxY, Math.min(maxY, newPosY))
      });
    };

    const handleGlobalMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleGlobalMouseMove);
    window.addEventListener('mouseup', handleGlobalMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove);
      window.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, dragStart, isZoomed, scale]);

  return (
    <>
        <div className="flex-1 mt-5 flex flex-col min-h-0 relative">
            <div 
              ref={containerRef}
              className="flex-1 border border-[#2a2a2a] bg-[#0a0a0a] rounded-xl flex items-center justify-center min-h-0 overflow-hidden relative"
            >
              <div 
                ref={imageRef}
                className="rounded-lg bg-contain bg-center bg-no-repeat transition-transform duration-300"
                style={{
                  backgroundImage: `url(${imagePath})`,
                  transform: `scale(${scale}) translate(${position.x / scale}px, ${position.y / scale}px)`,
                  cursor: isZoomed ? (isDragging ? 'grabbing' : 'grab') : 'default',
                  width: '90%',
                  height: '90%',
                  maxWidth: '90%',
                  maxHeight: '90%'
                }}
                onMouseDown={handleMouseDown}
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
