module.exports = () => `

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function POST(req, res) {
    
    const prima = new PrismaClient();
    const body = await req.json();

    try{
        const item = await prisma.table.create({
            data: {
              name : body.name,
            },
          })
        return NextResponse.json(item);
    }
    catch(error){
        return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
    }
}
`;

