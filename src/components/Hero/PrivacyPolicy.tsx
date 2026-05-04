import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-gray-300 pt-32 pb-20 px-6 font-inter">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="font-montserrat text-4xl md:text-5xl font-black mb-8 text-white">
          Política de <span className="text-[#FF00FF]">Privacidad</span>
        </h1>
        
        <div className="space-y-8 leading-relaxed">
          <section>
            <h2 className="text-xl font-montserrat font-bold text-white mb-4 border-l-4 border-[#00FFFF] pl-4">
              Responsable del Tratamiento
            </h2>
            <p>
              **ExePaginasWeb** es el responsable de los datos personales recopilados a través de este sitio. Nos comprometemos a proteger la privacidad de nuestros clientes de acuerdo con el **GDPR**.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-montserrat font-bold text-white mb-4 border-l-4 border-[#00FFFF] pl-4">
              Datos que Recopilamos y Finalidad
            </h2>
            <p>
              Recopilamos exclusivamente el nombre, email y teléfono que usted facilita voluntariamente en el formulario de contacto para:
            </p>
            <ul className="list-disc ml-6 mt-2 space-y-2">
              <li>Gestionar su solicitud de presupuesto o información.</li>
              <li>Mantener la relación comercial y operativa.</li>
              <li>Mejorar la seguridad y experiencia del usuario mediante cookies técnicas.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-montserrat font-bold text-white mb-4 border-l-4 border-[#00FFFF] pl-4">
              Sus Derechos
            </h2>
            <p>
              Usted tiene derecho a **acceder, rectificar, suprimir o limitar** el tratamiento de sus datos en cualquier momento. Para ejercer estos derechos, envíe una comunicación a nuestro correo de contacto oficial adjuntando copia de su documento de identidad.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-montserrat font-bold text-white mb-4 border-l-4 border-[#00FFFF] pl-4">
              Seguridad
            </h2>
            <p>
              Implementamos cifrado SSL y protocolos de seguridad modernos para garantizar que su información personal esté protegida contra accesos no autorizados.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-white/10 border border-white/10 backdrop-blur-sm mt-12">
            <p className="text-sm">
              Al utilizar este sitio, usted acepta nuestra política de cookies y el tratamiento de sus datos según lo descrito aquí.
            </p>
          </section>

          <motion.div 
            className="flex justify-center pt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Link to="/" className="px-8 py-3 rounded-full border border-[#FF00FF]/50 text-white font-montserrat font-bold hover:bg-[#FF00FF]/10 hover:shadow-[0_0_25px_rgba(255,0,255,0.4)] transition-all duration-300">
              VOLVER AL INICIO
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default PrivacyPolicy;