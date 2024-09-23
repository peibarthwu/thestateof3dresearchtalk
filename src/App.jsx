import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import ThreeScene from "./components/ThreeScene";

function App() {
  return (
    <>
      <ThreeScene />
      <div className="absolute top-0 z-1 px-[200px] text-xl">
        <h1>THE STATE OF 3D RESEARCH</h1>
        <h2>
          Understanding the interface as an object in its entirety (extension
          beyond the physical screen)
        </h2>

        <p>
          As spatial practice, computer games are both representations of space
          (a formal system of relations) and representational spaces (symbolic
          imagery with a primarily aesthetic purpose). This result is perhaps
          too open to be of any real use as it is; a much longer refinement and
          adaptation of Lefebvre’s theory than can be pursued here seems to be
          needed. But it indicates that the spatial representation in computer
          games is ambivalent and doublesided: it is both conceptual and
          associative.
          <br></br>
          Espen Aarseth, ALLEGORIES OF SPACE The Question of Spatiality in
          Computer Games
        </p>
        <p>
          Visual interfaces leverage real life metaphors but are not constrained
          by them…
        </p>
        <p>
          The only hard visual bound on interfaces is the clipping plane of your
          screen.
        </p>
        <p>
          In two dimensions, the denial of the interface as a physical object
          looks like endless scroll.
          <br></br>And infinity doesn’t feel that good.
          <br></br>We can no longer understand an interface as a metaphor for a
          physical object. It becomes messy, unable to be seen in its entirety.
          <br></br>You couldn’t recreate it in real life if you tried.
        </p>
        <p>
          When we introduce a third dimension, we now have to think about space
          through the screen in addition to space outside the window plane.
        </p>
        <p>
          There is no default visual bound to a 3D environment, you can imagine
          it going on forever.
        </p>
        <p>So how do we do visual bound-setting on 3D scenes?</p>
      </div>
    </>
  );
}

export default App;
