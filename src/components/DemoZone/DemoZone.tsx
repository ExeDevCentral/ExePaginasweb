import { motion, AnimatePresence } from 'framer-motion'
import { useState, useCallback } from 'react'
import { Upload, Image as ImageIcon, Settings, Download, Play, X, ShoppingCart } from 'lucide-react'

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
  const [generatedHtml, setGeneratedHtml] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [selectedProject, setSelectedProject] = useState<{title: string, category: string, summary: string} | null>(null)
  const [glitchActive, setGlitchActive] = useState(false)
  const [cartItems, setCartItems] = useState<{id: number, name: string, price: number}[]>([])
  const [flyingItem, setFlyingItem] = useState<number | null>(null)
  const [cartBounce, setCartBounce] = useState(false)
  const [toast, setToast] = useState<string | null>(null)

  const coffeeProducts = [
    { id: 1, name: 'Espresso Oscuro', price: 8.90, emoji: '☕', origin: 'Etiopía' },
    { id: 2, name: 'Cold Brew Clásico', price: 11.50, emoji: '🧊', origin: 'Colombia' },
    { id: 3, name: 'Latte de Avena', price: 9.90, emoji: '🥛', origin: 'Brasil' },
    { id: 4, name: 'Blend Especial', price: 14.00, emoji: '✨', origin: 'Perú' },
  ]

  const addToCart = (product: {id: number, name: string, price: number, emoji: string, origin: string}) => {
    setFlyingItem(product.id)
    setTimeout(() => {
      setFlyingItem(null)
      setCartItems(prev => [...prev, { id: product.id, name: product.name, price: product.price }])
      setCartBounce(true)
      setTimeout(() => setCartBounce(false), 400)
      setToast(`${product.emoji} "${product.name}" añadido`)
      setTimeout(() => setToast(null), 2000)
    }, 600)
  }

  const [propFilter, setPropFilter] = useState<'todos' | 'casa' | 'depto'>('todos')
  const [whatsappProp, setWhatsappProp] = useState<number | null>(null)
  const properties = [
    { id: 1, type: 'casa', name: 'Villa Serena', location: 'Zona Norte · Buenos Aires', price: 'USD 285,000', beds: 4, baths: 3, m2: 220, gradient: 'from-stone-700 to-stone-900', tag: 'Destacada' },
    { id: 2, type: 'depto', name: 'Loft Aura Centro', location: 'Microcentro · CABA', price: 'USD 95,000', beds: 1, baths: 1, m2: 58, gradient: 'from-slate-700 to-slate-900', tag: 'Nuevo' },
    { id: 3, type: 'casa', name: 'Casa del Lago', location: 'Tigre · GBA', price: 'USD 420,000', beds: 5, baths: 4, m2: 380, gradient: 'from-emerald-900 to-stone-900', tag: 'Premium' },
    { id: 4, type: 'depto', name: 'Studio Palermo', location: 'Palermo · CABA', price: 'USD 72,000', beds: 1, baths: 1, m2: 42, gradient: 'from-zinc-700 to-zinc-900', tag: 'Oportunidad' },
    { id: 5, type: 'casa', name: 'Chalet Andino', location: 'Bariloche · Río Negro', price: 'USD 350,000', beds: 3, baths: 2, m2: 190, gradient: 'from-amber-900 to-stone-900', tag: 'Exclusiva' },
    { id: 6, type: 'depto', name: 'Depto Recoleta', location: 'Recoleta · CABA', price: 'USD 130,000', beds: 2, baths: 2, m2: 85, gradient: 'from-neutral-700 to-neutral-900', tag: 'Clásico' },
  ]

  const openProject = (project: {title: string, category: string, summary: string}) => {
    if (project.title === 'NeoFit Studio') {
      setGlitchActive(true)
      setTimeout(() => {
        setGlitchActive(false)
        setSelectedProject(project)
      }, 600)
    } else {
      setSelectedProject(project)
    }
  }

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
    setErrorMsg(null)

    try {
      const reader = new FileReader()
      const base64Promise = new Promise<string>((resolve, reject) => {
        reader.onload = () => {
          const result = reader.result as string
          const base64 = result.split(',')[1] // remove data:image/mime;base64,
          resolve(base64)
        }
        reader.onerror = reject
        reader.readAsDataURL(uploadedFile)
      })

      const base64Data = await base64Promise

      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: base64Data,
          mimeType: uploadedFile.type
        })
      })

      const data = await response.json()
      if (!response.ok) {
        throw new Error(data.error || 'Error al procesar la imagen')
      }

      setGeneratedHtml(data.code)
    } catch (err: any) {
      setErrorMsg(err.message || 'Error inesperado')
    } finally {
      setIsProcessing(false)
    }
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

  // Casa Aura derived state (computed here to avoid IIFE in JSX)
  const auraFeatured = properties.find(p => p.id === (whatsappProp ?? 1)) ?? properties[0]
  const auraFiltered = properties.filter(p => propFilter === 'todos' || p.type === propFilter)

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: { y: 0, opacity: 1 }
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
              <motion.button 
                type="button" 
                className="mt-4 rounded-full border border-accent-cyan/40 px-4 py-2 text-sm text-accent-cyan transition hover:bg-accent-cyan/10"
                onClick={() => openProject(project)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Ver subpagina
              </motion.button>
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
            transition={{ duration: 0.8, ease: "easeOut" }}
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
                transition={{ duration: 0.8, ease: "easeOut" }}
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
            <motion.div variants={itemVariants} transition={{ duration: 0.8, ease: "easeOut" }}>
              <motion.button
                className="w-full px-8 py-4 bg-gradient-to-r from-accent-cyan to-accent-magenta rounded-full text-primary-bg font-semibold text-lg hover:shadow-lg hover:shadow-accent-cyan/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                onClick={generateCode}
                disabled={!uploadedFile || isProcessing}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-5 h-5 border-2 border-primary-bg border-t-transparent rounded-full animate-spin"></div>
                    Processing AI...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <Play className="w-5 h-5" />
                    Generate Code
                  </div>
                )}
              </motion.button>
              
              {errorMsg && (
                <p className="mt-4 text-accent-magenta text-center text-sm font-semibold">
                  {errorMsg}
                </p>
              )}
            </motion.div>
          </motion.div>

          {/* Preview Panel */}
          <motion.div
            className="space-y-6"
            variants={itemVariants}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="bg-gradient-to-br from-primary-bg/50 to-primary-bg/30 backdrop-blur-sm border border-accent-cyan/20 rounded-2xl p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-accent-cyan" />
                Live Preview
              </h3>

              <div className="aspect-video bg-primary-bg/50 rounded-xl overflow-hidden border border-accent-cyan/10 relative">
                {generatedHtml ? (
                  <iframe
                    srcDoc={generatedHtml}
                    className="w-full h-full bg-white"
                    title="Live Preview"
                  />
                ) : previewUrl ? (
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
              generatedHtml ? (
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

                  <div className="bg-primary-bg/50 rounded-lg p-4 font-mono text-sm text-primary-secondary overflow-x-auto max-h-[300px]">
                    <pre className="whitespace-pre-wrap text-left">
{generatedHtml}
                    </pre>
                  </div>

                  <motion.button
                    onClick={() => {
                      const blob = new Blob([generatedHtml], { type: 'text/html' });
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url;
                      a.download = 'generated-design.html';
                      a.click();
                    }}
                    className="mt-4 w-full px-4 py-2 bg-accent-magenta/20 border border-accent-magenta/40 rounded-lg text-accent-magenta hover:bg-accent-magenta/30 transition-colors duration-300"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Download HTML
                  </motion.button>
                </motion.div>
              ) : !isProcessing && (
                <motion.div
                  className="bg-gradient-to-br from-primary-bg/50 to-primary-bg/30 backdrop-blur-sm border border-accent-cyan/20 rounded-2xl p-6 flex flex-col items-center justify-center text-center opacity-70"
                  variants={itemVariants}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  <p className="text-primary-secondary mb-2">Presiona Generate Code para usar la IA</p>
                </motion.div>
              )
            )}
          </motion.div>
        </motion.div>
      </div>

      {/* Glitch Flash Overlay for NeoFit */}
      <AnimatePresence>
        {glitchActive && (
          <motion.div
            className="fixed inset-0 z-[60] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0, 1, 0, 0.8, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.6, times: [0, 0.1, 0.2, 0.35, 0.5, 0.7, 1] }}
          >
            <div className="absolute inset-0 bg-yellow-400 mix-blend-overlay opacity-60" />
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                className="text-black font-montserrat font-black text-8xl tracking-widest"
                animate={{ x: [-4, 4, -2, 2, 0], skewX: [-5, 5, -2, 0] }}
                transition={{ duration: 0.4, repeat: 1 }}
              >
                NEOFIT
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Portal de Cristal (Modal Exagerado) */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-primary-bg/80 backdrop-blur-xl cursor-pointer"
              onClick={() => setSelectedProject(null)}
            />

            {/* ─── CASA AURA MODAL — Split-screen moderno ─── */}
            {selectedProject.title === 'Casa Aura' ? (
                <motion.div
                  className="relative z-10 flex flex-col w-full max-w-7xl h-[90vh] bg-[#09090b] border border-white/8 rounded-[2rem] shadow-[0_0_140px_-30px_rgba(139,92,246,0.25)] overflow-hidden"
                  initial={{ opacity: 0, scale: 0.92, y: 40 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Ambient glow */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-20 left-1/3 w-[500px] h-48 bg-violet-600/10 blur-[120px] rounded-full" />
                    <div className="absolute bottom-0 right-0 w-72 h-72 bg-indigo-900/15 blur-[100px] rounded-full" />
                  </div>

                  {/* Top bar */}
                  <div className="flex items-center justify-between px-7 py-5 border-b border-white/6 shrink-0">
                    <div className="flex items-center gap-4">
                      <h2 className="font-montserrat font-black text-2xl text-white tracking-tight">
                        Casa<span className="text-violet-400">Aura</span>
                      </h2>
                      <span className="text-zinc-600 text-xl">·</span>
                      <span className="text-xs text-zinc-500 uppercase tracking-widest">{auraFiltered.length} propiedades</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {(['todos','casa','depto'] as const).map(f => (
                        <motion.button key={f} onClick={() => setPropFilter(f)}
                          whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                          className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                            propFilter === f
                              ? 'bg-violet-600 border-violet-500 text-white shadow-[0_0_12px_rgba(139,92,246,0.4)]'
                              : 'border-white/10 text-zinc-500 hover:border-violet-600/50 hover:text-violet-400 bg-white/3'
                          }`}>
                          {f === 'todos' ? 'Todos' : f === 'casa' ? '🏡 Casas' : '🏙 Deptos'}
                        </motion.button>
                      ))}
                      <button onClick={() => { setSelectedProject(null); setWhatsappProp(null) }}
                        className="ml-3 p-2.5 rounded-full border border-white/10 text-zinc-500 hover:text-white hover:border-white/30 transition-all">
                        <X size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Body: split screen */}
                  <div className="flex flex-1 overflow-hidden">
                    {/* LEFT — Featured big property */}
                    <div className="w-[52%] shrink-0 relative overflow-hidden border-r border-white/6">
                      <AnimatePresence mode="wait">
                        <motion.div key={auraFeatured.id}
                          className={`absolute inset-0 bg-gradient-to-br ${auraFeatured.gradient}`}
                          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                          transition={{ duration: 0.35 }}
                        />
                      </AnimatePresence>
                      {/* Dark overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                      {/* Tag badge */}
                      <motion.span key={`tag-${auraFeatured.id}`}
                        className="absolute top-6 left-6 bg-violet-600/90 backdrop-blur-sm text-white text-xs font-bold px-3 py-1.5 rounded-full"
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}>
                        {auraFeatured.tag}
                      </motion.span>
                      {/* Info panel bottom */}
                      <AnimatePresence mode="wait">
                        <motion.div key={`info-${auraFeatured.id}`}
                          className="absolute bottom-0 left-0 right-0 p-7"
                          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.3, delay: 0.05 }}
                        >
                          <p className="text-zinc-400 text-xs uppercase tracking-widest mb-1">{auraFeatured.location}</p>
                          <h3 className="text-white font-black text-3xl font-montserrat mb-3">{auraFeatured.name}</h3>
                          <div className="flex gap-4 mb-4">
                            {[`🛏 ${auraFeatured.beds} hab.`, `🚿 ${auraFeatured.baths} baños`, `📐 ${auraFeatured.m2} m²`].map(s => (
                              <span key={s} className="bg-white/10 backdrop-blur-sm text-white/80 text-xs px-3 py-1.5 rounded-full border border-white/10">{s}</span>
                            ))}
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-violet-300 text-2xl font-black">{auraFeatured.price}</p>
                            <motion.button
                              onClick={() => { setWhatsappProp(auraFeatured.id); setTimeout(() => setWhatsappProp(null), 2000) }}
                              className="flex items-center gap-2 bg-green-500 hover:bg-green-400 text-black font-bold text-sm px-5 py-3 rounded-full transition-colors"
                              whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                              animate={whatsappProp === auraFeatured.id
                                ? { scale: [1, 1.12, 0.96, 1.05, 1], boxShadow: ['0 0 0px rgba(34,197,94,0)', '0 0 30px rgba(34,197,94,0.8)', '0 0 0px rgba(34,197,94,0)'] }
                                : {}}
                              transition={{ duration: 0.5 }}
                            >
                              <span className="text-base">📱</span> WhatsApp
                            </motion.button>
                          </div>
                        </motion.div>
                      </AnimatePresence>
                    </div>

                    {/* RIGHT — Thumbnail list */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                      <AnimatePresence mode="popLayout">
                        {auraFiltered.map((prop, i) => (
                          <motion.div key={prop.id} layout
                            className={`flex gap-3 p-3 rounded-2xl border cursor-pointer transition-all ${
                              (whatsappProp ?? 1) === prop.id || (!whatsappProp && prop.id === 1 && i === 0)
                                ? 'border-violet-500/60 bg-violet-600/8'
                                : 'border-white/6 hover:border-white/20 bg-white/2 hover:bg-white/4'
                            }`}
                            onClick={() => setWhatsappProp(prop.id)}
                            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            transition={{ delay: i * 0.04 }}
                            whileHover={{ x: -2 }}
                          >
                            {/* Mini thumb */}
                            <div className={`w-20 h-16 rounded-xl bg-gradient-to-br ${prop.gradient} shrink-0 flex items-center justify-center text-white/30 text-xs font-bold`}>
                              {prop.type === 'casa' ? '🏡' : '🏙'}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between gap-1">
                                <p className="text-white text-sm font-semibold truncate">{prop.name}</p>
                                <span className="text-zinc-600 text-[10px] shrink-0">{prop.tag}</span>
                              </div>
                              <p className="text-zinc-500 text-xs truncate mt-0.5">{prop.location}</p>
                              <div className="flex items-center justify-between mt-1.5">
                                <p className="text-violet-400 text-sm font-black">{prop.price}</p>
                                <p className="text-zinc-600 text-[10px]">{prop.m2}m² · {prop.beds}hab</p>
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* WhatsApp toast */}
                  <AnimatePresence>
                    {whatsappProp !== null && (
                      <motion.div
                        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 bg-green-500 text-black font-bold px-6 py-3 rounded-full text-sm shadow-[0_0_30px_rgba(34,197,94,0.5)] flex items-center gap-2"
                        initial={{ opacity: 0, y: 20, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10 }}
                      >
                        💬 Conectando con el agente...
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

            ) : selectedProject.title === 'Pixel Coffee' ? (
              <motion.div
                className="relative z-10 flex flex-col w-full max-w-6xl h-[88vh] bg-[#1a0f0a] border border-amber-700/50 rounded-[2rem] shadow-[0_0_120px_-20px_rgba(180,83,9,0.5)] overflow-hidden"
                initial={{ scale: 0.8, opacity: 0, y: 60 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.85, opacity: 0, y: 40 }}
                transition={{ type: 'spring', stiffness: 200, damping: 22 }}
              >
                {/* Background warm glow */}
                <div className="absolute inset-0 pointer-events-none">
                  <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-amber-900/30 blur-[120px] rounded-full" />
                  <div className="absolute top-0 right-1/4 w-64 h-64 bg-orange-900/20 blur-[80px] rounded-full" />
                </div>

                {/* Steam particles */}
                <div className="absolute bottom-0 left-1/2 pointer-events-none">
                  {[0,1,2,3].map(i => (
                    <motion.div key={i}
                      className="absolute w-2 h-8 bg-amber-100/10 rounded-full"
                      style={{ left: `${i * 20 - 30}px` }}
                      animate={{ y: [0, -120, -200], opacity: [0, 0.4, 0], scaleX: [1, 1.5, 2] }}
                      transition={{ duration: 3, repeat: Infinity, delay: i * 0.7, ease: 'easeOut' }}
                    />
                  ))}
                </div>

                {/* Header */}
                <div className="px-8 pt-8 pb-5 border-b border-amber-900/40 flex items-center justify-between relative">
                  <div>
                    <p className="text-xs uppercase tracking-[0.4em] text-amber-500 font-bold mb-1">Ecommerce Ligero</p>
                    <h2 className="text-4xl sm:text-6xl font-montserrat font-black text-amber-50">
                      Pixel <span className="text-amber-400">Coffee</span>
                    </h2>
                  </div>

                  {/* Cart icon with counter */}
                  <div className="flex items-center gap-4">
                    <motion.div
                      className="relative p-4 bg-amber-900/40 border border-amber-700/40 rounded-2xl cursor-default"
                      animate={cartBounce ? { scale: [1, 1.3, 0.9, 1.1, 1] } : {}}
                      transition={{ duration: 0.4 }}
                    >
                      <ShoppingCart size={24} className="text-amber-400" />
                      {cartItems.length > 0 && (
                        <motion.span
                          className="absolute -top-2 -right-2 bg-amber-400 text-black text-xs font-black w-6 h-6 rounded-full flex items-center justify-center"
                          key={cartItems.length}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ type: 'spring', stiffness: 400 }}
                        >
                          {cartItems.length}
                        </motion.span>
                      )}
                    </motion.div>
                    <button onClick={() => { setSelectedProject(null); setCartItems([]) }}
                      className="p-3 bg-amber-900/20 hover:bg-red-900/30 border border-amber-800/40 hover:border-red-700/50 rounded-full text-amber-400 hover:text-red-400 transition-all">
                      <X size={22} />
                    </button>
                  </div>
                </div>

                {/* Toast notification */}
                <AnimatePresence>
                  {toast && (
                    <motion.div
                      className="absolute top-24 left-1/2 -translate-x-1/2 z-30 bg-amber-400 text-black font-bold px-6 py-3 rounded-full text-sm shadow-lg"
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                    >
                      {toast}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Products grid */}
                <div className="flex-1 overflow-auto p-8">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                    {coffeeProducts.map(product => (
                      <motion.div
                        key={product.id}
                        className="relative bg-[#221208] border border-amber-900/40 rounded-2xl p-5 flex flex-col gap-3 hover:border-amber-600/60 transition-colors"
                        whileHover={{ y: -4 }}
                        transition={{ type: 'spring', stiffness: 300 }}
                      >
                        {/* Emoji big */}
                        <div className="text-5xl mb-1 text-center">{product.emoji}</div>
                        <div>
                          <p className="font-bold text-amber-50 text-sm">{product.name}</p>
                          <p className="text-xs text-amber-700 mt-0.5">Origen: {product.origin}</p>
                        </div>
                        <p className="text-2xl font-black text-amber-400">${product.price.toFixed(2)}</p>

                        {/* Flying animation from button */}
                        <AnimatePresence>
                          {flyingItem === product.id && (
                            <motion.div
                              className="absolute top-1/2 left-1/2 text-2xl z-20 pointer-events-none"
                              initial={{ x: 0, y: 0, scale: 1, opacity: 1 }}
                              animate={{ x: 200, y: -300, scale: 0.3, opacity: 0 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.6, ease: 'easeIn' }}
                            >
                              {product.emoji}
                            </motion.div>
                          )}
                        </AnimatePresence>

                        <motion.button
                          onClick={() => addToCart(product)}
                          className="mt-auto w-full py-2.5 rounded-xl bg-amber-500/20 border border-amber-600/40 text-amber-400 text-sm font-semibold hover:bg-amber-500/40 hover:text-amber-200 transition-colors"
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.96 }}
                          disabled={flyingItem === product.id}
                        >
                          + Agregar
                        </motion.button>
                      </motion.div>
                    ))}
                  </div>

                  {/* Mini checkout */}
                  {cartItems.length > 0 && (
                    <motion.div
                      className="mt-6 bg-[#2a1508]/80 border border-amber-700/30 rounded-2xl p-6 flex items-center justify-between"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div>
                        <p className="text-amber-500 text-sm">{cartItems.length} producto(s) en tu pedido</p>
                        <p className="text-amber-50 text-2xl font-black mt-1">
                          Total: ${cartItems.reduce((s, i) => s + i.price, 0).toFixed(2)}
                        </p>
                      </div>
                      <motion.button
                        className="px-8 py-4 bg-amber-400 text-black font-black text-lg rounded-full hover:bg-amber-300 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        animate={{ boxShadow: ['0 0 20px rgba(251,191,36,0.3)', '0 0 40px rgba(251,191,36,0.6)', '0 0 20px rgba(251,191,36,0.3)'] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      >
                        ☕ Comprar Ahora
                      </motion.button>
                    </motion.div>
                  )}
                </div>
              </motion.div>

            ) : selectedProject.title === 'NeoFit Studio' ? (
              <motion.div
                className="relative z-10 flex flex-col w-full max-w-6xl h-[85vh] bg-[#080808] border-2 border-yellow-400/60 rounded-[2rem] shadow-[0_0_120px_-10px_rgba(234,179,8,0.4)] overflow-hidden"
                initial={{ scale: 0.7, opacity: 0, y: 80 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.6, opacity: 0, y: 60 }}
                transition={{ type: 'spring', stiffness: 260, damping: 18 }}
              >
                {/* Yellow scanlines decoration */}
                <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(234,179,8,0.03) 3px, rgba(234,179,8,0.03) 4px)' }} />

                {/* Close */}
                <button onClick={() => setSelectedProject(null)}
                  className="absolute top-5 right-5 z-20 p-3 bg-yellow-400/10 hover:bg-yellow-400/25 border border-yellow-400/40 rounded-full text-yellow-400 transition-all duration-200">
                  <X size={26} />
                </button>

                {/* Header */}
                <div className="px-10 pt-10 pb-6 border-b border-yellow-400/20 relative">
                  <div className="absolute top-0 left-0 w-72 h-32 bg-yellow-400/10 blur-[80px] rounded-full pointer-events-none" />
                  <p className="text-xs uppercase tracking-[0.4em] text-yellow-400 font-bold mb-2">Web de Membresías</p>
                  <h2 className="text-5xl sm:text-7xl font-montserrat font-black text-white">
                    Neo<span className="text-yellow-400">Fit</span> Studio
                  </h2>
                  <p className="mt-3 text-lg text-gray-400 max-w-xl">Sitio de gimnasio con planes, agenda de clases y CTA para conversion.</p>
                </div>

                {/* Membership Cards */}
                <div className="flex-1 overflow-auto p-8 flex items-center justify-center">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-4xl">
                    {/* BÁSICO */}
                    <motion.div
                      className="relative rounded-2xl border border-gray-700 bg-gray-900/80 p-7 flex flex-col gap-4"
                      whileHover={{ y: -8, borderColor: 'rgba(234,179,8,0.4)' }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <p className="text-xs uppercase tracking-widest text-gray-500">Básico</p>
                      <div className="text-5xl font-black text-white">$29<span className="text-lg text-gray-500">/mes</span></div>
                      <ul className="space-y-2 text-sm text-gray-400 flex-1">
                        {['Acceso en horario normal', 'Zona cardio', 'Vestuario'].map(f => (
                          <li key={f} className="flex items-center gap-2"><span className="text-yellow-400">✓</span>{f}</li>
                        ))}
                      </ul>
                      <button className="mt-2 w-full py-3 rounded-full border border-gray-600 text-gray-400 text-sm hover:border-yellow-400 hover:text-yellow-400 transition-colors">Elegir</button>
                    </motion.div>

                    {/* ELITE – destacado */}
                    <motion.div
                      className="relative rounded-2xl border-2 border-yellow-400 bg-yellow-400/5 p-7 flex flex-col gap-4 shadow-[0_0_40px_-10px_rgba(234,179,8,0.5)]"
                      animate={{ boxShadow: ['0 0 30px -10px rgba(234,179,8,0.4)', '0 0 60px -5px rgba(234,179,8,0.6)', '0 0 30px -10px rgba(234,179,8,0.4)'] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      whileHover={{ y: -10 }}
                    >
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-yellow-400 text-black text-xs font-black px-4 py-1.5 rounded-full tracking-wider">⚡ MÁS POPULAR</div>
                      <p className="text-xs uppercase tracking-widest text-yellow-400">Elite</p>
                      <div className="text-5xl font-black text-white">$59<span className="text-lg text-gray-400">/mes</span></div>
                      <ul className="space-y-2 text-sm text-gray-300 flex-1">
                        {['Acceso 24/7', 'Zona pesas + cardio', 'Clases grupales', 'App de seguimiento'].map(f => (
                          <li key={f} className="flex items-center gap-2"><span className="text-yellow-400">✓</span>{f}</li>
                        ))}
                      </ul>
                      <button className="mt-2 w-full py-3 rounded-full bg-yellow-400 text-black font-bold text-sm hover:bg-yellow-300 transition-colors">Empezar Ahora</button>
                    </motion.div>

                    {/* BESTIA */}
                    <motion.div
                      className="relative rounded-2xl border border-gray-700 bg-gray-900/80 p-7 flex flex-col gap-4"
                      whileHover={{ y: -8, borderColor: 'rgba(234,179,8,0.4)' }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <p className="text-xs uppercase tracking-widest text-gray-500">Bestia</p>
                      <div className="text-5xl font-black text-white">$99<span className="text-lg text-gray-500">/mes</span></div>
                      <ul className="space-y-2 text-sm text-gray-400 flex-1">
                        {['Todo Elite', 'Coach personal', 'Nutrición incluida', 'Zona VIP exclusiva'].map(f => (
                          <li key={f} className="flex items-center gap-2"><span className="text-yellow-400">✓</span>{f}</li>
                        ))}
                      </ul>
                      <button className="mt-2 w-full py-3 rounded-full border border-gray-600 text-gray-400 text-sm hover:border-yellow-400 hover:text-yellow-400 transition-colors">Elegir</button>
                    </motion.div>
                  </div>
                </div>
              </motion.div>

            ) : (
              /* ─── PORTAL GENÉRICO (resto de proyectos) ─── */
              <motion.div
                className="relative z-10 flex flex-col w-full max-w-6xl h-[85vh] bg-gradient-to-br from-primary-bg/90 to-primary-bg/60 border border-accent-cyan/30 rounded-[2.5rem] shadow-[0_0_100px_-20px_rgba(0,255,255,0.3)] overflow-hidden"
                initial={{ scale: 0.5, y: 150, opacity: 0, rotateX: 25 }}
                animate={{ scale: 1, y: 0, opacity: 1, rotateX: 0 }}
                exit={{ scale: 0.8, y: 100, opacity: 0, rotateX: -15 }}
                transition={{ type: 'spring', stiffness: 180, damping: 20 }}
              >
                <button onClick={() => setSelectedProject(null)}
                  className="absolute top-6 right-6 z-20 p-4 bg-primary-bg/50 hover:bg-accent-magenta/20 border border-accent-cyan/20 hover:border-accent-magenta rounded-full text-primary-text transition-all duration-300 backdrop-blur-md">
                  <X size={28} />
                </button>
                <div className="p-10 border-b border-accent-cyan/20 bg-gradient-to-r from-accent-cyan/10 to-transparent relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-64 h-64 bg-accent-magenta/20 blur-[100px] rounded-full pointer-events-none" />
                  <p className="text-sm uppercase tracking-[0.3em] text-accent-cyan font-bold mb-3">{selectedProject.category}</p>
                  <h2 className="text-5xl sm:text-7xl font-montserrat font-black bg-gradient-to-r from-white via-primary-text to-primary-secondary bg-clip-text text-transparent">{selectedProject.title}</h2>
                  <p className="mt-4 text-xl text-primary-secondary max-w-3xl">{selectedProject.summary}</p>
                </div>
                <div className="flex-1 overflow-hidden relative bg-primary-bg/40 p-10 flex items-center justify-center">
                  <div className="w-full max-w-4xl h-full bg-[#0a0a0a] rounded-2xl border-4 border-primary-secondary/20 shadow-2xl overflow-hidden relative flex flex-col">
                    <div className="h-10 bg-primary-bg border-b border-primary-secondary/20 flex items-center px-6 gap-3 shrink-0">
                      <div className="w-3.5 h-3.5 rounded-full bg-accent-magenta/80" />
                      <div className="w-3.5 h-3.5 rounded-full bg-yellow-400/80" />
                      <div className="w-3.5 h-3.5 rounded-full bg-accent-cyan/80" />
                      <div className="mx-auto w-1/3 h-5 bg-primary-secondary/10 rounded-full" />
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <motion.div
                        className="w-full h-[350%] bg-gradient-to-b from-primary-bg via-accent-cyan/5 to-accent-magenta/5"
                        animate={{ y: ['0%', '-65%'] }}
                        transition={{ duration: 25, ease: 'linear', repeat: Infinity, repeatType: 'reverse' }}
                      >
                        <div className="p-12 space-y-16 opacity-60">
                          <div className="w-full h-80 bg-gradient-to-r from-accent-cyan/10 to-accent-magenta/10 rounded-3xl border border-primary-secondary/10 flex items-center justify-center">
                            <div className="text-center space-y-6">
                              <div className="w-64 h-12 bg-primary-secondary/20 rounded-full mx-auto" />
                              <div className="w-96 h-6 bg-primary-secondary/10 rounded-full mx-auto" />
                            </div>
                          </div>
                          <div className="grid grid-cols-3 gap-8">
                            <div className="h-64 bg-primary-secondary/10 rounded-2xl" />
                            <div className="h-64 bg-primary-secondary/10 rounded-2xl" />
                            <div className="h-64 bg-primary-secondary/10 rounded-2xl" />
                          </div>
                          <div className="w-full h-48 bg-primary-secondary/10 rounded-3xl" />
                          <div className="grid grid-cols-2 gap-8">
                            <div className="h-96 bg-primary-secondary/10 rounded-2xl" />
                            <div className="space-y-6">
                              {[1,2,3,4].map(i => <div key={i} className="h-16 bg-primary-secondary/10 rounded-xl" />)}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default DemoZone
