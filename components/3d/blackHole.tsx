"use client"

import { useEffect, useRef } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js"
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js"
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js"
import SplineLoader from "@splinetool/loader"

export default function BlackHole({ onLoad }: { onLoad?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!containerRef.current) return

    // Camera
    const zoom = (innerWidth < 500)? 1.37 * (innerHeight/innerWidth) : 1.17 *(innerHeight/innerWidth)
    const width = (innerWidth < 700)? innerWidth -50  : innerWidth/2
    const height = innerWidth<700 ? 700 : 500
    const asciiResolutionX = (innerWidth < 400)? innerWidth/0.9 : innerWidth/2
    const asciiResolutionY = (innerWidth < 700)? innerHeight/0.9 : innerHeight/2

    const camera = new THREE.OrthographicCamera(
      (window.innerWidth / -2) * zoom,
      (window.innerWidth / 2) * zoom,
      (window.innerHeight / 2) * zoom,
      (window.innerHeight / -2) * zoom,
      -100000,
      100000,
    )
    camera.position.set(48.7, -54.15, 1358.42)
    camera.quaternion.setFromEuler(new THREE.Euler(0.04, 0.04, 0))

    // Scene
    const scene = new THREE.Scene()
    scene.background = new THREE.Color("#000000")

    let mixer: THREE.AnimationMixer | null = null
    const clock = new THREE.Clock()
    let splineObject: THREE.Object3D | null = null

    // Spline scene loader
    const loader = new SplineLoader()
    loader.load(
      "/scene.splinecode",
      (splineScene) => {
        splineObject = splineScene
        scene.add(splineScene)

        if (splineScene.animations && splineScene.animations.length > 0) {
          mixer = new THREE.AnimationMixer(splineScene)
          splineScene.animations.forEach((clip) => {
            const action = mixer!.clipAction(clip)
            action.play()
          })
        }

        if (onLoad) onLoad() 
      },
      undefined,
      (err) => console.error("Spline load error:", err),
    )


    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setSize(width, height)
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFShadowMap
    renderer.setClearAlpha(0)
    containerRef.current.appendChild(renderer.domElement)
    containerRef.current.style.width = `${width}`
    containerRef.current.style.height = `${(innerWidth< 700)? "300px" : "500px"}`

    const asciiShader = {
      uniforms: {
        tDiffuse: { value: null },
        resolution: {
          value: new THREE.Vector2(asciiResolutionX, asciiResolutionY),
        },
        pixelSize: { value: 6.0 },
        greyscale: { value: true },
        contrast: { value: 2.5 },
        backgroundColor: { value: new THREE.Color("#000000") },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D tDiffuse;
        uniform vec2 resolution;
        uniform float pixelSize;
        uniform bool greyscale;
        uniform float contrast;
        uniform vec3 backgroundColor;
        varying vec2 vUv;

        float character(float n, vec2 p) {
          p = floor(p * vec2(4.0, 4.0) + 2.5);
          if (clamp(p.x, 0.0, 4.0) == p.x) {
            if (clamp(p.y, 0.0, 4.0) == p.y) {
              int a = int(floor(p.x) + 5.0 * floor(p.y));
              if (((int(n) >> a) & 1) == 1) return 1.0;
            }
          }
          return 0.0;
        }

        void main() {
          vec2 uv = vUv;
          vec3 col = texture2D(tDiffuse, uv).rgb;
          
          float gray = 0.3 * col.r + 0.59 * col.g + 0.11 * col.b;
          
          gray = clamp((gray - 0.5) * contrast + 0.5, 0.0, 1.0);
          
          float n = 0.0;
          if (gray > 0.8) n = 65600.0;      // @
          else if (gray > 0.6) n = 332772.0; // #
          else if (gray > 0.4) n = 15255086.0; // +
          else if (gray > 0.2) n = 1040480.0;  // .
          else n = 0.0;                        // space (use background color)
          
          vec2 p = mod(uv * resolution.xy / pixelSize, 2.0) - vec2(1.0);
          float charValue = character(n, p);
          
          if (greyscale) {
            col = mix(backgroundColor, vec3(gray), charValue);
          } else {
            col = mix(backgroundColor, col, charValue);
          }
          
          gl_FragColor = vec4(col, 1.0);
        }
      `,
    }

    // Post-processing
    const composer = new EffectComposer(renderer)
    const renderPass = new RenderPass(scene, camera)
    composer.addPass(renderPass)

    const asciiPass = new ShaderPass(asciiShader)
    asciiPass.renderToScreen = true
    composer.addPass(asciiPass)

    // Orbit controls
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.125
    controls.enableZoom = false
    controls.enableRotate = true

    // Window resize handler
    function onWindowResize() {
      if(!containerRef.current) return
      const zoom = (innerWidth < 500)? 1.37 * (innerHeight/innerWidth) : 1.17 *(innerHeight/innerWidth)
      const width = (innerWidth < 700)? innerWidth-50  : innerWidth/2
      const height = innerWidth<700 ? 700 : 500
      const asciiResolutionX = (innerWidth < 400)? innerWidth/0.9 : innerWidth/2
      const asciiResolutionY = (innerWidth < 700)? innerHeight/0.9 : innerHeight/2

      camera.left = (window.innerWidth / -2) * zoom
      camera.right = (window.innerWidth / 2) * zoom
      camera.top = (window.innerHeight / 2) * zoom
      camera.bottom = (window.innerHeight / -2) * zoom
      camera.updateProjectionMatrix()
      renderer.setSize(width, height)
      composer.setSize(width, height)
      asciiPass.uniforms.resolution.value.set(asciiResolutionX, asciiResolutionY)
      containerRef.current.style.width = `${width}`
      containerRef.current.style.height = `${(innerWidth< 700)? "300px" : "500px"}`


    }
    onWindowResize()
    window.addEventListener("resize", onWindowResize)

    function animate() {
      if (splineObject) {
        splineObject.rotation.y += 0.005
      }

      if (mixer) {
        const delta = clock.getDelta()
        mixer.update(delta)
      }

      controls.update()
      composer.render()
    }

    renderer.setAnimationLoop(animate)

    // Cleanup
    return () => {
      window.removeEventListener("resize", onWindowResize)
      renderer.setAnimationLoop(null)
      renderer.dispose()
      if (containerRef.current) {
        containerRef.current.removeChild(renderer.domElement)
      }
    }
  }, [onLoad])

  return <div ref={containerRef} className="flex items-center justify-center overflow-hidden"/>
}
