import Header from "@/src/components/Header";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";

export default async function layout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return <Header children={children} session={session} />;
}
