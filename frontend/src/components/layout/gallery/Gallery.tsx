import Card from "../../ui/Card";
import type { CardDataItem } from "../../../types/CardDataItem";
interface GalleryProps {
  onCardClick: (index: number) => void;
  cardData: CardDataItem[];
}

const Gallery: React.FC<GalleryProps> = ({ onCardClick, cardData }) => {

  return (
    <>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(max(300px,24%),1fr))] gap-4 w-[95%] h-[800px]">
            {cardData.map((card, index) => (
              <Card 
                key={index}
                index={index}
                image={card.image}
                title={card.title}
                description={card.description}
                onClick={() => onCardClick(index)}
              />
            ))}
        </div>
    </>
  )
}

export default Gallery;