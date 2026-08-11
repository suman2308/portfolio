import { Nav } from "./components/Nav";
import { Hero } from "./components/Hero";
import { SplashCursor } from "./components/effects/SplashCursor";
import { About } from "./sections/About";
import { Projects } from "./sections/Projects";
import { Skills } from "./sections/Skills";
import { Coding } from "./sections/Coding";
import { Certifications } from "./sections/Certifications";
import { Connect } from "./sections/Connect";

export default function App() {
  return (
    <div className="grain relative min-h-dvh">
      {/* warm ambient wash — a touch of orange, never overpowering */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 -z-10"
        style={{
          background:
            "radial-gradient(52% 40% at 18% 0%, rgba(255,122,26,0.05), transparent 62%), radial-gradient(46% 38% at 88% 100%, rgba(255,150,60,0.045), transparent 60%)",
        }}
      />

      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <About />
        <Projects />
        <Skills />
        <Coding />
        <Certifications />
      </main>
      <Connect />
      <SplashCursor hueRange={[12, 44]} saturation={90} accent="#ffe9d6" radius={0.45} opacity={0.42} />
    </div>
  );
}
