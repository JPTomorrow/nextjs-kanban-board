import Head from "next/head";
import { useEffect } from "react";
import { GetServerSideProps } from "next";
import {
  KanBanColumnWithCards,
  useKanBanStore,
} from "@/store/card-field-state";
import KanBanColumns from "@/components/kanban/KBColumns";

export const getServerSideProps: GetServerSideProps<{
  kanbanColumns: KanBanColumnWithCards[];
}> = async () => {
  const { prisma } = require("@/utils/db");
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
  const setColumns = useKanBanStore((state) => state.setFields);

  useEffect(() => {
    setColumns(kanbanColumns);
  }, []);

  return (
    <>
      <Head>
        <title>KanBan Board</title>
        <meta name="description" content="A simple KanBan board" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex h-screen min-h-screen flex-col items-center justify-center bg-[#79e087]">
        <KanBanColumns />
      </main>
    </>
  );
};

export default Home;
