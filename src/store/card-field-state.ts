import { CardInfo } from "@prisma/client";
import create from "zustand";

interface CardFieldState {
  fields: CardInfo[][];
  addColumn: () => void;
  removeColumn: () => void;
  setFields: (newState: CardInfo[][]) => void;
  addCards: (cards: CardInfo[]) => void;
}

const useCardFieldStore = create<CardFieldState>()((set) => ({
  fields: [] as CardInfo[][],
  addColumn: () =>
    set((state) => ({
      fields: [...state.fields, []],
    })),
  removeColumn: () =>
    set((state) => ({
      fields: state.fields.slice(0, state.fields.length - 1),
    })),
  setFields: (newState: CardInfo[][]) =>
    set(() => ({
      fields: newState,
    })),
  addCards: (cards: CardInfo[]) =>
    set((state) => ({
      fields: [...state.fields, cards],
    })),
}));

export { useCardFieldStore };
