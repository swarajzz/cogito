import Header from "@/src/components/Header";
import { auth } from "@/src/lib/auth";
import { headers } from "next/headers";
import Script from "next/script";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <>
      <Script src="https://js.puter.com/v2" />
      <Header session={session} />
      {children}
    </>
  );
}
