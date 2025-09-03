import Header from "@/components/header";
import HeroSection from "@/components/hero-section";
import FilterBar from "@/components/filter-bar";
import AgentGrid from "@/components/agent-grid";
import VendorCTA from "@/components/vendor-cta";
import ContactForm from "@/components/contact-form";
import Footer from "@/components/footer";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <HeroSection />
      <FilterBar />
      <AgentGrid />
      <VendorCTA />
      <ContactForm />
      <Footer />
    </div>
  );
}
