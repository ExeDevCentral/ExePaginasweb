/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Componente: InteractiveFeatureShowcase
 * Diseño: Dashboard minimalista de alta precisión con sistema cromático adaptativo
 * de 4 tonos (Cyan, Emerald, Amber, Violet) para Tema Claro y Tema Oscuro.
 */
'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { ti } from '@/core/i18n/typedT'
import { motion, AnimatePresence, useInView, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { Badge } from '@astryxdesign/core'
import { Logo } from '@/components/layout/Logo'
import {
  Zap,
  ShieldCheck,
  Play,
  Pause,
  Layers,
  Lock,
  Check,
  TrendingUp,
  ArrowRight,
  PhoneCall,
  Award,
  Rocket,
  FileCode,
  Target,
  BarChart3,
  Database,
  Cpu,
  Globe,
  Terminal,
  ArrowUpRight,
} from 'lucide-react'
import { trackEvent } from '@/core/analytics/trackEvent'

interface StepTheme {
  hex: string
  // Sidebar item activo
  sidebarActiveCard: string
  sidebarActiveBadge: string
  progressBar: string
  // Sub-tab activo
  subTabActive: string
  // Widget telemétrico
  widgetCard: string
  codeHighlight: string
  pillBadge: string
  // Textos y acentos
  accentText: string
  checkIcon: string
  dotBg: string
  // CTA Botón
  ctaBtn: string
}

interface SubStage {
  id: string
  label: string
  icon: React.ElementType
  eyebrow: string
  title: string
  description: string
  tags: string[]
  visual: {
    type: 'ring' | 'chart' | 'code'
    primaryMetric: string
    primaryLabel: string
    ringPercent?: number
    secondaryMetrics: { label: string; value: string; accent?: boolean }[]
    chartPoints?: string
    codeSnippet?: { line: string; highlight?: boolean }[]
  }
}

interface MainStep {
  id: string
  number: string
  title: string
  subtitle: string
  theme: StepTheme
  stages: SubStage[]
}

function buildSteps(t: any): MainStep[] {
  return [
    {
      id: 'trato-directo',
      number: '01',
      title: ti(t, 'showcase.steps.trato-directo.title'),
      subtitle: ti(t, 'showcase.steps.trato-directo.subtitle'),
      theme: {
        hex: '#06b6d4',
        sidebarActiveCard:
          'bg-white dark:bg-[#091826] border-cyan-500/80 dark:border-cyan-400/40 shadow-[0_8px_20px_-6px_rgba(6,182,212,0.2)] dark:shadow-[0_0_25px_-5px_rgba(6,182,212,0.22)] ring-1 ring-cyan-500/15 dark:ring-0',
        sidebarActiveBadge:
          'bg-cyan-600 text-white dark:bg-cyan-500/20 dark:text-cyan-300 dark:border dark:border-cyan-400/40',
        progressBar: 'bg-cyan-600 dark:bg-cyan-400',
        subTabActive:
          'bg-white text-cyan-950 border border-cyan-500/60 dark:bg-cyan-500/15 dark:text-cyan-300 dark:border-cyan-400/30 font-bold shadow-xs',
        widgetCard:
          'bg-slate-50/95 dark:bg-[#091322] border-cyan-400/75 dark:border-cyan-500/30 shadow-[0_10px_26px_-8px_rgba(6,182,212,0.14),inset_0_1px_0_rgba(255,255,255,0.9)] dark:shadow-[0_0_35px_-12px_rgba(6,182,212,0.22)]',
        codeHighlight: 'text-cyan-400 font-semibold',
        pillBadge:
          'bg-cyan-500/12 text-cyan-900 dark:text-cyan-300 border border-cyan-500/35 dark:border-cyan-400/20',
        accentText: 'text-cyan-700 dark:text-cyan-400',
        checkIcon: 'text-cyan-600 dark:text-cyan-400',
        dotBg: 'bg-cyan-500',
        ctaBtn:
          'bg-cyan-600 hover:bg-cyan-500 text-white dark:bg-cyan-500 dark:hover:bg-cyan-400 dark:text-slate-950 shadow-sm shadow-cyan-500/20',
      },
      stages: [
        {
          id: 'diagnostico',
          label: ti(t, 'showcase.stages.diagnostico.label'),
          icon: PhoneCall,
          eyebrow: ti(t, 'showcase.stages.diagnostico.eyebrow'),
          title: ti(t, 'showcase.stages.diagnostico.title'),
          description: ti(t, 'showcase.stages.diagnostico.desc'),
          tags: [
            ti(t, 'showcase.stages.diagnostico.tag1'),
            ti(t, 'showcase.stages.diagnostico.tag2'),
            ti(t, 'showcase.stages.diagnostico.tag3'),
          ],
          visual: {
            type: 'ring',
            primaryMetric: '100%',
            primaryLabel: ti(t, 'showcase.stages.diagnostico.metric_label'),
            ringPercent: 100,
            secondaryMetrics: [
              {
                label: ti(t, 'showcase.stages.diagnostico.m1l'),
                value: ti(t, 'showcase.stages.diagnostico.m1v'),
                accent: true,
              },
              {
                label: ti(t, 'showcase.stages.diagnostico.m2l'),
                value: ti(t, 'showcase.stages.diagnostico.m2v'),
              },
              {
                label: ti(t, 'showcase.stages.diagnostico.m3l'),
                value: ti(t, 'showcase.stages.diagnostico.m3v'),
              },
            ],
          },
        },
        {
          id: 'presupuesto',
          label: ti(t, 'showcase.stages.presupuesto.label'),
          icon: Award,
          eyebrow: ti(t, 'showcase.stages.presupuesto.eyebrow'),
          title: ti(t, 'showcase.stages.presupuesto.title'),
          description: ti(t, 'showcase.stages.presupuesto.desc'),
          tags: [
            ti(t, 'showcase.stages.presupuesto.tag1'),
            ti(t, 'showcase.stages.presupuesto.tag2'),
            ti(t, 'showcase.stages.presupuesto.tag3'),
          ],
          visual: {
            type: 'chart',
            primaryMetric: '$0',
            primaryLabel: ti(t, 'showcase.stages.presupuesto.metric_label'),
            chartPoints: 'M 0 70 Q 45 65, 80 45 T 160 28 T 240 12',
            secondaryMetrics: [
              {
                label: ti(t, 'showcase.stages.presupuesto.m1l'),
                value: ti(t, 'showcase.stages.presupuesto.m1v'),
                accent: true,
              },
              {
                label: ti(t, 'showcase.stages.presupuesto.m2l'),
                value: ti(t, 'showcase.stages.presupuesto.m2v'),
              },
            ],
          },
        },
        {
          id: 'entrega',
          label: ti(t, 'showcase.stages.entrega.label'),
          icon: Rocket,
          eyebrow: ti(t, 'showcase.stages.entrega.eyebrow'),
          title: ti(t, 'showcase.stages.entrega.title'),
          description: ti(t, 'showcase.stages.entrega.desc'),
          tags: [
            ti(t, 'showcase.stages.entrega.tag1'),
            ti(t, 'showcase.stages.entrega.tag2'),
            ti(t, 'showcase.stages.entrega.tag3'),
          ],
          visual: {
            type: 'ring',
            primaryMetric: '100%',
            primaryLabel: ti(t, 'showcase.stages.entrega.metric_label'),
            ringPercent: 100,
            secondaryMetrics: [
              {
                label: ti(t, 'showcase.stages.entrega.m1l'),
                value: ti(t, 'showcase.stages.entrega.m1v'),
                accent: true,
              },
              {
                label: ti(t, 'showcase.stages.entrega.m2l'),
                value: ti(t, 'showcase.stages.entrega.m2v'),
              },
              {
                label: ti(t, 'showcase.stages.entrega.m3l'),
                value: ti(t, 'showcase.stages.entrega.m3v'),
              },
            ],
          },
        },
      ],
    },
    {
      id: 'arquitectura-viva',
      number: '02',
      title: ti(t, 'showcase.steps.arquitectura-viva.title'),
      subtitle: ti(t, 'showcase.steps.arquitectura-viva.subtitle'),
      theme: {
        hex: '#10b981',
        sidebarActiveCard:
          'bg-white dark:bg-[#071915] border-emerald-500/80 dark:border-emerald-400/40 shadow-[0_8px_20px_-6px_rgba(16,185,129,0.2)] dark:shadow-[0_0_25px_-5px_rgba(16,185,129,0.22)] ring-1 ring-emerald-500/15 dark:ring-0',
        sidebarActiveBadge:
          'bg-emerald-600 text-white dark:bg-emerald-500/20 dark:text-emerald-300 dark:border dark:border-emerald-400/40',
        progressBar: 'bg-emerald-600 dark:bg-emerald-400',
        subTabActive:
          'bg-white text-emerald-950 border border-emerald-500/60 dark:bg-emerald-500/15 dark:text-emerald-300 dark:border-emerald-400/30 font-bold shadow-xs',
        widgetCard:
          'bg-slate-50/95 dark:bg-[#071512] border-emerald-400/75 dark:border-emerald-500/30 shadow-[0_10px_26px_-8px_rgba(16,185,129,0.14),inset_0_1px_0_rgba(255,255,255,0.9)] dark:shadow-[0_0_35px_-12px_rgba(16,185,129,0.22)]',
        codeHighlight: 'text-emerald-400 font-semibold',
        pillBadge:
          'bg-emerald-500/12 text-emerald-900 dark:text-emerald-300 border border-emerald-500/35 dark:border-emerald-400/20',
        accentText: 'text-emerald-700 dark:text-emerald-400',
        checkIcon: 'text-emerald-600 dark:text-emerald-400',
        dotBg: 'bg-emerald-500',
        ctaBtn:
          'bg-emerald-600 hover:bg-emerald-500 text-white dark:bg-emerald-500 dark:hover:bg-emerald-400 dark:text-slate-950 shadow-sm shadow-emerald-500/20',
      },
      stages: [
        {
          id: 'nextjs',
          label: ti(t, 'showcase.stages.nextjs.label'),
          icon: Cpu,
          eyebrow: ti(t, 'showcase.stages.nextjs.eyebrow'),
          title: ti(t, 'showcase.stages.nextjs.title'),
          description: ti(t, 'showcase.stages.nextjs.desc'),
          tags: [
            ti(t, 'showcase.stages.nextjs.tag1'),
            ti(t, 'showcase.stages.nextjs.tag2'),
            ti(t, 'showcase.stages.nextjs.tag3'),
          ],
          visual: {
            type: 'code',
            primaryMetric: '48 KB',
            primaryLabel: ti(t, 'showcase.stages.nextjs.metric_label'),
            codeSnippet: [
              { line: 'export async function CheckoutFlow() {' },
              { line: '  const session = await edgeAuth.verify()', highlight: true },
              { line: '  return <InstantPaymentGateway />' },
              { line: '}' },
            ],
            secondaryMetrics: [
              {
                label: ti(t, 'showcase.stages.nextjs.m1l'),
                value: ti(t, 'showcase.stages.nextjs.m1v'),
                accent: true,
              },
              {
                label: ti(t, 'showcase.stages.nextjs.m2l'),
                value: ti(t, 'showcase.stages.nextjs.m2v'),
              },
            ],
          },
        },
        {
          id: 'cobros',
          label: ti(t, 'showcase.stages.cobros.label'),
          icon: Layers,
          eyebrow: ti(t, 'showcase.stages.cobros.eyebrow'),
          title: ti(t, 'showcase.stages.cobros.title'),
          description: ti(t, 'showcase.stages.cobros.desc'),
          tags: [
            ti(t, 'showcase.stages.cobros.tag1'),
            ti(t, 'showcase.stages.cobros.tag2'),
            ti(t, 'showcase.stages.cobros.tag3'),
          ],
          visual: {
            type: 'chart',
            primaryMetric: '0%',
            primaryLabel: ti(t, 'showcase.stages.cobros.metric_label'),
            chartPoints: 'M 0 75 Q 50 60, 95 40 T 175 20 T 240 8',
            secondaryMetrics: [
              {
                label: ti(t, 'showcase.stages.cobros.m1l'),
                value: ti(t, 'showcase.stages.cobros.m1v'),
                accent: true,
              },
              {
                label: ti(t, 'showcase.stages.cobros.m2l'),
                value: ti(t, 'showcase.stages.cobros.m2v'),
              },
            ],
          },
        },
        {
          id: 'cloud',
          label: ti(t, 'showcase.stages.cloud.label'),
          icon: Database,
          eyebrow: ti(t, 'showcase.stages.cloud.eyebrow'),
          title: ti(t, 'showcase.stages.cloud.title'),
          description: ti(t, 'showcase.stages.cloud.desc'),
          tags: [
            ti(t, 'showcase.stages.cloud.tag1'),
            ti(t, 'showcase.stages.cloud.tag2'),
            ti(t, 'showcase.stages.cloud.tag3'),
          ],
          visual: {
            type: 'ring',
            primaryMetric: '99.9%',
            primaryLabel: ti(t, 'showcase.stages.cloud.metric_label'),
            ringPercent: 99,
            secondaryMetrics: [
              {
                label: ti(t, 'showcase.stages.cloud.m1l'),
                value: ti(t, 'showcase.stages.cloud.m1v'),
                accent: true,
              },
              {
                label: ti(t, 'showcase.stages.cloud.m2l'),
                value: ti(t, 'showcase.stages.cloud.m2v'),
              },
              {
                label: ti(t, 'showcase.stages.cloud.m3l'),
                value: ti(t, 'showcase.stages.cloud.m3v'),
              },
            ],
          },
        },
      ],
    },
    {
      id: 'rendimiento',
      number: '03',
      title: ti(t, 'showcase.steps.rendimiento.title'),
      subtitle: ti(t, 'showcase.steps.rendimiento.subtitle'),
      theme: {
        hex: '#f59e0b',
        sidebarActiveCard:
          'bg-white dark:bg-[#1c1306] border-amber-500/80 dark:border-amber-400/40 shadow-[0_8px_20px_-6px_rgba(245,158,11,0.2)] dark:shadow-[0_0_25px_-5px_rgba(245,158,11,0.22)] ring-1 ring-amber-500/15 dark:ring-0',
        sidebarActiveBadge:
          'bg-amber-600 text-white dark:bg-amber-500/20 dark:text-amber-300 dark:border dark:border-amber-400/40',
        progressBar: 'bg-amber-600 dark:bg-amber-400',
        subTabActive:
          'bg-white text-amber-950 border border-amber-500/60 dark:bg-amber-500/15 dark:text-amber-300 dark:border-amber-400/30 font-bold shadow-xs',
        widgetCard:
          'bg-slate-50/95 dark:bg-[#171005] border-amber-400/80 dark:border-amber-500/30 shadow-[0_10px_26px_-8px_rgba(245,158,11,0.15),inset_0_1px_0_rgba(255,255,255,0.9)] dark:shadow-[0_0_35px_-12px_rgba(245,158,11,0.22)]',
        codeHighlight: 'text-amber-400 font-semibold',
        pillBadge:
          'bg-amber-500/12 text-amber-900 dark:text-amber-300 border border-amber-500/35 dark:border-amber-400/20',
        accentText: 'text-amber-700 dark:text-amber-400',
        checkIcon: 'text-amber-600 dark:text-amber-400',
        dotBg: 'bg-amber-500',
        ctaBtn:
          'bg-amber-600 hover:bg-amber-500 text-white dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-slate-950 shadow-sm shadow-amber-500/20',
      },
      stages: [
        {
          id: 'lighthouse',
          label: ti(t, 'showcase.stages.lighthouse.label'),
          icon: Zap,
          eyebrow: ti(t, 'showcase.stages.lighthouse.eyebrow'),
          title: ti(t, 'showcase.stages.lighthouse.title'),
          description: ti(t, 'showcase.stages.lighthouse.desc'),
          tags: [
            ti(t, 'showcase.stages.lighthouse.tag1'),
            ti(t, 'showcase.stages.lighthouse.tag2'),
            ti(t, 'showcase.stages.lighthouse.tag3'),
          ],
          visual: {
            type: 'ring',
            primaryMetric: '100',
            primaryLabel: ti(t, 'showcase.stages.lighthouse.metric_label'),
            ringPercent: 100,
            secondaryMetrics: [
              {
                label: ti(t, 'showcase.stages.lighthouse.m1l'),
                value: ti(t, 'showcase.stages.lighthouse.m1v'),
                accent: true,
              },
              {
                label: ti(t, 'showcase.stages.lighthouse.m2l'),
                value: ti(t, 'showcase.stages.lighthouse.m2v'),
              },
              {
                label: ti(t, 'showcase.stages.lighthouse.m3l'),
                value: ti(t, 'showcase.stages.lighthouse.m3v'),
              },
            ],
          },
        },
        {
          id: 'seo',
          label: ti(t, 'showcase.stages.seo.label'),
          icon: Globe,
          eyebrow: ti(t, 'showcase.stages.seo.eyebrow'),
          title: ti(t, 'showcase.stages.seo.title'),
          description: ti(t, 'showcase.stages.seo.desc'),
          tags: [
            ti(t, 'showcase.stages.seo.tag1'),
            ti(t, 'showcase.stages.seo.tag2'),
            ti(t, 'showcase.stages.seo.tag3'),
          ],
          visual: {
            type: 'chart',
            primaryMetric: '#1',
            primaryLabel: ti(t, 'showcase.stages.seo.metric_label'),
            chartPoints: 'M 0 80 Q 60 70, 100 45 T 180 22 T 240 6',
            secondaryMetrics: [
              {
                label: ti(t, 'showcase.stages.seo.m1l'),
                value: ti(t, 'showcase.stages.seo.m1v'),
                accent: true,
              },
              { label: ti(t, 'showcase.stages.seo.m2l'), value: ti(t, 'showcase.stages.seo.m2v') },
            ],
          },
        },
        {
          id: 'blindaje',
          label: ti(t, 'showcase.stages.blindaje.label'),
          icon: Lock,
          eyebrow: ti(t, 'showcase.stages.blindaje.eyebrow'),
          title: ti(t, 'showcase.stages.blindaje.title'),
          description: ti(t, 'showcase.stages.blindaje.desc'),
          tags: [
            ti(t, 'showcase.stages.blindaje.tag1'),
            ti(t, 'showcase.stages.blindaje.tag2'),
            ti(t, 'showcase.stages.blindaje.tag3'),
          ],
          visual: {
            type: 'code',
            primaryMetric: '24/7',
            primaryLabel: ti(t, 'showcase.stages.blindaje.metric_label'),
            codeSnippet: [
              { line: '[WAF] Edge Firewall: ACTIVE' },
              { line: '[TLS] Strict-Transport-Security: max-age=63072000', highlight: true },
              { line: '[CDN] Cache-Control: public, s-maxage=31536000' },
              { line: '[STATUS] 200 OK · Latency: 14ms' },
            ],
            secondaryMetrics: [
              {
                label: ti(t, 'showcase.stages.blindaje.m1l'),
                value: ti(t, 'showcase.stages.blindaje.m1v'),
                accent: true,
              },
              {
                label: ti(t, 'showcase.stages.blindaje.m2l'),
                value: ti(t, 'showcase.stages.blindaje.m2v'),
              },
            ],
          },
        },
        {
          id: 'linux-pos',
          label: ti(t, 'showcase.stages.linux-pos.label'),
          icon: Terminal,
          eyebrow: ti(t, 'showcase.stages.linux-pos.eyebrow'),
          title: ti(t, 'showcase.stages.linux-pos.title'),
          description: ti(t, 'showcase.stages.linux-pos.desc'),
          tags: [
            ti(t, 'showcase.stages.linux-pos.tag1'),
            ti(t, 'showcase.stages.linux-pos.tag2'),
            ti(t, 'showcase.stages.linux-pos.tag3'),
          ],
          visual: {
            type: 'code',
            primaryMetric: '480 MB',
            primaryLabel: ti(t, 'showcase.stages.linux-pos.metric_label'),
            codeSnippet: [
              { line: '$ systemd-analyze -> boot in 4.48s', highlight: true },
              { line: '[UDEV] ESC/POS Thermal Printer: READY' },
              { line: '[LAN] PostgreSQL Local Replica: 0.4ms' },
              { line: '[GUARD] S.M.A.R.T. Disk Health: 100% OK' },
            ],
            secondaryMetrics: [
              {
                label: ti(t, 'showcase.stages.linux-pos.m1l'),
                value: ti(t, 'showcase.stages.linux-pos.m1v'),
                accent: true,
              },
              {
                label: ti(t, 'showcase.stages.linux-pos.m2l'),
                value: ti(t, 'showcase.stages.linux-pos.m2v'),
              },
            ],
          },
        },
      ],
    },
    {
      id: 'conversion-escala',
      number: '04',
      title: ti(t, 'showcase.steps.conversion-escala.title'),
      subtitle: ti(t, 'showcase.steps.conversion-escala.subtitle'),
      theme: {
        hex: '#8b5cf6',
        sidebarActiveCard:
          'bg-white dark:bg-[#150e28] border-violet-500/80 dark:border-violet-400/40 shadow-[0_8px_20px_-6px_rgba(139,92,246,0.2)] dark:shadow-[0_0_25px_-5px_rgba(139,92,246,0.25)] ring-1 ring-violet-500/15 dark:ring-0',
        sidebarActiveBadge:
          'bg-violet-600 text-white dark:bg-violet-500/20 dark:text-violet-300 dark:border dark:border-violet-400/40',
        progressBar: 'bg-violet-600 dark:bg-violet-400',
        subTabActive:
          'bg-white text-violet-950 border border-violet-500/60 dark:bg-violet-500/15 dark:text-violet-300 dark:border-violet-400/30 font-bold shadow-xs',
        widgetCard:
          'bg-slate-50/95 dark:bg-[#120b22] border-violet-400/75 dark:border-violet-500/30 shadow-[0_10px_26px_-8px_rgba(139,92,246,0.14),inset_0_1px_0_rgba(255,255,255,0.9)] dark:shadow-[0_0_35px_-12px_rgba(139,92,246,0.25)]',
        codeHighlight: 'text-violet-400 font-semibold',
        pillBadge:
          'bg-violet-500/12 text-violet-900 dark:text-violet-300 border border-violet-500/35 dark:border-violet-400/20',
        accentText: 'text-violet-700 dark:text-violet-400',
        checkIcon: 'text-violet-600 dark:text-violet-400',
        dotBg: 'bg-violet-500',
        ctaBtn:
          'bg-violet-600 hover:bg-violet-500 text-white dark:bg-violet-500 dark:hover:bg-violet-400 dark:text-white shadow-sm shadow-violet-500/20',
      },
      stages: [
        {
          id: 'embudo',
          label: ti(t, 'showcase.stages.embudo.label'),
          icon: Target,
          eyebrow: ti(t, 'showcase.stages.embudo.eyebrow'),
          title: ti(t, 'showcase.stages.embudo.title'),
          description: ti(t, 'showcase.stages.embudo.desc'),
          tags: [
            ti(t, 'showcase.stages.embudo.tag1'),
            ti(t, 'showcase.stages.embudo.tag2'),
            ti(t, 'showcase.stages.embudo.tag3'),
          ],
          visual: {
            type: 'chart',
            primaryMetric: '+210%',
            primaryLabel: ti(t, 'showcase.stages.embudo.metric_label'),
            chartPoints: 'M 0 78 Q 55 68, 105 38 T 185 18 T 240 5',
            secondaryMetrics: [
              {
                label: ti(t, 'showcase.stages.embudo.m1l'),
                value: ti(t, 'showcase.stages.embudo.m1v'),
                accent: true,
              },
              {
                label: ti(t, 'showcase.stages.embudo.m2l'),
                value: ti(t, 'showcase.stages.embudo.m2v'),
              },
            ],
          },
        },
        {
          id: 'metricas',
          label: ti(t, 'showcase.stages.metricas.label'),
          icon: BarChart3,
          eyebrow: ti(t, 'showcase.stages.metricas.eyebrow'),
          title: ti(t, 'showcase.stages.metricas.title'),
          description: ti(t, 'showcase.stages.metricas.desc'),
          tags: [
            ti(t, 'showcase.stages.metricas.tag1'),
            ti(t, 'showcase.stages.metricas.tag2'),
            ti(t, 'showcase.stages.metricas.tag3'),
          ],
          visual: {
            type: 'ring',
            primaryMetric: '3.4x',
            primaryLabel: ti(t, 'showcase.stages.metricas.metric_label'),
            ringPercent: 88,
            secondaryMetrics: [
              {
                label: ti(t, 'showcase.stages.metricas.m1l'),
                value: ti(t, 'showcase.stages.metricas.m1v'),
                accent: true,
              },
              {
                label: ti(t, 'showcase.stages.metricas.m2l'),
                value: ti(t, 'showcase.stages.metricas.m2v'),
              },
              {
                label: ti(t, 'showcase.stages.metricas.m3l'),
                value: ti(t, 'showcase.stages.metricas.m3v'),
              },
            ],
          },
        },
        {
          id: 'autonomia',
          label: ti(t, 'showcase.stages.autonomia.label'),
          icon: FileCode,
          eyebrow: ti(t, 'showcase.stages.autonomia.eyebrow'),
          title: ti(t, 'showcase.stages.autonomia.title'),
          description: ti(t, 'showcase.stages.autonomia.desc'),
          tags: [
            ti(t, 'showcase.stages.autonomia.tag1'),
            ti(t, 'showcase.stages.autonomia.tag2'),
            ti(t, 'showcase.stages.autonomia.tag3'),
          ],
          visual: {
            type: 'code',
            primaryMetric: '2 seg',
            primaryLabel: ti(t, 'showcase.stages.autonomia.metric_label'),
            codeSnippet: [
              { line: ti(t, 'showcase.stages.autonomia.c1') },
              { line: ti(t, 'showcase.stages.autonomia.c2'), highlight: true },
              { line: ti(t, 'showcase.stages.autonomia.c3') },
              { line: ti(t, 'showcase.stages.autonomia.c4') },
            ],
            secondaryMetrics: [
              {
                label: ti(t, 'showcase.stages.autonomia.m1l'),
                value: ti(t, 'showcase.stages.autonomia.m1v'),
                accent: true,
              },
              {
                label: ti(t, 'showcase.stages.autonomia.m2l'),
                value: ti(t, 'showcase.stages.autonomia.m2v'),
              },
            ],
          },
        },
      ],
    },
  ]
}

export const InteractiveFeatureShowcase: React.FC<{ className?: string }> = ({
  className = '',
}) => {
  const { t, i18n } = useTranslation()
  const STEPS = React.useMemo(() => buildSteps(t), [t, i18n.language])
  const [activeStepIdx, setActiveStepIdx] = useState(0)
  const [subStageIdx, setSubStageIdx] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [elapsed, setElapsed] = useState(0)

  const sectionRef = useRef<HTMLElement>(null)
  const isInView = useInView(sectionRef, { amount: 0.15 })
  const reduceMotion = useReducedMotion()

  const STAGE_DURATION = 4500 // 4.5s por sub-etapa

  const advanceStage = useCallback(
    (direction: 1 | -1) => {
      setElapsed(0)
      const currentStagesCount = STEPS[activeStepIdx]?.stages.length ?? 3
      if (direction === 1) {
        if (subStageIdx + 1 >= currentStagesCount) {
          setActiveStepIdx((activeStepIdx + 1) % STEPS.length)
          setSubStageIdx(0)
        } else {
          setSubStageIdx(subStageIdx + 1)
        }
      } else if (subStageIdx - 1 < 0) {
        const prevMain = (activeStepIdx - 1 + STEPS.length) % STEPS.length
        const prevStagesCount = STEPS[prevMain]?.stages.length ?? 3
        setActiveStepIdx(prevMain)
        setSubStageIdx(prevStagesCount - 1)
      } else {
        setSubStageIdx(subStageIdx - 1)
      }
    },
    [activeStepIdx, subStageIdx]
  )

  // guardrail-ok(useEffect): timer externo para autosecuencia de etapas; requiere sincronizar intervalo con visibilidad/pausa
  useEffect(() => {
    if (isPaused || !isInView || reduceMotion) return

    const startTime = Date.now()
    const timer = setInterval(() => {
      const diff = Date.now() - startTime
      if (diff >= STAGE_DURATION) {
        setElapsed(0)
        const currentStagesCount = STEPS[activeStepIdx]?.stages.length ?? 3
        setSubStageIdx((prev) => {
          if (prev + 1 >= currentStagesCount) {
            const nextMain = (activeStepIdx + 1) % STEPS.length
            setActiveStepIdx(nextMain)
            return 0
          }
          return prev + 1
        })
      } else {
        setElapsed(diff)
      }
    }, 80)

    return () => clearInterval(timer)
  }, [activeStepIdx, subStageIdx, isPaused, isInView, reduceMotion])

  const handleKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      advanceStage(1)
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      advanceStage(-1)
    } else if (['1', '2', '3', '4'].includes(e.key)) {
      const idx = Number(e.key) - 1
      if (idx >= 0 && idx < STEPS.length) {
        setActiveStepIdx(idx)
        setSubStageIdx(0)
        setElapsed(0)
      }
    }
  }

  const currentStep = STEPS[activeStepIdx] ?? STEPS[0]!
  const currentStage = currentStep.stages[subStageIdx] ?? currentStep.stages[0]!
  const theme = currentStep.theme
  const totalStages = currentStep.stages.length
  const stepProgress = ((subStageIdx + Math.min(1, elapsed / STAGE_DURATION)) / totalStages) * 100

  return (
    <section
      id="arquitectura-en-vivo"
      ref={sectionRef}
      onKeyDown={handleKeyDown}
      aria-label="Recorrido interactivo de arquitectura y metodología"
      className={`scroll-mt-24 relative w-full max-w-[1400px] mx-auto px-5 sm:px-8 lg:px-12 py-20 sm:py-24 ${className}`}
    >
      {/* CABECERA EDITORIAL ASIMÉTRICA */}
      <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2.5 px-3 py-1 rounded-full border border-slate-200/80 dark:border-white/10 bg-white/75 dark:bg-white/[0.03] backdrop-blur-md font-mono text-[11px] uppercase tracking-widest mb-3 shadow-2xs transition-colors duration-300">
            <ShieldCheck
              className={`w-3.5 h-3.5 transition-colors duration-300 ${theme.checkIcon}`}
            />
            <span className="text-slate-700 dark:text-neutral-300 font-semibold">
              {ti(t, 'showcase.eyebrow')}
            </span>
            <Badge label={ti(t, 'showcase.badge')} variant="cyan" />
          </div>

          <h2 className="text-2xl sm:text-4xl font-semibold tracking-[-0.028em] text-slate-900 dark:text-white leading-tight">
            {ti(t, 'showcase.heading_prefix')}{' '}
            <span className="text-cyan-600 dark:text-cyan-400">
              {ti(t, 'showcase.heading_accent')}
            </span>
          </h2>
        </div>

        <p className="max-w-sm text-sm text-muted-foreground leading-relaxed md:text-right">
          {t('showcase.subtitle')}
        </p>
      </div>

      {/* ==============================================================
          SUPER CARD MINIMALISTA CON TONO ADAPTATIVO POR PASO (CLARO / OSCURO)
         ============================================================== */}
      <div className="relative rounded-2xl sm:rounded-3xl border border-slate-200/85 dark:border-white/[0.06] ring-1 ring-slate-900/[0.03] dark:ring-0 bg-white dark:bg-[#070b14] shadow-[0_24px_60px_-12px_rgba(15,23,42,0.12),0_6px_20px_-4px_rgba(15,23,42,0.04)] dark:shadow-[0_25px_70px_-15px_rgba(0,0,0,0.85)] overflow-hidden flex flex-col lg:flex-row min-h-[510px] transition-colors duration-500">
        {/* Línea superior de acento de 1px sincronizada al paso activo */}
        <div
          aria-hidden="true"
          className={`pointer-events-none absolute top-0 inset-x-0 h-px z-20 transition-colors duration-300 opacity-75 dark:opacity-50 ${theme.progressBar}`}
        />

        {/* ==============================================================
            SIDEBAR IZQUIERDO CON SUPERFICIE DIFERENCIADA (29%)
           ============================================================== */}
        <div className="w-full lg:w-[29%] p-5 sm:p-6 border-b lg:border-b-0 lg:border-r border-slate-200/80 dark:border-white/[0.06] bg-slate-100/85 dark:bg-[#050811] flex flex-col justify-between">
          <div>
            {/* Brand Header */}
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-300/80 dark:border-white/[0.06]">
              <div className="flex items-center gap-2.5">
                <Logo size={22} />
                <span className="font-mono font-bold text-xs text-slate-900 dark:text-white tracking-wide">
                  ExePaginasWeb
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                {STEPS.map((s, idx) => (
                  <span
                    key={s.id}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === activeStepIdx
                        ? `w-4 ${s.theme.dotBg}`
                        : 'w-1.5 bg-slate-300 dark:bg-white/15'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Lista de 4 Pasos con su propio tono cromático */}
            <div className="space-y-2.5">
              {STEPS.map((step, idx) => {
                const isActive = idx === activeStepIdx

                return (
                  <button
                    key={step.id}
                    type="button"
                    onClick={() => {
                      setActiveStepIdx(idx)
                      setSubStageIdx(0)
                      setElapsed(0)
                      trackEvent('main_step_selected', { step: step.id })
                    }}
                    className={`relative w-full text-left p-3.5 rounded-xl border transition-all duration-200 cursor-pointer overflow-hidden group ${
                      isActive
                        ? step.theme.sidebarActiveCard
                        : 'bg-white/75 hover:bg-white border-slate-200/95 hover:border-slate-300 shadow-[0_1px_2px_rgba(15,23,42,0.04)] dark:bg-transparent dark:hover:bg-white/[0.03] dark:border-transparent dark:shadow-none'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold shrink-0 transition-colors duration-200 ${
                          isActive
                            ? step.theme.sidebarActiveBadge
                            : 'bg-slate-200/90 text-slate-700 border border-slate-300/70 dark:bg-white/[0.04] dark:text-neutral-500 dark:border-transparent group-hover:text-slate-900 dark:group-hover:text-neutral-300'
                        }`}
                      >
                        {step.number}
                      </span>

                      <div className="min-w-0 flex-1">
                        <h3
                          className={`text-sm font-bold truncate transition-colors ${
                            isActive
                              ? 'text-slate-950 dark:text-white'
                              : 'text-slate-700 dark:text-neutral-400 group-hover:text-slate-950 dark:group-hover:text-neutral-200'
                          }`}
                        >
                          {ti(t, `showcase.steps.${step.id}.title`, step.title)}
                        </h3>
                        <p
                          className={`text-xs truncate mt-0.5 transition-colors ${
                            isActive
                              ? 'text-slate-600 dark:text-slate-300'
                              : 'text-slate-500 dark:text-neutral-600'
                          }`}
                        >
                          {ti(t, `showcase.steps.${step.id}.subtitle`, step.subtitle)}
                        </p>
                      </div>
                    </div>

                    {/* Barra de progreso fina de 1px del color propio del paso */}
                    {isActive && (
                      <div className="absolute left-0 right-0 bottom-0 h-px bg-slate-200/80 dark:bg-white/[0.04]">
                        <div
                          className={`h-full ${step.theme.progressBar}`}
                          style={{
                            width: `${Math.max(4, stepProgress)}%`,
                            transition: isPaused ? 'none' : 'width 50ms linear',
                          }}
                        />
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Nota discreta al pie del sidebar */}
          <div className="hidden lg:flex items-center justify-between pt-4 mt-4 border-t border-slate-300/80 dark:border-white/[0.06] text-[11px] font-mono text-slate-600 dark:text-neutral-500">
            <span>{ti(t, 'showcase.auto_seq')}</span>
            <span className={`font-bold transition-colors duration-300 ${theme.accentText}`}>
              {ti(t, 'showcase.step_counter')} 0{activeStepIdx + 1} / 04
            </span>
          </div>
        </div>

        {/* ==============================================================
            CANVAS PRINCIPAL DERECHO (71%): VISUAL & AMBIENTADO POR PASO
           ============================================================== */}
        <div
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
              setIsPaused(false)
            }
          }}
          role="region"
          aria-label={ti(t, 'showcase.detail_aria')}
          tabIndex={0}
          className="relative w-full lg:w-[71%] p-6 sm:p-8 lg:p-10 flex flex-col justify-between bg-white dark:bg-[#070b14] overflow-hidden"
        >
          {/* Resplandor ambiental sutil controlado en tema claro para no lavar los bordes */}
          <div
            aria-hidden="true"
            className="absolute -top-24 -right-24 w-96 h-96 rounded-full blur-[110px] opacity-[0.06] dark:opacity-20 pointer-events-none transition-all duration-700"
            style={{ backgroundColor: theme.hex }}
          />

          {/* BARRA SUPERIOR: SUB-TABS CON TRACK DEFINIDO + PAUSA */}
          <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-slate-200 dark:border-white/[0.06]">
            <div className="flex flex-wrap items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-[#0c1220] border border-slate-300/85 dark:border-white/[0.06]">
              {currentStep.stages.map((stg, i) => {
                const isCurrent = i === subStageIdx
                const Icon = stg.icon
                return (
                  <button
                    key={stg.id}
                    type="button"
                    onClick={() => {
                      setSubStageIdx(i)
                      setElapsed(0)
                    }}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-mono text-xs transition-all duration-150 cursor-pointer ${
                      isCurrent
                        ? theme.subTabActive
                        : 'text-slate-600 hover:text-slate-950 dark:text-neutral-400 dark:hover:text-white font-medium border border-transparent'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{ti(t, `showcase.stages.${stg.id}.label`, stg.label)}</span>
                  </button>
                )
              })}
            </div>

            <button
              type="button"
              onClick={() => setIsPaused(!isPaused)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300/80 dark:border-white/[0.07] bg-slate-50 hover:bg-slate-100 dark:bg-white/[0.02] dark:hover:bg-white/[0.06] text-slate-600 hover:text-slate-900 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors cursor-pointer font-mono text-xs"
            >
              {isPaused ? (
                <Play className="w-3.5 h-3.5 text-emerald-500" aria-hidden="true" />
              ) : (
                <Pause
                  className={`w-3.5 h-3.5 transition-colors duration-300 ${theme.checkIcon}`}
                  aria-hidden="true"
                />
              )}
              <span className="hidden sm:inline">
                {isPaused ? ti(t, 'showcase.resume') : ti(t, 'showcase.pause')}
              </span>
              <span className="sr-only sm:hidden">
                {isPaused ? ti(t, 'showcase.resume_aria') : ti(t, 'showcase.pause_aria')}
              </span>
            </button>
          </div>

          {/* ESCENARIO CENTRAL: WIDGET TELEMÉTRICO + COPY CONCISO */}
          <div className="relative z-10 my-auto py-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={`${currentStep.id}-${currentStage.id}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.16 }}
                className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8 items-center"
              >
                {/* COLUMNA VISUAL (5 COLS): TARJETA DASHBOARD CON COLOR DEL PASO */}
                <div
                  className={`md:col-span-5 rounded-2xl p-5 border space-y-4 transition-colors duration-300 ${theme.widgetCard}`}
                >
                  {/* Visual Tipo 1: Anillo de Progreso */}
                  {currentStage.visual.type === 'ring' && (
                    <div className="flex items-center gap-4 pb-3 border-b border-slate-200/80 dark:border-white/[0.05]">
                      <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
                        <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                          <circle
                            cx="32"
                            cy="32"
                            r="26"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.5"
                            className="text-slate-200/80 dark:text-white/[0.06]"
                          />
                          <circle
                            cx="32"
                            cy="32"
                            r="26"
                            fill="none"
                            stroke={theme.hex}
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeDasharray={163.36}
                            strokeDashoffset={
                              163.36 - (163.36 * (currentStage.visual.ringPercent ?? 100)) / 100
                            }
                          />
                        </svg>
                        <span className="absolute font-mono font-semibold text-sm text-slate-900 dark:text-white">
                          {currentStage.visual.primaryMetric}
                        </span>
                      </div>
                      <div>
                        <span
                          className={`text-[11px] font-mono uppercase tracking-wider font-semibold block ${theme.accentText}`}
                        >
                          {ti(t, 'showcase.verified_metric')}
                        </span>
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                          {currentStage.visual.primaryLabel}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Visual Tipo 2: Curva SVG Luminosa */}
                  {currentStage.visual.type === 'chart' && (
                    <div className="space-y-2 pb-3 border-b border-slate-200/80 dark:border-white/[0.05]">
                      <div className="flex items-baseline justify-between">
                        <span className="text-2xl font-mono font-semibold text-slate-900 dark:text-white">
                          {currentStage.visual.primaryMetric}
                        </span>
                        <span
                          className={`text-xs font-mono font-semibold flex items-center gap-1 ${theme.accentText}`}
                        >
                          <TrendingUp className="w-3.5 h-3.5" />
                          {currentStage.visual.primaryLabel}
                        </span>
                      </div>
                      <div className="h-16 w-full pt-1">
                        <svg
                          viewBox="0 0 240 85"
                          className="w-full h-full overflow-visible"
                          preserveAspectRatio="none"
                        >
                          <defs>
                            <linearGradient
                              id={`chartGrad-${currentStep.id}`}
                              x1="0"
                              y1="0"
                              x2="0"
                              y2="1"
                            >
                              <stop offset="0%" stopColor={theme.hex} stopOpacity="0.28" />
                              <stop offset="100%" stopColor={theme.hex} stopOpacity="0.0" />
                            </linearGradient>
                          </defs>
                          <path
                            d={`${currentStage.visual.chartPoints} L 240 85 L 0 85 Z`}
                            fill={`url(#chartGrad-${currentStep.id})`}
                          />
                          <path
                            d={currentStage.visual.chartPoints}
                            fill="none"
                            stroke={theme.hex}
                            strokeWidth="1.5"
                            vectorEffect="non-scaling-stroke"
                            strokeLinecap="round"
                          />
                        </svg>
                      </div>
                    </div>
                  )}

                  {/* Visual Tipo 3: Bloque de Código / Telemetría */}
                  {currentStage.visual.type === 'code' && (
                    <div className="space-y-2.5 pb-3 border-b border-slate-200 dark:border-white/[0.06]">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                          {currentStage.visual.primaryLabel}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md font-mono text-[11px] font-bold ${theme.pillBadge}`}
                        >
                          {currentStage.visual.primaryMetric}
                        </span>
                      </div>
                      <div className="p-3 rounded-xl bg-slate-900 dark:bg-[#050811] border border-slate-800 dark:border-white/[0.06] font-mono text-[11px] space-y-1">
                        {currentStage.visual.codeSnippet?.map((item, idx) => (
                          <div
                            key={idx}
                            className={`truncate ${
                              item.highlight ? theme.codeHighlight : 'text-slate-400'
                            }`}
                          >
                            {item.line}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* KPIs Secundarios */}
                  <div className="space-y-2 font-mono text-xs">
                    {currentStage.visual.secondaryMetrics.map((m, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-slate-600 dark:text-neutral-400">{m.label}</span>
                        <span
                          className={`font-bold ${
                            m.accent ? theme.accentText : 'text-slate-900 dark:text-neutral-200'
                          }`}
                        >
                          {m.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* COLUMNA EDITORIAL (7 COLS): LIMPIA, DIRECTA Y ESCANEABLE */}
                <div className="md:col-span-7 space-y-4">
                  <span
                    className={`inline-block font-mono text-[11px] font-bold uppercase tracking-widest ${theme.accentText}`}
                  >
                    {ti(t, `showcase.stages.${currentStage.id}.eyebrow`, currentStage.eyebrow)}
                  </span>

                  <h3 className="text-xl sm:text-2xl lg:text-[26px] font-semibold text-slate-900 dark:text-white tracking-[-0.025em] leading-snug">
                    {ti(t, `showcase.stages.${currentStage.id}.title`, currentStage.title)}
                  </h3>

                  <p className="text-sm sm:text-base text-slate-600 dark:text-neutral-300 leading-relaxed">
                    {ti(
                      t,
                      `showcase.stages.${currentStage.id}.description`,
                      currentStage.description
                    )}
                  </p>

                  <div className="flex flex-wrap gap-2 pt-1">
                    {currentStage.tags.map((tag) => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 dark:bg-white/[0.04] border border-slate-300/85 dark:border-white/[0.07] font-mono text-xs font-medium text-slate-800 dark:text-neutral-300 shadow-2xs"
                      >
                        <Check className={`w-3.5 h-3.5 shrink-0 ${theme.checkIcon}`} />
                        <span>{tag}</span>
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* FOOTER INTERNO DISCRETO CON ACCIÓN RÁPIDA SINCRONIZADA AL COLOR */}
          <div className="relative z-10 pt-4 border-t border-slate-200 dark:border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 font-mono text-xs text-slate-600 dark:text-neutral-500">
              <span
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${theme.dotBg}`}
              />
              <span>{ti(t, 'showcase.footer_badge')}</span>
            </div>

            <div className="flex items-center gap-2.5">
              <Link
                href={currentStage.id === 'linux-pos' ? '/linux' : '/soluciones'}
                className="px-3 py-1.5 rounded-lg border border-slate-300/85 dark:border-white/10 bg-slate-50 hover:bg-slate-100 dark:bg-white/[0.03] dark:hover:bg-white/[0.07] font-mono text-xs font-semibold text-slate-700 hover:text-slate-950 dark:text-neutral-300 dark:hover:text-white flex items-center gap-1.5 transition-colors"
              >
                <span>
                  {currentStage.id === 'linux-pos'
                    ? ti(t, 'showcase.portal_linux')
                    : ti(t, 'showcase.view_arch')}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <a
                href="https://wa.me/5493412799385?text=Hola%20Exequiel!%20Vi%20tu%20plataforma%20en%20ExePaginasWeb%20y%20quiero%20consultar%20por%20un%20proyecto."
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackEvent('hero_cta_contact_clicked', { source: 'super_card_footer' })
                }
                className={`px-3.5 py-1.5 rounded-lg font-mono text-xs font-bold flex items-center gap-1.5 transition-all duration-300 ${theme.ctaBtn}`}
              >
                <span>{ti(t, 'showcase.diagnose_cta')}</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default InteractiveFeatureShowcase
