// app/page.tsx

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import About from "../components/About";
import Work from "../components/Work";
import Projects from "../components/Projects";
import HorizontalWrapper from "../components/HorizontalWrapper";
import Skills from "../components/Skills";
import TrackRecord from "../components/TrackRecord";
import Process from "../components/Process";
import Learning from "../components/Learning";
import Contact from "../components/Contact";
import AiSignature from "../components/AiSignature";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Work />
      <Projects />

      <HorizontalWrapper id="skills-horizontal">
        <Skills />
        <TrackRecord />
        <Process />
        <Learning />
        <Contact />
      </HorizontalWrapper>

      <AiSignature />
      <Footer />
    </>
  );
}
