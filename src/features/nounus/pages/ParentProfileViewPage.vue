<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6">
    <!-- Loading -->
    <div v-if="isLoading" class="space-y-4">
      <div class="bg-white rounded-3xl overflow-hidden shadow-sm animate-pulse">
        <div class="h-32 bg-gray-200"></div>
        <div class="p-6">
          <div class="flex items-end gap-4 -mt-12 mb-4">
            <div class="h-20 w-20 rounded-2xl bg-gray-200 border-4 border-white"></div>
            <div class="space-y-2 flex-1">
              <div class="h-5 bg-gray-200 rounded-lg w-40"></div>
              <div class="h-3 bg-gray-200 rounded-lg w-28"></div>
            </div>
          </div>
          <div class="space-y-2">
            <div class="h-3 bg-gray-200 rounded-lg w-full"></div>
            <div class="h-3 bg-gray-200 rounded-lg w-3/4"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="profile" class="space-y-5 pt-4">
      <!-- Profile header -->
      <div class="bg-white rounded-3xl overflow-hidden shadow-sm">
        <!-- Cover banner -->
        <div class="h-28 sm:h-32 relative group">
          <img
            v-if="bannerUrl"
            :src="bannerUrl"
            alt="Bannière"
            class="h-full w-full object-cover"
          />
          <div v-else class="h-full w-full bg-gradient-to-r from-rose-200 via-rose-100 to-rose-50 flex items-center justify-center">
            <i class="ri ri-parent-line text-rose-300/60" style="font-size: 56px;"></i>
          </div>
          <!-- Banner upload button (own profile only) -->
          <button
            v-if="!isViewMode"
            @click="triggerBannerUpload"
            class="absolute bottom-2 right-2 h-8 w-8 rounded-full bg-white/90 backdrop-blur-sm text-gray-700 hover:bg-white shadow flex items-center justify-center transition-all active:scale-90 z-10"
          >
            <i class="ri ri-camera-line" style="font-size: 16px;"></i>
          </button>
          <input v-if="!isViewMode" ref="bannerInputRef" type="file" accept="image/*" class="hidden" @change="handleBannerUpload" />
        </div>

        <div class="px-5 pb-5">
          <!-- Avatar + Name + Actions -->
          <div class="flex items-end gap-4 -mt-12 mb-3">
            <div class="relative flex-shrink-0">
              <div class="h-24 w-24 rounded-2xl overflow-hidden bg-rose-50 border-4 border-white shadow-md">
                <img v-if="avatarUrl" :src="avatarUrl" alt="Profile" class="h-full w-full object-cover" />
                <div v-else class="h-full w-full flex items-center justify-center">
                  <i class="ri ri-parent-line text-rose-200" style="font-size: 36px;"></i>
                </div>
              </div>
              <button
                v-if="!isViewMode"
                @click="triggerAvatarUpload"
                class="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-rose-400 text-white flex items-center justify-center shadow hover:bg-rose-500 transition-colors active:scale-90 z-10"
              >
                <i class="ri ri-camera-line" style="font-size: 16px;"></i>
              </button>
              <input v-if="!isViewMode" ref="avatarInputRef" type="file" accept="image/*" class="hidden" @change="handleAvatarUpload" />
            </div>
            <div class="flex-1 min-w-0 pt-6">
              <h1 class="font-anton text-xl text-gray-900 leading-tight truncate">{{ profile.fullname || 'Parent' }}</h1>
              <p class="font-love text-xs text-gray-400 mt-0.5">
                {{ profile.email }}
                <span v-if="profile.phone" class="ml-1">· {{ profile.phone }}</span>
              </p>
            </div>
          </div>

          <!-- Badges -->
          <div class="flex flex-wrap items-center gap-2 mb-3">
            <span class="px-2.5 py-1 rounded-full bg-rose-50 text-rose-500 font-love text-xs font-medium flex items-center gap-1.5">
              <i class="ri ri-parent-line" style="font-size: 12px;"></i>
              Parent
            </span>
            <span v-if="profile.numberOfChildren" class="px-2.5 py-1 rounded-full bg-blue-50 text-blue-500 font-love text-xs font-medium flex items-center gap-1.5">
              <i class="ri ri-emotion-happy-line" style="font-size: 12px;"></i>
              {{ profile.numberOfChildren }} enfant{{ Number(profile.numberOfChildren) > 1 ? 's' : '' }}
            </span>
            <span v-if="memberSince !== '—'" class="px-2.5 py-1 rounded-full bg-gray-50 text-gray-500 font-love text-xs font-medium flex items-center gap-1.5">
              <i class="ri ri-calendar-line" style="font-size: 12px;"></i>
              Membre depuis {{ memberSince }}
            </span>
          </div>

          <!-- Key stats inline -->
          <div v-if="profile.budgetEstimated" class="flex items-center gap-4 py-3 border-t border-b border-gray-50 mb-3">
            <div class="flex items-center gap-1.5">
              <i class="ri ri-money-cny-circle-line text-green-500" style="font-size: 18px;"></i>
              <div>
                <p class="font-anton text-sm text-gray-900 leading-none">{{ profile.budgetEstimated }}</p>
                <p class="font-love text-[10px] text-gray-400">FCFA budget</p>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex items-center gap-2">
            <button
              v-if="!isViewMode"
              @click="goToEdit"
              class="flex-1 py-2.5 rounded-xl bg-rose-50 text-rose-400 hover:bg-rose-100 font-love text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <i class="ri ri-pencil-line" style="font-size: 14px;"></i>
              Modifier
            </button>
            <button
              v-if="isViewMode"
              @click="contactParent"
              class="flex-1 py-2.5 rounded-xl bg-rose-400 text-white hover:bg-rose-500 font-love text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <i class="ri ri-chat-3-line" style="font-size: 14px;"></i>
              Contacter
            </button>
          </div>
        </div>
      </div>

      <!-- Tabs -->
      <div class="sticky top-16 z-20 flex items-center gap-1.5 bg-white/90 backdrop-blur-md rounded-2xl p-1.5 shadow-sm overflow-x-auto -mx-4 sm:-mx-6 px-4 sm:px-6">
        <button
          v-for="tab in profileTabs"
          :key="tab.id"
          @click="activeTab = tab.id"
          :class="[
            'flex-1 min-w-fit py-2.5 px-3 rounded-xl font-love text-sm font-medium transition-all whitespace-nowrap flex items-center justify-center gap-1.5',
            activeTab === tab.id
              ? 'bg-primary text-white'
              : 'text-gray-500 hover:text-gray-700'
          ]"
        >
          <i class="ri" :class="`ri-${tab.icon}`" style="font-size: 15px;"></i>
          {{ tab.label }}
        </button>
      </div>

      <!-- Tab: À propos -->
      <template v-if="activeTab === 'about'">
      <!-- Informations complémentaires -->
      <div v-if="profile.informationsComplementaires" class="bg-white rounded-3xl p-6 shadow-sm">
        <div class="flex items-center gap-2 mb-3">
          <i class="ri ri-quote-text text-primary" style="font-size: 20px;"></i>
          <h2 class="font-anton text-lg text-gray-900">À propos</h2>
        </div>
        <p class="font-love text-sm text-gray-600 leading-relaxed">{{ profile.informationsComplementaires }}</p>
      </div>

      <!-- Services recherchés -->
      <div class="bg-white rounded-3xl p-6 shadow-sm">
        <div class="flex items-center gap-2 mb-4">
          <i class="ri ri-service-line text-primary" style="font-size: 20px;"></i>
          <h2 class="font-anton text-lg text-gray-900">Services recherchés</h2>
        </div>

        <div class="space-y-5">
          <!-- Type de services -->
          <div v-if="serviceTypes.length > 0">
            <h3 class="font-love text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Types de services</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="s in serviceTypes"
                :key="s.id"
                class="px-3 py-1.5 rounded-full bg-rose-50 text-rose-500 font-love text-xs font-medium flex items-center gap-1.5"
              >
                <i class="ri ri-check-line" style="font-size: 12px;"></i>
                {{ s.name }}
              </span>
            </div>
          </div>

          <!-- Garde enfants -->
          <div v-if="gardeEnfantsList.length > 0">
            <h3 class="font-love text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Garde d'enfants</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="g in gardeEnfantsList"
                :key="g.id"
                class="px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 font-love text-xs font-medium flex items-center gap-1.5"
              >
                <i class="ri ri-parent-line" style="font-size: 12px;"></i>
                {{ g.name }}
              </span>
            </div>
          </div>

          <!-- Aide ménagère -->
          <div v-if="aideMenagereList.length > 0">
            <h3 class="font-love text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Aide ménagère</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="a in aideMenagereList"
                :key="a.id"
                class="px-3 py-1.5 rounded-full bg-teal-50 text-teal-600 font-love text-xs font-medium flex items-center gap-1.5"
              >
                <i class="ri ri-home-gear-line" style="font-size: 12px;"></i>
                {{ a.name }}
              </span>
            </div>
          </div>

          <!-- Compétences spécifiques -->
          <div v-if="competences.length > 0">
            <h3 class="font-love text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Compétences recherchées</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="c in competences"
                :key="c.id"
                class="px-3 py-1.5 rounded-full bg-teal-50 text-teal-600 font-love text-xs font-medium flex items-center gap-1.5"
              >
                <i class="ri ri-star-smile-line" style="font-size: 12px;"></i>
                {{ c.name }}
              </span>
            </div>
          </div>

          <!-- Besoins spécifiques -->
          <div v-if="besionsSpecifiques.length > 0">
            <h3 class="font-love text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Besoins spécifiques</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="b in besionsSpecifiques"
                :key="b.id"
                class="px-3 py-1.5 rounded-full bg-orange-50 text-orange-600 font-love text-xs font-medium flex items-center gap-1.5"
              >
                <i class="ri ri-heart-line" style="font-size: 12px;"></i>
                {{ b.name }}
              </span>
            </div>
          </div>

          <!-- Tâches spécifiques -->
          <div v-if="tachesList.length > 0">
            <h3 class="font-love text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Tâches spécifiques</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="t in tachesList"
                :key="t.id"
                class="px-3 py-1.5 rounded-full bg-purple-50 text-purple-600 font-love text-xs font-medium flex items-center gap-1.5"
              >
                <i class="ri ri-task-line" style="font-size: 12px;"></i>
                {{ t.name }}
              </span>
            </div>
          </div>

          <!-- Critères de sélection -->
          <div v-if="criteresSelectionsList.length > 0">
            <h3 class="font-love text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Critères de sélection</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="c in criteresSelectionsList"
                :key="c.id"
                class="px-3 py-1.5 rounded-full bg-indigo-50 text-indigo-600 font-love text-xs font-medium flex items-center gap-1.5"
              >
                <i class="ri ri-filter-3-line" style="font-size: 12px;"></i>
                {{ c.name }}
              </span>
            </div>
          </div>
        </div>
      </div>
      </template>

      <!-- Tab: Disponibilités -->
      <template v-if="activeTab === 'disponibilites'">
      <!-- Disponibilités & Fréquence -->
      <div class="bg-white rounded-3xl p-6 shadow-sm">
        <div class="flex items-center gap-2 mb-4">
          <i class="ri ri-calendar-todo-line text-primary" style="font-size: 20px;"></i>
          <h2 class="font-anton text-lg text-gray-900">Disponibilités & Fréquence</h2>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Horaires souhaités -->
          <div v-if="horaireSouhaitesList.length > 0" class="p-4 rounded-2xl bg-gray-50">
            <div class="flex items-center gap-2 mb-2">
              <i class="ri ri-time-line text-gray-400" style="font-size: 14px;"></i>
              <h3 class="font-love text-xs font-semibold text-gray-400 uppercase tracking-wide">Horaires souhaités</h3>
            </div>
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="h in horaireSouhaitesList"
                :key="h.id"
                class="px-2.5 py-1 rounded-full bg-white text-gray-600 font-love text-xs font-medium"
              >
                {{ h.name }}
              </span>
            </div>
          </div>

          <!-- Fréquence -->
          <div v-if="frequenceList.length > 0" class="p-4 rounded-2xl bg-gray-50">
            <div class="flex items-center gap-2 mb-2">
              <i class="ri ri-repeat-line text-gray-400" style="font-size: 14px;"></i>
              <h3 class="font-love text-xs font-semibold text-gray-400 uppercase tracking-wide">Fréquence</h3>
            </div>
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="f in frequenceList"
                :key="f.id"
                class="px-2.5 py-1 rounded-full bg-white text-gray-600 font-love text-xs font-medium"
              >
                {{ f.name }}
              </span>
            </div>
          </div>

          <!-- Disponibilité du prestataire -->
          <div v-if="disponibilityList.length > 0" class="p-4 rounded-2xl bg-gray-50">
            <div class="flex items-center gap-2 mb-2">
              <i class="ri ri-flashlight-line text-gray-400" style="font-size: 14px;"></i>
              <h3 class="font-love text-xs font-semibold text-gray-400 uppercase tracking-wide">Disponibilité prestataire</h3>
            </div>
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="d in disponibilityList"
                :key="d.id"
                class="px-2.5 py-1 rounded-full bg-white text-gray-600 font-love text-xs font-medium"
              >
                {{ d.name }}
              </span>
            </div>
          </div>

          <!-- Mode de paiement -->
          <div v-if="modePaiementList.length > 0" class="p-4 rounded-2xl bg-gray-50">
            <div class="flex items-center gap-2 mb-2">
              <i class="ri ri-wallet-line text-gray-400" style="font-size: 14px;"></i>
              <h3 class="font-love text-xs font-semibold text-gray-400 uppercase tracking-wide">Mode de paiement</h3>
            </div>
            <div class="flex flex-wrap gap-1.5">
              <span
                v-for="m in modePaiementList"
                :key="m.id"
                class="px-2.5 py-1 rounded-full bg-white text-gray-600 font-love text-xs font-medium"
              >
                {{ m.name }}
              </span>
            </div>
          </div>
        </div>
      </div>
      </template>

      <!-- Tab: Localisation -->
      <template v-if="activeTab === 'localisation'">
      <!-- Localisation & Langues -->
      <div class="bg-white rounded-3xl p-6 shadow-sm">
        <div class="flex items-center gap-2 mb-4">
          <i class="ri ri-map-pin-line text-primary" style="font-size: 20px;"></i>
          <h2 class="font-anton text-lg text-gray-900">Localisation & Langues</h2>
        </div>

        <div class="space-y-4">
          <!-- Adresse -->
          <div v-if="adresseList.length > 0">
            <h3 class="font-love text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Adresse</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="a in adresseList"
                :key="a.id"
                class="px-3 py-1.5 rounded-full bg-rose-50 text-rose-500 font-love text-xs font-medium flex items-center gap-1.5"
              >
                <i class="ri ri-home-4-line" style="font-size: 12px;"></i>
                {{ a.name }}
              </span>
            </div>
          </div>

          <!-- Zones géographiques -->
          <div v-if="zoneGeoList.length > 0">
            <h3 class="font-love text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Zones d'intervention</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="z in zoneGeoList"
                :key="z.id"
                class="px-3 py-1.5 rounded-full bg-rose-50 text-rose-500 font-love text-xs font-medium flex items-center gap-1.5"
              >
                <i class="ri ri-map-pin-2-line" style="font-size: 12px;"></i>
                {{ z.name }}
              </span>
            </div>
          </div>

          <!-- Langues parlées -->
          <div v-if="langues.length > 0">
            <h3 class="font-love text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Langues parlées</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="lang in langues"
                :key="lang.id"
                class="px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 font-love text-xs font-medium flex items-center gap-1.5"
              >
                <i class="ri ri-translate-2" style="font-size: 12px;"></i>
                {{ lang.name }}
              </span>
            </div>
          </div>
        </div>
      </div>
      </template>

      <!-- Tab: Galerie -->
      <template v-if="activeTab === 'galerie'">
      <!-- Gallery -->
      <div class="bg-white rounded-3xl p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <i class="ri ri-image-line text-primary" style="font-size: 20px;"></i>
            <h2 class="font-anton text-lg text-gray-900">Galerie</h2>
          </div>
          <div class="flex items-center gap-3">
            <span class="font-love text-xs text-gray-400">{{ gallery.length }} photo(s)</span>
            <button
              v-if="!isViewMode"
              @click="triggerGalleryUpload"
              :disabled="uploadingImage"
              class="h-8 w-8 rounded-xl bg-rose-50 text-rose-400 hover:bg-rose-100 flex items-center justify-center transition-colors disabled:opacity-50"
              title="Ajouter une photo"
            >
              <i class="ri ri-add-line" style="font-size: 18px;"></i>
            </button>
          </div>
        </div>
        <div v-if="gallery.length > 0" class="grid grid-cols-3 sm:grid-cols-4 gap-3">
          <div
            v-for="(img, i) in gallery"
            :key="i"
            class="aspect-square rounded-2xl overflow-hidden border border-rose-50 hover:shadow-md transition-shadow cursor-pointer relative group"
          >
            <img :src="getMediaUrl(img)" alt="" class="h-full w-full object-cover hover:scale-105 transition-transform duration-300" />
            <button
              v-if="!isViewMode"
              @click="deleteGalleryImage(img)"
              class="absolute top-1 right-1 h-7 w-7 rounded-lg bg-black/40 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity hover:bg-red-500"
              title="Supprimer"
            >
              <i class="ri ri-delete-bin-line" style="font-size: 14px;"></i>
            </button>
          </div>
        </div>
        <div v-else class="text-center py-8">
          <i class="ri ri-image-add-line text-gray-300" style="font-size: 36px;"></i>
          <p class="font-love text-sm text-gray-400 mt-2">Aucune photo.</p>
        </div>
        <input v-if="!isViewMode" ref="galleryInput" type="file" accept="image/*" class="hidden" @change="handleGalleryUpload" />
      </div>
      </template>

      <!-- Tab: Candidats (own profile only) -->
      <template v-if="activeTab === 'candidats' && !isViewMode">
        <div class="bg-white rounded-3xl p-6 shadow-sm">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <i class="ri ri-group-line text-primary" style="font-size: 20px;"></i>
              <h2 class="font-anton text-lg text-gray-900">Candidatures reçues</h2>
            </div>
            <span class="font-love text-xs text-gray-400">{{ applications.length }} candidat(s)</span>
          </div>

          <div v-if="applicationsLoading" class="space-y-3">
            <div v-for="i in 3" :key="i" class="flex items-center gap-3 p-3 rounded-2xl bg-gray-50 animate-pulse">
              <div class="h-12 w-12 rounded-xl bg-gray-200 flex-shrink-0"></div>
              <div class="flex-1 space-y-2">
                <div class="h-4 bg-gray-200 rounded-lg w-1/3"></div>
                <div class="h-3 bg-gray-200 rounded-lg w-1/2"></div>
              </div>
            </div>
          </div>

          <div v-else-if="applications.length > 0" class="space-y-3">
            <div
              v-for="app in applications"
              :key="app.id"
              class="flex items-center gap-3 p-3 rounded-2xl bg-gray-50/60 hover:bg-rose-50/40 transition-colors border border-transparent hover:border-rose-100"
            >
              <div class="h-12 w-12 rounded-xl overflow-hidden bg-rose-50 flex items-center justify-center flex-shrink-0">
                <img v-if="getApplicantAvatar(app)" :src="getApplicantAvatar(app)" alt="" class="h-full w-full object-cover" />
                <i v-else class="ri ri-user-3-line text-rose-200" style="font-size: 22px;"></i>
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="font-anton text-sm text-gray-900 truncate">{{ getApplicantName(app) }}</h3>
                <p class="font-love text-xs text-gray-400 truncate">{{ app.job?.titre || 'Annonce supprimée' }}</p>
                <p class="font-love text-[10px] text-gray-300 mt-0.5">{{ formatAppDate(app.createdAt) }}</p>
              </div>
              <button
                @click="contactApplicant(app)"
                class="h-9 w-9 rounded-xl bg-rose-50 text-rose-400 hover:bg-rose-100 flex items-center justify-center transition-colors flex-shrink-0"
                title="Contacter"
              >
                <i class="ri ri-chat-3-line" style="font-size: 16px;"></i>
              </button>
            </div>
          </div>

          <div v-else-if="!applicationsLoading && !applicationsError" class="text-center py-8">
            <i class="ri ri-user-unfollow-line text-gray-300" style="font-size: 36px;"></i>
            <p class="font-love text-sm text-gray-400 mt-2">Aucune candidature pour le moment.</p>
          </div>

          <div v-if="applicationsError" class="mt-3 bg-red-50 border border-red-100 rounded-2xl p-3 flex items-center gap-2">
            <i class="ri ri-close-circle-line text-red-500" style="font-size: 18px;"></i>
            <p class="text-xs text-red-600 font-love">{{ applicationsError }}</p>
          </div>
        </div>
      </template>

      <!-- Actions (own profile only) -->
      <div v-if="!isViewMode" class="flex gap-3">
        <button
          @click="goToJobs"
          class="flex-1 py-3.5 rounded-2xl bg-primary text-white font-love font-semibold text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
        >
          <i class="ri ri-briefcase-line" style="font-size: 16px;"></i>
          Mes annonces
        </button>
        <button
          @click="goToPrestations"
          class="flex-1 py-3.5 rounded-2xl bg-white border border-rose-100 text-primary font-love font-semibold text-sm hover:bg-rose-50 transition-colors flex items-center justify-center gap-2"
        >
          <i class="ri ri-wallet-line" style="font-size: 16px;"></i>
          Mes prestations
        </button>
      </div>
    </div>

    <!-- Not found -->
    <div v-else-if="!loading && !isViewMode" class="flex flex-col items-center justify-center py-20 text-center">
      <div class="h-24 w-24 rounded-full bg-gradient-to-br from-rose-50 to-rose-100 flex items-center justify-center mb-5">
        <i class="ri ri-user-add-line text-rose-300" style="font-size: 44px;"></i>
      </div>
      <h3 class="font-anton text-xl text-gray-900 mb-2">Créez votre profil</h3>
      <p class="font-love text-sm text-gray-400 mb-6 max-w-xs">
        Vous n'avez pas encore de profil parent. Créez-le pour publier des annonces et trouver la nounou idéale.
      </p>
      <button
        @click="goToCreateProfile"
        class="px-8 py-3.5 rounded-2xl bg-primary text-white font-love font-semibold text-sm hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm"
      >
        <i class="ri ri-add-line" style="font-size: 18px;"></i>
        Créer mon profil
      </button>
    </div>

    <!-- Not found (view mode) -->
    <div v-else-if="!loading && isViewMode" class="flex flex-col items-center justify-center py-20 text-center">
      <div class="h-24 w-24 rounded-full bg-gradient-to-br from-rose-50 to-rose-100 flex items-center justify-center mb-5">
        <i class="ri ri-user-unfollow-line text-rose-300" style="font-size: 44px;"></i>
      </div>
      <h3 class="font-anton text-xl text-gray-900 mb-2">Profil introuvable</h3>
      <p class="font-love text-sm text-gray-400 mb-6 max-w-xs">
        Ce profil n'existe pas ou n'est plus disponible.
      </p>
      <button
        @click="goBack"
        class="px-8 py-3.5 rounded-2xl bg-primary text-white font-love font-semibold text-sm hover:bg-primary/90 transition-colors flex items-center gap-2 shadow-sm"
      >
        <i class="ri ri-arrow-left-line" style="font-size: 18px;"></i>
        Retour
      </button>
    </div>

    <!-- Error -->
    <div v-if="mediaError" class="mt-4 bg-red-50 border border-red-100 rounded-2xl p-4 flex items-center gap-3">
      <i class="ri ri-close-circle-line text-red-500" style="font-size: 20px;"></i>
      <p class="text-sm text-red-600 font-love">{{ mediaError }}</p>
    </div>

    <!-- Image Cropper -->
    <ImageCropper
      v-model="showCropper"
      :image="cropImageSrc"
      :title="cropTitle"
      :file-name="cropFileName"
      :stencil-type="cropStencilType"
      :aspect-ratio="cropAspectRatio"
      @crop="onCrop"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { StorageUtils } from '@/utils/store.utils';
import { URL_API_ROUTE } from '@/routes/_requests/index.request';
import { findMediaByType, getMediaUrl as resolveMediaUrl, getAvatarUrl } from '@/utils/media.utils';
import { useProfilStore } from '@/stores/authProfilStore';
import { useAuthStore } from '@/stores/auth.store';
import { useProfileMedia } from '@/composables/useProfileMedia';
import ImageCropper from '@/components/ui/ImageCropper.vue';
import { useChatStore } from '@/stores/chatStore';
import axios from 'axios';
import { useParentProfile, useParentProfileById } from '@/features/profile/hooks/useProfile';
import { useJobApplications } from '@/features/jobs/hooks/useJobs';

const router = useRouter();
const route = useRoute();
const profilStore = useProfilStore();
const authStore = useAuthStore();
const chatStore = useChatStore();

const viewModeId = computed(() => (route.params.id as string) || '');
const isViewMode = computed(() => !!viewModeId.value);

// TanStack Query for profile data
// useParentProfile (propre profil) est désactivé en mode vue pour éviter
// une requête inutile quand on consulte le profil d'un autre parent.
const { data: profileData, isLoading: profileLoading, refetch: refetchProfile } = useParentProfile(
  computed(() => !isViewMode.value)
);
// Passage d'un getter (au lieu de .value) pour que la query soit réactive
// aux changements du paramètre de route (navigation entre profils).
const { data: viewModeProfileData } = useParentProfileById(() => viewModeId.value);
const { data: applicationsData } = useJobApplications(() => viewModeId.value);

const profile = ref<any>(null);
const userMedias = ref<any[]>([]);
const loading = ref(false);
const fetchingProfile = ref(false);
const activeTab = ref('about');

const isLoading = computed(() => loading.value || (!isViewMode.value && profileLoading.value));

const profileTabs = computed(() => {
  const tabs = [
    { id: 'about', label: 'À propos', icon: 'user-line' },
    { id: 'disponibilites', label: 'Dispo.', icon: 'calendar-todo-line' },
    { id: 'localisation', label: 'Lieux', icon: 'map-pin-line' },
    { id: 'galerie', label: 'Galerie', icon: 'image-line' },
  ];
  if (!isViewMode.value) {
    tabs.push({ id: 'candidats', label: 'Candidats', icon: 'group-line' });
  }
  return tabs;
});

// ── Unwrap API response (TransformInterceptor wraps as { success, data }) ──
const unwrap = (resp: any) => {
  if (resp && typeof resp === 'object' && !Array.isArray(resp) && 'success' in resp && 'data' in resp) {
    return resp.data;
  }
  return resp;
};

// ── Fetch profile ──
const fetchProfile = async () => {
  if (fetchingProfile.value) return;
  try {
    fetchingProfile.value = true;
    loading.value = true;
    mediaError.value = null;

    if (isViewMode.value) {
      const data = unwrap(viewModeProfileData.value);
      profile.value = data;
      userMedias.value = data?.user?.medias || [];
    } else {
      // Use TanStack Query data for own profile
      if (profileData.value) {
        const data = unwrap(profileData.value);
        profile.value = data;
        userMedias.value = data?.user?.medias || [];
      }
    }
  } catch (e: any) {
    if (e?.response?.status === 404) {
      profile.value = null;
    } else if (e?.response?.status === 403) {
      router.push({ name: 'PackSubscrible' });
      return;
    } else {
      mediaError.value = e?.response?.data?.message || 'Erreur lors de la récupération du profil';
    }
  } finally {
    loading.value = false;
    fetchingProfile.value = false;
  }
};

// ── Media composable ──
const {
  avatarInputRef,
  bannerInputRef,
  galleryInput,
  uploadingImage,
  showCropper,
  cropImageSrc,
  cropTitle,
  cropFileName,
  cropStencilType,
  cropAspectRatio,
  error: mediaError,
  avatarUrl,
  bannerUrl,
  gallery,
  getMediaUrl,
  triggerAvatarUpload,
  handleAvatarUpload,
  triggerBannerUpload,
  handleBannerUpload,
  onCrop,
  triggerGalleryUpload,
  handleGalleryUpload,
  deleteGalleryImage,
} = useProfileMedia(userMedias, fetchProfile);

// ── Job applications (Candidats tab) ──
const applications = ref<any[]>([]);
const applicationsLoading = ref(false);
const applicationsError = ref<string | null>(null);

const fetchApplications = async () => {
  if (isViewMode.value) return;
  try {
    applicationsLoading.value = true;
    applicationsError.value = null;

    const raw = applicationsData.value;
    // TransformInterceptor wraps responses as { success, data }
    const data = raw && typeof raw === 'object' && !Array.isArray(raw) && 'success' in raw && 'data' in raw ? raw.data : raw;
    applications.value = Array.isArray(data) ? data : (data?.data || []);
  } catch (e: any) {
    applicationsError.value = e?.response?.data?.message || 'Erreur lors du chargement des candidatures';
  } finally {
    applicationsLoading.value = false;
  }
};

const getApplicantAvatar = (app: any) => {
  return getAvatarUrl(app?.user?.medias || []);
};

const getApplicantName = (app: any) => {
  const nounu = app?.user?.nounus?.[0];
  return nounu?.fullname || app?.user?.fullname || 'Nounou';
};

const formatAppDate = (dateStr: string) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
};

const contactApplicant = async (app: any) => {
  const userId = app?.user?.id;
  if (!userId) return;
  try {
    const nounuId = app?.user?.nounus?.[0]?.id;
    const room = await chatStore.findOrCreateRoom(userId, nounuId);
    if (room?.id) {
      router.push({ name: 'CHAT_MESSAGE_DETAIL', params: { id: room.id } });
    }
  } catch (e: any) {
    if (e?.status === 401) {
      router.push({ name: 'AUTH_SIGN_IN' });
    }
  }
};

// ── Preferences helpers ──
const allPrefs = computed(() => profile.value?.preferences || []);

const getPrefList = (key: string) => {
  const seen = new Set();
  return allPrefs.value
    .filter((p: any) => p[key])
    .map((p: any) => p[key])
    .filter(Boolean)
    .filter((item: any) => {
      const id = item.id ?? item.name;
      if (seen.has(id)) return false;
      seen.add(id);
      return true;
    });
};

const serviceTypes = computed(() => getPrefList('typeServices'));
const competences = computed(() => getPrefList('competanceSpecifique'));
const besionsSpecifiques = computed(() => getPrefList('besionsSpecifiques'));
const gardeEnfantsList = computed(() => getPrefList('gardeEnfants'));
const aideMenagereList = computed(() => getPrefList('aideMenagere'));
const horaireSouhaitesList = computed(() => getPrefList('horaireSouhaites'));
const frequenceList = computed(() => getPrefList('frequenceDesServices'));
const disponibilityList = computed(() => getPrefList('disponibilityPrestataire'));
const modePaiementList = computed(() => getPrefList('modeDePaiement'));
const adresseList = computed(() => getPrefList('adress'));
const zoneGeoList = computed(() => getPrefList('zoneGeographiquePrestataire'));
const langues = computed(() => getPrefList('langueParler'));
const tachesList = computed(() => getPrefList('taches'));
const criteresSelectionsList = computed(() => getPrefList('criteresSelections'));

const memberSince = computed(() => {
  if (!profile.value?.createdAt) return '—';
  return new Date(profile.value.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
});

// ── Map profile for edit ──
const mapProfileForEdit = (data: any) => {
  const prefs = data.preferences || [];
  const getPrefNames = (key: string) => prefs.filter((p: any) => p[key]).map((p: any) => p[key].name).filter(Boolean);
  const getPrefFirst = (key: string) => {
    const found = prefs.find((p: any) => p[key]);
    return found ? [found[key].name] : [];
  };

  const profilePhoto = findMediaByType(userMedias.value, 'photo_profil');

  return {
    id: data.id,
    fullname: data.fullname || '',
    adresse_mail: data.email || '',
    phone: data.phone || '',
    image: resolveMediaUrl(profilePhoto),
    number_of_children: data.numberOfChildren || '',
    budget_estimated: data.budgetEstimated || '',
    informations_complementaires: data.informationsComplementaires || '',
    preferences: {
      type_services: getPrefNames('typeServices'),
      besions_specifiques: getPrefNames('besionsSpecifiques'),
      garde_enfants: getPrefNames('gardeEnfants'),
      aide_menagere: getPrefNames('aideMenagere'),
      frequence_des_services: getPrefNames('frequenceDesServices'),
      horaire_souhaites: getPrefNames('horaireSouhaites'),
      adress: getPrefNames('adress'),
      zone_geographique_prestataire: getPrefNames('zoneGeographiquePrestataire'),
      competance_specifique: getPrefNames('competanceSpecifique'),
      langue_parler: getPrefNames('langueParler'),
      disponibility_du_prestataire: getPrefNames('disponibilityPrestataire'),
      mode_de_paiement: getPrefNames('modeDePaiement'),
      taches: getPrefNames('taches'),
      criteres_selections: getPrefNames('criteresSelections'),
    },
  };
};

// ── Navigation ──
const goToEdit = () => {
  if (profile.value) {
    const mapped = mapProfileForEdit(profile.value);
    profilStore.ChangeInputToEdit(mapped);
  }
  router.push({ name: 'AUTH_PROFILE_PARENT', query: { edit: 'true' } });
};

const goToCreateProfile = () => {
  authStore.setUpdateProfil(false, '');
  profilStore.state.stepProfil = 1;
  router.push({ name: 'AUTH_PROFILE_PARENT' });
};

const goToJobs = () => {
  router.push({ name: 'MY_JOBS' });
};

const goToPrestations = () => {
  router.push({ name: 'PRESTATIONS' });
};

const goToSettings = () => {
  router.push({ name: 'SETTINGS' });
};

const goBack = () => {
  router.back();
};

const contactParent = async () => {
  if (!profile.value?.id) return;
  try {
    const userId = profile.value.user?.id || profile.value.userId;
    if (!userId) return;
    const room = await chatStore.findOrCreateRoom(userId, undefined, profile.value.id);
    if (room?.id) {
      router.push({ name: 'CHAT_MESSAGE_DETAIL', params: { id: room.id } });
    }
  } catch (e: any) {
    if (e?.status === 401) {
      router.push({ name: 'AUTH_SIGN_IN' });
    }
  }
};

onMounted(() => {
  if (isViewMode.value) {
    fetchProfile();
  } else {
    // Use TanStack Query data for own profile
    if (profileData.value) {
      const data = unwrap(profileData.value);
      profile.value = data;
      userMedias.value = data?.user?.medias || [];
    }
  }
  fetchApplications();
});

// Watch for TanStack Query data changes (for own profile)
watch(profileData, (newData) => {
  if (!isViewMode.value && newData) {
    const data = unwrap(newData);
    profile.value = data;
    userMedias.value = data?.user?.medias || [];
  }
});
</script>
