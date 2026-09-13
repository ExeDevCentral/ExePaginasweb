import { ImageResponse } from 'next/og'
import { OgCard } from '@/components/og/OgCard'
import { INITIAL_PROJECTS } from '@/data/projects'

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = INITIAL_PROJECTS.find((p) => p.id === id)

  return new ImageResponse(
    <OgCard
      eyebrow={project ? project.categoryLabel : 'ExePaginasWeb · Portfolio'}
      title={project ? project.title : 'Portfolio de proyectos a medida'}
      description={
        project
          ? project.description
          : 'Tiendas online, sistemas SaaS, landings de alta conversión y herramientas web con código propio.'
      }
      tags={project?.tags}
      status={project?.status}
      statusLabel={project?.statusLabel}
    />,
    { width: 1200, height: 630 }
  )
}
