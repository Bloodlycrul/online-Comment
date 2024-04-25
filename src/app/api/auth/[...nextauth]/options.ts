import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/user";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await UserModel.findOne({
            $or: [
              { email: credentials.identifer.email },
              { username: credentials.identifer.username },
            ],
          });

          if (!user) {
            throw new Error("User not found");
          }

          if (!user.isVerifed) {
            throw new Error("Please verify your email address");
          }

          const verifyPassword = await bcrypt.compare(
            credentials.password,
            user.passsword
          );

          if (verifyPassword) {
            return user;
          } else {
            throw new Error("Please verify your password");
          }
        } catch (error: any) {
          console.error(error.message);
          throw new Error(error.message);
        }
      },
    }),
  ],

  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user._id = token._id;
        session.user.isVerified = token.isVerified;
        session.user.isAccpectedMessage = token.isAccpectedMessage;
        session.user.username = token.username;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isverified = user.isVerified;
        token.isAccpectedMessage = user.isAccpectedMessage;
        token.username = user.username;
      }
      return token;
    },
  },

  session: {
    strategy: "jwt",
  },

  secret: process.env.NEXTAUTH_SECRET,
};
