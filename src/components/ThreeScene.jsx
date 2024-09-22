import React, { useRef, useEffect } from "react";
import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass";

const ThreeScene = () => {
  const sceneRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    let perspective = 10;
    let customPass;
    let uMouse = new THREE.Vector2(0, 0);
    let LABEL_TEXT = "LULULEMON COUNTERFEIT";

    const scene = new THREE.Scene();

    const fov =
      (180 * (2 * Math.atan(window.innerHeight / 2 / perspective))) / Math.PI;
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    sceneRef.current.appendChild(renderer.domElement);
    const camera = new THREE.PerspectiveCamera(
      fov,
      window.innerWidth / window.innerHeight,
      1,
      1000
    );
    camera.position.set(0, 0, perspective);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    const labelMeshSize = innerWidth > innerHeight ? innerHeight : innerWidth;
    const labelGeometry = new THREE.PlaneGeometry(labelMeshSize, labelMeshSize);
    let labelTextureCanvas;

    // Canvas and corresponding context2d to be used for drawing the text
    labelTextureCanvas = canvasRef.current;
    const labelTextureCtx = labelTextureCanvas.getContext("2d");
    // Dynamic texture size based on the device capabilities
    const textureSize = Math.min(renderer.capabilities.maxTextureSize, 2048);
    const relativeFontSize = 20;
    // Size our text canvas
    labelTextureCanvas.width = textureSize;
    labelTextureCanvas.height = textureSize;
    labelTextureCtx.textAlign = "center";
    labelTextureCtx.textBaseline = "middle";
    // Dynamic font size based on the texture size (based on the device capabilities)
    labelTextureCtx.font = `${relativeFontSize}px Times New Roman`;
    const textWidth = labelTextureCtx.measureText(LABEL_TEXT).width;
    const widthDelta = labelTextureCanvas.width / textWidth;
    const fontSize = relativeFontSize * widthDelta;
    labelTextureCtx.font = `${fontSize}px Times New Roman`;
    labelTextureCtx.fillStyle = "white";
    labelTextureCtx.fillText(
      LABEL_TEXT,
      labelTextureCanvas.width / 2,
      labelTextureCanvas.height / 2
    );

    const labelMaterial = new THREE.MeshBasicMaterial({
      map: new THREE.CanvasTexture(labelTextureCanvas),
      transparent: true,
    });
    // Create a plane mesh, add it to the scene
    const labelMesh = new THREE.Mesh(labelGeometry, labelMaterial);
    scene.add(labelMesh);

    var postEffect = {
      uniforms: {
        tDiffuse: { value: null },
        uTime: { value: 0 },
        resolution: {
          value: new THREE.Vector2(window.innerWidth, window.innerHeight),
        },
        uMouse: { value: new THREE.Vector2(-10, -10) },
        uRadius: { value: 1.0 },
        uXCells: { value: 0.0 },
        uYCells: { value: 50.0 },
      },
      vertexShader: `varying vec2 vUv;  varying vec3 pos;
      void main() {vUv = uv; pos = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0 );}`,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform vec2 resolution;
        varying vec3 pos;
       
        varying vec2 vUv;
        uniform vec2 uMouse;
        uniform float uTime;
        uniform float uRadius;
        uniform float uXCells;
        uniform float uYCells;
    
        vec3 mod289(vec3 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    
    vec4 mod289(vec4 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0;
    }
    
    vec4 permute(vec4 x) {
         return mod289(((x*34.0)+1.0)*x);
    }
    
    vec4 taylorInvSqrt(vec4 r)
    {
      return 1.79284291400159 - 0.85373472095314 * r;
    }
    
    float snoise(vec3 v)
      { 
      const vec2	C = vec2(1.0/6.0, 1.0/3.0) ;
      const vec4	D = vec4(0.0, 0.5, 1.0, 2.0);
    
    // First corner
      vec3 i	= floor(v + dot(v, C.yyy) );
      vec3 x0 =	 v - i + dot(i, C.xxx) ;
    
    // Other corners
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min( g.xyz, l.zxy );
      vec3 i2 = max( g.xyz, l.zxy );
    
      //	 x0 = x0 - 0.0 + 0.0 * C.xxx;
      //	 x1 = x0 - i1	+ 1.0 * C.xxx;
      //	 x2 = x0 - i2	+ 2.0 * C.xxx;
      //	 x3 = x0 - 1.0 + 3.0 * C.xxx;
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
      vec3 x3 = x0 - D.yyy;			// -1.0+3.0*C.x = -0.5 = -D.y
    
    // Permutations
      i = mod289(i); 
      vec4 p = permute( permute( permute( 
                 i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
               + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
               + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
    
    // Gradients: 7x7 points over a square, mapped onto an octahedron.
    // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
      float n_ = 0.142857142857; // 1.0/7.0
      vec3	ns = n_ * D.wyz - D.xzx;
    
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);	//	mod(p,7*7)
    
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_ );		// mod(j,N)
    
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
    
      vec4 b0 = vec4( x.xy, y.xy );
      vec4 b1 = vec4( x.zw, y.zw );
    
      //vec4 s0 = vec4(lessThan(b0,0.0))*2.0 - 1.0;
      //vec4 s1 = vec4(lessThan(b1,0.0))*2.0 - 1.0;
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
    
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
    
      vec3 p0 = vec3(a0.xy,h.x);
      vec3 p1 = vec3(a0.zw,h.y);
      vec3 p2 = vec3(a1.xy,h.z);
      vec3 p3 = vec3(a1.zw,h.w);
    
    //Normalise gradients
      //vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      vec4 norm = inversesqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
    
    // Mix final noise value
      vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
      m = m * m;
      return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), 
                                    dot(p2,x2), dot(p3,x3) ) );
      }
    
    //////////////////////////////////////////////////////////////
    
    // PRNG
    // From https://www.shadertoy.com/view/4djSRW
    float prng(in vec2 seed) {
      seed = fract (seed * vec2 (5.3983, 5.4427));
      seed += dot (seed.yx, seed.xy + vec2 (21.5351, 14.3137));
      return fract (seed.x * seed.y * 95.4337);
    }
    
    //////////////////////////////////////////////////////////////
    
    float PI = 3.1415926535897932384626433832795;
    
    float noiseStack(vec3 pos,int octaves,float falloff){
      float noise = snoise(vec3(pos));
      float off = 1.0;
      if (octaves>1) {
        pos *= 2.0;
        off *= falloff;
        noise = (1.0-off)*noise + off*snoise(vec3(pos));
      }
      if (octaves>2) {
        pos *= 2.0;
        off *= falloff;
        noise = (1.0-off)*noise + off*snoise(vec3(pos));
      }
      if (octaves>3) {
        pos *= 2.0;
        off *= falloff;
        noise = (1.0-off)*noise + off*snoise(vec3(pos));
      }
      return (1.0+noise)/2.0;
    }
    
    vec2 noiseStackUV(vec3 pos,int octaves,float falloff,float diff){
      float displaceA = noiseStack(pos,octaves,falloff);
      float displaceB = noiseStack(pos+vec3(3984.293,423.21,5235.19),octaves,falloff);
      return vec2(displaceA,displaceB);
    }
        void main()  {
           vec2 fragCoord = gl_FragCoord.xy;
         
          float xpart = fragCoord.x/resolution.x;
          float ypart = vUv.y/resolution.y;
      
            float clip = 50.0;
            float ypartClip = vUv.y/clip;
            float ypartClippedFalloff = clamp(2.-ypartClip,0.0,1.0);
            float ypartClipped = min(ypartClip,1.);
            float ypartClippedn = 1.0-ypartClipped;
            float xfuel = 1.0-abs(2.0*xpart-1.0);//pow(1.0-abs(2.0*xpart-1.0),0.5);
            
            vec2 coordScaled = 0.01*fragCoord - 0.02*vec2(uXCells,0.0);
            vec3 position = vec3(coordScaled,0.0) + vec3(1223.0,6434.0,8425.0);
            vec3 flow = vec3(4.1*(0.5-xpart)*pow(ypartClippedn,4.0),-2.0*xfuel*pow(ypartClippedn,64.0),0.0);
            vec3 timing = uTime*vec3(0.0,-1.7,1.1) + flow;
    
            vec3 displacePos = vec3(1.0,0.5,1.0)*2.4*position+uTime*vec3(0.01,-0.7,1.3);
            vec3 displace3 = vec3(noiseStackUV(displacePos,2,0.4,0.1),0.0);
            vec3 noiseCoord = (vec3(2.0,1.0,1.0)*position+timing+0.4*displace3)/1.2;
            float noise = noiseStack(noiseCoord,3,0.4);
            float flames = pow(ypartClipped,0.3*xfuel)*pow(noise,0.3*xfuel);
    
            float f = ypartClippedFalloff*pow(1.0-flames*flames*flames,8.0);
            float fff = f*f*f;
            float ff = f*f;
    
            vec4 inputColor = texture2D(tDiffuse, vUv);
            vec3 fire = 1.2*vec3(fff*fff - inputColor.x, ff, f);
            vec4 color = vec4(fire/pos.y+0.5,  1.);
            gl_FragColor = color;
        }`,
    };

    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    composer.addPass(renderPass);

    customPass = new ShaderPass(postEffect);
    customPass.renderToScreen = true;
    composer.addPass(customPass);

    document.addEventListener("mousemove", (e) => {
      uMouse.x = e.clientX / window.innerWidth;
      uMouse.y = 1 - e.clientY / window.innerHeight;
    });

    window.addEventListener("resize", onWindowResize);
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(innerWidth, innerHeight);
    }

    function animate() {
      requestAnimationFrame(animate);
      composer.render();
      // renderer.render(scene, camera);

      if (customPass) {
        customPass.uniforms.uTime.value += 0.01;
        customPass.uniforms.uMouse.value = uMouse;
      }
    }
    animate();

    const handleResize = () => {
      if (customPass) {
        customPass.uniforms.resolution.value = new THREE.Vector2(window.innerWidth, window.innerHeight);
      }
    };

    console.log("running setup")

    // Attach the render function to the resize handler
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);

      sceneRef.current.removeChild(renderer.domElement);
    };

  }, []);

  return (
    <>
      <div ref={sceneRef} className="fixed inset-0" />
      <canvas
        ref={canvasRef}
        className="absolute top-0 left-0 w-screen h-screen hidden bg-[white]"
      ></canvas>
    </>
  );
};

export default ThreeScene;
