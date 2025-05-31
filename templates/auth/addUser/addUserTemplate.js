module.exports = () => `
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(req, res) {
  
    try{
      const body = await req.json();
      const { name, surname, email, password } = body;

      const isUserExist = await prisma.uSER.findUnique({
        where: {email: email}
      })

      if(isUserExist){
        return NextResponse.json({error: "This email already in use!"}, {status:400});
      }

      const hashedPassword = await hash(password, 10);
      const newUser = await prisma.uSER.create({
        data: {
          name, 
          surname,
          email, 
          password: hashedPassword, 
          createdAt: new Date()}
      });
      
      return NextResponse.json(newUser, { status: 201 });

    }catch (error){
      console.log("Error while adding user:", error);
      return NextResponse.json({ error: "Internal Server Error", details: error.message }, { status: 500 });
    }
}
`;