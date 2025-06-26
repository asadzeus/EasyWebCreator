module.exports = () => `import { prisma } from "@/prisma/myclient";
import { NextResponse } from "next/server";

export async function GET(req) {
    

    try{
        const item = await prisma.table.findMany();
        return NextResponse.json(item);
    }
    catch(error){
        return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
    }
}
`;

