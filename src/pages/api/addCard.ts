import { prisma } from "@/utils/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const columnId = req.body.columnId;
    const card = req.body.cardInfo as {
      title: string;
      content: string;
      author: string;
    };

    const added = await prisma.cardInfo.create({
      data: {
        columnId: columnId,
        author: card.author,
        title: card.title,
        content: card.content,
      },
    });
    console.log("test");
    res.status(200).json(added);
  } catch (err) {
    res.status(200).json({ err: "Could not add card." });
  }
};
