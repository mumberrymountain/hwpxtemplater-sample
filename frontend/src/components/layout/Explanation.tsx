import { type CardDataItem } from "../../types/CardDataItem";

interface ExplanationProps {
  selectedCard: CardDataItem | null;
  selectedCardIndex: number | null;
  setSelectedCardIndex: React.Dispatch<React.SetStateAction<number | null>>;
}

const Explanation: React.FC<ExplanationProps> = ({selectedCard, selectedCardIndex, setSelectedCardIndex}) => {
  const handleBackClick = () => {
    setSelectedCardIndex(null);
  };

  return (
    <div className="w-[95%] shrink-0 flex items-center justify-between">
        {selectedCard === null ? (
        <div>
            <h2 className="text-[36px] font-bold mb-2 bg-gradient-to-br from-indigo-500 to-purple-600 bg-clip-text text-transparent">
            HwpxTemplater 예제
            </h2>
            <h4 className="mt-1 text-[#a8a5a8] font-normal text-[17px] leading-[1.5]">
            HwpxTemplater 라이브러리를 활용한 기본 예제 데모입니다.
            </h4>
        </div>
        ) : (
        <div>
            <h2 className="text-[36px] font-bold mb-2">
            {selectedCard.detailTitle}
            </h2>
            <h4 className="mt-1 text-[#a8a5a8] font-normal text-[17px] leading-[1.5]">
            {selectedCard.detailDescription}
            </h4>
        </div>
        )}
        
        {selectedCardIndex !== null && (
        <button 
                onClick={handleBackClick}
                className="bg-[#1a1a1a] text-white border border-[#2a2a2a] rounded-lg px-4 py-2 cursor-pointer text-sm"
        >
            ← 뒤로가기
        </button>
        )}
    </div>
  )
}

export default Explanation