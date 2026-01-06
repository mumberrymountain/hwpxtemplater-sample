import { useState } from 'react'; // 호버 상태 관리를 위한 useState 추가
import React from 'react'; // 이게 있어야 React.FC를 사용할 수 있습니다

interface CardProps {
  image: string;
  title: string;
  description: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ image, title, description, onClick }) => {
  const [isHovered, setIsHovered] = useState(false); // 호버 상태 관리

  return (
    <div className="p-5 flex justify-center items-center h-[300px]">
      <div 
        className={`w-full h-full rounded-lg bg-[#1a1a1a] border border-[#2a2a2a] overflow-hidden cursor-pointer transition-all duration-300 ease-in-out ${
          isHovered 
            ? 'shadow-[0_8px_24px_rgba(0,0,0,0.3)] -translate-y-1' 
            : 'shadow-[0_2px_8px_rgba(0,0,0,0.1)] translate-y-0'
        }`}
       onMouseEnter={() => setIsHovered(true)}
       onMouseLeave={() => setIsHovered(false)}
       onClick={onClick}
      >
        <div 
          className={`h-[80%] bg-cover bg-center bg-no-repeat transition-transform duration-300 ease-in-out ${
            isHovered ? 'scale-105' : 'scale-100'
          }`}
          style={{backgroundImage: `url(${image})`}}
        ></div>
        <div className="flex justify-between h-[20%]">
            <div className="flex justify-center flex-col p-[10px]">
              <h4>{title}</h4>
              <p className="text-[13px] mt-[3px]">{description}</p>
            </div>
            <div className="flex items-center pr-[10px]">
              <i 
                className={`bi bi-chevron-right text-white text-[23px] transition-transform duration-300 ease-in-out ${
                  isHovered ? 'translate-x-1' : 'translate-x-0'
                }`}
              ></i>
            </div>
        </div>
      </div>
    </div>
  );
}

export default Card;