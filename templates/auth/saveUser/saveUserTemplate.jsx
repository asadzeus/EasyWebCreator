import { prisma } from "@/prisma/myclient";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../[...nextauth]/route";


export async function POST(req) {

    const session = await getServerSession(authOptions);
    const body = await req.json();

    console.log("body:", body);
    console.log("session:", session);


    try {
        const updatedUser = await prisma.uSER.update({
            where: { id: session?.user?.id },
            data:{
                name: body.name,
                surname: body.surname,
                image: body.image
            }
        })

        return NextResponse.json({updatedUser});
    } 
    catch (error) {
        console.error(error.message);
        return NextResponse.json({error: error.message}, {status: 500})
    }
    
}

