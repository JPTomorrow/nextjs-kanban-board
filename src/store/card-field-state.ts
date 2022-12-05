import { CardInfo, KanBanColumn, PrismaClient } from "@prisma/client";
import create from "zustand";

type KanBanColumnWithCards = KanBanColumn & { cards: CardInfo[] };

interface BoardState {
  fields: KanBanColumnWithCards[];
  addField: (name: string, cards: CardInfo[]) => void;
  removeField: (columnId: number) => void;
  setFields: (newFields: KanBanColumnWithCards[]) => void;
  addCards: (columnId: number, cards: CardInfo[]) => void;
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
        set((state) => ({
          fields: state.fields.filter((x) => x !== r),
        }));
      });
    });
  },
  setFields: (newFields: KanBanColumnWithCards[]) =>
    set(() => ({
      fields: newFields,
    })),
  addCards: async (columnId: number, cards: CardInfo[]) => {
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
    // set((state) => {
    //   const findField = state.fields.find((x) => x.id == added.id);
    //   if (findField) {
    //     findField.cards = added.cards;
    //   } else {
    //     state.fields.push(added);
    //   }
    //   return {
    //     ...state,
    //   };
    // });
  },
}));

export type { KanBanColumnWithCards, BoardState };
export { useKanBanStore };
