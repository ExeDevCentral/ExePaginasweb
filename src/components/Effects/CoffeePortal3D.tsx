import { Canvas, useFrame } from '@react-three/fiber';
import { Float, PerspectiveCamera, Environment, ContactShadows } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'framer-motion';

const Bean = () => {
  const ref = useRef<THREE.Mesh>(null);
  // Pre-asignamos un vector para evitar crear objetos en cada frame (GC optimization)
  const tempVector = useMemo(() => new THREE.Vector3(), []);
  
  const speed = useMemo(() => Math.random() * 2 + 1, []);
  const rotationSpeed = useMemo(() => (Math.random() - 0.5) * 0.1, []);
  const direction = useMemo(() => new THREE.Vector3(
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10,
    Math.random() * 10 + 5
  ), []);

  useFrame(() => {
    if (ref.current) {
      // Optimizamos el cálculo de posición sin clonar vectores
      tempVector.copy(direction).multiplyScalar(0.01 * speed);
      ref.current.position.add(tempVector);
      ref.current.rotation.x += rotationSpeed;
      ref.current.rotation.y += rotationSpeed;
    }
  });

  // Compartimos la geometría y el material (se podría optimizar más con instancedMesh, 
  // pero para 40 granos esto es suficiente y limpio)
  return (
    <mesh ref={ref} position={[0, 0, -5]}>
      <capsuleGeometry args={[0.2, 0.3, 4, 8]} />
      <meshStandardMaterial color="#3d1d11" roughness={0.3} metalness={0.2} />
    </mesh>
  );
};

const StylizedCup = () => {
  return (
    <Float speed={5} rotationIntensity={2} floatIntensity={2}>
      <group position={[0, 0, 0]} rotation={[0.5, 0, 0]}>
        {/* Cuerpo de la taza */}
        <mesh>
          <cylinderGeometry args={[1.5, 1.2, 2, 32]} />
          <meshPhysicalMaterial 
            color="#ffffff" 
            roughness={0} 
            transmission={0.1} 
            thickness={0.5}
          />
        </mesh>
        {/* Asa */}
        <mesh position={[1.5, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <torusGeometry args={[0.5, 0.15, 16, 32, Math.PI]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        {/* "Café" interno */}
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[1.35, 1.35, 0.1, 32]} />
          <meshStandardMaterial color="#2a1508" emissive="#1a0f0a" emissiveIntensity={0.5} />
        </mesh>
      </group>
    </Float>
  );
};

export const CoffeePortal3D = ({ isVisible }: { isVisible: boolean }) => {
  const beans = useMemo(() => Array.from({ length: 40 }).map((_, i) => i), []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] pointer-events-none bg-amber-950/20 backdrop-blur-sm"
        >
          <Canvas shadows dpr={[1, 2]} gl={{ antialias: true }}>
            <PerspectiveCamera makeDefault position={[0, 0, 10]} fov={50} />
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={2} color="#fbbf24" />
            <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
            
            <Environment preset="city" />

            <group>
              <StylizedCup />
              {beans.map((id) => (
                <Bean key={id} />
              ))}
            </group>

            <ContactShadows 
              position={[0, -4, 0]} 
              opacity={0.4} 
              scale={20} 
              blur={2.5} 
              far={4.5} 
            />
          </Canvas>

          {/* Flash de luz exagerado al final */}
          <motion.div 
            className="absolute inset-0 bg-white"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0, 1] }}
            transition={{ 
              times: [0, 0.8, 1], 
              duration: 1.2,
              ease: "easeIn" 
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
