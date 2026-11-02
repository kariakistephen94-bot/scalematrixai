import Header from "../components/Header";
import Hero from "../components/Hero";
import Marquee from "../components/Marquee";
import Results from "../components/Results";
import EngineStory from "../components/EngineStory";
import Application from "../components/Application";
import Footer from "../components/Footer";
import SiteDialogs from "../components/SiteDialogs";
import SiteInteractions from "../components/SiteInteractions";
import MotionProvider from "../components/MotionProvider";

export default function Home() {
  return (
    <>
      <MotionProvider />
      <SiteInteractions />
      <div className="atmosphere" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <a className="skip" href="#application">
        Skip to application
      </a>
      <Header />
      <main>
        <Hero />
        <Marquee />
        <Results />
        <EngineStory />
        <Application />
      </main>
      <Footer />
      <SiteDialogs />
    </>
  );
}
