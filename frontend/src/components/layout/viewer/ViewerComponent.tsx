import Template from "./Template";
import { SampleDetailType } from "../../../types/SampleDetailType";
import Result from "./Result";
import Editor from "./Editor";
import type { Dispatch, SetStateAction } from "react";
import type { CardDataItem } from "../../../types/CardDataItem";

interface ViewerComponentProps {
  sampleDetailtype: string;
  cardData: CardDataItem[];
  setCardData: Dispatch<SetStateAction<CardDataItem[]>>;
  selectedCardIndex: number;
}

const ViewerComponent: React.FC<ViewerComponentProps> = ({sampleDetailtype, cardData, setCardData, selectedCardIndex}) => {
    const sampleDetailBody = () => {
        switch (sampleDetailtype) {
            case SampleDetailType.TEMPLATE:
                return (
                    <Template
                        selectedCardIndex={selectedCardIndex}
                        cardData={cardData} 
                    />
                );

            case SampleDetailType.DATA:
                return (
                    <Editor 
                        cardData={cardData} 
                        setCardData={setCardData} 
                        selectedCardIndex={selectedCardIndex}
                    />
                );

            case SampleDetailType.RESULT:
                return (
                    <Result
                        cardData={cardData} 
                        selectedCardIndex={selectedCardIndex}
                    />
                );
        }
    };

    const getMinHeightClass = () => {
        if (sampleDetailtype === SampleDetailType.DATA) {
            return 'min-h-[450px] sm:min-h-[550px]';
        }
        if (sampleDetailtype === SampleDetailType.TEMPLATE) {
            return 'min-h-[400px] sm:min-h-[450px]';
        }
        return 'min-h-[120px]';
    };

    return (
        <div className={`w-full lg:w-[30%] bg-[#161616] border border-[#2a2a2a] rounded-xl flex flex-col ${getMinHeightClass()} lg:min-h-0 ${sampleDetailtype === SampleDetailType.RESULT ? 'lg:h-fit' : ''}`}>
            <div className="text-white bg-[#1a1a1a] h-[50px] lg:h-[60px] border-b border-[#2a2a2a] flex items-center justify-center shrink-0 text-sm lg:text-base">
                {sampleDetailtype}
            </div>
            <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
                {sampleDetailBody()}
            </div>
        </div>
    )
}

export default ViewerComponent