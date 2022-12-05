import { CardInfo, KanBanColumn, PrismaClient } from "@prisma/client";
import create from "zustand";

type KanBanColumnWithCards = KanBanColumn & { cards: CardInfo[] };

interface BoardState {
  fields: KanBanColumnWithCards[];
  addField: (name: string, cards: CardInfo[]) => void;
  removeField: (columnId: number) => void;
  setFields: (newFields: KanBanColumnWithCards[]) => void;
  addCard: (
    columnId: number,
    card: { title: string; content: string; author: string }
  ) => void;
}

const useKanBanStore = create<BoardState>()((set) => ({
  fields: [] as KanBanColumnWithCards[],
  addField: async (name: string) => {
    await fetch("api/addColumn", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        columnName: name,
      }),
    }).then((res) => {
      res.json().then((r) => {
        if (!r.err) {
          set((state) => ({
            fields: [...state.fields, r as KanBanColumnWithCards],
          }));
        } else {
          console.log(r.err);
        }
      });
    });
  },
  removeField: async (columnId: number) => {
    await fetch("api/removeColumn", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        columnId: columnId,
      }),
    }).then((res) => {
      res.json().then((r) => {
        if (!r.err) {
          set((state) => ({
            fields: state.fields.filter((x) => x.id !== r),
          }));
        } else {
          console.log(r.err);
        }
      });
    });
  },
  setFields: (newFields: KanBanColumnWithCards[]) =>
    set(() => ({
      fields: newFields,
    })),
  addCard: async (
    columnId: number,
    card: { title: string; content: string; author: string }
  ) => {
    await fetch("api/addCard", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        columnId: columnId,
        cardInfo: card,
      }),
    }).then((res) => {
      res.json().then((r) => {
        if (!r.err) {
          set((state) => {
            const findField = state.fields.find((x) => x.id == r.columnId);
            if (findField) {
              findField.cards.push(r as CardInfo);
            }
            return {
              ...state,
            };
          });
        } else {
          console.log(r.err);
        }
      });
    });
    // const added = await prisma.kanBanColumn.update({
    //   where: {
    //     id: columnId,
    //   },
    //   include: {
    //     cards: true,
    //   },
    //   data: {
    //     cards: cards as any,
    //   },
    // });
  },
}));

export type { KanBanColumnWithCards, BoardState };
export { useKanBanStore };
