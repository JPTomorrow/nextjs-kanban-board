import React, { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggableLocation,
} from "react-beautiful-dnd";
import { CardInfo } from "@prisma/client";
import { useCardFieldStore } from "@/store/card-field-state";

// // fake data generator
// const getItems = (count: number, offset: number = 0) =>
//   Array.from({ length: count }, (v, k) => k).map(
//     (k) =>
//       ({
//         id: `item-${k + offset}-${new Date().getTime()}`,
//         title: "test 1",
//         content: `item ${k + offset}`,
//         author: "Justin Morrow",
//       } as CardInfo)
//   );

const reorder = (list: CardInfo[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed!);

  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (
  source: CardInfo[],
  destination: CardInfo[],
  droppableSource: DraggableLocation,
  droppableDestination: DraggableLocation
) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed!);

  const result: any = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

function DraggableCardField({ cards }: { cards: CardInfo[] }) {
  // const [state, setState] = useState<CardInfo[][]>([cards]);
  const state = useCardFieldStore((state) => state);

  useEffect(() => {
    state.addCards(cards);
  }, []);

  function onDragEnd(result: DropResult) {
    const { source, destination } = result;

    // dropped outside the list
    if (!destination) {
      return;
    }

    const sInd = +source.droppableId;
    const dInd = +destination.droppableId;

    if (sInd === dInd) {
      const items = reorder(
        state.fields[sInd]!,
        source.index,
        destination.index
      );
      const newState = [...state.fields];
      newState[sInd] = items;
      state.setFields(newState);
    } else {
      const result = move(
        state.fields[sInd]!,
        state.fields[dInd]!,
        source,
        destination
      );
      const newState = [...state.fields];
      newState[sInd] = result[sInd];
      newState[dInd] = result[dInd];

      state.setFields(newState.filter((group) => group.length));
    }
  }

  return (
    <>
      {/* <button
        type="button"
        onClick={() => {
          setState([...state, []]);
        }}
      >
        Add new group
      </button>
      <button
        type="button"
        onClick={() => {
          setState([...state, getItems(1)]);
        }}
      >
        Add new item
      </button> */}
      <DragDropContext onDragEnd={onDragEnd}>
        {state.fields.map((el, ind) => (
          <Droppable key={ind} droppableId={`${ind}`}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className="w-full"
              >
                {el.map((item, index) => (
                  <Draggable
                    key={item.id}
                    draggableId={item.id.toString()}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={provided.draggableProps.style}
                        className={`${
                          snapshot.isDragging ? "bg-secondary" : "bg-primary"
                        } w-full`}
                      >
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-around",
                          }}
                        >
                          {item.content}
                          <button
                            type="button"
                            onClick={() => {
                              const newState = [...state.fields];
                              newState[ind]!.splice(index, 1);
                              state.setFields(
                                newState.filter((group) => group.length)
                              );
                            }}
                          >
                            delete
                          </button>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </DragDropContext>
    </>
  );
}

export default DraggableCardField;
