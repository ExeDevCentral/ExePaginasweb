/**
 * © 2026 Exequiel Echevarria — ExePaginasWeb
 * Todos los derechos reservados.
 * Prohibida su reproducción total o parcial sin autorización.
 */
'use client'

import React, { useState } from 'react'
import {
  User,
  Mail,
  Lock,
  Building,
  Shield,
  LogOut,
  Save,
  CheckCircle2,
  KeyRound,
  Laptop,
} from 'lucide-react'
import { toast } from 'sonner'
import { useTranslation } from 'react-i18next'
import type { Cliente } from '../../core/domain/entities/Cliente'
import type { IAuthRepository } from '../../core/domain/repositories/IAuthRepository'
import { SupabaseAuthRepository } from '../../core/infra/repositories/SupabaseAuthRepository'
import { firstPasswordRuleFailed } from '../../core/domain/auth/passwordPolicy'

interface SettingsPanelProps {
  cliente: Cliente | null
  userEmail?: string | null | undefined
  role?: string | null | undefined
  currentTenant?: { id: string; nombre: string; slug?: string } | null | undefined
  onLogout: () => void
  onRefreshProfile?: () => void
  authRepo?: IAuthRepository
}

export default function SettingsPanel({
  cliente,
  userEmail,
  role = 'cliente',
  currentTenant,
  onLogout,
  onRefreshProfile,
  authRepo,
}: Readonly<SettingsPanelProps>) {
  const { t } = useTranslation()
  const repo = authRepo ?? new SupabaseAuthRepository()
  const [fullName, setFullName] = useState(cliente?.full_name || '')
  const [savingProfile, setSavingProfile] = useState(false)

  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [savingPassword, setSavingPassword] = useState(false)

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!cliente?.id) return

    setSavingProfile(true)
    try {
      await repo.updateProfile({ clienteId: cliente.id, fullName })

      toast.success(t('dashboard.perfil_actualizado', 'Perfil actualizado'), {
        description: 'Tus datos de cuenta fueron guardados correctamente.',
      })
      onRefreshProfile?.()
    } catch (err: unknown) {
      console.error('Error updating profile:', err)
      toast.error('No se pudo actualizar el perfil', {
        description: err instanceof Error ? err.message : 'Error desconocido',
      })
    } finally {
      setSavingProfile(false)
    }
  }

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    const failed = firstPasswordRuleFailed(newPassword)
    if (failed) {
      toast.error('Contraseña débil', {
        description: `La contraseña debe cumplir: ${failed.label}.`,
      })
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error('Las contraseñas no coinciden', {
        description: 'Asegurate de que ambas contraseñas escritas sean idénticas.',
      })
      return
    }

    setSavingPassword(true)
    try {
      await repo.updatePassword(newPassword)

      toast.success('Contraseña actualizada', {
        description: 'Tu clave de acceso se ha modificado exitosamente.',
      })
      setNewPassword('')
      setConfirmPassword('')
    } catch (err: unknown) {
      console.error('Error updating password:', err)
      toast.error('No se pudo cambiar la contraseña', {
        description: err instanceof Error ? err.message : 'Error al modificar contraseña.',
      })
    } finally {
      setSavingPassword(false)
    }
  }

  return (
    <div className="space-y-8 font-sans max-w-5xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2.5">
            <User className="w-6 h-6 text-[#38BDF8]" />
            <span>Configuración de Cuenta & Seguridad</span>
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1 font-medium">
            Administrá tus credenciales de acceso, datos personales y espacio de trabajo.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-muted/40 border border-border text-xs font-semibold text-muted-foreground">
          <Shield className="w-3.5 h-3.5 text-[#38BDF8]" />
          <span className="capitalize">Rol: {role}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 1. Datos del Perfil */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-border">
            <div className="w-10 h-10 rounded-xl bg-muted/40 border border-border flex items-center justify-center text-[#38BDF8]">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Datos Personales</h3>
              <p className="text-[11px] text-muted-foreground">
                Información del titular de la cuenta
              </p>
            </div>
          </div>

          <form onSubmit={handleUpdateProfile} className="space-y-4">
            <div>
              <label
                htmlFor="settings-fullname"
                className="block text-xs font-semibold text-muted-foreground mb-1.5"
              >
                Nombre Completo
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="settings-fullname"
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="Tu nombre y apellido"
                  className="w-full pl-9 pr-3 py-2.5 bg-muted/40 border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:border-[#4361EE] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="settings-email"
                className="block text-xs font-semibold text-muted-foreground mb-1.5"
              >
                Correo Electrónico (Principal)
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="settings-email"
                  type="email"
                  disabled
                  value={userEmail || cliente?.email || ''}
                  className="w-full pl-9 pr-3 py-2.5 bg-card border border-border rounded-xl text-xs text-muted-foreground cursor-not-allowed opacity-80"
                />
              </div>
              <p className="text-[10px] text-muted-foreground mt-1">
                El correo está vinculado a tu autenticación de seguridad en Supabase.
              </p>
            </div>

            <button
              type="submit"
              disabled={savingProfile}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#4361EE] hover:bg-[#3854E0] text-white text-xs font-semibold transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{savingProfile ? 'Guardando...' : 'Guardar Cambios'}</span>
            </button>
          </form>
        </div>

        {/* 2. Modificar Contraseña */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-5">
          <div className="flex items-center gap-3 pb-3 border-b border-border">
            <div className="w-10 h-10 rounded-xl bg-muted/40 border border-border flex items-center justify-center text-[#818CF8]">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Seguridad de Acceso</h3>
              <p className="text-[11px] text-muted-foreground">
                Actualizá tu clave de ingreso al panel
              </p>
            </div>
          </div>

          <form onSubmit={handleUpdatePassword} className="space-y-4">
            <div>
              <label
                htmlFor="settings-new-password"
                className="block text-xs font-semibold text-muted-foreground mb-1.5"
              >
                Nueva Contraseña
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="settings-new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mínimo 6 caracteres"
                  className="w-full pl-9 pr-3 py-2.5 bg-muted/40 border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:border-[#4361EE] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="settings-confirm-password"
                className="block text-xs font-semibold text-muted-foreground mb-1.5"
              >
                Confirmar Nueva Contraseña
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  id="settings-confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repetí la nueva contraseña"
                  className="w-full pl-9 pr-3 py-2.5 bg-muted/40 border border-border rounded-xl text-xs text-foreground placeholder:text-muted-foreground focus:border-[#4361EE] focus:outline-none transition-colors"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={savingPassword || !newPassword}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted hover:bg-muted/80 text-foreground border border-border text-xs font-semibold transition-all shadow-sm cursor-pointer disabled:opacity-50"
            >
              <Lock className="w-3.5 h-3.5 text-[#818CF8]" />
              <span>{savingPassword ? 'Actualizando...' : 'Cambiar Contraseña'}</span>
            </button>
          </form>
        </div>

        {/* 3. Espacio de Trabajo / Tenant */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-border">
            <div className="w-10 h-10 rounded-xl bg-muted/40 border border-border flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Espacio de Trabajo (Tenant)</h3>
              <p className="text-[11px] text-muted-foreground">Entorno y sede configurada</p>
            </div>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex justify-between items-center py-1 border-b border-border/50">
              <span className="text-muted-foreground">Organización:</span>
              <span className="font-semibold text-foreground">
                {currentTenant?.nombre || 'Espacio Predeterminado'}
              </span>
            </div>
            <div className="flex justify-between items-center py-1 border-b border-border/50">
              <span className="text-muted-foreground">Identificador:</span>
              <span className="font-mono text-[11px] text-muted-foreground">
                {currentTenant?.id || 'Inquilino Principal'}
              </span>
            </div>
            <div className="flex justify-between items-center py-1">
              <span className="text-muted-foreground">Estado del Entorno:</span>
              <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Operativo 24/7
              </span>
            </div>
          </div>
        </div>

        {/* 4. Sesión y Cierre */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-border">
            <div className="w-10 h-10 rounded-xl bg-muted/40 border border-border flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Laptop className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-foreground">Sesión Activa</h3>
              <p className="text-[11px] text-muted-foreground">Control de acceso seguro</p>
            </div>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Tu sesión actual está autenticada mediante tokens seguros JWT con renovación automática.
            Podés cerrar tu sesión en cualquier momento.
          </p>

          <div className="pt-2">
            <button
              type="button"
              onClick={onLogout}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-semibold transition-all cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
