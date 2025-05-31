module.exports = () => `
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client"
import { compare } from "bcryptjs";


const prisma = new PrismaClient()

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Credentials({
      credentials: {
        name: {type: "name"},
        surname: {type: "surname"},
        email: {type:"email"},
        password: {type:"password"},
      },
      authorize: async (credentials) =>{

        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please provide both email and password.");
        }

        const user = await prisma.uSER.findUnique({
          where: { email: credentials.email },
        });

        if (!user) {
          throw new Error('Invalid Credentials');
        }

        const isPassValid = await compare(credentials.password, user.password);
        if (!isPassValid) {
          throw new Error('Wrong Password');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          surname: user.surname,
          image: user.image,
        };
      }
    })
  ],
  pages: {
    signIn: "/sign-in",
  },
  callbacks:{
    async signIn({user, account, profile }){
      if(account.provider == "google"){
        const existingUser = await prisma.uSER.findUnique({
          where: {email: user.email}
        });

        if(!existingUser){
          const newUser = await prisma.uSER.create({
            data: {
              name: profile.given_name,
              surname: profile.family_name,
              email: user.email,
              password: "",
              image: profile?.picture,
            },
          })
        }

      }
      return true;
    },
    async session({ session, user }) {
      if (session?.user) {
        const dbUser = await prisma.uSER.findUnique({
          where: { email: session.user.email },
        });

        if (dbUser) {
          session.user.id = dbUser.id;
          session.user.name = dbUser.name;
          session.user.image = dbUser.image
          session.user.surname = dbUser.surname
          session.user.accountType = dbUser.accountType
        }
      }
      return session;
    },
  },
  };

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };


`;


