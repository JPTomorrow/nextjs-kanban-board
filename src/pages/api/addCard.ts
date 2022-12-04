import { prisma } from "@/utils/db";
import { NextApiRequest } from "next";

export default async (req: NextApiRequest, res: any) => {
  try {
    const columnId = req.body.columnId;
    const card = req.body.cardInfo as {
      author: string;
      content: string;
      columnId: number;
      title: string;
    };

    const result = await prisma.cardInfo.create({
      data: {
        columnId: columnId,
        author: card.author,
        title: card.title,
        content: card.content,
      },
    });

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: "Could not add card." });
  }
};
