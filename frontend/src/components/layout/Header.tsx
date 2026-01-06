import React from 'react';
import logoSvg from '../../assets/images/logo.svg'

interface HeaderProps {
  onDemoClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onDemoClick }) => {
  return (
    <>
      <div className="h-[120px] flex justify-center items-center flex-col">
        <div className="h-[100px] w-[95%] border border-[#2a2a2a] bg-[#161616] rounded-[10px] flex items-center justify-between px-[30px]">
          <div className="flex items-center gap-[3px]">
            <img src={logoSvg} alt="HwpxTemplater Logo" className="h-20 w-20" />
            <span className="text-2xl font-bold bg-gradient-to-br from-pink-400 via-purple-500 to-indigo-500 bg-clip-text text-transparent font-sans tracking-[0.5px]">
              HwpxTemplater
            </span>
          </div>
          <div className="flex items-center gap-[25px]">
            <div 
              className="text-[#c0c0c0] hover:text-white cursor-pointer text-[17px] font-sans transition-colors duration-200"
              onClick={onDemoClick}
            >
              DEMO
            </div>
            <div className="text-[#c0c0c0] cursor-pointer text-[17px] font-sans">
              <a className="text-[#c0c0c0] hover:text-white transition-colors duration-200" href='https://mumberrymountain.github.io/hwpxtemplater/'>DOCS</a>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default Header