import { SampleDetailType } from "../../../types/SampleDetailType"
import ViewerComponent from "./ViewerComponent"
import type { Dispatch, SetStateAction } from "react";
import type { CardDataItem } from "../../../types/CardDataItem";

type ViewerProps = {
    cardData: CardDataItem[];
    setCardData: Dispatch<SetStateAction<CardDataItem[]>>;
    selectedCardIndex: number;
};
  

const Viewer: React.FC<ViewerProps> = ({cardData, setCardData, selectedCardIndex}) => {
    return (
      <>
        <div className="w-[95%] flex-1 flex flex-col min-h-0 my-5 overflow-auto">
          <div className="flex flex-col lg:flex-row items-stretch justify-between flex-1 min-h-0 gap-5">
            {Object.values(SampleDetailType).map((type) => (
                <ViewerComponent 
                  key={type}
                  sampleDetailtype={type} 
                  cardData={cardData} 
                  setCardData={setCardData} 
                  selectedCardIndex={selectedCardIndex}
                />
            ))}
          </div>
        </div>
      </>
    )
  }
  
  export default Viewer