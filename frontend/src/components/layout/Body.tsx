import React from 'react'
import { type CardDataItem } from '../../types/CardDataItem';
import Gallery from './gallery/Gallery';
import Viewer from './viewer/Viewer';
import { Toaster } from 'sonner';
import Explanation from './Explanation';

interface BodyProps {
  cardData: CardDataItem[];
  setCardData: React.Dispatch<React.SetStateAction<CardDataItem[]>>;
  selectedCardIndex: number | null;
  setSelectedCardIndex: React.Dispatch<React.SetStateAction<number | null>>;
}

const Body: React.FC<BodyProps> = ({cardData, setCardData, selectedCardIndex, setSelectedCardIndex}) => {
  const handleCardClick = (index: number) => {
    setSelectedCardIndex(index);
  };

  const selectedCard = selectedCardIndex !== null ? cardData[selectedCardIndex] : null;

  return (
    <>
        <div className="flex flex-col h-[calc(100vh-110px)] items-center">
            <Explanation selectedCard={selectedCard} selectedCardIndex={selectedCardIndex} setSelectedCardIndex={setSelectedCardIndex}/>
        {selectedCardIndex === null ? (
            <Gallery onCardClick={handleCardClick} cardData={cardData} />
        ) : selectedCard && (
            <Viewer 
                cardData={cardData}
                setCardData={setCardData}
                selectedCardIndex={selectedCardIndex}
            />
        )}
        <Toaster theme="dark"/>
        </div>
    </>
  );
}

export default Body