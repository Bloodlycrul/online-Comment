"use client";

import React from "react";
import { useSession, signIn, signOut } from "next-auth/react";
import Image from "next/image";
import { useState } from "react";
import { UserTypes } from "@/types/UserTypes";

const SignIn = () => {
  const [userState, setUserState] = useState<UserTypes>({
    username: "",
    email: "",
    password: "",
  });

  const { data: session } = useSession();
  if (session) {
    <>
      Signed in as {session.user.email} <br />
      <button onClick={() => signOut()}>Sign Out</button>
    </>;
  }

  return (
    <>
      <div className=" flex items-center justify-center">
        <div className="flex flex-col ">
          <input
            type="text"
            className=""
            placeholder="Enter the username"
            value={userState.username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setUserState({ ...userState, username: e.target.value });
            }}
          />
          <input
            type="email"
            className=""
            placeholder="Enter the username"
            value={userState.username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {}}
          />
          <input
            type="text"
            className=""
            placeholder="Enter the username"
            value={userState.username}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              setUserState({ ...userState, password: e.target.value });
            }}
          />
        </div>
        <div className="w-1/2 ">
          <Image
            src={
              "https://images.unsplash.com/photo-1485118571520-91ebb7fb2a78?q=80&w=2750&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            }
            alt="Image"
            sizes="100vw"
            width={1000}
            height={1000}
          />
        </div>
      </div>
    </>
  );
};

export default SignIn;
