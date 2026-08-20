import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import PopularDeals from "@/components/PopularDeals";
import ContactFormSection from "@/components/ContactFormSection";
import LocationSection from "@/components/LocationSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Home() {
  return (
    <main className="flex flex-col flex-1 bg-white relative">
      <Navbar />
      <HeroSection />
      <WhyChooseUs />
      <PopularDeals />
      <ContactFormSection />
      <LocationSection />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}


