module.exports = () => `

import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

export async function GET(req) {
    
    const prima = new PrismaClient();

    try{
        const item = await prima.table.findMany();
        return NextResponse.json(item);
    }
    catch(error){
        return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
    }
}
`;

