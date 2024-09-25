import Search from "@/app/ui/search";

export default async function Page({
  searchParams,
}: {
  searchParams?: { keywords?: string };
}) {
  const keywords = searchParams?.keywords || "";

  return (
    <div className="w-full">
      <Search placeholder="Search stocks..." />
    </div>
  );
}
