import Head from "next/head";
import { useEffect, useState } from "react";
import { GetServerSideProps } from "next";

import DBTest from "@/components/DBTest";
import KBColumns from "@/components/kanban/KBColumns";

import { PrismaClient } from "@prisma/client";

// icons
import { AiOutlinePlus } from "react-icons/ai";
import {
  KanBanColumnWithCards,
  useKanBanStore,
} from "@/store/card-field-state";

export const getServerSideProps: GetServerSideProps<{
  kanbanColumns: KanBanColumnWithCards[];
}> = async () => {
  const { prisma } = require("@/utils/db");
  const cards = await prisma.cardInfo.findMany();
  const kanbanColumns: KanBanColumnWithCards[] =
    await prisma.kanBanColumn.findMany({
      include: {
        cards: true,
      },
    });
  return { props: { kanbanColumns } };
};

const Home = ({
  kanbanColumns,
}: {
  kanbanColumns: KanBanColumnWithCards[];
}) => {
  // const [columnCount, setColumnCount] = useState(1);
  const addField = useKanBanStore((state) => state.addField);
  const removeField = useKanBanStore((state) => state.removeField);
  useEffect(() => {
    const setFields = useKanBanStore((state) => state.setFields);
    setFields(kanbanColumns);
  }, []);
  // const addColumn = () => {
  //   setColumnCount(columnCount + 1);
  // };
  // const removeColumn = () => {
  //   if (columnCount <= 1) return;
  //   setColumnCount(columnCount - 1);
  // };
  return (
    <>
      <Head>
        <title>KanBan Board</title>
        <meta name="description" content="A simple KanBan board" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex h-screen min-h-screen flex-col items-center justify-center bg-[#79e087]">
        {/* <DBTest cards={cards} /> */}

        <div className="fixed top-5 right-5 flex">
          {/* <p className="mr-5 align-middle">column count: {columnCount}</p> */}
          {/* <button
            className="icon-button rounded-l-lg"
            onClick={() => alert("PLEASE IMPLEMENT removeField")}
          >
            <AiOutlineMinus />
          </button> */}
          <button
            className="icon-button rounded-r-lg"
            onClick={() => alert("PLEASE IMPLEMENT addField")}
          >
            <AiOutlinePlus />
          </button>
        </div>

        <KBColumns />
      </main>
    </>
  );
};

export default Home;
