'use client'

import React, { useRef, useEffect, memo } from 'react'
import * as THREE from 'three'

interface DemoCard3DSceneProps {
  type: 'salon' | 'neofit' | 'aura' | 'coffee'
  isHovered: boolean
}

export const DemoCard3DScene: React.FC<DemoCard3DSceneProps> = memo(({ type, isHovered }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const hoverRef = useRef(isHovered)
  hoverRef.current = isHovered

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const width = canvas.clientWidth || 320
    const height = canvas.clientHeight || 176

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.set(0, 0, 4.2)

    let renderer: THREE.WebGLRenderer | null = null
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      })
      renderer.setSize(width, height, false)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.5))
    } catch {
      return
    }

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
    scene.add(ambientLight)

    let lightColor = 0xf43f5e
    let particleColor = 0xfb7185

    if (type === 'neofit') {
      lightColor = 0x10b981
      particleColor = 0x34d399
    } else if (type === 'aura') {
      lightColor = 0x38bdf8
      particleColor = 0x7dd3fc
    } else if (type === 'coffee') {
      lightColor = 0xf59e0b
      particleColor = 0xfbbf24
    }

    const pointLight1 = new THREE.PointLight(lightColor, 2, 10)
    pointLight1.position.set(5, 5, 5)
    scene.add(pointLight1)

    const pointLight2 = new THREE.PointLight(0xffffff, 1, 10)
    pointLight2.position.set(-5, -3, 3)
    scene.add(pointLight2)

    const dirLight = new THREE.DirectionalLight(0xffffff, 1.0)
    dirLight.position.set(0, 4, 2)
    scene.add(dirLight)

    // Root Group
    const rootGroup = new THREE.Group()
    scene.add(rootGroup)

    const disposables: { dispose: () => void }[] = []

    // 1. SALON BLOOM
    let meshRef: THREE.Mesh | null = null
    let ringRef: THREE.Mesh | null = null

    // 2. NEOFIT
    let icoRef: THREE.Mesh | null = null
    let coreRef: THREE.Mesh | null = null
    let ring1Ref: THREE.Mesh | null = null
    let ring2Ref: THREE.Mesh | null = null

    // 3. CASA AURA
    let auraGroup: THREE.Group | null = null
    let wireRef: THREE.Mesh | null = null

    // 4. PIXEL COFFEE
    let coffeeGroup: THREE.Group | null = null
    let steamRing: THREE.Mesh | null = null

    if (type === 'salon') {
      const ringGeo = new THREE.TorusGeometry(1.5, 0.03, 16, 64)
      const ringMat = new THREE.MeshStandardMaterial({
        color: '#fb7185',
        emissive: '#f43f5e',
        emissiveIntensity: 0.8,
        roughness: 0.2,
        metalness: 0.8,
        transparent: true,
        opacity: 0.7,
      })
      ringRef = new THREE.Mesh(ringGeo, ringMat)
      ringRef.rotation.x = Math.PI / 4
      rootGroup.add(ringRef)

      const knotGeo = new THREE.TorusKnotGeometry(0.75, 0.22, 100, 16)
      const knotMat = new THREE.MeshPhysicalMaterial({
        color: '#f43f5e',
        emissive: '#be123c',
        emissiveIntensity: 0.35,
        roughness: 0.15,
        metalness: 0.4,
        clearcoat: 1,
        clearcoatRoughness: 0.1,
        transmission: 0.3,
        thickness: 0.8,
      })
      meshRef = new THREE.Mesh(knotGeo, knotMat)
      rootGroup.add(meshRef)

      disposables.push(ringGeo, ringMat, knotGeo, knotMat)
    } else if (type === 'neofit') {
      const icoGeo = new THREE.IcosahedronGeometry(0.95, 1)
      const icoMat = new THREE.MeshStandardMaterial({
        color: '#34d399',
        emissive: '#10b981',
        emissiveIntensity: 0.8,
        wireframe: true,
        roughness: 0.1,
        metalness: 0.9,
      })
      icoRef = new THREE.Mesh(icoGeo, icoMat)
      rootGroup.add(icoRef)

      const coreGeo = new THREE.OctahedronGeometry(0.5, 0)
      const coreMat = new THREE.MeshStandardMaterial({
        color: '#6ee7b7',
        emissive: '#059669',
        emissiveIntensity: 1.5,
        roughness: 0.1,
        metalness: 0.7,
      })
      coreRef = new THREE.Mesh(coreGeo, coreMat)
      rootGroup.add(coreRef)

      const r1Geo = new THREE.TorusGeometry(1.35, 0.025, 16, 64)
      const r1Mat = new THREE.MeshBasicMaterial({
        color: '#10b981',
        transparent: true,
        opacity: 0.6,
      })
      ring1Ref = new THREE.Mesh(r1Geo, r1Mat)
      rootGroup.add(ring1Ref)

      const r2Geo = new THREE.TorusGeometry(1.2, 0.025, 16, 64)
      const r2Mat = new THREE.MeshBasicMaterial({
        color: '#34d399',
        transparent: true,
        opacity: 0.4,
      })
      ring2Ref = new THREE.Mesh(r2Geo, r2Mat)
      rootGroup.add(ring2Ref)

      disposables.push(icoGeo, icoMat, coreGeo, coreMat, r1Geo, r1Mat, r2Geo, r2Mat)
    } else if (type === 'aura') {
      auraGroup = new THREE.Group()
      rootGroup.add(auraGroup)

      const boxGeo = new THREE.BoxGeometry(1.1, 0.8, 1.1)
      const boxMat = new THREE.MeshPhysicalMaterial({
        color: '#38bdf8',
        emissive: '#0284c7',
        emissiveIntensity: 0.3,
        roughness: 0.1,
        metalness: 0.3,
        transmission: 0.4,
        thickness: 0.6,
        transparent: true,
        opacity: 0.85,
      })
      const box = new THREE.Mesh(boxGeo, boxMat)
      box.position.set(0, -0.2, 0)
      auraGroup.add(box)

      const coneGeo = new THREE.ConeGeometry(1.0, 0.6, 4)
      const coneMat = new THREE.MeshStandardMaterial({
        color: '#0ea5e9',
        emissive: '#0369a1',
        emissiveIntensity: 0.4,
        roughness: 0.2,
        metalness: 0.8,
      })
      const cone = new THREE.Mesh(coneGeo, coneMat)
      cone.position.set(0, 0.5, 0)
      cone.rotation.y = Math.PI / 4
      auraGroup.add(cone)

      const wireGeo = new THREE.BoxGeometry(1.35, 1.35, 1.35)
      const wireMat = new THREE.MeshStandardMaterial({
        color: '#7dd3fc',
        emissive: '#38bdf8',
        emissiveIntensity: 0.8,
        wireframe: true,
        transparent: true,
        opacity: 0.5,
      })
      wireRef = new THREE.Mesh(wireGeo, wireMat)
      auraGroup.add(wireRef)

      disposables.push(boxGeo, boxMat, coneGeo, coneMat, wireGeo, wireMat)
    } else if (type === 'coffee') {
      coffeeGroup = new THREE.Group()
      coffeeGroup.position.set(0, -0.1, 0)
      rootGroup.add(coffeeGroup)

      const cupGeo = new THREE.CylinderGeometry(0.7, 0.5, 0.9, 32)
      const cupMat = new THREE.MeshPhysicalMaterial({
        color: '#fef3c7',
        emissive: '#f59e0b',
        emissiveIntensity: 0.25,
        roughness: 0.2,
        metalness: 0.1,
        clearcoat: 0.8,
      })
      const cup = new THREE.Mesh(cupGeo, cupMat)
      coffeeGroup.add(cup)

      const handleGeo = new THREE.TorusGeometry(0.25, 0.08, 16, 32, Math.PI)
      const handleMat = new THREE.MeshStandardMaterial({ color: '#fde68a', roughness: 0.3 })
      const handle = new THREE.Mesh(handleGeo, handleMat)
      handle.position.set(0.65, 0, 0)
      handle.rotation.z = Math.PI / 2
      coffeeGroup.add(handle)

      const liquidGeo = new THREE.CylinderGeometry(0.66, 0.66, 0.05, 32)
      const liquidMat = new THREE.MeshStandardMaterial({
        color: '#451a03',
        emissive: '#78350f',
        emissiveIntensity: 0.3,
        roughness: 0.1,
        metalness: 0.4,
      })
      const liquid = new THREE.Mesh(liquidGeo, liquidMat)
      liquid.position.set(0, 0.38, 0)
      coffeeGroup.add(liquid)

      const steamGeo = new THREE.TorusGeometry(0.4, 0.03, 16, 32)
      const steamMat = new THREE.MeshStandardMaterial({
        color: '#f59e0b',
        emissive: '#fbbf24',
        emissiveIntensity: 1.2,
        transparent: true,
        opacity: 0.65,
      })
      steamRing = new THREE.Mesh(steamGeo, steamMat)
      steamRing.position.set(0, 0.7, 0)
      coffeeGroup.add(steamRing)

      disposables.push(
        cupGeo,
        cupMat,
        handleGeo,
        handleMat,
        liquidGeo,
        liquidMat,
        steamGeo,
        steamMat
      )
    }

    // Particles
    const particleCount = 35
    const particlePositions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 4.5
      particlePositions[i * 3 + 1] = (Math.random() - 0.5) * 3.5
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 3.0
    }
    const particleGeo = new THREE.BufferGeometry()
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3))
    const particleMat = new THREE.PointsMaterial({
      size: 0.06,
      color: particleColor,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    })
    const particleMesh = new THREE.Points(particleGeo, particleMat)
    scene.add(particleMesh)
    disposables.push(particleGeo, particleMat)

    // Animation Loop
    let animId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()
      const isHov = hoverRef.current
      const targetScale = isHov ? 1.15 : 1.0
      rootGroup.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1)

      // Float effect
      rootGroup.position.y = Math.sin(t * 2) * 0.12

      if (type === 'salon') {
        const speed = isHov ? 1.8 : 0.8
        if (meshRef) {
          meshRef.rotation.x = t * 0.4 * speed
          meshRef.rotation.y = t * 0.6 * speed
        }
        if (ringRef) {
          ringRef.rotation.z = -t * 0.5 * speed
          ringRef.rotation.x = Math.sin(t * 0.5) * 0.3
        }
      } else if (type === 'neofit') {
        const speed = isHov ? 2.2 : 1.0
        if (icoRef) {
          icoRef.rotation.x = t * 0.5 * speed
          icoRef.rotation.y = t * 0.7 * speed
        }
        if (coreRef) {
          coreRef.rotation.y = -t * 0.9 * speed
          const s = 0.5 + Math.sin(t * 3) * 0.08
          coreRef.scale.set(s, s, s)
        }
        if (ring1Ref) {
          ring1Ref.rotation.x = t * 0.8 * speed
          ring1Ref.rotation.z = t * 0.4 * speed
        }
        if (ring2Ref) {
          ring2Ref.rotation.y = -t * 0.7 * speed
          ring2Ref.rotation.z = t * 0.6 * speed
        }
      } else if (type === 'aura') {
        const speed = isHov ? 1.5 : 0.7
        if (auraGroup) {
          auraGroup.rotation.y = t * 0.4 * speed
          auraGroup.rotation.x = 0.25 + Math.sin(t * 0.5) * 0.1
        }
        if (wireRef) {
          wireRef.rotation.y = -t * 0.6 * speed
        }
      } else if (type === 'coffee') {
        const speed = isHov ? 2.0 : 0.9
        if (coffeeGroup) {
          coffeeGroup.rotation.y = t * 0.5 * speed
          coffeeGroup.rotation.z = Math.sin(t * 0.8) * 0.08
        }
        if (steamRing) {
          steamRing.rotation.x = Math.PI / 2 + Math.sin(t * 2) * 0.15
          steamRing.position.y = 0.7 + Math.sin(t * 2.5) * 0.15
          const s = 0.8 + Math.sin(t * 2) * 0.2
          steamRing.scale.set(s, s, s)
        }
      }

      particleMesh.rotation.y = t * 0.12
      particleMesh.rotation.x = Math.sin(t * 0.08) * 0.08

      renderer?.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(animId)
      disposables.forEach((d) => d.dispose())
      renderer?.dispose()
    }
  }, [type])

  return (
    <div className="w-full h-44 relative overflow-hidden pointer-events-none select-none rounded-2xl flex items-center justify-center">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  )
})

DemoCard3DScene.displayName = 'DemoCard3DScene'

export default DemoCard3DScene
