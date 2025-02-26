"use client";
import Featured from "@/components/featured/Featured";
import Footer from "@/components/footer/Footer";
import Header from "@/components/header/Header";
import MailList from "@/components/mailList/MailList";
import Navbar from "@/components/navbar/Navbar";
import Offers from "@/components/offers/Offers";
import PropertyList from "@/components/propertyList/PropertyList";
import FeaturedProperties from "@/components/featuredProperties/FeaturedProperties";


const Home = () => {

  return (
    <>

      <Navbar />
      <div className=" min-w-full overflow-x-hidden">
        <Header />
        <div className="space-y-[30px] mt-[50px]">
          <Heading text="Special Offers" />
          <Offers />
          <Featured />
          <Heading text="Browse by property type" />
          <PropertyList />
          <Heading text="Homes guests Featured" />
          <FeaturedProperties />
          <MailList />
          <Footer />
        </div>
      </div>
    </>
  );
};

export default Home;


const Heading = ({text}:{text: string}) => {
  return (
    <h1 className="container mx-auto px-4 font-semibold text-xl">{text}</h1>
  )
}
