import { prisma } from "@/utils/db";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const name = req.body.columnName as string;

    const added = await prisma.kanBanColumn.create({
      data: {
        name: name,
      },
      include: {
        cards: true,
      },
    });

    res.status(200).json(added);
  } catch (err) {
    console.log(err);
    res.status(200).json({ err: "Could not add column." });
  }
};
