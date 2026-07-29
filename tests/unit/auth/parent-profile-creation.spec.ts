import { describe, expect, it, beforeEach, vi } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'

const { mockAxiosPost, mockAxiosIsAxiosError } = vi.hoisted(() => ({
  mockAxiosPost: vi.fn(),
  mockAxiosIsAxiosError: vi.fn(),
}))

vi.mock('axios', () => ({
  default: Object.assign(mockAxiosPost, {
    isAxiosError: mockAxiosIsAxiosError,
    post: mockAxiosPost,
    get: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  }),
  isAxiosError: mockAxiosIsAxiosError,
}))

vi.mock('@capacitor/preferences', () => ({
  Preferences: {
    get: vi.fn().mockResolvedValue({ value: 'user-parent-123' }),
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
import { useParentHook } from '@/hooks/parentHooks/parent.hooks'
import { useProfilStore } from '@/stores/authProfilStore'
import { useAuthStore } from '@/stores/auth.store'

describe('Création de profil Parent - useParentHook', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.clearAllMocks()
    mockAxiosPost.mockResolvedValue({ data: { id: 'parent-profile-1' } })
    mockAxiosIsAxiosError.mockReturnValue(false)
  })

  it('should initialize with default state', () => {
    const { state } = useParentHook()
    expect(state.loading).toBe(false)
    expect(state.error).toBeNull()
    expect(state.success).toBe(false)
  })

  it('should create parent profile successfully', async () => {
    mockAxiosPost.mockResolvedValue({ data: { id: 'parent-profile-1' } })

    const { createParentProfile, state } = useParentHook()
    await createParentProfile()

    expect(state.success).toBe(true)
    expect(state.error).toBeNull()
    expect(state.loading).toBe(false)
  })

  it('should call axios.post for new profile creation', async () => {
    mockAxiosPost.mockResolvedValue({ data: { id: 'parent-profile-1' } })

    const { createParentProfile } = useParentHook()
    await createParentProfile()

    expect(mockAxiosPost).toHaveBeenCalledWith(
      expect.any(String),
      expect.any(FormData),
      expect.objectContaining({
        headers: { 'Content-Type': 'multipart/form-data' },
      }),
    )
  })

  it('should throw if user ID is not found in storage', async () => {
    const { Preferences } = await import('@capacitor/preferences')
    vi.mocked(Preferences.get).mockResolvedValueOnce({ value: null })

    const { createParentProfile, state } = useParentHook()
    await createParentProfile()

    expect(state.success).toBe(false)
    expect(state.error).toContain('Valeur de stockage non trouvée')
  })

  it('should handle axios error and set error message', async () => {
    mockAxiosIsAxiosError.mockReturnValue(true)
    mockAxiosPost.mockRejectedValue({
      response: { data: { message: 'Erreur serveur parent' } },
      message: 'Request failed',
    })

    const { createParentProfile, state } = useParentHook()
    await createParentProfile()

    expect(state.success).toBe(false)
    expect(state.error).toBe('Erreur serveur parent')
  })

  it('should handle generic error and set error message', async () => {
    mockAxiosIsAxiosError.mockReturnValue(false)
    mockAxiosPost.mockRejectedValue(new Error('Unexpected error'))

    const { createParentProfile, state } = useParentHook()
    await createParentProfile()

    expect(state.success).toBe(false)
    expect(state.error).toBe('Unexpected error')
  })

  it('should set loading to false after completion regardless of success', async () => {
    mockAxiosPost.mockResolvedValue({ data: { id: 'parent-profile-1' } })

    const { createParentProfile, state } = useParentHook()
    await createParentProfile()

    expect(state.loading).toBe(false)
  })

  it('should reset success to false on new attempt', async () => {
    mockAxiosPost.mockResolvedValue({ data: { id: 'parent-profile-1' } })

    const { createParentProfile, state } = useParentHook()
    await createParentProfile()
    expect(state.success).toBe(true)

    mockAxiosIsAxiosError.mockReturnValue(true)
    mockAxiosPost.mockRejectedValue({ response: { data: { message: 'Error' } } })
    await createParentProfile()
    expect(state.success).toBe(false)
  })
})

describe('Création de profil Parent - useProfilStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with step 1', () => {
    const store = useProfilStore()
    expect(store.state.stepProfil).toBe(1)
  })

  it('should have empty initial personal info', () => {
    const store = useProfilStore()
    expect(store.state.InformationPersonnelle.fullname).toBe('')
    expect(store.state.InformationPersonnelle.adresse_mail).toBe('')
    expect(store.state.InformationPersonnelle.phone).toBe('')
  })

  it('should have empty initial children info', () => {
    const store = useProfilStore()
    expect(store.state.InformationSurLesEnfants.number_of_children).toBe('')
    expect(store.state.InformationSurLesEnfants.besions_specifiques).toEqual([])
  })

  it('should have empty initial tarifications', () => {
    const store = useProfilStore()
    expect(store.state.Tarifications.budget_estimated).toBe('')
  })

  it('should have empty initial services recherches', () => {
    const store = useProfilStore()
    expect(store.state.ServicesRecherches.garde_enfants).toEqual([])
    expect(store.state.ServicesRecherches.aide_menagere).toEqual([])
    expect(store.state.ServicesRecherches.frequence_des_services).toEqual([])
    expect(store.state.ServicesRecherches.horaire_souhaites).toEqual([])
  })

  it('should have default activeMenu_typeOfProfil', () => {
    const store = useProfilStore()
    expect(store.state.activeMenu_typeOfProfil).toBe('open-modal-auth-profil-nounu')
  })

  it('should navigate to previous step with minimum 1', () => {
    const store = useProfilStore()
    store.state.stepProfil = 3
    store.previousStep()
    expect(store.state.stepProfil).toBe(2)
    store.previousStep()
    expect(store.state.stepProfil).toBe(1)
    store.previousStep()
    expect(store.state.stepProfil).toBe(1)
  })

  it('should clear error on successful validation', () => {
    const store = useProfilStore()
    store.state.in_error = { path: 'fullname', message: 'Champ requis' }
    expect(store.state.in_error.message).toBe('Champ requis')
  })

  it('should set update profil via ChangeInputToEdit', () => {
    const store = useProfilStore()
    const authStore = useAuthStore()
    const mockData = {
      id: 'parent-1',
      fullname: 'Test Parent',
      adresse_mail: 'parent@test.com',
      phone: '+2250700000000',
      number_of_children: '3',
      budget_estimated: '75000',
      preferences: {
        besions_specifiques: ['allergies'],
        garde_enfants: ['soir'],
        aide_menagere: ['menage'],
        frequence_des_services: ['hebdo'],
        horaire_souhaites: ['18h-22h'],
        adress: ['Abidjan'],
        zone_geographique_prestataire: ['Cocody'],
        competance_specifique: ['premiers_secours'],
        langue_parler: ['francais'],
        disponibility_du_prestataire: ['soir'],
        mode_de_paiement: ['especes'],
      },
      informations_complementaires: 'Info test',
    }

    store.ChangeInputToEdit(mockData)

    expect(authStore.isUpdateProfil).toBe(true)
    expect(authStore.isUpdateProfilID).toBe('parent-1')
    expect(store.state.InformationPersonnelle.fullname).toBe('Test Parent')
    expect(store.state.InformationPersonnelle.adresse_mail).toBe('parent@test.com')
    expect(store.state.InformationPersonnelle.phone).toBe('+2250700000000')
    expect(store.state.InformationSurLesEnfants.number_of_children).toBe('3')
    expect(store.state.Tarifications.budget_estimated).toBe('75000')
    expect(store.state.AutreInformations.informations_complementaires).toBe('Info test')
  })
})
