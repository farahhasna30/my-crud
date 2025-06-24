import { cookies } from "next/headers";
import PostingResepPage from "./page-client";

export default async function PostingBarengWrapperPage() {
  const cookieStore = cookies();
  const username = cookieStore.get("username")?.value || null;

  console.log(
    "Username dibaca dari cookie di Server Component (Posting Bareng Wrapper):",
    username
  );

  return <PostingResepPage initialUsername={username} />;
}
