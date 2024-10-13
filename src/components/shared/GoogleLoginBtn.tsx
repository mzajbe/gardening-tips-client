/* eslint-disable padding-line-between-statements */
/* eslint-disable react/self-closing-comp */
/* eslint-disable prettier/prettier */
"use client";

import { Button } from "@nextui-org/button";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

const GoogleLoginBtn = () => {
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect");
  return (
    <Suspense>
      <Button
        onClick={() => {
          signIn("google", { callbackUrl: redirect ? redirect : "/" });
        }}
      >
        Log In With Google
      </Button>
    </Suspense>
  );
};

export default GoogleLoginBtn;
