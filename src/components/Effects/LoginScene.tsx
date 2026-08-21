'use client'

import React, { useRef, useEffect, memo } from 'react'
import * as THREE from 'three'

export const LoginScene = memo(function LoginScene() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let width = window.innerWidth
    let height = window.innerHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100)
    camera.position.set(0, 0, 6)

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

    const disposables: { dispose: () => void }[] = []

    // Lights
    const ambient = new THREE.AmbientLight(0xc7d2fe, 0.4)
    scene.add(ambient)
    const p1 = new THREE.PointLight(0x6366f1, 1.5, 15)
    p1.position.set(5, 5, 5)
    scene.add(p1)
    const p2 = new THREE.PointLight(0xa855f7, 1.0, 15)
    p2.position.set(-5, -3, 3)
    scene.add(p2)
    const mouseLight = new THREE.PointLight(0x818cf8, 2, 12)
    mouseLight.position.set(0, 0, 2)
    scene.add(mouseLight)

    // Center Icosahedron Ball
    const centerGeo = new THREE.IcosahedronGeometry(1, 2)
    const centerMat = new THREE.MeshPhysicalMaterial({
      color: '#6366f1',
      emissive: '#4f46e5',
      emissiveIntensity: 0.25,
      roughness: 0.1,
      metalness: 0.8,
      transparent: true,
      opacity: 0.4,
    })
    const centerMesh = new THREE.Mesh(centerGeo, centerMat)
    centerMesh.position.set(0, 0.2, 0)
    centerMesh.scale.setScalar(1.5)
    scene.add(centerMesh)
    disposables.push(centerGeo, centerMat)

    // Floating Torus Knot
    const knotGeo = new THREE.TorusKnotGeometry(1, 0.3, 64, 16)
    const knotMat = new THREE.MeshStandardMaterial({
      color: '#a855f7',
      emissive: '#9333ea',
      emissiveIntensity: 0.3,
      roughness: 0.15,
      metalness: 0.7,
      transparent: true,
      opacity: 0.35,
    })
    const knotMesh = new THREE.Mesh(knotGeo, knotMat)
    knotMesh.position.set(-3.5, 1.5, -2)
    knotMesh.scale.setScalar(0.6)
    scene.add(knotMesh)
    disposables.push(knotGeo, knotMat)

    // Floating Octahedron
    const octGeo = new THREE.OctahedronGeometry(1, 0)
    const octMat = new THREE.MeshStandardMaterial({
      color: '#c084fc',
      emissive: '#a855f7',
      emissiveIntensity: 0.3,
      roughness: 0.05,
      metalness: 0.9,
      transparent: true,
      opacity: 0.4,
    })
    const octMesh = new THREE.Mesh(octGeo, octMat)
    octMesh.position.set(3.8, -1, -1.5)
    octMesh.scale.setScalar(0.5)
    scene.add(octMesh)
    disposables.push(octGeo, octMat)

    // Floating Icosahedron
    const icoGeo = new THREE.IcosahedronGeometry(1, 1)
    const icoMat = new THREE.MeshStandardMaterial({
      color: '#818cf8',
      emissive: '#6366f1',
      emissiveIntensity: 0.4,
      wireframe: true,
      transparent: true,
      opacity: 0.5,
    })
    const icoMesh = new THREE.Mesh(icoGeo, icoMat)
    icoMesh.position.set(-3, -2, -3)
    icoMesh.scale.setScalar(0.35)
    scene.add(icoMesh)
    disposables.push(icoGeo, icoMat)

    // Particles
    const pCount = 150
    const pPos = new Float32Array(pCount * 3)
    for (let i = 0; i < pCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 20
      pPos[i * 3 + 1] = (Math.random() - 0.5) * 14
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 12 - 2
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
    const pMat = new THREE.PointsMaterial({
      size: 0.06,
      color: '#818cf8',
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    })
    const pMesh = new THREE.Points(pGeo, pMat)
    scene.add(pMesh)
    disposables.push(pGeo, pMat)

    // Mouse movement
    const handleMouseMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1
      const y = -(e.clientY / window.innerHeight) * 2 + 1
      mouseLight.position.x = x * 4
      mouseLight.position.y = y * 3
    }
    window.addEventListener('mousemove', handleMouseMove)

    const handleResize = () => {
      width = window.innerWidth
      height = window.innerHeight
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderer?.setSize(width, height, false)
    }
    window.addEventListener('resize', handleResize)

    let animId: number
    const clock = new THREE.Clock()

    const animate = () => {
      animId = requestAnimationFrame(animate)
      const t = clock.getElapsedTime()

      centerMesh.rotation.y = t * 0.15
      centerMesh.rotation.x = Math.sin(t * 0.1) * 0.1
      centerMesh.position.y = 0.2 + Math.sin(t * 1.5) * 0.1

      knotMesh.rotation.x = t * 0.3
      knotMesh.rotation.z = t * 0.2
      knotMesh.position.y = 1.5 + Math.sin(t * 2) * 0.15

      octMesh.rotation.y = t * 0.4
      octMesh.rotation.x = t * 0.25
      octMesh.position.y = -1 + Math.sin(t * 1.8) * 0.12

      icoMesh.rotation.y = -t * 0.2
      icoMesh.rotation.z = t * 0.15

      pMesh.rotation.y = t * 0.03

      renderer?.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', handleResize)
      disposables.forEach((d) => d.dispose())
      renderer?.dispose()
    }
  }, [])

  return (
    <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  )
})

export default LoginScene
