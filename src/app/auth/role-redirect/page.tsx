import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { decodeAccessToken, getPostLoginRoute } from "@/src/lib/auth";

type RoleRedirectPageProps = {
  searchParams: {
    redirect?: string;
  };
};

const RoleRedirectPage = ({ searchParams }: RoleRedirectPageProps) => {
  const accessToken = cookies().get("accessToken")?.value;

  if (!accessToken) {
    redirect("/login");
  }

  const decodedUser = decodeAccessToken(accessToken);

  if (!decodedUser) {
    redirect("/login");
  }

  const nextRoute = getPostLoginRoute(decodedUser.role, searchParams.redirect);

  redirect(nextRoute);
};

export default RoleRedirectPage;
