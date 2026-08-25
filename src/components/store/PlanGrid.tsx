import { motion } from 'framer-motion'
import PlanCard, { type PlanData } from './PlanCard'

interface PlanGridProps {
  plans: PlanData[]
  currency: 'ARS' | 'USD'
  isAnnual: boolean
  onSelectPlan: (plan: PlanData) => void
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
}

export default function PlanGrid({ plans, currency, isAnnual, onSelectPlan }: PlanGridProps) {
  return (
    <motion.div
      className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-60px' }}
    >
      {plans.map((plan, index) => (
        <PlanCard
          key={plan.id}
          plan={plan}
          index={index}
          currency={currency}
          isAnnual={isAnnual}
          onSelect={onSelectPlan}
        />
      ))}
    </motion.div>
  )
}
