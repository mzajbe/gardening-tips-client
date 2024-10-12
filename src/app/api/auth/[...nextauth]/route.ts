/* eslint-disable padding-line-between-statements */
/* eslint-disable prettier/prettier */
import nexiosInstance from "@/src/config/nexios.config";
import { AuthOptions } from "@/src/config/nextAuth.config";
import { profile } from "console";
import NextAuth from "next-auth";

import { cookies } from "next/headers";

const handler = NextAuth(AuthOptions);

export { handler as GET, handler as POST };
