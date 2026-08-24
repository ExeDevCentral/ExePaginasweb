import BrandLoader from '@/components/layout/BrandLoader'

export default function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background/95 backdrop-blur-md">
      <BrandLoader size="lg" />
    </div>
  )
}
