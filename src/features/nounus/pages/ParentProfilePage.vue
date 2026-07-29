<template>
  <ProfileSetupLayout
    title="Profil Parent"
    :current-step="profilStore.state.stepProfil"
    :total-steps="totalSteps"
    :loading="loading"
    :is-edit-mode="authStore.isUpdateProfil"
    :show-cropper="showCropper"
    :crop-image-src="cropImageSrc"
    :crop-title="cropTitle"
    :crop-file-name="cropFileName"
    :crop-stencil-type="cropStencilType"
    @close="quitWizard"
    @back="profilStore.previousStep"
    @next="handleNext"
    @crop-cancel="onCropCancel"
    @crop="onCrop"
  >
        <!-- Step 1: Informations personnelles -->
        <div v-if="profilStore.state.stepProfil === 1" class="space-y-5">
          <div class="text-center mb-6">
            <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-100 text-rose-400 mb-3">
              <i class="ri ri-user-3-line" style="font-size: 12px;"></i>
              <span class="font-love text-[10px] font-bold uppercase tracking-wider">Étape 1</span>
            </div>
            <h2 class="font-anton text-2xl text-gray-900 mb-1">Informations personnelles</h2>
            <p class="font-love text-sm text-gray-500">Présentez-vous aux nounous.</p>
          </div>

          <div class="bg-white rounded-3xl p-6 shadow-sm border border-rose-50 flex flex-col items-center gap-3">
            <div class="relative">
              <div class="h-28 w-28 rounded-3xl border-2 border-rose-200 overflow-hidden bg-rose-50 shadow-sm">
                <img v-if="imagePreview" :src="imagePreview" alt="Profile" class="h-full w-full object-cover" />
                <div v-else class="h-full w-full flex items-center justify-center">
                  <i class="ri ri-parent-line text-rose-200" style="font-size: 40px;"></i>
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
                  v-model="profilStore.state.InformationPersonnelle.fullname"
                  type="text"
                  placeholder="Jeanne Dupont"
                  class="w-full font-love text-sm bg-rose-50/40 border border-rose-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 pl-11 pr-4 py-3.5 placeholder:text-gray-400 transition-all"
                />
              </div>
            </div>
            <div>
              <label class="block font-love text-xs font-medium text-gray-700 mb-1.5">Adresse email</label>
              <div class="relative">
                <i class="ri ri-mail-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" style="font-size: 16px;"></i>
                <input
                  v-model="profilStore.state.InformationPersonnelle.adresse_mail"
                  type="email"
                  placeholder="jeanne.dupont@email.com"
                  class="w-full font-love text-sm bg-rose-50/40 border border-rose-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 pl-11 pr-4 py-3.5 placeholder:text-gray-400 transition-all"
                />
              </div>
            </div>
            <div>
              <label class="block font-love text-xs font-medium text-gray-700 mb-1.5">Téléphone</label>
              <div class="relative">
                <i class="ri ri-phone-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" style="font-size: 16px;"></i>
                <input
                  v-model="profilStore.state.InformationPersonnelle.phone"
                  type="tel"
                  placeholder="+225 07 00 00 00"
                  class="w-full font-love text-sm bg-rose-50/40 border border-rose-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 pl-11 pr-4 py-3.5 placeholder:text-gray-400 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Step 2: Informations sur les enfants -->
        <div v-else-if="profilStore.state.stepProfil === 2" class="space-y-5">
          <div class="text-center mb-6">
            <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-100 text-rose-400 mb-3">
              <i class="ri ri-emotion-happy-line" style="font-size: 12px;"></i>
              <span class="font-love text-[10px] font-bold uppercase tracking-wider">Étape 2</span>
            </div>
            <h2 class="font-anton text-2xl text-gray-900 mb-1">Vos enfants</h2>
            <p class="font-love text-sm text-gray-500">Parlez-nous de vos enfants.</p>
          </div>

          <div class="bg-white rounded-3xl p-6 shadow-sm border border-rose-50 space-y-5">
            <div>
              <label class="block font-love text-xs font-medium text-gray-700 mb-1.5">Nombre d'enfants</label>
              <div class="relative">
                <i class="ri ri-parent-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" style="font-size: 16px;"></i>
                <input
                  v-model="profilStore.state.InformationSurLesEnfants.number_of_children"
                  type="number"
                  placeholder="2"
                  class="w-full font-love text-sm bg-rose-50/40 border border-rose-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 pl-11 pr-4 py-3.5 placeholder:text-gray-400 transition-all"
                />
              </div>
            </div>

            <div>
              <label class="flex items-center gap-1.5 font-love text-xs font-medium text-gray-700 mb-2.5">
                <i class="ri ri-heart-line text-rose-400" style="font-size: 14px;"></i>
                Besoins spécifiques
              </label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="item in specificNeeds"
                  :key="item.id || item.name"
                  type="button"
                  @click="toggleArrayItem(profilStore.state.InformationSurLesEnfants.besions_specifiques, item.name)"
                  :class="[
                    'px-4 py-2.5 rounded-2xl font-love text-xs font-medium transition-all border flex items-center gap-1.5',
                    profilStore.state.InformationSurLesEnfants.besions_specifiques.includes(item.name)
                      ? 'bg-rose-400 text-white border-rose-400 shadow-sm shadow-rose-200'
                      : 'bg-white text-gray-600 border-rose-100 hover:border-rose-300 hover:bg-rose-50/40'
                  ]"
                >
                  <i v-if="profilStore.state.InformationSurLesEnfants.besions_specifiques.includes(item.name)" class="ri ri-check-line" style="font-size: 12px;"></i>
                  {{ item.name }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 3: Services recherchés -->
        <div v-else-if="profilStore.state.stepProfil === 3" class="space-y-5">
          <div class="text-center mb-6">
            <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-100 text-rose-400 mb-3">
              <i class="ri ri-service-line" style="font-size: 12px;"></i>
              <span class="font-love text-[10px] font-bold uppercase tracking-wider">Étape 3</span>
            </div>
            <h2 class="font-anton text-2xl text-gray-900 mb-1">Services recherchés</h2>
            <p class="font-love text-sm text-gray-500">Quels services vous intéresse ?</p>
          </div>

          <div class="bg-white rounded-3xl p-6 shadow-sm border border-rose-50 space-y-5">
            <div>
              <label class="flex items-center gap-1.5 font-love text-xs font-medium text-gray-700 mb-2.5">
                <i class="ri ri-service-line text-rose-400" style="font-size: 14px;"></i>
                Type de services
              </label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="item in typeServices"
                  :key="item.id || item.name"
                  type="button"
                  @click="toggleArrayItem(profilStore.state.ServicesRecherches.type_services, item.name)"
                  :class="[
                    'px-4 py-2.5 rounded-2xl font-love text-xs font-medium transition-all border flex items-center gap-1.5',
                    profilStore.state.ServicesRecherches.type_services.includes(item.name)
                      ? 'bg-rose-400 text-white border-rose-400 shadow-sm shadow-rose-200'
                      : 'bg-white text-gray-600 border-rose-100 hover:border-rose-300 hover:bg-rose-50/40'
                  ]"
                >
                  <i v-if="profilStore.state.ServicesRecherches.type_services.includes(item.name)" class="ri ri-check-line" style="font-size: 12px;"></i>
                  {{ item.name }}
                </button>
              </div>
            </div>

            <div>
              <label class="flex items-center gap-1.5 font-love text-xs font-medium text-gray-700 mb-2.5">
                <i class="ri ri-parent-line text-rose-400" style="font-size: 14px;"></i>
                Garde d'enfants
              </label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="item in childCareTypes"
                  :key="item.id || item.name"
                  type="button"
                  @click="toggleArrayItem(profilStore.state.ServicesRecherches.garde_enfants, item.name)"
                  :class="[
                    'px-4 py-2.5 rounded-2xl font-love text-xs font-medium transition-all border flex items-center gap-1.5',
                    profilStore.state.ServicesRecherches.garde_enfants.includes(item.name)
                      ? 'bg-rose-400 text-white border-rose-400 shadow-sm shadow-rose-200'
                      : 'bg-white text-gray-600 border-rose-100 hover:border-rose-300 hover:bg-rose-50/40'
                  ]"
                >
                  <i v-if="profilStore.state.ServicesRecherches.garde_enfants.includes(item.name)" class="ri ri-check-line" style="font-size: 12px;"></i>
                  {{ item.name }}
                </button>
              </div>
            </div>

            <div>
              <label class="flex items-center gap-1.5 font-love text-xs font-medium text-gray-700 mb-2.5">
                <i class="ri ri-home-gear-line text-rose-400" style="font-size: 14px;"></i>
                Aide ménagère
              </label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="item in housekeeperTypes"
                  :key="item.id || item.name"
                  type="button"
                  @click="toggleArrayItem(profilStore.state.ServicesRecherches.aide_menagere, item.name)"
                  :class="[
                    'px-4 py-2.5 rounded-2xl font-love text-xs font-medium transition-all border flex items-center gap-1.5',
                    profilStore.state.ServicesRecherches.aide_menagere.includes(item.name)
                      ? 'bg-rose-400 text-white border-rose-400 shadow-sm shadow-rose-200'
                      : 'bg-white text-gray-600 border-rose-100 hover:border-rose-300 hover:bg-rose-50/40'
                  ]"
                >
                  <i v-if="profilStore.state.ServicesRecherches.aide_menagere.includes(item.name)" class="ri ri-check-line" style="font-size: 12px;"></i>
                  {{ item.name }}
                </button>
              </div>
            </div>

            <div>
              <label class="flex items-center gap-1.5 font-love text-xs font-medium text-gray-700 mb-2.5">
                <i class="ri ri-repeat-line text-rose-400" style="font-size: 14px;"></i>
                Fréquence des services
              </label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="item in serviceFrequencies"
                  :key="item.id || item.name"
                  type="button"
                  @click="toggleArrayItem(profilStore.state.ServicesRecherches.frequence_des_services, item.name)"
                  :class="[
                    'px-4 py-2.5 rounded-2xl font-love text-xs font-medium transition-all border flex items-center gap-1.5',
                    profilStore.state.ServicesRecherches.frequence_des_services.includes(item.name)
                      ? 'bg-rose-400 text-white border-rose-400 shadow-sm shadow-rose-200'
                      : 'bg-white text-gray-600 border-rose-100 hover:border-rose-300 hover:bg-rose-50/40'
                  ]"
                >
                  <i v-if="profilStore.state.ServicesRecherches.frequence_des_services.includes(item.name)" class="ri ri-check-line" style="font-size: 12px;"></i>
                  {{ item.name }}
                </button>
              </div>
            </div>

            <div>
              <label class="flex items-center gap-1.5 font-love text-xs font-medium text-gray-700 mb-2.5">
                <i class="ri ri-time-line text-rose-400" style="font-size: 14px;"></i>
                Horaires souhaités
              </label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="item in desiredTimes"
                  :key="item.id || item.name"
                  type="button"
                  @click="toggleArrayItem(profilStore.state.ServicesRecherches.horaire_souhaites, item.name)"
                  :class="[
                    'px-4 py-2.5 rounded-2xl font-love text-xs font-medium transition-all border flex items-center gap-1.5',
                    profilStore.state.ServicesRecherches.horaire_souhaites.includes(item.name)
                      ? 'bg-rose-400 text-white border-rose-400 shadow-sm shadow-rose-200'
                      : 'bg-white text-gray-600 border-rose-100 hover:border-rose-300 hover:bg-rose-50/40'
                  ]"
                >
                  <i v-if="profilStore.state.ServicesRecherches.horaire_souhaites.includes(item.name)" class="ri ri-check-line" style="font-size: 12px;"></i>
                  {{ item.name }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 4: Localisation -->
        <div v-else-if="profilStore.state.stepProfil === 4" class="space-y-5">
          <div class="text-center mb-6">
            <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-100 text-rose-400 mb-3">
              <i class="ri ri-map-pin-line" style="font-size: 12px;"></i>
              <span class="font-love text-[10px] font-bold uppercase tracking-wider">Étape 4</span>
            </div>
            <h2 class="font-anton text-2xl text-gray-900 mb-1">Localisation</h2>
            <p class="font-love text-sm text-gray-500">Où cherchez-vous une nounou ?</p>
          </div>

          <div class="bg-white rounded-3xl p-6 shadow-sm border border-rose-50 space-y-5">
            <div>
              <label class="flex items-center gap-1.5 font-love text-xs font-medium text-gray-700 mb-2.5">
                <i class="ri ri-home-4-line text-rose-400" style="font-size: 14px;"></i>
                Adresse
              </label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="item in addresses"
                  :key="item.id || item.name"
                  type="button"
                  @click="toggleArrayItem(profilStore.state.Localizations.adress, item.name)"
                  :class="[
                    'px-4 py-2.5 rounded-2xl font-love text-xs font-medium transition-all border flex items-center gap-1.5',
                    profilStore.state.Localizations.adress.includes(item.name)
                      ? 'bg-rose-400 text-white border-rose-400 shadow-sm shadow-rose-200'
                      : 'bg-white text-gray-600 border-rose-100 hover:border-rose-300 hover:bg-rose-50/40'
                  ]"
                >
                  <i v-if="profilStore.state.Localizations.adress.includes(item.name)" class="ri ri-check-line" style="font-size: 12px;"></i>
                  {{ item.name }}
                </button>
              </div>
            </div>

            <div>
              <label class="flex items-center gap-1.5 font-love text-xs font-medium text-gray-700 mb-2.5">
                <i class="ri ri-map-pin-2-line text-rose-400" style="font-size: 14px;"></i>
                Zones géographiques du prestataire
              </label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="item in zoneGeographies"
                  :key="item.id || item.name"
                  type="button"
                  @click="toggleArrayItem(profilStore.state.Localizations.zone_geographique_prestataire, item.name)"
                  :class="[
                    'px-4 py-2.5 rounded-2xl font-love text-xs font-medium transition-all border flex items-center gap-1.5',
                    profilStore.state.Localizations.zone_geographique_prestataire.includes(item.name)
                      ? 'bg-rose-400 text-white border-rose-400 shadow-sm shadow-rose-200'
                      : 'bg-white text-gray-600 border-rose-100 hover:border-rose-300 hover:bg-rose-50/40'
                  ]"
                >
                  <i v-if="profilStore.state.Localizations.zone_geographique_prestataire.includes(item.name)" class="ri ri-check-line" style="font-size: 12px;"></i>
                  {{ item.name }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 5: Budget -->
        <div v-else-if="profilStore.state.stepProfil === 5" class="space-y-5">
          <div class="text-center mb-6">
            <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-100 text-rose-400 mb-3">
              <i class="ri ri-money-cny-circle-line" style="font-size: 12px;"></i>
              <span class="font-love text-[10px] font-bold uppercase tracking-wider">Étape 5</span>
            </div>
            <h2 class="font-anton text-2xl text-gray-900 mb-1">Budget</h2>
            <p class="font-love text-sm text-gray-500">Quel est votre budget estimé ?</p>
          </div>

          <div class="bg-white rounded-3xl p-6 shadow-sm border border-rose-50 space-y-5">
            <div>
              <label class="block font-love text-xs font-medium text-gray-700 mb-1.5">Budget estimé (FCFA)</label>
              <div class="relative">
                <i class="ri ri-money-cny-circle-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-300" style="font-size: 16px;"></i>
                <input
                  v-model="profilStore.state.Tarifications.budget_estimated"
                  type="number"
                  placeholder="50000"
                  class="w-full font-love text-sm bg-rose-50/40 border border-rose-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 pl-11 pr-4 py-3.5 placeholder:text-gray-400 transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Step 6: Préférences spécifiques -->
        <div v-else-if="profilStore.state.stepProfil === 6" class="space-y-5">
          <div class="text-center mb-6">
            <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-100 text-rose-400 mb-3">
              <i class="ri ri-star-smile-line" style="font-size: 12px;"></i>
              <span class="font-love text-[10px] font-bold uppercase tracking-wider">Étape 6</span>
            </div>
            <h2 class="font-anton text-2xl text-gray-900 mb-1">Préférences spécifiques</h2>
            <p class="font-love text-sm text-gray-500">Vos critères de recherche.</p>
          </div>

          <div class="bg-white rounded-3xl p-6 shadow-sm border border-rose-50 space-y-5">
            <div>
              <label class="flex items-center gap-1.5 font-love text-xs font-medium text-gray-700 mb-2.5">
                <i class="ri ri-star-smile-line text-rose-400" style="font-size: 14px;"></i>
                Compétences spécifiques recherchées
              </label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="item in specificSkills"
                  :key="item.id || item.name"
                  type="button"
                  @click="toggleArrayItem(profilStore.state.PreferencePourLesSpecifiques.competance_specifique, item.name)"
                  :class="[
                    'px-4 py-2.5 rounded-2xl font-love text-xs font-medium transition-all border flex items-center gap-1.5',
                    profilStore.state.PreferencePourLesSpecifiques.competance_specifique.includes(item.name)
                      ? 'bg-rose-400 text-white border-rose-400 shadow-sm shadow-rose-200'
                      : 'bg-white text-gray-600 border-rose-100 hover:border-rose-300 hover:bg-rose-50/40'
                  ]"
                >
                  <i v-if="profilStore.state.PreferencePourLesSpecifiques.competance_specifique.includes(item.name)" class="ri ri-check-line" style="font-size: 12px;"></i>
                  {{ item.name }}
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
                  v-for="item in languages"
                  :key="item.id || item.name"
                  type="button"
                  @click="toggleArrayItem(profilStore.state.PreferencePourLesSpecifiques.langue_parler, item.name)"
                  :class="[
                    'px-4 py-2.5 rounded-2xl font-love text-xs font-medium transition-all border flex items-center gap-1.5',
                    profilStore.state.PreferencePourLesSpecifiques.langue_parler.includes(item.name)
                      ? 'bg-rose-400 text-white border-rose-400 shadow-sm shadow-rose-200'
                      : 'bg-white text-gray-600 border-rose-100 hover:border-rose-300 hover:bg-rose-50/40'
                  ]"
                >
                  <i v-if="profilStore.state.PreferencePourLesSpecifiques.langue_parler.includes(item.name)" class="ri ri-check-line" style="font-size: 12px;"></i>
                  {{ item.name }}
                </button>
              </div>
            </div>

            <div>
              <label class="flex items-center gap-1.5 font-love text-xs font-medium text-gray-700 mb-2.5">
                <i class="ri ri-flashlight-line text-rose-400" style="font-size: 14px;"></i>
                Disponibilité du prestataire
              </label>
              <div class="flex flex-wrap gap-2">
                <button
                  v-for="item in providerAvailabilities"
                  :key="item.id || item.name"
                  type="button"
                  @click="toggleArrayItem(profilStore.state.PreferencePourLesSpecifiques.disponibility_du_prestataire, item.name)"
                  :class="[
                    'px-4 py-2.5 rounded-2xl font-love text-xs font-medium transition-all border flex items-center gap-1.5',
                    profilStore.state.PreferencePourLesSpecifiques.disponibility_du_prestataire.includes(item.name)
                      ? 'bg-rose-400 text-white border-rose-400 shadow-sm shadow-rose-200'
                      : 'bg-white text-gray-600 border-rose-100 hover:border-rose-300 hover:bg-rose-50/40'
                  ]"
                >
                  <i v-if="profilStore.state.PreferencePourLesSpecifiques.disponibility_du_prestataire.includes(item.name)" class="ri ri-check-line" style="font-size: 12px;"></i>
                  {{ item.name }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 7: Modalités de paiement -->
        <div v-else-if="profilStore.state.stepProfil === 7" class="space-y-5">
          <div class="text-center mb-6">
            <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-100 text-rose-400 mb-3">
              <i class="ri ri-wallet-line" style="font-size: 12px;"></i>
              <span class="font-love text-[10px] font-bold uppercase tracking-wider">Étape 7</span>
            </div>
            <h2 class="font-anton text-2xl text-gray-900 mb-1">Modalités de paiement</h2>
            <p class="font-love text-sm text-gray-500">Comment souhaitez-vous payer ?</p>
          </div>

          <div class="bg-white rounded-3xl p-6 shadow-sm border border-rose-50">
            <label class="flex items-center gap-1.5 font-love text-xs font-medium text-gray-700 mb-2.5">
              <i class="ri ri-wallet-line text-rose-400" style="font-size: 14px;"></i>
              Modes de paiement
            </label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="item in paymentTerms"
                :key="item.id || item.name"
                type="button"
                @click="toggleArrayItem(profilStore.state.ModalitesDePaiement.mode_de_paiement, item.name)"
                :class="[
                  'px-4 py-2.5 rounded-2xl font-love text-xs font-medium transition-all border flex items-center gap-1.5',
                  profilStore.state.ModalitesDePaiement.mode_de_paiement.includes(item.name)
                    ? 'bg-rose-400 text-white border-rose-400 shadow-sm shadow-rose-200'
                    : 'bg-white text-gray-600 border-rose-100 hover:border-rose-300 hover:bg-rose-50/40'
                ]"
              >
                <i v-if="profilStore.state.ModalitesDePaiement.mode_de_paiement.includes(item.name)" class="ri ri-check-line" style="font-size: 12px;"></i>
                {{ item.name }}
              </button>
            </div>
          </div>
        </div>

        <!-- Step 8: Tâches spécifiques -->
        <div v-else-if="profilStore.state.stepProfil === 8" class="space-y-5">
          <div class="text-center mb-6">
            <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-100 text-rose-400 mb-3">
              <i class="ri ri-task-line" style="font-size: 12px;"></i>
              <span class="font-love text-[10px] font-bold uppercase tracking-wider">Étape 8</span>
            </div>
            <h2 class="font-anton text-2xl text-gray-900 mb-1">Tâches spécifiques</h2>
            <p class="font-love text-sm text-gray-500">Quelles tâches la nounou devra-t-elle accomplir ?</p>
          </div>

          <div class="bg-white rounded-3xl p-6 shadow-sm border border-rose-50">
            <label class="flex items-center gap-1.5 font-love text-xs font-medium text-gray-700 mb-2.5">
              <i class="ri ri-task-line text-rose-400" style="font-size: 14px;"></i>
              Tâches
            </label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="item in taches"
                :key="item.id || item.name"
                type="button"
                @click="toggleArrayItem(profilStore.state.TachesSpecifiques.taches, item.name)"
                :class="[
                  'px-4 py-2.5 rounded-2xl font-love text-xs font-medium transition-all border flex items-center gap-1.5',
                  profilStore.state.TachesSpecifiques.taches.includes(item.name)
                    ? 'bg-rose-400 text-white border-rose-400 shadow-sm shadow-rose-200'
                    : 'bg-white text-gray-600 border-rose-100 hover:border-rose-300 hover:bg-rose-50/40'
                ]"
              >
                <i v-if="profilStore.state.TachesSpecifiques.taches.includes(item.name)" class="ri ri-check-line" style="font-size: 12px;"></i>
                {{ item.name }}
              </button>
            </div>
          </div>
        </div>

        <!-- Step 9: Critères de sélection -->
        <div v-else-if="profilStore.state.stepProfil === 9" class="space-y-5">
          <div class="text-center mb-6">
            <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-100 text-rose-400 mb-3">
              <i class="ri ri-filter-3-line" style="font-size: 12px;"></i>
              <span class="font-love text-[10px] font-bold uppercase tracking-wider">Étape 9</span>
            </div>
            <h2 class="font-anton text-2xl text-gray-900 mb-1">Critères de sélection</h2>
            <p class="font-love text-sm text-gray-500">Quels critères supplémentaires recherchez-vous ?</p>
          </div>

          <div class="bg-white rounded-3xl p-6 shadow-sm border border-rose-50">
            <label class="flex items-center gap-1.5 font-love text-xs font-medium text-gray-700 mb-2.5">
              <i class="ri ri-filter-3-line text-rose-400" style="font-size: 14px;"></i>
              Critères
            </label>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="item in criteresSelections"
                :key="item.id || item.name"
                type="button"
                @click="toggleArrayItem(profilStore.state.CriteresSelection.criteres_selections, item.name)"
                :class="[
                  'px-4 py-2.5 rounded-2xl font-love text-xs font-medium transition-all border flex items-center gap-1.5',
                  profilStore.state.CriteresSelection.criteres_selections.includes(item.name)
                    ? 'bg-rose-400 text-white border-rose-400 shadow-sm shadow-rose-200'
                    : 'bg-white text-gray-600 border-rose-100 hover:border-rose-300 hover:bg-rose-50/40'
                ]"
              >
                <i v-if="profilStore.state.CriteresSelection.criteres_selections.includes(item.name)" class="ri ri-check-line" style="font-size: 12px;"></i>
                {{ item.name }}
              </button>
            </div>
          </div>
        </div>

        <!-- Step 10: Autres informations -->
        <div v-else-if="profilStore.state.stepProfil === 10" class="space-y-5">
          <div class="text-center mb-6">
            <div class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-rose-100 text-rose-400 mb-3">
              <i class="ri ri-quote-text" style="font-size: 12px;"></i>
              <span class="font-love text-[10px] font-bold uppercase tracking-wider">Étape 10</span>
            </div>
            <h2 class="font-anton text-2xl text-gray-900 mb-1">Informations complémentaires</h2>
            <p class="font-love text-sm text-gray-500">Ajoutez toute information utile.</p>
          </div>

          <div class="bg-white rounded-3xl p-6 shadow-sm border border-rose-50">
            <label class="flex items-center gap-1.5 font-love text-xs font-medium text-gray-700 mb-1.5">
              <i class="ri ri-quote-text text-rose-400" style="font-size: 14px;"></i>
              Informations complémentaires
            </label>
            <textarea
              v-model="profilStore.state.AutreInformations.informations_complementaires"
              rows="6"
              placeholder="Décrivez vos besoins, vos attentes, vos contraintes..."
              class="w-full font-love text-sm bg-rose-50/40 border border-rose-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-rose-200 focus:border-rose-300 px-4 py-3.5 placeholder:text-gray-400 resize-none transition-all"
            ></textarea>
            <div class="flex items-center justify-between mt-2">
              <p class="font-love text-xs text-gray-400">
                {{ profilStore.state.AutreInformations.informations_complementaires.length }} / 1000 caractères
              </p>
              <div class="h-1 w-24 bg-gray-100 rounded-full overflow-hidden">
                <div
                  class="h-full bg-rose-400 rounded-full transition-all"
                  :style="{ width: `${Math.min((profilStore.state.AutreInformations.informations_complementaires.length / 1000) * 100, 100)}%` }"
                ></div>
              </div>
            </div>
          </div>
        </div>

    <!-- Error display -->
    <div
      v-if="profilStore.state.in_error.message"
      class="mt-4 rounded-2xl bg-red-50 border border-red-100 px-4 py-3 flex items-center gap-3"
    >
      <i class="ri ri-error-warning-line text-red-500" style="font-size: 20px;"></i>
      <p class="font-love text-sm text-red-700">{{ profilStore.state.in_error.message }}</p>
    </div>
  </ProfileSetupLayout>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import ProfileSetupLayout from '@/layouts/ProfileSetupLayout.vue';
import { useProfilStore } from '@/stores/authProfilStore';
import { useProfiNounulStore } from '@/stores/authProfilNounuStore';
import { useAuthStore } from '@/stores/auth.store';
import { URL_API_ROUTE } from '@/routes/_requests/index.request';
import axios from 'axios';
import { useAllSettings } from '@/features/settings/hooks/useSettings';
import { StorageUtils } from '@/utils/store.utils';

const router = useRouter();
const profilStore = useProfilStore();
const nounuStore = useProfiNounulStore();
const authStore = useAuthStore();

// TanStack Query for settings
const { data: settingsData } = useAllSettings();

const totalSteps = 10;
const loading = ref(false);
const imagePreview = ref('');
const fileInputRef = ref<HTMLInputElement | null>(null);

// Parameters from API
const specificNeeds = ref<any[]>([]);
const typeServices = ref<any[]>([]);
const childCareTypes = ref<any[]>([]);
const housekeeperTypes = ref<any[]>([]);
const serviceFrequencies = ref<any[]>([]);
const desiredTimes = ref<any[]>([]);
const addresses = ref<any[]>([]);
const zoneGeographies = ref<any[]>([]);
const specificSkills = ref<any[]>([]);
const languages = ref<any[]>([]);
const providerAvailabilities = ref<any[]>([]);
const paymentTerms = ref<any[]>([]);
const taches = ref<any[]>([]);
const criteresSelections = ref<any[]>([]);

const fetchParameters = async () => {
  try {
    const data = settingsData.value;
    const items = Array.isArray(data) ? data : (data?.data ?? []);
    const bySlug = (slug: string) => items.filter((p: any) => p?.typeParameter?.slug === slug);
    specificNeeds.value = bySlug('besoins');
    typeServices.value = bySlug('type_service');
    childCareTypes.value = bySlug('garde');
    housekeeperTypes.value = bySlug('aide_menagere');
    serviceFrequencies.value = bySlug('frequence');
    desiredTimes.value = bySlug('horaire_souhaite');
    addresses.value = bySlug('adresse');
    zoneGeographies.value = bySlug('zone_geo');
    specificSkills.value = bySlug('competence');
    languages.value = bySlug('langue');
    providerAvailabilities.value = bySlug('disponibilite');
    paymentTerms.value = bySlug('mode_paiement');
    taches.value = bySlug('taches');
    criteresSelections.value = bySlug('criteres_selection');
  } catch (e) {
    console.error('[ParentProfilePage] Failed to fetch parameters:', e);
  } finally {
    applyFallbackParameters();
  }
};

const applyFallbackParameters = () => {
  if (specificNeeds.value.length === 0) specificNeeds.value = [
    { name: 'Allergies alimentaires' },
    { name: 'Régime spécial' },
    { name: 'Handicap' },
    { name: 'Accompagnement scolaire' },
    { name: 'Aucun besoin spécial' },
  ];
  if (childCareTypes.value.length === 0) childCareTypes.value = [
    { name: 'Garde à domicile' },
    { name: 'Garde partagée' },
    { name: 'Garde périscolaire' },
    { name: 'Garde occasionnelle' },
    { name: 'Sortie d\'école' },
  ];
  if (housekeeperTypes.value.length === 0) housekeeperTypes.value = [
    { name: 'Ménage complet' },
    { name: 'Repassage' },
    { name: 'Vaisselle' },
    { name: 'Rangement' },
    { name: 'Nettoyage vitres' },
    { name: 'Grand ménage' },
  ];
  if (serviceFrequencies.value.length === 0) serviceFrequencies.value = [
    { name: 'Quotidien' },
    { name: 'Hebdomadaire' },
    { name: 'Mensuel' },
    { name: 'Occasionnel' },
  ];
  if (desiredTimes.value.length === 0) desiredTimes.value = [
    { name: 'Matin (6h-12h)' },
    { name: 'Après-midi (12h-18h)' },
    { name: 'Soirée (18h-22h)' },
    { name: 'Nuit (22h-6h)' },
    { name: 'Journée complète' },
    { name: 'Weekend' },
  ];
  if (addresses.value.length === 0) addresses.value = [
    { name: 'Cocody' },
    { name: 'Plateau' },
    { name: 'Yopougon' },
    { name: 'Marcory' },
    { name: 'Treichville' },
    { name: 'Abobo' },
    { name: 'Adjamé' },
    { name: 'Koumassi' },
  ];
  if (zoneGeographies.value.length === 0) zoneGeographies.value = [
    { name: 'Abidjan' },
    { name: 'Bouaké' },
    { name: 'Yamoussoukro' },
    { name: 'San-Pédro' },
    { name: 'Korhogo' },
  ];
  if (specificSkills.value.length === 0) specificSkills.value = [
    { name: 'Premiers secours' },
    { name: 'Aide aux devoirs' },
    { name: 'Activités manuelles' },
    { name: 'Musique' },
    { name: 'Sport' },
    { name: 'Langues étrangères' },
    { name: 'Cuisine' },
  ];
  if (languages.value.length === 0) languages.value = [
    { name: 'Français' },
    { name: 'Anglais' },
    { name: 'Dioula' },
    { name: 'Bété' },
    { name: 'Baoulé' },
  ];
  if (providerAvailabilities.value.length === 0) providerAvailabilities.value = [
    { name: 'Immédiate' },
    { name: 'Sous 1 semaine' },
    { name: 'Sous 2 semaines' },
    { name: 'Sous 1 mois' },
    { name: 'À convenir' },
  ];
  if (paymentTerms.value.length === 0) paymentTerms.value = [
    { name: 'Orange Money' },
    { name: 'MTN Money' },
    { name: 'Moov Money' },
    { name: 'Wave' },
    { name: 'Espèces' },
  ];
  if (taches.value.length === 0) taches.value = [
    { name: 'Garde d\'enfants' },
    { name: 'Préparation des repas' },
    { name: 'Aide aux devoirs' },
    { name: 'Bain et habillage' },
    { name: 'Promenade' },
  ];
  if (criteresSelections.value.length === 0) criteresSelections.value = [
    { name: 'Disponibilité immédiate' },
    { name: 'Références requises' },
    { name: 'Casier judiciaire vierge' },
    { name: 'Expérience avec bébés' },
    { name: 'Expérience avec jumeaux' },
  ];
};

onMounted(() => {
  fetchParameters();
  if (authStore.isUpdateProfil && nounuStore.IMAGE_PREVIEW) {
    imagePreview.value = typeof nounuStore.IMAGE_PREVIEW === 'string' ? nounuStore.IMAGE_PREVIEW : '';
  }
});

const quitWizard = async () => {
  // In edit mode, just close and return to profile without clearing data
  if (authStore.isUpdateProfil) {
    authStore.setUpdateProfil(false, '');
    profilStore.state.stepProfil = 1;
    router.push({ name: 'PROFIL' });
    return;
  }

  // In creation mode, clear profile data from local storage
  const storageUtils = StorageUtils();
  await storageUtils.removeStore('nProfil_1_Id');
  await storageUtils.removeStore('nType_Profil');
  
  // Reset store state
  authStore.setUpdateProfil(false, '');
  profilStore.state.stepProfil = 1;
  
  // Reset form data
  profilStore.state.InformationPersonnelle = {
    image_profil: null,
    fullname: '',
    adresse_mail: '',
    phone: '',
  };
  profilStore.state.InformationSurLesEnfants = {
    number_of_children: '',
    besions_specifiques: [],
  };
  profilStore.state.ServicesRecherches = {
    type_services: [],
    garde_enfants: [],
    aide_menagere: [],
    frequence_des_services: [],
    horaire_souhaites: [],
  };
  profilStore.state.Localizations = {
    adress: [],
    zone_geographique_prestataire: [],
  };
  profilStore.state.Tarifications = {
    budget_estimated: '',
  };
  profilStore.state.PreferencePourLesSpecifiques = {
    competance_specifique: [],
    langue_parler: [],
    disponibility_du_prestataire: [],
  };
  profilStore.state.TachesSpecifiques = {
    taches: [],
  };
  profilStore.state.CriteresSelection = {
    criteres_selections: [],
  };
  profilStore.state.ModalitesDePaiement = {
    mode_de_paiement: [],
  };
  profilStore.state.AutreInformations = {
    informations_complementaires: '',
  };
  
  // Check if user is still connected (has token and profile id)
  const token = await StorageUtils().getStore('nToken');
  const profilId = await StorageUtils().getStore('nProfil_1_Id');
  if (!token?.value || !profilId?.value) {
    router.push({ name: 'AUTH_SIGN_IN' });
  } else {
    router.push({ name: 'PROFIL' });
  }
};

// File cropper ----------------------------------------------------------------
const showCropper = ref(false);
const cropImageSrc = ref('');
const cropTitle = ref('Recadrer votre photo de profil');
const cropFileName = ref('image.jpg');
const cropStencilType = ref<'circle' | 'rectangle'>('circle');

const fileToFileList = (file: File): FileList => {
  const dataTransfer = new DataTransfer();
  dataTransfer.items.add(file);
  return dataTransfer.files;
};

const triggerFileInput = () => {
  fileInputRef.value?.click();
};

const handlePhotoUpload = (e: Event) => {
  const target = e.target as HTMLInputElement;
  const file = target.files?.[0];
  if (file) {
    cropImageSrc.value = URL.createObjectURL(file);
    cropFileName.value = file.name;
    showCropper.value = true;
  }
  if (target) {
    target.value = '';
  }
};

const onCropCancel = () => {
  showCropper.value = false;
};

const onCrop = ({ file, dataUrl }: { file: File; dataUrl: string }) => {
  profilStore.state.InformationPersonnelle.image_profil = fileToFileList(file);
  imagePreview.value = dataUrl;
  nounuStore.IMAGE_PREVIEW = dataUrl;
  showCropper.value = false;
};

// Helpers ---------------------------------------------------------------------
const toggleArrayItem = (arr: any[], item: any) => {
  const idx = arr.indexOf(item);
  if (idx > -1) arr.splice(idx, 1);
  else arr.push(item);
};

// Step actions ----------------------------------------------------------------
const handleNext = async () => {
  loading.value = true;

  const currentStep = profilStore.state.stepProfil;
  const stepActions: Record<number, () => void | Promise<void>> = {
    1: profilStore.InfoPersonalParentProfil,
    2: profilStore.ChildrenInfoParentProfil,
    3: profilStore.ServicesSoughtParentProfil,
    4: profilStore.LocalizationProfil,
    5: profilStore.PricingParentProfil,
    6: profilStore.PreferenceParentProfil,
    7: profilStore.PaymentTermsParentProfil,
    8: profilStore.TachesSpecifiquesProfil,
    9: profilStore.CriteresSelectionProfil,
    10: profilStore.AutreInfoParentProfil,
  };

  const action = stepActions[currentStep];
  if (action) await action();

  if (profilStore.state.in_error.message) {
    loading.value = false;
    return;
  }

  if (currentStep === totalSteps) {
    router.push({ name: 'PROFIL' });
  }

  loading.value = false;
};
</script>
