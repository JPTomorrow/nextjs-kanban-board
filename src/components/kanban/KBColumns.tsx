import { CardInfo } from "@prisma/client";
import { DragEventHandler, useState } from "react";
import Draggable, { DraggableEvent } from "react-draggable";

const Card = ({ card }: { card: CardInfo }) => {
  const [resetPosition, setResetPosition] = useState(null);
  const onStart = (e: DraggableEvent) => {
    console.log(e.timeStamp);
  };
  const onStop = (e: DraggableEvent) => {
    console.log(e.timeStamp);
  };
  return (
    <Draggable onStart={onStart} onStop={onStop}>
      <div className="m-5 rounded-lg border-[1px] border-secondary bg-primary p-5">
        <h1>{card.title}</h1>
        <h2>{card.author}</h2>
        <p>{card.content}</p>
      </div>
    </Draggable>
  );
};

const KbColumn = ({ cards }: { cards: CardInfo[] }) => {
  return (
    <div className="mt-[70px] h-5/6 flex-col rounded-xl shadow-lg shadow-black transition-all duration-75 hover:scale-[102%]">
      <div className="flex h-1/5 w-[350px] items-center justify-start rounded-t-xl bg-[#310d0d]">
        <h1 className=" pl-5 text-2xl text-primary">Placeholder Header</h1>
      </div>
      <div className=" h-4/5 w-[350px] rounded-b-xl border-[1px] border-secondary bg-[#ffeac3]">
        {cards.map((c: CardInfo, i) => (
          <Card card={c} key={i} />
        ))}
      </div>
    </div>
  );
};

const KBColumns = ({
  columnCount,
  cards,
}: {
  columnCount: number;
  cards: CardInfo[];
}) => {
  return (
    <div className="inline-flex h-full w-full items-center gap-x-3  overflow-auto px-5">
      {[...Array(columnCount)].map((_, i) => (
        <KbColumn key={i} cards={cards} />
      ))}
    </div>
  );
};

export default KBColumns;
