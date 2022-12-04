import { prisma } from "@/utils/db";
import { NextApiRequest } from "next";

export default async (req: NextApiRequest, res: any) => {
  try {
    const id = req.body.cardId as number;

    const removed = await prisma.cardInfo.delete({
      where: {
        id: id,
      },
    });

    res.status(200).json(removed);
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: "Could not remove card." });
  }
};
