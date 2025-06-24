"use server";

import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export async function loginAction(_, formData) {
  const cookieStore = await cookies();
  const username = formData.get("username");
  console.log(username);

  cookieStore.set("username", username);
  redirect("/receipts");
}

export async function logout() {
  redirect("/");
}
