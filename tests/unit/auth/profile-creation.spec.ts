import { describe, expect, it, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

const { mockAxiosFn } = vi.hoisted(() => ({
  mockAxiosFn: vi.fn(),
}))

vi.mock('axios', () => ({
  default: Object.assign(mockAxiosFn, {
    isAxiosError: vi.fn(),
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  }),
  isAxiosError: vi.fn(),
}))

vi.mock('@capacitor/preferences', () => ({
  Preferences: {
    get: vi.fn().mockResolvedValue({ value: 'user-123' }),
    set: vi.fn().mockResolvedValue(undefined),
    remove: vi.fn().mockResolvedValue(undefined),
    clear: vi.fn().mockResolvedValue(undefined),
  },
}))

vi.mock('vue-router', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
}))

import axios from 'axios'
import { useNounuHook } from '@/hooks/nounuHooks/nounu.hooks'
import { useProfiNounulStore } from '@/stores/authProfilNounuStore'
import { useAuthStore } from '@/stores/auth.store'

describe('Création de profil Nounu - useNounuHook', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    mockAxiosFn.mockResolvedValue({ data: { id: 'nounu-profile-1', fullname: 'Awa Nounu' } })
    vi.mocked(axios.isAxiosError).mockReturnValue(false)
  })

  it('should initialize with default state', () => {
    const { state } = useNounuHook()
    expect(state.loading).toBe(false)
    expect(state.error).toBeNull()
    expect(state.success).toBe(false)
  })

  it('should throw if user ID is not found in storage', async () => {
    const { Preferences } = await import('@capacitor/preferences')
    vi.mocked(Preferences.get).mockResolvedValueOnce({ value: null })

    const { createProfile, state } = useNounuHook()
    await createProfile()

    expect(state.success).toBe(false)
    expect(state.error).toBe('ID utilisateur non trouvé')
  })

  it('should create profile successfully and set success state', async () => {
    mockAxiosFn.mockResolvedValue({ data: { id: 'nounu-profile-1', fullname: 'Awa Nounu' } })

    const { createProfile, state } = useNounuHook()
    await createProfile()

    expect(state.success).toBe(true)
    expect(state.error).toBeNull()
    expect(state.loading).toBe(false)
  })

  it('should call POST method for new profile creation', async () => {
    mockAxiosFn.mockResolvedValue({ data: { id: 'nounu-profile-1' } })

    const { createProfile } = useNounuHook()
    await createProfile()

    expect(mockAxiosFn).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'POST',
      }),
    )
  })

  it('should call PUT method for profile update', async () => {
    const authStore = useAuthStore()
    authStore.setUpdateProfil(true, 'profile-123')

    mockAxiosFn.mockResolvedValue({ data: { id: 'nounu-profile-1' } })

    const { createProfile } = useNounuHook()
    await createProfile()

    expect(mockAxiosFn).toHaveBeenCalledWith(
      expect.objectContaining({
        method: 'PUT',
      }),
    )
  })

  it('should handle axios error and set error message', async () => {
    vi.mocked(axios.isAxiosError).mockReturnValue(true)
    mockAxiosFn.mockRejectedValue({
      response: { data: { message: 'Erreur serveur profil' } },
      message: 'Request failed',
    })

    const { createProfile, state } = useNounuHook()
    await createProfile()

    expect(state.success).toBe(false)
    expect(state.error).toBe('Erreur serveur profil')
  })

  it('should handle generic error and set error message', async () => {
    vi.mocked(axios.isAxiosError).mockReturnValue(false)
    mockAxiosFn.mockRejectedValue(new Error('Network error'))

    const { createProfile, state } = useNounuHook()
    await createProfile()

    expect(state.success).toBe(false)
    expect(state.error).toBe('Network error')
  })

  it('should set loading to false after completion regardless of success', async () => {
    mockAxiosFn.mockResolvedValue({ data: { id: 'nounu-profile-1' } })

    const { createProfile, state } = useNounuHook()
    await createProfile()

    expect(state.loading).toBe(false)
  })
})

describe('Création de profil Nounu - useProfiNounulStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with step 1', () => {
    const store = useProfiNounulStore()
    expect(store.state.StepProfil).toBe(1)
  })

  it('should have empty initial personal info', () => {
    const store = useProfiNounulStore()
    expect(store.state.InformationPersonnelle.fullname).toBe('')
    expect(store.state.InformationPersonnelle.age).toBe('')
    expect(store.state.InformationPersonnelle.phone).toBe('')
    expect(store.state.InformationPersonnelle.address).toEqual([])
  })

  it('should have empty initial experience info', () => {
    const store = useProfiNounulStore()
    expect(store.state.ExperienceEtCompetences.annees_experience).toBe('')
    expect(store.state.ExperienceEtCompetences.tranche_age_enfants).toEqual([])
    expect(store.state.ExperienceEtCompetences.competance_specifique).toEqual([])
    expect(store.state.ExperienceEtCompetences.langue_parler).toEqual([])
  })

  it('should have empty initial tarifications', () => {
    const store = useProfiNounulStore()
    expect(store.state.Tarifications.tarif_horaire).toBe('')
    expect(store.state.Tarifications.tarif_mensuel).toBe('')
  })

  it('should navigate to next step', () => {
    const store = useProfiNounulStore()
    expect(store.state.StepProfil).toBe(1)
    store.state.StepProfil = 2
    expect(store.state.StepProfil).toBe(2)
  })

  it('should navigate to previous step with minimum 1', () => {
    const store = useProfiNounulStore()
    store.state.StepProfil = 3
    store.previousStep()
    expect(store.state.StepProfil).toBe(2)
    store.previousStep()
    expect(store.state.StepProfil).toBe(1)
    store.previousStep()
    expect(store.state.StepProfil).toBe(1)
  })

  it('should clear error on successful validation', () => {
    const store = useProfiNounulStore()
    store.state.in_error = { path: 'fullname', message: 'Champ requis' }
    expect(store.state.in_error.message).toBe('Champ requis')
  })

  it('should have DataEMERGENCIES with 2 options', () => {
    const store = useProfiNounulStore()
    expect(store.DataEMERGENCIES).toHaveLength(2)
    expect(store.DataEMERGENCIES[0].id).toBe(1)
    expect(store.DataEMERGENCIES[1].id).toBe(2)
  })

  it('should have DataFlexiblePrice with 2 options', () => {
    const store = useProfiNounulStore()
    expect(store.DataFlexiblePrice).toHaveLength(2)
    expect(store.DataFlexiblePrice[0].id).toBe(1)
    expect(store.DataFlexiblePrice[1].id).toBe(2)
  })
})
