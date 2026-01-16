import ImagePreview from "./ImagePreview";
import type { CardDataItem } from "../../../types/CardDataItem";
import { downloadFromResponse } from "../../../utils/fileDownload";
import { toast } from "sonner";
import { useState } from "react";

interface TemplateProps {
  selectedCardIndex: number;
  cardData: CardDataItem[];
}

const Template: React.FC<TemplateProps> = ({selectedCardIndex, cardData}) => {
  const onClickTemplateDownload = async () => {
    const data = { fileName: `${cardData[selectedCardIndex].api}.hwpx`};
    try{
        const response = await fetch(`${import.meta.env.VITE_API_URL}/template`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/hwp+zip'
          },
          body: JSON.stringify(data)
        });

        await downloadFromResponse(response, `${cardData[selectedCardIndex].api}.hwpx`);
        toast.info("파일 다운로드가 완료됐습니다.");
      } catch (e) {
        console.error(e);
        toast.error("파일 다운로드 중 에러가 발생했습니다. 잠시후 다시 시도해주세요.");
      }
  }
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="p-3 lg:p-5 h-full flex flex-col min-h-[350px] lg:min-h-0">
        <div className="bg-[#1a1a1a] text-[#a0a0a0] rounded-xl p-4 lg:p-[30px] shrink-0">
            <p>{`${cardData[selectedCardIndex].api}.hwpx`}</p>
            <p className="text-[#8b5cf6] text-xs mt-[10px]">
                <i className="bi bi-file-earmark-arrow-down"></i>
                <span 
                  className={`ml-[5px] cursor-pointer transition-all duration-200 ease-in-out ${isHovered ? 'text-[#a78bfa] underline translate-x-[3px]' : 'text-[#8b5cf6] no-underline translate-x-0'}`}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                  onClick={onClickTemplateDownload}
                >
                  템플릿 다운로드하기
                </span>
            </p>
        </div>

        <div className="flex-1 min-h-0 flex flex-col">
            <ImagePreview imagePath={cardData[selectedCardIndex].image}/>
        </div>
    </div>
  )
}

export default Template