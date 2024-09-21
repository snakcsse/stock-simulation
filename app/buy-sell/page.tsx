import Quote from "@/app/ui/quote";
import Search from "@/app/ui/search";

export default async function Page({
  searchParams,
}: {
  searchParams?: { keywords?: string };
}) {
  const keywords = searchParams?.keywords || "";

  return (
    <div className="w-full">
      <h1>Quote</h1>
      <Search placeholder="Search stocks..." />
      {/* <Quote keywords={keywords} /> */}
    </div>
  );
}
