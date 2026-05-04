import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const TermsOfService: React.FC = () => {
  return (
    <div className="min-h-screen bg-black text-gray-300 pt-32 pb-20 px-6 font-inter">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-4xl mx-auto"
      >
        <h1 className="font-montserrat text-4xl md:text-5xl font-black mb-8 text-white">
          Términos de <span className="text-[#00FFFF]">Servicio</span>
        </h1>
        
        <div className="space-y-8 leading-relaxed">
          <section>
            <h2 className="text-xl font-montserrat font-bold text-white mb-4 border-l-4 border-[#FF00FF] pl-4">
              1. Aceptación de los Términos
            </h2>
            <p>
              Al contratar o utilizar los servicios de **ExePaginasWeb**, usted acepta estos términos. Si no está de acuerdo, le rogamos se abstenga de utilizar nuestra plataforma.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-montserrat font-bold text-white mb-4 border-l-4 border-[#FF00FF] pl-4">
              2. Propiedad Intelectual
            </h2>
            <p>
              Todo el código, diseño y herramientas de automatización son propiedad exclusiva de ExePaginasWeb. Se prohíbe la reproducción total o parcial, ingeniería inversa o uso para fines distintos a los pactados sin autorización por escrito.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-montserrat font-bold text-white mb-4 border-l-4 border-[#FF00FF] pl-4">
              3. Limitación de Responsabilidad
            </h2>
            <p>
              No nos hacemos responsables por la veracidad de los datos introducidos por terceros en sus sistemas de reserva, ni por interrupciones del servicio debidas a causas de fuerza mayor o mantenimiento de proveedores externos.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-montserrat font-bold text-white mb-4 border-l-4 border-[#FF00FF] pl-4">
              4. Ley Aplicable
            </h2>
            <p>
              Cualquier controversia se resolverá bajo la legislación vigente en España, sometiéndose las partes a los tribunales de la ciudad correspondiente al domicilio social de la empresa.
            </p>
          </section>

          <section className="p-6 rounded-2xl bg-white/5 border border-white/10 mt-12">
            <p className="text-sm italic">
              Última actualización: Mayo 2024. Para cualquier duda sobre estos términos, por favor contáctenos a través de nuestro formulario oficial.
            </p>
          </section>

          <motion.div 
            className="flex justify-center pt-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <Link to="/" className="px-8 py-3 rounded-full border border-[#00FFFF]/50 text-white font-montserrat font-bold hover:bg-[#00FFFF]/10 hover:shadow-[0_0_25px_rgba(0,255,255,0.4)] transition-all duration-300">
              VOLVER AL INICIO
            </Link>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default TermsOfService;