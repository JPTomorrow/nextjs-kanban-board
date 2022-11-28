import { prisma } from "@/utils/db";
import { NextApiRequest } from "next";

export default async (req: NextApiRequest, res: any) => {
  const data = req.body;
  try {
    const result = await prisma.cardInfo.create({
      data: {
        title: "test card title",
        content: "test card content",
        author: "me",
      },
    });
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: "Error occured." });
  }
};
