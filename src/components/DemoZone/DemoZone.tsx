import { motion } from 'framer-motion'
import { useState, useCallback } from 'react'
import { Upload, Image as ImageIcon, Settings, Download, Play } from 'lucide-react'

const DemoZone = () => {
  const projects = [
    {
      title: 'Salon Bloom',
      category: 'Landing de servicios',
      summary: 'Pagina para reservas, promociones y testimonios con estilo visual premium.',
    },
    {
      title: 'NeoFit Studio',
      category: 'Web de membresias',
      summary: 'Sitio de gimnasio con planes, agenda de clases y CTA para conversion.',
    },
    {
      title: 'Casa Aura',
      category: 'Catalogo inmobiliario',
      summary: 'Subpaginas de propiedades con filtros y contacto directo por WhatsApp.',
    },
    {
      title: 'Pixel Coffee',
      category: 'Ecommerce ligero',
      summary: 'Tienda online con carrito rapido y fichas de producto visuales.',
    },
  ]

  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  type FilterKey = 'brightness' | 'contrast' | 'saturation' | 'blur'
  const [filters, setFilters] = useState<Record<FilterKey, number>>({
    brightness: 100,
    contrast: 100,
    saturation: 100,
    blur: 0
  })
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file?.type.startsWith('image/')) {
      setUploadedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }, [])

  const handleDrop = useCallback((event: React.DragEvent<HTMLElement>) => {
    event.preventDefault()
    const file = event.dataTransfer.files?.[0]
    if (file?.type.startsWith('image/')) {
      setUploadedFile(file)
      const url = URL.createObjectURL(file)
      setPreviewUrl(url)
    }
  }, [])

  const handleDragOver = useCallback((event: React.DragEvent<HTMLElement>) => {
    event.preventDefault()
  }, [])

  const generateCode = async () => {
    if (!uploadedFile) return

    setIsProcessing(true)
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsProcessing(false)

    // In a real implementation, this would send the image to an AI service
    // and generate code based on the design
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  }

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.8,
        ease: [0.4, 0, 0.2, 1]
      }
    }
  }

  return (
    <section id="demo" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary-bg/95 to-primary-bg">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 font-montserrat">
            <span className="bg-gradient-to-r from-accent-cyan to-accent-magenta bg-clip-text text-transparent">
              AI-Powered Demo
            </span>
          </h2>
          <p className="text-xl text-primary-secondary max-w-3xl mx-auto leading-relaxed">
            Mira ejemplos reales de subpaginas web y luego prueba una carga de diseno para simular una generacion rapida.
          </p>
        </motion.div>

        <motion.div
          className="mb-12 grid gap-5 md:grid-cols-2"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {projects.map((project) => (
            <article key={project.title} className="rounded-2xl border border-accent-cyan/20 bg-primary-bg/40 p-5 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-[0.2em] text-accent-cyan">{project.category}</p>
              <h3 className="mt-2 text-2xl font-bold">{project.title}</h3>
              <p className="mt-3 text-primary-secondary">{project.summary}</p>
              <button type="button" className="mt-4 rounded-full border border-accent-cyan/40 px-4 py-2 text-sm text-accent-cyan transition hover:bg-accent-cyan/10">
                Ver subpagina
              </button>
            </article>
          ))}
        </motion.div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {/* Upload Area */}
          <motion.div
            className="space-y-6"
            variants={itemVariants}
          >
            <label
              className="relative border-2 border-dashed border-accent-cyan/50 rounded-2xl p-8 text-center hover:border-accent-cyan transition-colors duration-300 cursor-pointer bg-gradient-to-br from-primary-bg/50 to-primary-bg/30 backdrop-blur-sm"
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              htmlFor="file-upload"
            >
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />

              <motion.div
                className="flex flex-col items-center space-y-4"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <div className="w-20 h-20 bg-gradient-to-r from-accent-cyan to-accent-magenta rounded-full flex items-center justify-center">
                  <Upload className="w-10 h-10 text-primary-bg" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-primary-text mb-2">Upload Your Design</h3>
                  <p className="text-primary-secondary">
                    Drag & drop an image or click to browse
                    <br />
                    <span className="text-sm">PNG, JPG, WebP up to 10MB</span>
                  </p>
                </div>
              </motion.div>

              {uploadedFile && (
                <motion.div
                  className="mt-4 p-3 bg-accent-cyan/10 rounded-lg border border-accent-cyan/20"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <p className="text-accent-cyan font-semibold">✓ {uploadedFile.name}</p>
                </motion.div>
              )}
            </label>

            {/* Filter Controls */}
            {previewUrl && (
              <motion.div
                className="bg-gradient-to-br from-primary-bg/50 to-primary-bg/30 backdrop-blur-sm border border-accent-cyan/20 rounded-2xl p-6"
                variants={itemVariants}
              >
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Settings className="w-5 h-5 text-accent-cyan" />
                  Adjust Filters
                </h3>

                <div className="space-y-4">
                  {(Object.entries(filters) as [FilterKey, number][]).map(([key, value]) => (
                    <div key={key} className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="capitalize text-primary-secondary">{key}</span>
                        <span className="text-accent-cyan font-semibold">{value}{key === 'blur' ? 'px' : '%'}</span>
                      </div>
                      <input
                        type="range"
                        min={0}
                        max={key === 'blur' ? 10 : 200}
                        value={value}
                        onChange={(e) => setFilters(prev => ({ ...prev, [key]: Number(e.target.value) }))}
                        className="w-full h-2 bg-primary-bg/50 rounded-lg appearance-none cursor-pointer slider"
                      />
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Generate Button */}
            <motion.button
              className="w-full px-8 py-4 bg-gradient-to-r from-accent-cyan to-accent-magenta rounded-full text-primary-bg font-semibold text-lg hover:shadow-lg hover:shadow-accent-cyan/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={generateCode}
              disabled={!uploadedFile || isProcessing}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              variants={itemVariants}
            >
              {isProcessing ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-primary-bg border-t-transparent rounded-full animate-spin"></div>
                  Processing...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <Play className="w-5 h-5" />
                  Generate Code
                </div>
              )}
            </motion.button>
          </motion.div>

          {/* Preview Panel */}
          <motion.div
            className="space-y-6"
            variants={itemVariants}
          >
            <div className="bg-gradient-to-br from-primary-bg/50 to-primary-bg/30 backdrop-blur-sm border border-accent-cyan/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-accent-cyan" />
                Live Preview
              </h3>

              <div className="aspect-video bg-primary-bg/50 rounded-xl overflow-hidden border border-accent-cyan/10">
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    style={{
                      filter: `brightness(${filters.brightness}%) contrast(${filters.contrast}%) saturate(${filters.saturation}%) blur(${filters.blur}px)`
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-primary-secondary">
                    <div className="text-center">
                      <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>Upload an image to see preview</p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Code Output Placeholder */}
            {uploadedFile && (
              <motion.div
                className="bg-gradient-to-br from-primary-bg/50 to-primary-bg/30 backdrop-blur-sm border border-accent-magenta/20 rounded-2xl p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                  <Download className="w-5 h-5 text-accent-magenta" />
                  Generated Code
                </h3>

                <div className="bg-primary-bg/50 rounded-lg p-4 font-mono text-sm text-primary-secondary overflow-x-auto">
                  <pre className="whitespace-pre-wrap">
{`// Generated React Component
const GeneratedComponent = () => {
  return (
    <div className="generated-element"
         style={{
           background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
           borderRadius: '12px',
           padding: '2rem'
         }}>
      <h2>Your Generated Component</h2>
      <p>AI-generated with animations and responsive design</p>
    </div>
  )
}`}
                  </pre>
                </div>

                <motion.button
                  className="mt-4 w-full px-4 py-2 bg-accent-magenta/20 border border-accent-magenta/40 rounded-lg text-accent-magenta hover:bg-accent-magenta/30 transition-colors duration-300"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Download Component
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

export default DemoZone
