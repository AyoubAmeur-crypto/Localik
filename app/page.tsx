import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import WhyChooseUs from "@/components/WhyChooseUs";
import PopularDeals from "@/components/PopularDeals";
import ContactFormSection from "@/components/ContactFormSection";
import LocationSection from "@/components/LocationSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import { getCarsPaginated, getCars } from "@/lib/db-actions";

export default async function Home() {
  const result = await getCarsPaginated(1, 8, { isAvailable: true });
  const initialCars = result.cars || [];
  const initialHasMore = result.hasMore || false;

  // Retrieve all available cars dynamically from the database
  const allDbCars = await getCars();
  const availableCars = allDbCars.filter((c) => c.isAvailable).map((c) => ({
    id: c.id,
    name: c.name,
    price: c.price,
    imageSrc: c.imageSrc,
  }));

  return (
    <main className="flex flex-col flex-1 bg-white relative">
      <Navbar />
      <HeroSection />
      <WhyChooseUs />
      <PopularDeals initialCars={initialCars} initialHasMore={initialHasMore} />
      <ContactFormSection availableCars={availableCars} />
      <LocationSection />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}


