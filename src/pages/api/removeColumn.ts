import { prisma } from "@/utils/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const columnId = req.body.columnId;

    const removed = await prisma.kanBanColumn.delete({
      where: {
        id: columnId,
      },
    });

    res.status(200).json(removed.id);
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: "Could not remove column." });
  }
};
