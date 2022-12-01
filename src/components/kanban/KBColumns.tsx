import { CardInfo } from "@prisma/client";
import dynamic from "next/dynamic";

// needs to be no SSR because react-beutiful-dnd does not support SSR
const DraggableCard = dynamic(
  () => import("@/components/kanban/DraggableCard"),
  { ssr: false }
);

const KbColumn = ({ cards }: { cards: CardInfo[] }) => {
  return (
    <div className="mt-[70px] h-5/6 flex-col rounded-xl shadow-lg shadow-black">
      <div className="flex h-1/5 w-[350px] items-center justify-start rounded-t-xl bg-[#310d0d]">
        <h1 className="pl-5 text-2xl text-primary">Placeholder Header</h1>
      </div>
      <div className="h-4/5 w-[350px] rounded-b-xl border-[1px] border-secondary bg-[#ffeac3]">
        {cards.map((c: CardInfo, i) => (
          <DraggableCard key={i} />
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
