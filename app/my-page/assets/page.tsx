import Assets from "@/app/ui/assets/assets";
import Footer from "@/app/ui/footer";

export default function Page() {
  return (
    <>
      <Assets></Assets>
      <Footer
        sources={[
          { name: "Finnhub", link: "https://finnhub.io/docs/api/introduction" },
        ]}
      ></Footer>
    </>
  );
}
