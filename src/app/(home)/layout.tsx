import Header from "@/src/components/Header";
import Script from "next/script";

export default async function layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Script src="https://js.puter.com/v2" />
      <Header />
      {children}
    </>
  );
}
