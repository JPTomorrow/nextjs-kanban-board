import { CardInfo } from "@prisma/client";

const DBTest = ({ cards }: { cards: CardInfo[] }) => {
  async function postNewCard() {
    fetch("/api/post-card")
      .then(() => console.log("posted card successfully"))
      .catch((err) => console.log(err));
  }

  return (
    <>
      <h1>Cards from PlanetScale SQL database using Prisma</h1>
      <div className="inline-flex w-full justify-center gap-5">
        {cards.map((c: CardInfo, i) => (
          <div
            key={i}
            className="my-5 rounded-lg border-[1px] border-secondary bg-primary p-5"
          >
            <h1>{c.title}</h1>
            <h2>{c.author}</h2>
            <p>{c.content}</p>
          </div>
        ))}
      </div>
      <button
        onClick={postNewCard}
        className="rounded-xl border-[1px] border-secondary bg-transparent px-5 py-2 transition-all duration-150 hover:bg-secondary hover:bg-opacity-40 hover:text-primary"
      >
        Add Card
      </button>
    </>
  );
};

export default DBTest;
