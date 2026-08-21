'use client'

import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'

export default function Quote3DCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    let width = window.innerWidth
    let height = window.innerHeight

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100)
    camera.position.set(0, 0, 10)

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

    const group = new THREE.Group()
    scene.add(group)

    const disposables: { dispose: () => void }[] = []

    // Ambient and point light
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
    scene.add(ambientLight)
    const pointLight = new THREE.PointLight(0x22d3ee, 2, 25)
    pointLight.position.set(5, 5, 5)
    scene.add(pointLight)

    for (let i = 0; i < 10; i++) {
      const type = i % 4
      let geo: THREE.BufferGeometry
      if (type === 0) geo = new THREE.IcosahedronGeometry(1, 0)
      else if (type === 1) geo = new THREE.OctahedronGeometry(1, 0)
      else if (type === 2) geo = new THREE.DodecahedronGeometry(1, 0)
      else geo = new THREE.TorusKnotGeometry(0.6, 0.2, 24, 12)

      const mat = new THREE.MeshBasicMaterial({
        color: i % 2 === 0 ? '#22d3ee' : '#ec4899',
        transparent: true,
        opacity: 0.15,
        wireframe: true,
      })

      const mesh = new THREE.Mesh(geo, mat)
      mesh.position.set(
        (Math.random() - 0.5) * 22,
        (Math.random() - 0.5) * 14,
        -6 + Math.random() * -4
      )
      const scale = 0.4 + Math.random() * 0.8
      mesh.scale.set(scale, scale, scale)
      group.add(mesh)

      disposables.push(geo, mat)
    }

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
      group.rotation.y = t * 0.025
      group.rotation.x = Math.sin(t * 0.015) * 0.05
      renderer?.render(scene, camera)
    }

    animate()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', handleResize)
      disposables.forEach((d) => d.dispose())
      renderer?.dispose()
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-[1] opacity-60">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  )
}
