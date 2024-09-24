import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Slide from "./Slide";
import gsap from "gsap"

const ThreeScene = () => {
  const sceneRef = useRef(null);
  const threeDRef = useRef(null);
  const contentRef = useRef(null);


  useEffect(() => {
    const options = {
      root: null, // Use the viewport as the root
      rootMargin: '0px',
      threshold: 0.05 // Trigger when 5% of the element is visible
    };

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    sceneRef.current.appendChild(renderer.domElement);
    scene.fog = new THREE.FogExp2(0xcccccc, 10);


    const geometry = new THREE.BoxGeometry();
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    // const cube = new THREE.Mesh(geometry, material);
    // scene.add(cube);

    camera.position.z = 5;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.6;
    controls.keys = {
      LEFT: "ArrowLeft", //left arrow
      UP: "ArrowUp", // up arrow
      RIGHT: "ArrowRight", // right arrow
      BOTTOM: "ArrowDown", // down arrow
    };

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    scene.add(directionalLight);
    directionalLight.position.y = 10;
    // Load GLTF Model
    const loader = new GLTFLoader();
    loader.load(
      "boxworldtall.gltf",
      (gltf) => {
        gltf.scene.scale.set(1, 1, 1); // Adjust scale as needed
        scene.add(gltf.scene);
      },
      undefined,
      (error) => {
        console.error("Error loading GLTF model", error);
      }
    );

    const isReduced =
      window.matchMedia(`(prefers-reduced-motion: reduce)`) === true ||
      window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true;

    const onScroll = (e) => {

      
      if (!isReduced) {
        if (e.wheelDelta > 0) {
          camera.position.z += 0.1;
         
           
        } else {
          camera.position.z -= 0.1;
        }
      }
    };
    window.addEventListener("wheel", (e) => onScroll(e));
   
    const animate = function () {
      requestAnimationFrame(animate);


      renderer.render(scene, camera);
    };

    animate();


    const handleIntersection = (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          console.log('Element with ID "three-d" is entering the viewport');
          gsap.to( scene.fog, {
            density: 0.01,
            duration: 4,
            ease: "power2.inOut",
          })
          contentRef.current.style.color ="red"
          // You can add any action you want to take when the element is in view
        }
      });
    };

    const observer = new IntersectionObserver(handleIntersection, options);
    if (threeDRef.current) {
      observer.observe(threeDRef.current);
    }

   

    return () => {
      if (threeDRef.current) {
        observer.unobserve(threeDRef.current);
      }
      sceneRef.current.removeChild(renderer.domElement);
    };
  }, []);

  return(
    <>
    <div ref={sceneRef} className="fixed inset-0" />
    <div ref={contentRef} className="content-container absolute top-0 z-1 text-xl">
        <Slide>
          <h1>Addressing Interface Boundaries in Space</h1>
        </Slide>

        <Slide>
          <p>
            The following will encourage you to imagine interfaces, in real life,
            as objects, and in their entirety.
          </p>
          <p>We will looking at extension beyond the physical screen.</p>
        </Slide>

        <Slide>
          <h1>What is the "real life" analogue of this document?</h1>
        </Slide>

        <Slide>
          <img
            src="/scroll.png" // Path to your image
            alt="Description of image"
            width={300} // Desired width
          />
        </Slide>

        <Slide>
          <blockquote>
            <i>
              As spatial practice, computer games are both representations of
              space (a formal system of relations) and representational spaces
              (symbolic imagery with a primarily aesthetic purpose). [...] But
              it indicates that the spatial representation in computer games is
              ambivalent and doublesided: it is both conceptual and associative.
            </i>
          </blockquote>
          <span className="block mt-10">
            Espen Aarseth, ALLEGORIES OF SPACE The Question of Spatiality in
            Computer Games
          </span>
        </Slide>

        <Slide>
          <p>
            Visual interfaces leverage real life metaphors but are not constrained by
            them…
          </p>
          <p>
            We can use JavaScript to selectively break pretty much any of the real world
            constraints on a scroll of paper.
          </p>
        </Slide>

        <Slide>
          <div className="perspective-container">
            <h2 className="rotate-element-2">
              What denial of real world constraints looks like.
            </h2>
          </div>
        </Slide>

        <Slide>
          <p>
            When we introduce a third dimension, we now have to think about
            space through the screen in addition to space outside the window
            plane.
          </p>
          <div className="w-full flex justify-around">
          <div className="perspective-container">
          <img
            src="/down-arrow.svg" // Path to your image
            alt="Infinity hands"
            width={300} // Desired width
            className="rotate-element-3"
          />
          </div>
          </div>
         

        </Slide>

        <Slide >
          <p>
            And this brings us to a problem: there is no default visual bound to
            a 3D environment, you can imagine it going on forever.
          </p>
        </Slide>


        <Slide>
        <div className="w-full flex justify-around">
        <div className="perspective-container">
          <img
            src="/infinity.jpg" // Path to your image
            alt="Infinity hands"
            width={300} // Desired width
            className="rotate-element-2"
          />
            <h2 className="rotate-element">We are now in an 1.7976931348623157e+308 * 1.0000001 space.</h2>
          </div>
</div>
       

        </Slide>

        <Slide >

        <h1 ref={threeDRef} className="">This is 3D infinite scroll ...</h1>

          <h2>Why does infinity feel so bad?</h2>
          <p>
            When an interface uses infinity, we can no longer understand an
            interface as a metaphor for a physical object. It becomes messy,
            unable to be seen in its entirety. You couldn't recreate it in real
            life if you tried.
          </p>
        </Slide>


        <Slide>
          <h2 className="">Looking to games for answers, looking to paintings, looking to dioramas.</h2>
          <div className="w-full flex justify-around">
          <div className="perspective-container">
          <img
            src="/theinteriorityofoutside.PNG" // Path to your image
            alt="Infinity hands"
            width={300} // Desired width
            className="mt-10"
          />
           <img
            src="/depthmap.png" // Path to your image
            alt="Infinity hands"
            width={300} // Desired width
            className="rotate-element-2"
          />
          </div>
          </div>
        
        </Slide>

    

      

        <Slide>
         
          <p>
            It's OKAY! for websites to have their own internal logic structure.
          </p>
        </Slide>
      </div>
    </>
  )
  
  
  
  
};

export default ThreeScene;
