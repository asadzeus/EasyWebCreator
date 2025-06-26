module.exports = () => `import { prisma } from "@/prisma/myclient";
import { NextResponse } from "next/server";

export async function POST(req, res) {
    
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

