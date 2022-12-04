// import dynamic from "next/dynamic";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggableLocation,
} from "react-beautiful-dnd";
import { CardInfo } from "@prisma/client";
import {
  KanBanColumnWithCards,
  useKanBanStore,
} from "@/store/card-field-state";

// needs to be no SSR because react-beutiful-dnd does not support SSR
// const DraggableCardField = dynamic(
//   () => import("@/components/kanban/DraggableCardField"),
//   { ssr: false }
// );

const reorder = (
  list: KanBanColumnWithCards,
  startIndex: number,
  endIndex: number
) => {
  const result = Array.from(list.cards);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed!);
  return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (
  source: KanBanColumnWithCards,
  destination: KanBanColumnWithCards,
  droppableSource: DraggableLocation,
  droppableDestination: DraggableLocation
) => {
  const sourceClone = Array.from(source.cards);
  const destClone = Array.from(destination.cards);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  destClone.splice(droppableDestination.index, 0, removed!);

  const result: any = {};
  result[droppableSource.droppableId] = sourceClone;
  result[droppableDestination.droppableId] = destClone;

  return result;
};

const KbColumn = ({ column }: { column: KanBanColumnWithCards }) => {
  const state = useKanBanStore((state) => state);

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
      newState[sInd] = {
        id: column.id,
        name: column.name,
        cards: items,
      };
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

      state.setFields(newState.filter((group) => group.cards.length));
    }
  }

  return (
    <div className="mt-[70px] h-5/6 flex-col rounded-xl shadow-lg shadow-black">
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
      <div className="flex h-1/5 w-[350px] items-center justify-start rounded-t-xl bg-[#310d0d]">
        <h1 className="pl-5 text-2xl text-primary">Placeholder Header</h1>
      </div>
      <div className="h-4/5 w-[350px] rounded-b-xl border-[1px] border-secondary bg-[#ffeac3]">
        <DragDropContext onDragEnd={onDragEnd}>
          {state.fields.map((el, ind) => (
            <Droppable key={ind} droppableId={`${ind}`}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="w-full"
                >
                  {el.cards.map((item, index) => (
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
                                newState[ind]!.cards.splice(index, 1);
                                state.setFields(
                                  newState.filter((group) => group.cards.length)
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
      </div>
    </div>
  );
};

const KBColumns = () => {
  const columns = useKanBanStore((state) => state.fields);
  return (
    <div className="inline-flex h-full w-full items-center gap-x-3  overflow-auto px-5">
      {columns.map((c, i) => (
        <KbColumn key={i} column={c} />
      ))}
    </div>
  );
};

export default KBColumns;
