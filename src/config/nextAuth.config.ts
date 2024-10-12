/* eslint-disable padding-line-between-statements */
/* eslint-disable prettier/prettier */
import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import nexiosInstance from "./nexios.config";
import { cookies } from "next/headers";
export const AuthOptions : NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],

  callbacks: {
    async signIn({ profile, account }: any) {
      try {
        if (!profile || !account) {
          return false;
        }

        console.log({ profile, account });
        if (account?.provider === "google") {
          const response: any = await nexiosInstance.post("/auth/login", {
            name: profile.name,
            email: profile.email,
            profilePicture: profile.picture,
            // isOAuth: true,
          });
          // console.log('Backend response:', response.data);
          // eslint-disable-next-line padding-line-between-statements
          if (
            response.data.data.accessToken ||
            response.data.data.refreshToken
          ) {
            cookies().set("accessToken", response.data.data.accessToken);
            cookies().set("refreshToken", response.data.data.refreshToken);
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      } catch (error) {
        console.log(error);
        return false;
      }

      // return true;
    },
  },

  pages: {
    signIn: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET as string,
};
