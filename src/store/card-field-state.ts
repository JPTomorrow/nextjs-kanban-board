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

const { prisma } = require("@/utils/db");

const useKanBanStore = create<BoardState>()((set) => ({
  fields: [] as KanBanColumnWithCards[],
  addField: async (name: string) => {
    const newField: KanBanColumnWithCards = await prisma.kanBanColumn.create({
      data: {
        name: name,
      },
      include: {
        cards: true,
      },
    });

    set((state) => ({
      fields: [...state.fields, newField],
    }));
  },
  removeField: async (columnId: number) => {
    const removed = await prisma.kanBanColumn.delete({
      where: {
        id: columnId,
      },
    });
    set((state) => ({
      fields: state.fields.filter((x) => x !== removed),
    }));
  },
  setFields: (newFields: KanBanColumnWithCards[]) =>
    set(() => ({
      fields: newFields,
    })),
  addCards: async (columnId: number, cards: CardInfo[]) => {
    const added = await prisma.kanBanColumn.update({
      where: {
        id: columnId,
      },
      include: {
        cards: true,
      },
      data: {
        cards: cards as any,
      },
    });

    set((state) => {
      const findField = state.fields.find((x) => x.id == added.id);
      if (findField) {
        findField.cards = added.cards;
      } else {
        state.fields.push(added);
      }

      return {
        ...state,
      };
    });
  },
}));

export type { KanBanColumnWithCards, BoardState };
export { useKanBanStore };
