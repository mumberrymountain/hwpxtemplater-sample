import type { CardDataItem } from "../../../types/CardDataItem";
import DownloadResult from "./DownloadResult";

interface ResultProps {
  selectedCardIndex: number;
  cardData: CardDataItem[];
}

const Result : React.FC<ResultProps> = ({selectedCardIndex, cardData}) => {
  return (
    <div className="p-5">
        <DownloadResult selectedCardIndex={selectedCardIndex} cardData={cardData}/>
    </div>
  )
}

export default Result