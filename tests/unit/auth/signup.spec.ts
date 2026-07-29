import { describe, expect, it, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { signUpSchema } from '@/validations/auth/signUpAuth.validate'
import { useAuthStore } from '@/stores/auth.store'
import type { SIGN_UP } from '@/types/auth.types'

describe('Inscription - signUpSchema validation', () => {
  it('should validate a correct sign-up payload', () => {
    const valid: SIGN_UP = {
      email: 'nounu@test.com',
      password: 'password123',
      role: 'user',
      type: 'open-modal-auth-profil-nounu',
    }
    const result = signUpSchema.safeParse(valid)
    expect(result.success).toBe(true)
  })

  it('should reject an invalid email', () => {
    const result = signUpSchema.safeParse({
      email: 'not-an-email',
      password: 'password123',
      type: 'open-modal-auth-profil-nounu',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("L'adresse email est invalide")
    }
  })

  it('should reject a password shorter than 8 characters', () => {
    const result = signUpSchema.safeParse({
      email: 'nounu@test.com',
      password: 'short',
      type: 'open-modal-auth-profil-nounu',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Le mot de passe doit avoir au moins 8 caractères')
    }
  })

  it('should reject an empty type', () => {
    const result = signUpSchema.safeParse({
      email: 'nounu@test.com',
      password: 'password123',
      type: '',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Le type de compte est obligatoire')
    }
  })

  it('should reject a missing email', () => {
    const result = signUpSchema.safeParse({
      password: 'password123',
      type: 'open-modal-auth-profil-nounu',
    })
    expect(result.success).toBe(false)
  })

  it('should reject a missing password', () => {
    const result = signUpSchema.safeParse({
      email: 'nounu@test.com',
      type: 'open-modal-auth-profil-nounu',
    })
    expect(result.success).toBe(false)
  })
})

describe('Inscription - useAuthStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should set email correctly', () => {
    const store = useAuthStore()
    store.setEmail('nounu@test.com')
    expect(store.email).toBe('nounu@test.com')
  })

  it('should set registration data correctly', () => {
    const store = useAuthStore()
    const registration: Partial<SIGN_UP> = {
      email: 'nounu@test.com',
      password: 'password123',
      type: 'open-modal-auth-profil-nounu',
    }
    store.setRegistration(registration)
    expect(store.registration.email).toBe('nounu@test.com')
    expect(store.registration.password).toBe('password123')
    expect(store.registration.type).toBe('open-modal-auth-profil-nounu')
  })

  it('should merge partial registration data with existing state', () => {
    const store = useAuthStore()
    store.setRegistration({ email: 'first@test.com', password: 'pass1234', type: 'nounu' })
    store.setRegistration({ email: 'updated@test.com' })
    expect(store.registration.email).toBe('updated@test.com')
    expect(store.registration.password).toBe('pass1234')
    expect(store.registration.type).toBe('nounu')
  })

  it('should set and clear errors', () => {
    const store = useAuthStore()
    expect(store.hasErrors).toBe(false)

    store.setError('general', { path: 'email', message: 'Email déjà utilisé' })
    expect(store.hasErrors).toBe(true)
    expect(store.errors.general.message).toBe('Email déjà utilisé')

    store.clearErrors()
    expect(store.hasErrors).toBe(false)
  })

  it('should reset the store', () => {
    const store = useAuthStore()
    store.setEmail('test@test.com')
    store.setRegistration({ email: 'test@test.com', password: 'password123', type: 'nounu' })
    store.setLoginStatus(true)
    store.setError('general', { path: 'email', message: 'Error' })

    store.resetStore()

    expect(store.isLogged).toBe(false)
    expect(store.email).toBe('')
    expect(store.registration.email).toBe('')
    expect(store.registration.password).toBe('')
    expect(store.registration.type).toBe('')
    expect(store.hasErrors).toBe(false)
  })

  it('should set update profil status', () => {
    const store = useAuthStore()
    store.setUpdateProfil(true, 'profile-123', 'nounu')
    expect(store.isUpdateProfil).toBe(true)
    expect(store.isUpdateProfilID).toBe('profile-123')
    expect(store.isUpdateProfilType).toBe('nounu')
  })
})
