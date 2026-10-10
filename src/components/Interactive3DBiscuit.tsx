import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import type { FlavorId } from '../store'

interface Props {
  flavorId: FlavorId
}

// Flavor color schemes for lights, particles, and fallbacks
const FLAVOR_THEMES: Record<
  FlavorId,
  {
    modelUrl: string
    keyLightColor: number
    crumbColorHex: number
    crumbColorCss: string
    glowColor: string
    crustColor: string
    tintOverlay: string
    specular: string
  }
> = {
  original: {
    modelUrl: '/models/biscuit_original.glb',
    keyLightColor: 0xfff4db,
    crumbColorHex: 0xf5a623,
    crumbColorCss: '#F5A623',
    glowColor: 'rgba(245, 166, 35, 0.4)',
    crustColor: '#B87A24',
    tintOverlay: 'rgba(245, 166, 35, 0.08)',
    specular: 'rgba(255, 235, 180, 0.25)',
  },
  choco: {
    modelUrl: '/models/biscuit_choco.glb',
    keyLightColor: 0xffeedb,
    crumbColorHex: 0x8d5332,
    crumbColorCss: '#8D5332',
    glowColor: 'rgba(141, 83, 50, 0.45)',
    crustColor: '#361A0C',
    tintOverlay: 'rgba(54, 26, 12, 0.55)',
    specular: 'rgba(215, 160, 130, 0.2)',
  },
  matcha: {
    modelUrl: '/models/biscuit_matcha.glb',
    keyLightColor: 0xebfaed,
    crumbColorHex: 0x6fbf8b,
    crumbColorCss: '#6FBF8B',
    glowColor: 'rgba(111, 191, 139, 0.4)',
    crustColor: '#2B4A34',
    tintOverlay: 'rgba(50, 95, 65, 0.48)',
    specular: 'rgba(195, 240, 205, 0.25)',
  },
}

// Global model cache across renders so switching flavors is instant
const modelCache = new Map<FlavorId, THREE.Group>()

// --------------------------------------------------------------------------
// Three.js WebGL Real 3D Renderer (Persistent Lifecycle + Multi-Flavor Cache)
// --------------------------------------------------------------------------
function WebGLBiscuitCanvas({
  flavorId,
  onError,
}: {
  flavorId: FlavorId
  onError: () => void
}) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [loaded, setLoaded] = useState(false)
  const currentModelRef = useRef<THREE.Group | null>(null)
  const keyLightRef = useRef<THREE.DirectionalLight | null>(null)
  const crumbPointsRef = useRef<THREE.Points | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)

  // 1. One-time Three.js scene & renderer initialization (survives flavorId changes)
  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
        failIfMajorPerformanceCaveat: false,
      })
    } catch (e) {
      console.warn('WebGL init failed:', e)
      onError()
      return
    }

    const width = container.clientWidth || 420
    const height = container.clientHeight || 420
    renderer.setSize(width, height, false)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15
    renderer.domElement.style.width = '100%'
    renderer.domElement.style.height = '100%'
    renderer.domElement.style.cursor = 'grab'
    renderer.domElement.className = 'select-none'
    renderer.domElement.style.touchAction = 'pan-y'

    container.appendChild(renderer.domElement)

    const scene = new THREE.Scene()
    sceneRef.current = scene

    const camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 50)
    camera.position.set(0, 0.22, 3.5)

    // Orbit controls with smooth drag and idle auto-rotate
    const controls = new OrbitControls(camera, renderer.domElement)
    controls.enableDamping = true
    controls.dampingFactor = 0.05
    controls.enableZoom = false
    controls.enablePan = false
    controls.autoRotate = true
    controls.autoRotateSpeed = 1.4
    controls.maxPolarAngle = Math.PI / 1.7
    controls.minPolarAngle = Math.PI / 3.2

    renderer.domElement.addEventListener('pointerdown', () => {
      renderer.domElement.style.cursor = 'grabbing'
    })
    renderer.domElement.addEventListener('pointerup', () => {
      renderer.domElement.style.cursor = 'grab'
    })

    // Lighting Setup
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.9)
    scene.add(ambientLight)

    const keyLight = new THREE.DirectionalLight(FLAVOR_THEMES[flavorId].keyLightColor, 2.8)
    keyLight.position.set(4, 5, 4)
    scene.add(keyLight)
    keyLightRef.current = keyLight

    const fillLight = new THREE.DirectionalLight(0xffeedd, 1.4)
    fillLight.position.set(-4, -2, -2)
    scene.add(fillLight)

    const topRim = new THREE.DirectionalLight(0xffffff, 2.0)
    topRim.position.set(0, 6, -2)
    scene.add(topRim)

    // Floating crumb particles
    const crumbCount = 42
    const crumbGeo = new THREE.BufferGeometry()
    const crumbPos = new Float32Array(crumbCount * 3)
    for (let i = 0; i < crumbCount; i++) {
      crumbPos[i * 3] = (Math.random() - 0.5) * 3.4
      crumbPos[i * 3 + 1] = (Math.random() - 0.5) * 2.8
      crumbPos[i * 3 + 2] = (Math.random() - 0.5) * 2.8
    }
    crumbGeo.setAttribute('position', new THREE.BufferAttribute(crumbPos, 3))
    const crumbMat = new THREE.PointsMaterial({
      size: 0.045,
      color: FLAVOR_THEMES[flavorId].crumbColorHex,
      transparent: true,
      opacity: 0.7,
    })
    const crumbPoints = new THREE.Points(crumbGeo, crumbMat)
    scene.add(crumbPoints)
    crumbPointsRef.current = crumbPoints

    // Resize handler
    const handleResize = () => {
      if (!container || !renderer) return
      const w = container.clientWidth || 420
      const h = container.clientHeight || 420
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h, false)
    }
    window.addEventListener('resize', handleResize)

    // Animation render loop
    let animId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const elapsedTime = clock.getElapsedTime()

      controls.update()

      // Idle floating bob for the biscuit without breaking centering
      if (currentModelRef.current) {
        currentModelRef.current.position.y = Math.sin(elapsedTime * 1.5) * 0.04
      }

      // Slow orbit for crumb particles
      crumbPoints.rotation.y = elapsedTime * 0.035
      crumbPoints.rotation.x = Math.sin(elapsedTime * 0.4) * 0.02

      renderer.render(scene, camera)
    }
    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
      controls.dispose()
      crumbGeo.dispose()
      crumbMat.dispose()
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [onError])

  // 2. Flavor switch effect: switches model and lighting inside the persistent scene
  useEffect(() => {
    const scene = sceneRef.current
    if (!scene) return

    const theme = FLAVOR_THEMES[flavorId]
    if (keyLightRef.current) {
      keyLightRef.current.color.setHex(theme.keyLightColor)
    }
    if (crumbPointsRef.current) {
      ;(crumbPointsRef.current.material as THREE.PointsMaterial).color.setHex(theme.crumbColorHex)
    }

    // Function to mount model into scene
    const applyModel = (model: THREE.Group) => {
      if (currentModelRef.current) {
        scene.remove(currentModelRef.current)
      }
      currentModelRef.current = model
      scene.add(model)
      setLoaded(true)
    }

    // Check if model is already cached
    const cached = modelCache.get(flavorId)
    if (cached) {
      applyModel(cached)
      return
    }

    // Otherwise load from file
    const loader = new GLTFLoader()
    loader.load(
      theme.modelUrl,
      (gltf) => {
        const model = gltf.scene

        // Center and normalize geometry
        const box = new THREE.Box3().setFromObject(model)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())

        // Wrap in parent group so position offset doesn't get wiped by animate loop
        const pivot = new THREE.Group()
        model.position.x = -center.x
        model.position.y = -center.y
        model.position.z = -center.z
        pivot.add(model)

        const maxDim = Math.max(size.x, size.y, size.z) || 1
        const targetScale = 2.1 / maxDim
        pivot.scale.setScalar(targetScale)

        // Commercial food photography presentation angle:
        // Tilt top cracked face towards viewer (Math.PI / 2.6 ~ 69°)
        pivot.rotation.set(1.22, 0.04, -0.04)

        // Enhance material aesthetics
        model.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh
            if (mesh.material) {
              const mat = (
                Array.isArray(mesh.material) ? mesh.material[0] : mesh.material
              ) as THREE.MeshStandardMaterial
              mat.roughness = flavorId === 'choco' ? 0.76 : flavorId === 'matcha' ? 0.9 : 0.84
              mat.metalness = 0.02
              mat.needsUpdate = true
            }
          }
        })

        modelCache.set(flavorId, pivot)
        applyModel(pivot)
      },
      undefined,
      (err) => {
        console.warn('Failed loading GLB model for flavor:', flavorId, err)
        onError()
      }
    )
  }, [flavorId, onError])

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <div ref={mountRef} className="w-full h-full flex items-center justify-center" />
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <img
            src="/cookie_top.png"
            alt="OkaraBite"
            className="w-48 h-48 object-contain opacity-50 animate-pulse"
          />
        </div>
      )}
    </div>
  )
}

// --------------------------------------------------------------------------
// Framer Motion 3D Physics Fallback (Always Works If WebGL is Disabled)
// --------------------------------------------------------------------------
function FramerMotionFallback({ flavorId }: { flavorId: FlavorId }) {
  const theme = FLAVOR_THEMES[flavorId]
  const containerRef = useRef<HTMLDivElement>(null)

  const rotX = useMotionValue(14)
  const rotY = useMotionValue(-18)
  const springX = useSpring(rotX, { stiffness: 85, damping: 14 })
  const springY = useSpring(rotY, { stiffness: 85, damping: 14 })

  const isDragging = useRef(false)
  const startPos = useRef({ x: 0, y: 0 })
  const currentRot = useRef({ x: 14, y: -18 })
  const [isInteracting, setIsInteracting] = useState(false)

  useEffect(() => {
    let animId: number
    let t = 0
    const loop = () => {
      if (!isDragging.current) {
        t += 0.02
        rotX.set(currentRot.current.x + Math.cos(t * 0.5) * 8)
        rotY.set(currentRot.current.y + Math.sin(t * 0.7) * 16)
      }
      animId = requestAnimationFrame(loop)
    }
    animId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animId)
  }, [rotX, rotY])

  const handlePointerDown = (e: React.PointerEvent) => {
    isDragging.current = true
    setIsInteracting(true)
    startPos.current = { x: e.clientX, y: e.clientY }
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging.current) return
    const dx = e.clientX - startPos.current.x
    const dy = e.clientY - startPos.current.y
    rotY.set(currentRot.current.y + dx * 0.55)
    rotX.set(Math.max(-55, Math.min(55, currentRot.current.x - dy * 0.55)))
  }

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!isDragging.current) return
    isDragging.current = false
    setIsInteracting(false)
    currentRot.current = { x: rotX.get(), y: rotY.get() }
    try {
      ;(e.target as HTMLElement).releasePointerCapture(e.pointerId)
    } catch {}
  }

  const lightReflectionX = useTransform(springY, [-60, 60], ['20%', '80%'])
  const lightReflectionY = useTransform(springX, [-60, 60], ['80%', '20%'])
  const depthLayers = [-14, -10, -6, -2, 2, 6, 10, 14]

  return (
    <div
      ref={containerRef}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className="relative w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing select-none"
      style={{ perspective: 1200, touchAction: 'pan-y' }}
    >
      <motion.div
        style={{
          rotateX: springX,
          rotateY: springY,
          transformStyle: 'preserve-3d',
        }}
        className="relative w-52 h-52 sm:w-72 sm:h-72 md:w-88 md:h-88 flex items-center justify-center transition-shadow duration-500"
      >
        <div
          className="absolute -bottom-10 w-56 sm:w-68 h-12 rounded-full pointer-events-none transition-all duration-700 blur-xl"
          style={{
            background: `radial-gradient(ellipse at center, ${theme.glowColor} 0%, rgba(0,0,0,0.7) 40%, transparent 70%)`,
            transform: 'translateZ(-40px) rotateX(75deg)',
          }}
        />

        {depthLayers.map((z, idx) => (
          <div
            key={idx}
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              transform: `translateZ(${z}px)`,
              background:
                idx === 0 || idx === depthLayers.length - 1
                  ? 'transparent'
                  : `radial-gradient(circle, ${theme.crustColor} 60%, rgba(45,22,10,0.9) 100%)`,
              opacity: idx === 0 || idx === depthLayers.length - 1 ? 0 : 0.82,
              filter: 'blur(0.5px)',
            }}
          />
        ))}

        <div
          className="absolute inset-0 rounded-full overflow-hidden pointer-events-none"
          style={{
            transform: 'translateZ(-15px) rotateY(180deg)',
            background: `radial-gradient(circle at 50% 50%, ${theme.crustColor} 0%, #1A0D06 100%)`,
            boxShadow: 'inset 0 0 25px rgba(0,0,0,0.85)',
          }}
        >
          <img
            src="/cookie_top.png"
            alt=""
            className="w-full h-full object-contain brightness-75 contrast-125 filter"
            style={{ mixBlendMode: 'multiply' }}
          />
        </div>

        <div
          className="absolute inset-0 rounded-full flex items-center justify-center pointer-events-none"
          style={{
            transform: 'translateZ(16px)',
            filter: 'drop-shadow(0 20px 35px rgba(0,0,0,0.75))',
          }}
        >
          <img
            src="/cookie_top.png"
            alt="OkaraBite Artisan Biscuit"
            className="w-full h-full object-contain pointer-events-none select-none transition-transform duration-300"
            draggable={false}
          />

          <div
            className="absolute inset-2 rounded-full pointer-events-none transition-colors duration-700"
            style={{
              backgroundColor: theme.tintOverlay,
              mixBlendMode: flavorId === 'original' ? 'normal' : 'multiply',
            }}
          />

          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none opacity-40 mix-blend-screen"
            style={{
              background: `radial-gradient(circle at ${lightReflectionX} ${lightReflectionY}, ${theme.specular} 0%, transparent 60%)`,
            }}
          />
        </div>

        {[
          { x: -95, y: -80, z: 45, size: 7, delay: 0 },
          { x: 110, y: -60, z: -30, size: 5, delay: 0.5 },
          { x: 90, y: 85, z: 35, size: 8, delay: 1.0 },
          { x: -105, y: 70, z: -40, size: 6, delay: 1.5 },
          { x: 0, y: -125, z: 25, size: 4, delay: 0.8 },
          { x: -45, y: 115, z: 50, size: 6, delay: 1.2 },
        ].map((crumb, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full pointer-events-none shadow-md"
            style={{
              width: crumb.size,
              height: crumb.size,
              backgroundColor: theme.crumbColorCss,
              transform: `translate3d(${crumb.x}px, ${crumb.y}px, ${crumb.z}px)`,
            }}
            animate={{
              y: [crumb.y - 6, crumb.y + 6, crumb.y - 6],
              opacity: [0.65, 0.95, 0.65],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: crumb.delay,
            }}
          />
        ))}
      </motion.div>

      {/* Floating hint */}
      <div
        className={`absolute bottom-0 bg-black/60 backdrop-blur-md px-3.5 py-1 rounded-full border border-white/20 text-[10px] font-mono font-bold text-white/90 shadow-md flex items-center gap-2 pointer-events-none select-none transition-opacity ${
          isInteracting ? 'opacity-40' : 'opacity-100'
        }`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623] animate-pulse" />
        <span>DRAG TO ROTATE 360°</span>
      </div>
    </div>
  )
}

// Check WebGL support safely
function checkWebGLSupport(): boolean {
  try {
    const canvas = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl2') || canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  } catch {
    return false
  }
}

export default function Interactive3DBiscuit({ flavorId }: Props) {
  const [webglSupported] = useState(() => checkWebGLSupport())
  const [webglFailed, setWebglFailed] = useState(false)

  const showWebGL = webglSupported && !webglFailed

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {showWebGL ? (
        <WebGLBiscuitCanvas flavorId={flavorId} onError={() => setWebglFailed(true)} />
      ) : (
        <FramerMotionFallback flavorId={flavorId} />
      )}
    </div>
  )
}