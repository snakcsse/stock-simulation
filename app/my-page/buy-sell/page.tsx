import Search from "@/app/ui/search";
import Footer from "@/app/ui/footer";

export default async function Page() {
  return (
    <>
      <div className="w-full">
        <Search placeholder="Search stocks..." />
      </div>
      <Footer
        sources={[
          {
            name: "Alpha Vantage",
            link: "https://www.alphavantage.co/documentation/",
          },
        ]}
      ></Footer>
    </>
  );
}
