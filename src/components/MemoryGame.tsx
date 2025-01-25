import { useEffect, useMemo, useState } from "react";
import _ from "lodash";

interface Card {
  image: string;
  flipped: boolean;
  matched: boolean;
}

function MemoryGame({ images }: { images: string[] }) {
  const [cards, setCards] = useState<Card[]>([]);
  const isFinished = useMemo(() => !cards.find((card) => !card.matched), [cards]);

  const resetCards = () => {
    const shuffledImages = _.shuffle([...images, ...images]);
    setCards(shuffledImages.map((image) => ({ image, flipped: false, matched: false })));
  };

  useEffect(() => {
    resetCards();
  }, [images]);

  const checkCardsMatched = (card1: Card, card2: Card) => card1.image === card2.image;

  const handleClickCard = (id: number) => {
    const flippedCardId = cards.findIndex((card) => card.flipped && !card.matched);
    const isMatched = flippedCardId >= 0 && checkCardsMatched(cards[flippedCardId], cards[id]);

    setCards((prevCards) => {
      const newCards = [...prevCards];
      newCards[id].flipped = true;
      if (isMatched) {
        newCards[id].matched = true;
        newCards[flippedCardId].matched = true;
      }
      return newCards;
    });

    if (!isMatched && flippedCardId >= 0) {
      setTimeout(() => {
        setCards((prevCards) => {
          const newCards = [...prevCards];
          newCards[id].flipped = newCards[flippedCardId].flipped = false;
          return newCards;
        });
      }, 800);
    }
  };

  return (
    <>
      {isFinished && (
        <div className="mb-3">
          <h3 className="mb-5">You won!</h3>
          <button className="btn text-xs" onClick={resetCards}>
            Play again
          </button>
        </div>
      )}
      <div className="grid grid-cols-4 gap-4">
        {cards.map(({ flipped, matched, image }, id) => (
          <div
            key={id}
            className={`w-24 h-24 bg-blue-400 rounded-xl border-4 border-gray-700 duration-300 overflow-hidden ${
              flipped || matched ? `pointer-events-none rotate-180` : `rotate-0 cursor-pointer`
            }`}
            onClick={() => handleClickCard(id)}
          >
            {(flipped || matched) && <img className="w-full h-full" src={image} alt="" />}
          </div>
        ))}
      </div>
    </>
  );
}

export default MemoryGame;
