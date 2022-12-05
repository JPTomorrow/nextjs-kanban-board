import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggableLocation,
} from "react-beautiful-dnd";
import {
  KanBanColumnWithCards,
  useKanBanStore,
} from "@/store/card-field-state";
import { AiOutlinePlus, AiOutlineDelete } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import { Dispatch, SetStateAction, useState } from "react";

const AddCardModal = ({
  func,
  columnId,
}: {
  func: Dispatch<SetStateAction<boolean>>;
  columnId: number;
}) => {
  const addCard = useKanBanStore((state) => state.addCard);
  const [cardTitle, setCardTitle] = useState("");
  const [cardContent, setCardContent] = useState("");

  const hideSelf = () => func(false);
  return (
    <div className="absolute inset-x-0 z-10 mx-auto flex h-auto w-fit justify-center self-center rounded-xl bg-primary p-5">
      <input
        className="rounded-xl border-[1px] border-secondary p-3"
        placeholder="Card Title"
        onChange={(e) => setCardTitle(e.target.value)}
      />
      <input
        className="ml-3 rounded-xl border-[1px] border-secondary p-3"
        placeholder="Card Content"
        onChange={(e) => setCardContent(e.target.value)}
      />
      <button
        onClick={() => {
          addCard(columnId, {
            title: cardTitle,
            content: cardContent,
            author: "",
          });
          hideSelf();
        }}
        className="icon-button ml-3 rounded-xl"
      >
        Submit
      </button>
      <button onClick={hideSelf} className="icon-button ml-3 rounded-xl">
        <RxCross1 />
      </button>
    </div>
  );
};

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

const KbColumn = ({
  column,
  columnIdx,
}: {
  column: KanBanColumnWithCards;
  columnIdx: number;
}) => {
  const state = useKanBanStore((state) => state);
  const [showAddCardModal, setShowAddCardModal] = useState(false);

  return (
    <>
      <div className="relative ml-3 block h-full w-[350px]">
        <div className="absolute flex h-[80px] w-full items-center justify-between rounded-t-xl bg-primary-2">
          <h1 className="ml-5 text-2xl text-primary">{column.name}</h1>
          <button
            onClick={() => state.removeField(column.id)}
            className="icon-button mr-5 rounded-md border-primary"
          >
            <AiOutlineDelete className="text-primary" />
          </button>
        </div>
        <div className="h-full flex-col overflow-auto rounded-xl bg-secondary-2 pt-[80px] shadow-lg shadow-black">
          <div className="">
            <Droppable key={columnIdx} droppableId={`${columnIdx}`}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="w-full"
                >
                  {column.cards.map((item, index) => (
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
                          className={`bg-opacity-70 ${
                            snapshot.isDragging
                              ? " bg-primary-2 bg-opacity-40"
                              : "bg-primary-2"
                          }  m-1 w-auto rounded-lg border-[2px] border-primary-2 p-2 text-secondary-2`}
                        >
                          <div className="relative flex-col">
                            <h1 className="text-lg font-bold">{item.title}</h1>
                            <h2 className="text-sm">
                              Created By:{" "}
                              {item.author ? item.author : "John Doe"}
                            </h2>
                            <button
                              type="button"
                              className="icon-button absolute top-1 right-1 rounded-sm border-secondary-2 p-1"
                              onClick={() => {
                                const newState = [...state.fields];
                                newState[columnIdx]!.cards.splice(index, 1);
                                state.setFields(
                                  newState.filter((group) => group.cards.length)
                                );
                              }}
                            >
                              <AiOutlineDelete className="text-secondary-2" />
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
            <button
              className="icon-button mx-auto my-3 flex items-center justify-center rounded-lg"
              onClick={() => setShowAddCardModal(!showAddCardModal)}
            >
              <p>Add Card</p> <AiOutlinePlus className="ml-2" />
            </button>
          </div>
        </div>
      </div>
      {showAddCardModal ? (
        <AddCardModal func={setShowAddCardModal} columnId={column.id} />
      ) : null}
    </>
  );
};

const AddColumnModal = ({
  func,
}: {
  func: Dispatch<SetStateAction<boolean>>;
}) => {
  const addColumn = useKanBanStore((state) => state.addField);
  const [columnName, setColumnName] = useState("");
  const hideSelf = () => func(false);
  return (
    <div className=" inset-x-0 mx-auto flex h-auto w-[400px] justify-center self-center rounded-xl bg-primary p-5">
      <input
        className="rounded-xl border-[1px] border-secondary p-3"
        placeholder="Column Name"
        onChange={(e) => setColumnName(e.target.value)}
      />
      <button
        onClick={() => {
          addColumn(columnName, []);
          hideSelf();
        }}
        className="icon-button ml-3 rounded-xl"
      >
        Submit
      </button>
      <button onClick={hideSelf} className="icon-button ml-3 rounded-xl">
        <RxCross1 />
      </button>
    </div>
  );
};

const KBColumns = () => {
  const state = useKanBanStore((state) => state);
  const [showAddColumn, setShowAddColumn] = useState(false);

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
        id: state.fields[sInd]!.id,
        name: state.fields[sInd]!.name,
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
      const newState = [...state.fields] as KanBanColumnWithCards[];
      newState[sInd]!.cards = result[sInd];
      newState[dInd]!.cards = result[dInd];

      state.setFields(newState.filter((group) => group.cards.length));
    }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="inline-flex h-screen w-full items-start py-3">
        {state.fields.map((c, i) => (
          <KbColumn key={i} column={c} columnIdx={i} />
        ))}
        {showAddColumn ? <AddColumnModal func={setShowAddColumn} /> : null}
        <button
          className="icon-button mt-3 rounded-r-lg py-5"
          onClick={() => setShowAddColumn(!showAddColumn)}
        >
          <AiOutlinePlus />
        </button>
      </div>
    </DragDropContext>
  );
};

export default KBColumns;
