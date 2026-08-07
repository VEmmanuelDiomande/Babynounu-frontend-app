<template>
  <ProfileSetupLayout
    title="Profil Nounu"
    :current-step="nounuStore.state.StepProfil"
    :total-steps="totalSteps"
    :loading="loading"
    :is-edit-mode="authStore.isUpdateProfil"
    :show-cropper="showCropper"
    :crop-image-src="cropImageSrc"
    :crop-title="cropTitle"
    :crop-file-name="cropFileName"
    :crop-stencil-type="cropStencilType"
    @close="quitWizard"
    @back="nounuStore.previousStep"
    @next="handleNext"
    @crop-cancel="onCropCancel"
    @crop="onCrop"
  >
        <!-- Step 1: Informations personnelles -->
        <div v-if="nounuStore.state.StepProfil === 1" class="space-y-5">
          <div class="text-center mb-6">
            <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-100 text-rose-400 mb-3">
              <i class="ri ri-user-3-line" style="font-size: 12px;"></i>
              <span class="font-love text-[10px] font-bold uppercase tracking-wider">Étape 1</span>
            </div>
            <h2 class="font-anton text-2xl text-gray-900 mb-1">Informations personnelles</h2>
            <p class="font-love text-sm text-gray-500">Présentez-vous aux parents.</p>
          </div>

          <div class="bg-white rounded-3xl p-6 shadow-sm border border-rose-50 flex flex-col items-center gap-3">
            <div class="relative">
              <div class="h-28 w-28 rounded-3xl border-2 border-rose-200 overflow-hidden bg-rose-50 shadow-sm">
                <img v-if="imagePreview" :src="imagePreview" alt="Profile" class="h-full w-full object-cover" />
                <div v-else class="h-full w-full flex items-center justify-center">
                  <i class="ri ri-user-3-line text-rose-200" style="font-size: 40px;"></i>
                </div>
              </div>
              <button
                type="button"
                @click="triggerFileInput"
                class="absolute -bottom-2 -right-2 h-9 w-9 rounded-full bg-rose-400 text-white flex items-center justify-center shadow-lg hover:bg-rose-500 transition-colors active:scale-90"
              >
                <i class="ri ri-camera-line" style="font-size: 18px;"></i>
              </button>
              <input ref="fileInputRef" type="file" accept="image/*" class="hidden" @change="handlePhotoUpload" />
            </div>
            <p class="font-love text-xs text-gray-400">Photo de profil</p>
          </div>

          <div class="bg-white rounded-3xl p-6 shadow-sm border border-rose-50 space-y-4">
            <div>
              <label class="block font-love text-xs font-medium text-gray-700 mb-1.5">Nom complet</label>
              <div class="relative">
                <i class="ri ri-user-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" style="font-size: 16px;"></i>
                <input
                  v-model="nounuStore.state.InformationPersonnelle.fullname"
                  type="text"
                  placeholder="Jeanne Dupont"
                  class="w-full font-love text-sm bg-rose-50/40 border border-rose-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 pl-11 pr-4 py-3.5 placeholder:text-gray-400 transition-all"
                />
              </div>
            </div>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-love text-xs font-medium text-gray-700 mb-1.5">Âge</label>
                <div class="relative">
                  <i class="ri ri-calendar-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" style="font-size: 16px;"></i>
                  <input
                    v-model="nounuStore.state.InformationPersonnelle.age"
                    type="number"
                    placeholder="28"
                    class="w-full font-love text-sm bg-rose-50/40 border border-rose-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 pl-11 pr-4 py-3.5 placeholder:text-gray-400 transition-all"
                  />
                </div>
              </div>
              <div>
                <label class="block font-love text-xs font-medium text-gray-700 mb-1.5">Téléphone</label>
                <div class="relative">
                  <i class="ri ri-phone-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" style="font-size: 16px;"></i>
                  <input
                    v-model="nounuStore.state.InformationPersonnelle.phone"
                    type="tel"
                    placeholder="+225 07 00 00 00"
                    class="w-full font-love text-sm bg-rose-50/40 border border-rose-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 pl-11 pr-4 py-3.5 placeholder:text-gray-400 transition-all"
                  />
                </div>
              </div>
            </div>
            <div>
              <label class="block font-love text-xs font-medium text-gray-700 mb-1.5">Adresse</label>
              <div class="relative">
                <i class="ri ri-map-pin-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" style="font-size: 16px;"></i>
                <input
                  v-model="addressInput"
                  type="text"
                  placeholder="Cocody, Abidjan"
                  class="w-full font-love text-sm bg-rose-50/40 border border-rose-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 pl-11 pr-4 py-3.5 placeholder:text-gray-400 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2: Expérience & Compétences -->
        <div v-else-if="nounuStore.state.StepProfil === 2" class="space-y-5">
          <div class="text-center mb-6">
            <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-100 text-rose-400 mb-3">
              <i class="ri ri-briefcase-line" style="font-size: 12px;"></i>
              <span class="font-love text-[10px] font-bold uppercase tracking-wider">Étape 2</span>
            </div>
            <h2 class="font-anton text-2xl text-gray-900 mb-1">Expérience & Compétences</h2>
            <p class="font-love text-sm text-gray-500">Parlez-nous de votre expérience.</p>
          </div>

          <div class="bg-white rounded-3xl p-6 shadow-sm border border-rose-50 space-y-5">
            <div>
              <label class="block font-love text-xs font-medium text-gray-700 mb-1.5">Années d'expérience</label>
              <div class="relative">
                <i class="ri ri-time-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" style="font-size: 16px;"></i>
                <input
                  v-model="nounuStore.state.ExperienceEtCompetences.annees_experience"
                  type="number"
                  placeholder="5"
                  class="w-full font-love text-sm bg-rose-50/40 border border-rose-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 pl-11 pr-4 py-3.5 placeholder:text-gray-400 transition-all"
                />
              </div>
            </div>

            <div>
              <label class="flex items-center gap-1.5 font-love text-xs font-medium text-gray-700 mb-2.5">
                <i class="ri ri-emotion-happy-line text-rose-400" style="font-size: 14px;"></i>
                Tranche d'âge des enfants
              </label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="range in ageRanges"
                  :key="range"
                  type="button"
                  @click="toggleArrayItem(nounuStore.state.ExperienceEtCompetences.tranche_age_enfants, range)"
                  :class="[
                    'px-4 py-2.5 rounded-2xl font-love text-xs font-medium transition-all border flex items-center gap-1.5',
                    nounuStore.state.ExperienceEtCompetences.tranche_age_enfants.includes(range)
                      ? 'bg-rose-400 text-white border-rose-400 shadow-sm shadow-rose-200'
                      : 'bg-white text-gray-600 border-rose-100 hover:border-rose-300 hover:bg-rose-50/40'
                  ]"
                >
                  <i v-if="nounuStore.state.ExperienceEtCompetences.tranche_age_enfants.includes(range)" class="ri ri-check-line" style="font-size: 12px;"></i>
                  {{ range }}
                </button>
              </div>
            </div>

            <div>
              <label class="flex items-center gap-1.5 font-love text-xs font-medium text-gray-700 mb-2.5">
                <i class="ri ri-star-smile-line text-rose-400" style="font-size: 14px;"></i>
                Compétences spécifiques
              </label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="skill in competences"
                  :key="skill"
                  type="button"
                  @click="toggleArrayItem(nounuStore.state.ExperienceEtCompetences.competance_specifique, skill)"
                  :class="[
                    'px-4 py-2.5 rounded-2xl font-love text-xs font-medium transition-all border flex items-center gap-1.5',
                    nounuStore.state.ExperienceEtCompetences.competance_specifique.includes(skill)
                      ? 'bg-rose-400 text-white border-rose-400 shadow-sm shadow-rose-200'
                      : 'bg-white text-gray-600 border-rose-100 hover:border-rose-300 hover:bg-rose-50/40'
                  ]"
                >
                  <i v-if="nounuStore.state.ExperienceEtCompetences.competance_specifique.includes(skill)" class="ri ri-check-line" style="font-size: 12px;"></i>
                  {{ skill }}
                </button>
              </div>
            </div>

            <div>
              <label class="flex items-center gap-1.5 font-love text-xs font-medium text-gray-700 mb-2.5">
                <i class="ri ri-translate-2 text-rose-400" style="font-size: 14px;"></i>
                Langues parlées
              </label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="lang in languages"
                  :key="lang"
                  type="button"
                  @click="toggleArrayItem(nounuStore.state.ExperienceEtCompetences.langue_parler, lang)"
                  :class="[
                    'px-4 py-2.5 rounded-2xl font-love text-xs font-medium transition-all border flex items-center gap-1.5',
                    nounuStore.state.ExperienceEtCompetences.langue_parler.includes(lang)
                      ? 'bg-rose-400 text-white border-rose-400 shadow-sm shadow-rose-200'
                      : 'bg-white text-gray-600 border-rose-100 hover:border-rose-300 hover:bg-rose-50/40'
                  ]"
                >
                  <i v-if="nounuStore.state.ExperienceEtCompetences.langue_parler.includes(lang)" class="ri ri-check-line" style="font-size: 12px;"></i>
                  {{ lang }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Disponibilités -->
        <div v-else-if="nounuStore.state.StepProfil === 3" class="space-y-5">
          <div class="text-center mb-6">
            <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-100 text-rose-400 mb-3">
              <i class="ri ri-calendar-todo-line" style="font-size: 12px;"></i>
              <span class="font-love text-[10px] font-bold uppercase tracking-wider">Étape 3</span>
            </div>
            <h2 class="font-anton text-2xl text-gray-900 mb-1">Disponibilités</h2>
            <p class="font-love text-sm text-gray-500">Quand êtes-vous disponible ?</p>
          </div>

          <div class="bg-white rounded-3xl p-6 shadow-sm border border-rose-50 space-y-5">
            <div>
              <label class="flex items-center gap-1.5 font-love text-xs font-medium text-gray-700 mb-2.5">
                <i class="ri ri-time-line text-rose-400" style="font-size: 14px;"></i>
                Horaires disponibles
              </label>
              <div class="grid grid-cols-2 gap-2.5">
                <button
                  v-for="slot in timeSlots"
                  :key="slot"
                  type="button"
                  @click="toggleArrayItem(nounuStore.state.Disponibilites.horaire_disponible, slot)"
                  :class="[
                    'px-3 py-3 rounded-2xl font-love text-xs font-medium transition-all border text-center flex items-center justify-center gap-1.5',
                    nounuStore.state.Disponibilites.horaire_disponible.includes(slot)
                      ? 'bg-rose-400 text-white border-rose-400 shadow-sm shadow-rose-200'
                      : 'bg-white text-gray-600 border-rose-100 hover:border-rose-300 hover:bg-rose-50/40'
                  ]"
                >
                  <i v-if="nounuStore.state.Disponibilites.horaire_disponible.includes(slot)" class="ri ri-check-line" style="font-size: 12px;"></i>
                  {{ slot }}
                </button>
              </div>
            </div>

            <div>
              <label class="flex items-center gap-1.5 font-love text-xs font-medium text-gray-700 mb-2.5">
                <i class="ri ri-flashlight-line text-rose-400" style="font-size: 14px;"></i>
                Missions urgentes
              </label>
              <div class="space-y-2.5">
                <button
                  v-for="item in nounuStore.DataEMERGENCIES"
                  :key="item.id"
                  type="button"
                  @click="nounuStore.state.Disponibilites.urgences = [item]"
                  :class="[
                    'w-full text-left px-4 py-3.5 rounded-2xl font-love text-sm transition-all border-2 flex items-center gap-3',
                    nounuStore.state.Disponibilites.urgences.find((u: any) => u.id === item.id)
                      ? 'bg-rose-50 border-rose-400 text-rose-500 font-medium'
                      : 'bg-white border-rose-100 text-gray-600 hover:border-rose-300'
                  ]"
                >
                  <div
                    :class="[
                      'h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all',
                      nounuStore.state.Disponibilites.urgences.find((u: any) => u.id === item.id)
                        ? 'border-rose-400 bg-rose-400'
                        : 'border-gray-200'
                    ]"
                  >
                    <i v-if="nounuStore.state.Disponibilites.urgences.find((u: any) => u.id === item.id)" class="ri ri-check-line text-white" style="font-size: 12px;"></i>
                  </div>
                  {{ item.name }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 4: Tarifications -->
        <div v-else-if="nounuStore.state.StepProfil === 4" class="space-y-5">
          <div class="text-center mb-6">
            <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-100 text-rose-400 mb-3">
              <i class="ri ri-money-cny-circle-line" style="font-size: 12px;"></i>
              <span class="font-love text-[10px] font-bold uppercase tracking-wider">Étape 4</span>
            </div>
            <h2 class="font-anton text-2xl text-gray-900 mb-1">Tarifications</h2>
            <p class="font-love text-sm text-gray-500">Définissez vos tarifs.</p>
          </div>

          <div class="bg-white rounded-3xl p-6 shadow-sm border border-rose-50 space-y-5">
            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="block font-love text-xs font-medium text-gray-700 mb-1.5">Tarif horaire (FCFA)</label>
                <div class="relative">
                  <i class="ri ri-money-cny-circle-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" style="font-size: 16px;"></i>
                  <input
                    v-model="nounuStore.state.Tarifications.tarif_horaire"
                    type="number"
                    placeholder="2500"
                    class="w-full font-love text-sm bg-rose-50/40 border border-rose-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 pl-11 pr-4 py-3.5 placeholder:text-gray-400 transition-all"
                  />
                </div>
              </div>
              <div>
                <label class="block font-love text-xs font-medium text-gray-700 mb-1.5">Tarif mensuel (FCFA)</label>
                <div class="relative">
                  <i class="ri ri-calendar-2-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" style="font-size: 16px;"></i>
                  <input
                    v-model="nounuStore.state.Tarifications.tarif_mensuel"
                    type="number"
                    placeholder="150000"
                    class="w-full font-love text-sm bg-rose-50/40 border border-rose-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 pl-11 pr-4 py-3.5 placeholder:text-gray-400 transition-all"
                  />
                </div>
              </div>
            </div>

            <div>
              <label class="flex items-center gap-1.5 font-love text-xs font-medium text-gray-700 mb-2.5">
                <i class="ri ri-hand-heart-line text-rose-400" style="font-size: 14px;"></i>
                Flexibilité tarifaire
              </label>
              <div class="space-y-2.5">
                <button
                  v-for="item in nounuStore.DataFlexiblePrice"
                  :key="item.id"
                  type="button"
                  @click="nounuStore.state.Tarifications.flexibilite_tarifaire = [item]"
                  :class="[
                    'w-full text-left px-4 py-3.5 rounded-2xl font-love text-sm transition-all border-2 flex items-center gap-3',
                    nounuStore.state.Tarifications.flexibilite_tarifaire.find((f: any) => f.id === item.id)
                      ? 'bg-rose-50 border-rose-400 text-rose-500 font-medium'
                      : 'bg-white border-rose-100 text-gray-600 hover:border-rose-300'
                  ]"
                >
                  <div
                    :class="[
                      'h-5 w-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all',
                      nounuStore.state.Tarifications.flexibilite_tarifaire.find((f: any) => f.id === item.id)
                        ? 'border-rose-400 bg-rose-400'
                        : 'border-gray-200'
                    ]"
                  >
                    <i v-if="nounuStore.state.Tarifications.flexibilite_tarifaire.find((f: any) => f.id === item.id)" class="ri ri-check-line text-white" style="font-size: 12px;"></i>
                  </div>
                  {{ item.name }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 5: Présentation -->
        <div v-else-if="nounuStore.state.StepProfil === 5" class="space-y-5">
          <div class="text-center mb-6">
            <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-100 text-rose-400 mb-3">
              <i class="ri ri-quote-text" style="font-size: 12px;"></i>
              <span class="font-love text-[10px] font-bold uppercase tracking-wider">Étape 5</span>
            </div>
            <h2 class="font-anton text-2xl text-gray-900 mb-1">Présentation</h2>
            <p class="font-love text-sm text-gray-500">Présentez-vous en quelques mots.</p>
          </div>

          <div class="bg-white rounded-3xl p-6 shadow-sm border border-rose-50">
            <label class="flex items-center gap-1.5 font-love text-xs font-medium text-gray-700 mb-1.5">
              <i class="ri ri-quote-text text-rose-400" style="font-size: 14px;"></i>
              Courte biographie
            </label>
            <textarea
              v-model="nounuStore.state.PresentationDuPersonnel.courte_biographie"
              rows="6"
              placeholder="Bonjour, je m'appelle... J'ai X années d'expérience dans la garde d'enfants..."
              class="w-full font-love text-sm bg-rose-50/40 border border-rose-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 px-4 py-3.5 placeholder:text-gray-400 resize-none transition-all"
            ></textarea>
            <div class="flex items-center justify-between mt-2">
              <p class="font-love text-xs text-gray-400">
                {{ nounuStore.state.PresentationDuPersonnel.courte_biographie.length }} / 1000 caractères
              </p>
              <div class="h-1 w-24 bg-gray-100 rounded-full overflow-hidden">
                <div
                  class="h-full bg-rose-400 rounded-full transition-all"
                  :style="{ width: `${Math.min((nounuStore.state.PresentationDuPersonnel.courte_biographie.length / 1000) * 100, 100)}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 6: Zone géographique -->
        <div v-else-if="nounuStore.state.StepProfil === 6" class="space-y-5">
          <div class="text-center mb-6">
            <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-100 text-rose-400 mb-3">
              <i class="ri ri-map-pin-line" style="font-size: 12px;"></i>
              <span class="font-love text-[10px] font-bold uppercase tracking-wider">Étape 6</span>
            </div>
            <h2 class="font-anton text-2xl text-gray-900 mb-1">Zone géographique</h2>
            <p class="font-love text-sm text-gray-500">Où pouvez-vous travailler ?</p>
          </div>

          <div class="bg-white rounded-3xl p-6 shadow-sm border border-rose-50">
            <label class="flex items-center gap-1.5 font-love text-xs font-medium text-gray-700 mb-2.5">
              <i class="ri ri-map-pin-2-line text-rose-400" style="font-size: 14px;"></i>
              Zones de travail
            </label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="zone in workZones"
                :key="zone"
                type="button"
                @click="toggleArrayItem(nounuStore.state.DisponibiliteGeographique.zone_de_travail, zone)"
                :class="[
                  'px-4 py-2.5 rounded-2xl font-love text-xs font-medium transition-all border flex items-center gap-1.5',
                  nounuStore.state.DisponibiliteGeographique.zone_de_travail.includes(zone)
                    ? 'bg-rose-400 text-white border-rose-400 shadow-sm shadow-rose-200'
                    : 'bg-white text-gray-600 border-rose-100 hover:border-rose-300 hover:bg-rose-50/40'
                ]"
              >
                <i v-if="nounuStore.state.DisponibiliteGeographique.zone_de_travail.includes(zone)" class="ri ri-check-line" style="font-size: 12px;"></i>
                {{ zone }}
              </button>
            </div>
          </div>
        </div>

        <!-- Step 7: Vérification & Références -->
        <div v-else-if="nounuStore.state.StepProfil === 7" class="space-y-5">
          <div class="text-center mb-6">
            <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-100 text-rose-400 mb-3">
              <i class="ri ri-shield-check-line" style="font-size: 12px;"></i>
              <span class="font-love text-[10px] font-bold uppercase tracking-wider">Étape 7</span>
            </div>
            <h2 class="font-anton text-2xl text-gray-900 mb-1">Vérification & Références</h2>
            <p class="font-love text-sm text-gray-500">Ajoutez des documents et références.</p>
          </div>

          <div class="bg-white rounded-3xl p-6 shadow-sm border border-rose-50 space-y-5">
            <!-- Documents upload -->
            <div>
              <label class="flex items-center gap-1.5 font-love text-xs font-medium text-gray-700 mb-2.5">
                <i class="ri ri-clipboard-line text-rose-400" style="font-size: 14px;"></i>
                Documents
              </label>
              <div class="rounded-2xl p-4 border-2 border-dashed border-rose-200 hover:border-rose-400 transition-colors flex items-center justify-between cursor-pointer" @click="triggerVerificationInput">
                <div class="flex items-center gap-3">
                  <div class="h-11 w-11 rounded-xl bg-rose-50 flex items-center justify-center">
                    <i class="ri ri-clipboard-line text-rose-400" style="font-size: 22px;"></i>
                  </div>
                  <div>
                    <p class="font-love text-sm font-medium text-gray-900">Pièce d'identité</p>
                    <p class="font-love text-[10px] text-gray-400">CNI, Passeport ou Permis</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span v-if="verificationFiles" class="px-2 py-0.5 rounded-full bg-teal-50 text-teal-500 font-love text-[10px] font-medium flex items-center gap-1">
                    <i class="ri ri-check-line" style="font-size: 10px;"></i>
                    Sélectionné
                  </span>
                  <span class="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-400 font-love text-xs font-medium transition-colors">
                    Charger
                  </span>
                </div>
              </div>
              <input ref="verificationInputRef" type="file" accept="image/*" multiple class="hidden" @change="handleVerificationUpload" />
            </div>

            <!-- Certifications -->
            <div>
              <label class="flex items-center gap-1.5 font-love text-xs font-medium text-gray-700 mb-2.5">
                <i class="ri ri-award-line text-rose-400" style="font-size: 14px;"></i>
                Certifications
              </label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="cert in certifications"
                  :key="cert"
                  type="button"
                  @click="toggleArrayItem(nounuStore.state.VerificationEtReferences.certifications, cert)"
                  :class="[
                    'px-4 py-2.5 rounded-2xl font-love text-xs font-medium transition-all border flex items-center gap-1.5',
                    nounuStore.state.VerificationEtReferences.certifications.includes(cert)
                      ? 'bg-rose-400 text-white border-rose-400 shadow-sm shadow-rose-200'
                      : 'bg-white text-gray-600 border-rose-100 hover:border-rose-300 hover:bg-rose-50/40'
                  ]"
                >
                  <i v-if="nounuStore.state.VerificationEtReferences.certifications.includes(cert)" class="ri ri-check-line" style="font-size: 12px;"></i>
                  {{ cert }}
                </button>
              </div>
            </div>

            <!-- References -->
            <div>
              <div class="flex items-center justify-between mb-3">
                <label class="flex items-center gap-1.5 font-love text-xs font-medium text-gray-700">
                  <i class="ri ri-contacts-line text-rose-400" style="font-size: 14px;"></i>
                  Références
                </label>
                <button
                  type="button"
                  @click="nounuStore.state.VerificationEtReferences.references.push({ fullname: '', phone: '' })"
                  class="px-3 py-1.5 rounded-xl bg-rose-50 text-rose-400 hover:bg-rose-100 font-love text-xs font-medium transition-colors flex items-center gap-1"
                >
                  <i class="ri ri-add-line" style="font-size: 14px;"></i>
                  Ajouter
                </button>
              </div>
              <div class="space-y-3">
                <div
                  v-for="(ref, i) in nounuStore.state.VerificationEtReferences.references"
                  :key="i"
                  class="rounded-2xl border border-rose-100 bg-rose-50/30 p-4 space-y-3"
                >
                  <div class="flex items-center justify-between">
                    <span class="font-love text-xs font-medium text-gray-700 flex items-center gap-1.5">
                      <i class="ri ri-user-line text-gray-400" style="font-size: 14px;"></i>
                      Référence {{ i + 1 }}
                    </span>
                    <button
                      v-if="nounuStore.state.VerificationEtReferences.references.length > 1"
                      type="button"
                      @click="nounuStore.state.VerificationEtReferences.references.splice(i, 1)"
                      class="h-7 w-7 rounded-lg bg-red-50 text-red-400 hover:bg-red-100 transition-colors flex items-center justify-center"
                    >
                      <i class="ri ri-delete-bin-line" style="font-size: 14px;"></i>
                    </button>
                  </div>
                  <input
                    v-model="ref.fullname"
                    type="text"
                    placeholder="Nom du contact"
                    class="w-full font-love text-sm bg-white border border-rose-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 px-4 py-2.5 placeholder:text-gray-400 transition-all"
                  />
                  <input
                    v-model="ref.phone"
                    type="tel"
                    placeholder="Téléphone"
                    class="w-full font-love text-sm bg-white border border-rose-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 px-4 py-2.5 placeholder:text-gray-400 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 8: Galerie -->
        <div v-else-if="nounuStore.state.StepProfil === 8" class="space-y-5">
          <div class="text-center mb-6">
            <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-100 text-rose-400 mb-3">
              <i class="ri ri-image-line" style="font-size: 12px;"></i>
              <span class="font-love text-[10px] font-bold uppercase tracking-wider">Étape 8</span>
            </div>
            <h2 class="font-anton text-2xl text-gray-900 mb-1">Galerie photos</h2>
            <p class="font-love text-sm text-gray-500">Ajoutez des photos de votre travail.</p>
          </div>

          <div class="bg-white rounded-3xl p-6 shadow-sm border border-rose-50">
            <div class="grid grid-cols-3 gap-3">
              <div
                v-for="(img, i) in galleryPreviews"
                :key="i"
                class="relative aspect-square rounded-2xl overflow-hidden group border border-rose-100 shadow-sm"
              >
                <img :src="img" alt="Gallery" class="h-full w-full object-cover" />
                <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>
                <button
                  type="button"
                  @click="removeGalleryImage(i)"
                  class="absolute top-1.5 right-1.5 h-7 w-7 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <i class="ri ri-close-line" style="font-size: 14px;"></i>
                </button>
              </div>
              <button
                type="button"
                @click="triggerGalleryInput"
                class="aspect-square rounded-2xl border-2 border-dashed border-rose-200 hover:border-rose-400 hover:bg-rose-50/40 transition-all flex flex-col items-center justify-center gap-1.5 text-gray-400 hover:text-rose-400"
              >
                <div class="h-10 w-10 rounded-full bg-rose-50 flex items-center justify-center">
                  <i class="ri ri-add-line" style="font-size: 22px;"></i>
                </div>
                <span class="font-love text-xs">Ajouter</span>
              </button>
              <input ref="galleryInputRef" type="file" accept="image/*" multiple class="hidden" @change="handleGalleryUpload" />
            </div>
            <p class="font-love text-xs text-gray-400 mt-4 text-center">
              {{ galleryPreviews.length }} photo(s) ajoutée(s)
            </p>
          </div>
        </div>

    <!-- Error display -->
    <div
      v-if="nounuStore.state.in_error.message"
      class="mt-4 rounded-2xl bg-red-50 border border-red-100 px-4 py-3 flex items-center gap-3"
    >
      <i class="ri ri-error-warning-line text-red-500" style="font-size: 20px;"></i>
      <p class="font-love text-sm text-red-700">{{ nounuStore.state.in_error.message }}</p>
    </div>
  </ProfileSetupLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ProfileSetupLayout from '@/layouts/ProfileSetupLayout.vue';
import { useProfiNounulStore } from '@/stores/authProfilNounuStore';
import { useAuthStore } from '@/stores/auth.store';
import { URL_API_ROUTE } from '@/routes/_requests/index.request';
import axios from 'axios';
import { useAllSettings } from '@/features/settings/hooks/useSettings';
import { StorageUtils } from '@/utils/store.utils';

const router = useRouter();
const nounuStore = useProfiNounulStore();
const authStore = useAuthStore();

// TanStack Query for settings
const { data: settingsData } = useAllSettings();

const totalSteps = 8;
const loading = ref(false);
const imagePreview = ref('');
const galleryPreviews = ref<string[]>([]);
const fileInputRef = ref<HTMLInputElement | null>(null);
const galleryInputRef = ref<HTMLInputElement | null>(null);
const verificationInputRef = ref<HTMLInputElement | null>(null);
const verificationFiles = ref(false);
const addressInput = ref('');

const ageRanges = ref<string[]>([]);
const languages = ref<string[]>([]);
const competences = ref<string[]>([]);
const timeSlots = ref<string[]>([]);
const workZones = ref<string[]>([]);
const certifications = ref<any[]>([]);

const applyFallbackParameters = () => {
  if (ageRanges.value.length === 0) ageRanges.value = ['0-1 an', '1-3 ans', '3-6 ans', '6-12 ans'];
  if (competences.value.length === 0) competences.value = ['Premiers secours', 'Aide aux devoirs', 'Activités manuelles', 'Musique', 'Sport', 'Langues étrangères', 'Cuisine'];
  if (languages.value.length === 0) languages.value = ['Français', 'Anglais', 'Dioula', 'Bété', 'Baoulé'];
  if (workZones.value.length === 0) workZones.value = ['Cocody', 'Plateau', 'Yopougon', 'Marcory', 'Treichville', 'Abobo', 'Adjamé', 'Koumassi'];
  if (timeSlots.value.length === 0) timeSlots.value = ['Plein temps', 'Demi-journée', 'Soirée', 'Nuit', 'Weekend'];
  if (certifications.value.length === 0) certifications.value = ['CAP Petite Enfance', 'Auxiliaire de puériculture', 'Diplôme d\'État d\'éducateur', 'Formation premiers secours', 'Aucune certification'];
};

const fetchParameters = async () => {
  try {
    const data = settingsData.value;
    const items = Array.isArray(data) ? data : (data?.data ?? []);
    const bySlug = (slug: string) => items.filter((p: any) => p?.typeParameter?.slug === slug).map((p: any) => p.name);
    ageRanges.value = bySlug('tranche_age');
    competences.value = bySlug('competence');
    languages.value = bySlug('langue');
    workZones.value = bySlug('zone');
    timeSlots.value = bySlug('horaire');
    certifications.value = bySlug('certifications');
  } catch (e) {
    console.error('[NounuProfilePage] Failed to fetch parameters:', e);
  } finally {
    applyFallbackParameters();
  }
};

onMounted(async () => {
  fetchParameters();

  // Pré-remplir le fullname depuis l'inscription si pas en mode édition
  if (!authStore.isUpdateProfil && !nounuStore.state.InformationPersonnelle.fullname) {
    const storedFullname = await StorageUtils().getStore('nUserFullname');
    if (storedFullname?.value) {
      nounuStore.state.InformationPersonnelle.fullname = storedFullname.value;
    }
  }
});

const quitWizard = async () => {
  // In edit mode, just close and return to profile without clearing data
  if (authStore.isUpdateProfil) {
    authStore.setUpdateProfil(false, '');
    nounuStore.state.StepProfil = 1;
    router.push({ name: 'PROFIL' });
    return;
  }

  // In creation mode, clear profile data from local storage
  const storageUtils = StorageUtils();
  await storageUtils.removeStore('nProfil_1_Id');
  await storageUtils.removeStore('nType_Profil');
  await storageUtils.clearStore()
  
  
  // Reset store state
  authStore.setUpdateProfil(false, '');
  nounuStore.state.StepProfil = 1;
  
  // Reset form data
  nounuStore.state.InformationPersonnelle = {
    fullname: '',
    age: '',
    phone: '',
    address: [],
    image_profil: null,
  };
  nounuStore.state.ExperienceEtCompetences = {
    annees_experience: '',
    tranche_age_enfants: [],
    competance_specifique: [],
    langue_parler: [],
  };
  nounuStore.state.Disponibilites = {
    horaire_disponible: [],
    urgences: [],
  };
  nounuStore.state.Tarifications = {
    tarif_horaire: '',
    tarif_mensuel: '',
    flexibilite_tarifaire: [],
  };
  nounuStore.state.VerificationEtReferences = {
    verification_confirmer: [],
    references: [],
    certifications: [],
  };
  nounuStore.state.PresentationDuPersonnel = {
    courte_biographie: '',
  };
  nounuStore.state.EvaluationEtAvis = {
    evaluation_precedentes: [],
  };
  nounuStore.state.DisponibiliteGeographique = {
    zone_de_travail: [],
  };
  nounuStore.state.Galery = {
    gallery: [],
  };
  
  // Reset preview
  nounuStore.IMAGE_PREVIEW = {};
  nounuStore.GALLERY_PREVIEW = [];
  
  // Check if user is still connected (has token and profile id)
  const token = await StorageUtils().getStore('nToken');
  const profilId = await StorageUtils().getStore('nProfil_1_Id');
  if (!token?.value || !profilId?.value) {
    router.push({ name: 'AUTH_SIGN_IN' });
  } else {
    router.push({ name: 'PROFIL' });
  }
};

// File cropper queue ----------------------------------------------------------
type CropTarget = 'profile' | 'gallery' | 'verification';

interface CropQueueItem {
  type: CropTarget;
  src: string;
  fileName: string;
  title: string;
  stencilType: 'circle' | 'rectangle';
}

const cropQueue = ref<CropQueueItem[]>([]);
const showCropper = ref(false);
const currentCropItem = computed(() => cropQueue.value[0]);
const cropImageSrc = computed(() => currentCropItem.value?.src ?? '');
const cropTitle = computed(() => currentCropItem.value?.title ?? 'Recadrer l\'image');
const cropFileName = computed(() => currentCropItem.value?.fileName ?? 'image.jpg');
const cropStencilType = computed(() => currentCropItem.value?.stencilType ?? 'rectangle');

const fileToFileList = (file: File): FileList => {
  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(file);
  return dataTransfer.files;
};

const enqueueCrop = (file: File, type: CropTarget) => {
  const item: CropQueueItem = {
    type,
    src: URL.createObjectURL(file),
    fileName: file.name,
    stencilType: type === 'profile' ? 'circle' : 'rectangle',
    title:
      type === 'profile'
        ? 'Recadrer votre photo de profil'
        : type === 'gallery'
          ? 'Recadrer la photo de la galerie'
          : 'Recadrer le document',
  };
  cropQueue.value.push(item);
  if (!showCropper.value) {
    showCropper.value = true;
  }
};

const onCropCancel = () => {
  const item = cropQueue.value.shift();
  if (item) {
    URL.revokeObjectURL(item.src);
  }
  showCropper.value = cropQueue.value.length > 0;
};

const onCrop = ({ file, dataUrl }: { file: File; dataUrl: string }) => {
  const item = cropQueue.value.shift();
  if (!item) return;

  if (item.type === 'profile') {
    nounuStore.state.InformationPersonnelle.image_profil = fileToFileList(file);
    imagePreview.value = dataUrl;
    nounuStore.IMAGE_PREVIEW = dataUrl;
  } else if (item.type === 'gallery') {
    nounuStore.state.Galery.gallery.push(file);
    galleryPreviews.value.push(dataUrl);
    nounuStore.GALLERY_PREVIEW.push(dataUrl);
  } else if (item.type === 'verification') {
    nounuStore.state.VerificationEtReferences.verification_confirmer.push(file);
    verificationFiles.value = true;
  }

  URL.revokeObjectURL(item.src);
  showCropper.value = cropQueue.value.length > 0;
};

const toggleArrayItem = (arr: any[], item: any) => {
  const idx = arr.indexOf(item);
  if (idx > -1) arr.splice(idx, 1);
  else arr.push(item);
};

const triggerFileInput = () => {
  fileInputRef.value?.click();
};

const handlePhotoUpload = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    enqueueCrop(file, 'profile');
  }
  if (target) {
    target.value = '';
  }
};

const triggerVerificationInput = () => {
  verificationInputRef.value?.click();
};

const handleVerificationUpload = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const files = target.files;
  if (files && files.length > 0) {
    nounuStore.state.VerificationEtReferences.verification_confirmer = [];
    verificationFiles.value = false;
    Array.from(files).forEach((file) => enqueueCrop(file, 'verification'));
  }
  if (target) {
    target.value = '';
  }
};

const triggerGalleryInput = () => {
  galleryInputRef.value?.click();
};

const handleGalleryUpload = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const files = target.files;
  if (files && files.length > 0) {
    Array.from(files).forEach((file) => enqueueCrop(file, 'gallery'));
  }
  if (target) {
    target.value = '';
  }
};

const removeGalleryImage = (index: number) => {
  galleryPreviews.value.splice(index, 1);
  nounuStore.GALLERY_PREVIEW.splice(index, 1);
  nounuStore.state.Galery.gallery.splice(index, 1);
};

const handleNext = async () => {
  loading.value = true;

  // Sync address input to store array
  if (addressInput.value) {
    nounuStore.state.InformationPersonnelle.address = [addressInput.value];
  }

  const stepActions: Record<number, () => void | Promise<void>> = {
    1: nounuStore.InfoPersonalNounuProfil,
    2: nounuStore.ExperienceEtCompetencesProfil,
    3: nounuStore.DisponibilitesProfil,
    4: nounuStore.TarificationsProfil,
    5: nounuStore.PresentationDuPersonnelProfil,
    6: nounuStore.DisponibiliteGeographiqueProfil,
    7: nounuStore.VerificationEtReferencesProfil,
    8: nounuStore.Galery,
  };

  const action = stepActions[nounuStore.state.StepProfil];
  if (action) await action();

  loading.value = false;
};
</script>
