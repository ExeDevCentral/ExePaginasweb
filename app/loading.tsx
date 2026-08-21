export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-3 border-accent-cyan border-t-transparent rounded-full animate-spin shadow-lg shadow-accent-cyan/20" />
        <p className="text-sm font-mono text-muted-foreground animate-pulse">
          Cargando ExeSistemasWEB...
        </p>
      </div>
    </div>
  )
}
