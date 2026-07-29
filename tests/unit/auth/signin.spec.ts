import { describe, expect, it, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { signInSchema } from '@/validations/auth/signInAuth.validate'
import { useAuthStore } from '@/stores/auth.store'
import type { SIGN_IN } from '@/types/auth.types'

describe('Connexion - signInSchema validation', () => {
  it('should validate a correct sign-in payload', () => {
    const valid: SIGN_IN = {
      email: 'nounu@test.com',
      password: 'password123',
    }
    const result = signInSchema.safeParse(valid)
    expect(result.success).toBe(true)
  })

  it('should reject an invalid email', () => {
    const result = signInSchema.safeParse({
      email: 'invalid-email',
      password: 'password123',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe("L'adresse email est invalide")
    }
  })

  it('should reject a password shorter than 8 characters', () => {
    const result = signInSchema.safeParse({
      email: 'nounu@test.com',
      password: 'short',
    })
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toBe('Le mot de passe doit avoir au moins 8 caractères')
    }
  })

  it('should reject a missing email', () => {
    const result = signInSchema.safeParse({
      password: 'password123',
    })
    expect(result.success).toBe(false)
  })

  it('should reject a missing password', () => {
    const result = signInSchema.safeParse({
      email: 'nounu@test.com',
    })
    expect(result.success).toBe(false)
  })

  it('should reject an empty payload', () => {
    const result = signInSchema.safeParse({})
    expect(result.success).toBe(false)
  })
})

describe('Connexion - useAuthStore login state', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should set login status to true', () => {
    const store = useAuthStore()
    expect(store.isLogged).toBe(false)
    store.setLoginStatus(true)
    expect(store.isLogged).toBe(true)
    expect(store.isAuthenticated).toBe(true)
  })

  it('should set login status to false', () => {
    const store = useAuthStore()
    store.setLoginStatus(true)
    store.setLoginStatus(false)
    expect(store.isLogged).toBe(false)
    expect(store.isAuthenticated).toBe(false)
  })

  it('should set and clear login errors', () => {
    const store = useAuthStore()
    expect(store.hasErrors).toBe(false)

    store.setError('login', { path: 'email', message: 'Email ou mot de passe incorrect' })
    expect(store.hasErrors).toBe(true)
    expect(store.errors.login.message).toBe('Email ou mot de passe incorrect')

    store.clearErrors()
    expect(store.hasErrors).toBe(false)
  })

  it('should track errors independently for general and login', () => {
    const store = useAuthStore()
    store.setError('general', { path: 'email', message: 'Registration error' })
    expect(store.errors.general.message).toBe('Registration error')
    expect(store.errors.login.message).toBe('')

    store.setError('login', { path: 'password', message: 'Login error' })
    expect(store.errors.general.message).toBe('Registration error')
    expect(store.errors.login.message).toBe('Login error')
    expect(store.hasErrors).toBe(true)
  })

  it('should reset store and clear login state', () => {
    const store = useAuthStore()
    store.setLoginStatus(true)
    store.setError('login', { path: 'email', message: 'Error' })

    store.resetStore()

    expect(store.isLogged).toBe(false)
    expect(store.hasErrors).toBe(false)
  })
})
