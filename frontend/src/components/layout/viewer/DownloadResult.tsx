import type { CardDataItem } from "../../../types/CardDataItem";
import { downloadFromResponse } from "../../../utils/fileDownload";
import { toast } from "sonner";
import { useState } from "react";

interface DownloadResultProps {
  selectedCardIndex: number;
  cardData: CardDataItem[];
}

const DownloadResult : React.FC<DownloadResultProps> = ({selectedCardIndex, cardData}) => {
    const [resultFileName, setResultFileName] = useState(`${cardData[selectedCardIndex].fileName}`);
    const onClickDownloadResultFile = async () => {
        if (!resultFileName) {
          toast.error("파일명을 입력해주세요.");
          return;
        }
        if (!resultFileName.endsWith(".hwpx")) {
          toast.error("파일명은 .hwpx 확장자로 끝나야 합니다.");
          return;
        }
        
        const data = {
            fileName: resultFileName,
            templateParam: cardData[selectedCardIndex].templateParam
        };

        try{
            const response = await fetch(`${import.meta.env.VITE_API_URL}/${cardData[selectedCardIndex].api}`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            })
    
            await downloadFromResponse(response, `${resultFileName}`);
            toast.info("파일 다운로드가 완료됐습니다.");
        } catch (e) {
            console.error(e);
            toast.error("파일 다운로드 중 에러가 발생했습니다. 잠시후 다시 시도해주세요.");
        }
    }
    return (
      <>
        <div className="bg-[#1a1a1a] text-[#a0a0a0] rounded-xl h-[50px] p-[30px]">
           <div className="flex items-center gap-4 h-full">
              <input
                id="resultFileName"
                type="text"
                placeholder="파일 이름을 입력하세요"
                className="flex-1 bg-[#2d2d2d] text-[#e0e0e0] border border-[#3d3d3d] rounded-lg px-3 py-2 text-sm outline-none focus:border-[#4d4d4d]"
                value={resultFileName}
                onChange={(e) => setResultFileName(e.target.value)}
              />
              
              <button
                className="bg-[#365880] hover:bg-[#0052a3] text-white border-none rounded-lg px-5 py-[10px] text-sm font-semibold cursor-pointer whitespace-nowrap transition-colors duration-200"
                onClick={onClickDownloadResultFile}
              >
                다운로드
              </button>
            </div> 
        </div>
      </>
    )
  }
  
  export default DownloadResult