import Header from "../components/Header";
import Hero from "../components/Hero";
import Results from "../components/Results";
import HowItWorks from "../components/HowItWorks";
import Application from "../components/Application";
import Footer from "../components/Footer";
import SiteDialogs from "../components/SiteDialogs";
import SiteInteractions from "../components/SiteInteractions";

export default function Home() {
  return (
    <>
      <SiteInteractions />
      <a className="skip" href="#application">
        Skip to application
      </a>
      <Header />
      <main>
        <Hero />
        <Results />
        <HowItWorks />
        <Application />
      </main>
      <Footer />
      <SiteDialogs />
    </>
  );
}
