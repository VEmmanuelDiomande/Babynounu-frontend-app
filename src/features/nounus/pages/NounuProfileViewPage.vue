<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6">
    <!-- Loading -->
    <div v-if="loading" class="space-y-4">
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
          <div v-else class="h-full w-full bg-gradient-to-r from-rose-200 via-rose-100 to-rose-50"></div>
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
                  <i class="ri ri-user-3-line text-rose-200" style="font-size: 36px;"></i>
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
            <div class="flex-1 min-w-0 pt-2">
              <h1 class="font-anton text-xl text-gray-900 leading-tight truncate">{{ profile.fullname }}</h1>
              <p class="font-love text-xs text-gray-400 mt-0.5">{{ profile.age }} ans · {{ profile.anneesExperience || 0 }} ans d'expérience</p>
            </div>
          </div>

          <!-- Badges -->
          <div class="flex flex-wrap items-center gap-2 mb-3">
            <span :class="['px-2.5 py-1 rounded-full font-love text-xs font-medium flex items-center gap-1.5', statusColor]">
              <span :class="['h-2 w-2 rounded-full', statusDot]"></span>
              {{ statusLabel }}
            </span>
            <span :class="['px-2.5 py-1 rounded-full font-love text-xs font-medium flex items-center gap-1.5', certifColor]">
              <i class="ri ri-shield-check-line" style="font-size: 12px;"></i>
              {{ certifLabel }}
            </span>
            <span v-if="profile.urgences" class="px-2.5 py-1 rounded-full bg-red-50 text-red-500 font-love text-xs font-medium flex items-center gap-1.5">
              <i class="ri ri-flashlight-line" style="font-size: 12px;"></i>
              Urgences
            </span>
          </div>

          <!-- Key stats inline -->
          <div class="flex items-center gap-4 py-3 border-t border-b border-gray-50 mb-3">
            <div class="flex items-center gap-1.5">
              <i class="ri ri-money-cny-circle-line text-green-500" style="font-size: 18px;"></i>
              <div>
                <p class="font-anton text-sm text-gray-900 leading-none">{{ profile.tarifHoraire || '-' }}</p>
                <p class="font-love text-[10px] text-gray-400">FCFA/h</p>
              </div>
            </div>
            <div v-if="profile.tarifMensuel" class="flex items-center gap-1.5">
              <i class="ri ri-calendar-2-line text-orange-500" style="font-size: 18px;"></i>
              <div>
                <p class="font-anton text-sm text-gray-900 leading-none">{{ profile.tarifMensuel }}</p>
                <p class="font-love text-[10px] text-gray-400">FCFA/mois</p>
              </div>
            </div>
            <div class="flex items-center gap-1.5">
              <i class="ri ri-star-fill text-yellow-400" style="font-size: 16px;"></i>
              <div>
                <p class="font-anton text-sm text-gray-900 leading-none">{{ (isViewMode ? reviewData.averageRating : profile.points)?.toFixed(1) || '0.0' }}</p>
                <p class="font-love text-[10px] text-gray-400">{{ isViewMode && reviewData.totalReviews > 0 ? `${reviewData.totalReviews} avis` : 'Note' }}</p>
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
              @click="onToggleLike"
              :class="[
                'flex items-center gap-2 px-4 py-2.5 rounded-xl font-love text-sm font-medium transition-colors',
                isLiked(viewModeId) ? 'bg-rose-50 text-rose-500' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'
              ]"
            >
              <i :class="['ri', isLiked(viewModeId) ? 'ri-heart-fill text-rose-500' : 'ri-heart-line']" style="font-size: 16px;"></i>
              <span v-if="getLikeCount(viewModeId) > 0">{{ getLikeCount(viewModeId) }}</span>
            </button>
            <button
              v-if="isViewMode"
              @click="contactNounu"
              class="flex-1 py-2.5 rounded-xl bg-rose-400 text-white hover:bg-rose-500 font-love text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <i class="ri ri-chat-3-line" style="font-size: 14px;"></i>
              Contacter
            </button>
          </div>
        </div>
      </div>

      <!-- Bio -->
      <div v-if="profile.courteBiographie" class="bg-white rounded-3xl p-6 shadow-sm">
        <div class="flex items-center gap-2 mb-3">
          <i class="ri ri-quote-text text-primary" style="font-size: 20px;"></i>
          <h2 class="font-anton text-lg text-gray-900">À propos de moi</h2>
        </div>
        <p class="font-love text-sm text-gray-600 leading-relaxed">{{ profile.courteBiographie }}</p>
      </div>

      <!-- Services & Competences -->
      <div class="bg-white rounded-3xl p-6 shadow-sm">
        <div class="flex items-center gap-2 mb-4">
          <i class="ri ri-service-line text-primary" style="font-size: 20px;"></i>
          <h2 class="font-anton text-lg text-gray-900">Services & Compétences</h2>
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

          <!-- Compétences spécifiques -->
          <div v-if="competences.length > 0">
            <h3 class="font-love text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Compétences spécifiques</h3>
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

          <!-- Garde enfants -->
          <div v-if="gardeEnfants" class="flex items-center gap-3 p-3 rounded-2xl bg-gray-50">
            <div class="h-10 w-10 rounded-xl bg-rose-50 flex items-center justify-center flex-shrink-0">
              <i class="ri ri-parent-line text-rose-400" style="font-size: 20px;"></i>
            </div>
            <div>
              <p class="font-love text-xs text-gray-400">Garde d'enfants</p>
              <p class="font-love text-sm text-gray-700 font-medium">{{ gardeEnfants.name }}</p>
            </div>
          </div>

          <!-- Tranche d'âge -->
          <div v-if="trancheAge" class="flex items-center gap-3 p-3 rounded-2xl bg-gray-50">
            <div class="h-10 w-10 rounded-xl bg-blue-50 flex items-center justify-center flex-shrink-0">
              <i class="ri ri-emotion-happy-line text-blue-400" style="font-size: 20px;"></i>
            </div>
            <div>
              <p class="font-love text-xs text-gray-400">Tranche d'âge des enfants</p>
              <p class="font-love text-sm text-gray-700 font-medium">{{ trancheAge.name }}</p>
            </div>
          </div>

          <!-- Équipement ménager -->
          <div v-if="equipementMenager" class="flex items-center gap-3 p-3 rounded-2xl bg-gray-50">
            <div class="h-10 w-10 rounded-xl bg-purple-50 flex items-center justify-center flex-shrink-0">
              <i class="ri ri-home-gear-line text-purple-400" style="font-size: 20px;"></i>
            </div>
            <div>
              <p class="font-love text-xs text-gray-400">Équipement ménager</p>
              <p class="font-love text-sm text-gray-700 font-medium">{{ equipementMenager.name }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Disponibilités -->
      <div class="bg-white rounded-3xl p-6 shadow-sm">
        <div class="flex items-center gap-2 mb-4">
          <i class="ri ri-calendar-todo-line text-primary" style="font-size: 20px;"></i>
          <h2 class="font-anton text-lg text-gray-900">Disponibilités</h2>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <!-- Horaires disponibles -->
          <div v-if="horaireDisponible" class="p-4 rounded-2xl bg-gray-50">
            <div class="flex items-center gap-2 mb-2">
              <i class="ri ri-time-line text-gray-400" style="font-size: 14px;"></i>
              <h3 class="font-love text-xs font-semibold text-gray-400 uppercase tracking-wide">Horaires</h3>
            </div>
            <p class="font-love text-sm text-gray-700 font-medium">{{ horaireDisponible.name }}</p>
          </div>

          <!-- Fréquence -->
          <div v-if="frequence" class="p-4 rounded-2xl bg-gray-50">
            <div class="flex items-center gap-2 mb-2">
              <i class="ri ri-repeat-line text-gray-400" style="font-size: 14px;"></i>
              <h3 class="font-love text-xs font-semibold text-gray-400 uppercase tracking-wide">Fréquence</h3>
            </div>
            <p class="font-love text-sm text-gray-700 font-medium">{{ frequence.name }}</p>
          </div>

        </div>
      </div>

      <!-- Zones & Langues -->
      <div class="bg-white rounded-3xl p-6 shadow-sm">
        <div class="flex items-center gap-2 mb-4">
          <i class="ri ri-map-pin-line text-primary" style="font-size: 20px;"></i>
          <h2 class="font-anton text-lg text-gray-900">Zones & Langues</h2>
        </div>

        <div class="space-y-4">
          <!-- Zones de travail -->
          <div v-if="zones.length > 0">
            <h3 class="font-love text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Zones de travail</h3>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="zone in zones"
                :key="zone.id"
                class="px-3 py-1.5 rounded-full bg-rose-50 text-rose-500 font-love text-xs font-medium flex items-center gap-1.5"
              >
                <i class="ri ri-map-pin-2-line" style="font-size: 12px;"></i>
                {{ zone.name }}
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

          <!-- Adresse -->
          <div v-if="adresse" class="flex items-center gap-3 p-3 rounded-2xl bg-gray-50">
            <div class="h-10 w-10 rounded-xl bg-rose-50 flex items-center justify-center flex-shrink-0">
              <i class="ri ri-home-4-line text-rose-400" style="font-size: 20px;"></i>
            </div>
            <div>
              <p class="font-love text-xs text-gray-400">Adresse</p>
              <p class="font-love text-sm text-gray-700 font-medium">{{ adresse.name }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Références & Évaluations -->
      <div v-if="profile.references || profile.evaluationPrecedentes" class="bg-white rounded-3xl p-6 shadow-sm">
        <div class="flex items-center gap-2 mb-4">
          <i class="ri ri-file-list-3-line text-primary" style="font-size: 20px;"></i>
          <h2 class="font-anton text-lg text-gray-900">Références & Évaluations</h2>
        </div>

        <div class="space-y-4">
          <div v-if="profile.references" class="p-4 rounded-2xl bg-gray-50">
            <h3 class="font-love text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Références</h3>
            <p class="font-love text-sm text-gray-600 leading-relaxed">{{ profile.references }}</p>
          </div>
          <div v-if="profile.evaluationPrecedentes" class="p-4 rounded-2xl bg-gray-50">
            <h3 class="font-love text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Évaluations précédentes</h3>
            <p class="font-love text-sm text-gray-600 leading-relaxed">{{ profile.evaluationPrecedentes }}</p>
          </div>
        </div>
      </div>

      <!-- Reviews & Ratings -->
      <div v-if="isViewMode" class="bg-white rounded-3xl p-6 shadow-sm">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <i class="ri ri-star-line text-primary" style="font-size: 20px;"></i>
            <h2 class="font-anton text-lg text-gray-900">Avis & Notes</h2>
          </div>
          <div v-if="reviewData.totalReviews > 0" class="flex items-center gap-2">
            <i class="ri ri-star-fill text-yellow-400" style="font-size: 18px;"></i>
            <span class="font-anton text-lg text-gray-900">{{ reviewData.averageRating.toFixed(1) }}</span>
            <span class="font-love text-xs text-gray-400">({{ reviewData.totalReviews }} avis)</span>
          </div>
        </div>

        <div v-if="reviewData.reviews.length > 0" class="space-y-4">
          <div
            v-for="review in reviewData.reviews"
            :key="review.id"
            class="p-4 rounded-2xl bg-gray-50"
          >
            <div class="flex items-start gap-3">
              <div class="h-10 w-10 rounded-full bg-rose-100 flex items-center justify-center flex-shrink-0 overflow-hidden">
                <img v-if="getReviewerAvatar(review)" :src="getReviewerAvatar(review)" alt="" class="h-full w-full object-cover" />
                <span v-else class="font-anton text-sm text-rose-400">{{ getReviewerInitial(review) }}</span>
              </div>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-2 mb-1">
                  <p class="font-love text-sm font-semibold text-gray-900 truncate">{{ getReviewerName(review) }}</p>
                  <span class="font-love text-xs text-gray-400 flex-shrink-0">{{ formatReviewDate(review.createdAt) }}</span>
                </div>
                <div class="flex items-center gap-0.5 mb-2">
                  <i
                    v-for="star in 5"
                    :key="star"
                    :class="[
                      'ri',
                      star <= review.rating ? 'ri-star-fill text-yellow-400' : 'ri-star-line text-gray-200'
                    ]"
                    style="font-size: 14px;"
                  ></i>
                </div>
                <p v-if="review.comment" class="font-love text-sm text-gray-600 leading-relaxed">{{ review.comment }}</p>
              </div>
            </div>
          </div>

          <button
            v-if="reviewData.hasNextPage"
            @click="loadMoreReviews"
            :disabled="reviewsLoading"
            class="w-full py-3 rounded-2xl bg-rose-50 text-rose-500 hover:bg-rose-100 font-love text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <i v-if="reviewsLoading" class="ri ri-loader-4-line animate-spin" style="font-size: 16px;"></i>
            {{ reviewsLoading ? 'Chargement...' : 'Voir plus d\'avis' }}
          </button>
        </div>

        <div v-else class="flex flex-col items-center justify-center py-8 text-center">
          <div class="h-14 w-14 rounded-full bg-gray-100 flex items-center justify-center mb-3">
            <i class="ri ri-chat-star-line text-gray-300" style="font-size: 28px;"></i>
          </div>
          <p class="font-love text-sm text-gray-400">Aucun avis pour le moment</p>
        </div>
      </div>

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

      <!-- Actions (own profile only) -->
      <div v-if="!isViewMode" class="flex gap-3">
        <button
          @click="goToPrestations"
          class="flex-1 py-3.5 rounded-2xl bg-primary text-white font-love font-semibold text-sm hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
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
        Vous n'avez pas encore de profil nounu. Créez-le pour apparaître dans les recherches et recevoir des demandes.
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
import { ref, computed, onMounted, reactive, watch } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { StorageUtils } from '@/utils/store.utils';
import { URL_API_ROUTE } from '@/routes/_requests/index.request';
import { getGalleryUrls, getMediaUrl as resolveMediaUrl, findMediaByType } from '@/utils/media.utils';
import { useProfiNounulStore } from '@/stores/authProfilNounuStore';
import { useAuthStore } from '@/stores/auth.store';
import { useProfileMedia } from '@/composables/useProfileMedia';
import { useLikes } from '@/composables/useLikes';
import ImageCropper from '@/components/ui/ImageCropper.vue';
import { useChatStore } from '@/stores/chatStore';
import axios from 'axios';
import { useNounuProfile, useNounuProfileById } from '@/features/profile/hooks/useProfile';
import { useNounuReviews } from '@/features/reviews/hooks/useReviews';

const router = useRouter();
const route = useRoute();
const nounuStore = useProfiNounulStore();
const authStore = useAuthStore();
const chatStore = useChatStore();
const { fetchSingleStatus, toggleLike, isLiked, getLikeCount } = useLikes();

const viewModeId = computed(() => (route.params.id as string) || '');
const isViewMode = computed(() => !!viewModeId.value);

// TanStack Query for profile data
const { data: profileData, isLoading: profileLoading, refetch: refetchProfile } = useNounuProfile();
const { data: viewModeProfileData } = useNounuProfileById(viewModeId.value);
const { data: reviewsData } = useNounuReviews(viewModeId.value);

const profile = ref<any>(null);
const userMedias = ref<any[]>([]);
const loading = ref(false);
const fetchingProfile = ref(false);

const reviewData = reactive({
  reviews: [] as any[],
  averageRating: 0,
  totalReviews: 0,
  hasNextPage: false,
  currentPage: 1,
});
const reviewsLoading = ref(false);

const fetchProfile = async () => {
  if (fetchingProfile.value) return;
  try {
    fetchingProfile.value = true;
    loading.value = true;
    mediaError.value = null;

    if (isViewMode.value) {
      const data = viewModeProfileData.value;
      profile.value = data;
      userMedias.value = data?.user?.medias || [];
    } else {
      // Use TanStack Query data for own profile
      if (profileData.value) {
        profile.value = profileData.value;
        userMedias.value = profileData.value?.user?.medias || [];
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

const allPrefs = computed(() => profile.value?.preferences || []);

const dedupByParamId = (items: any[]) => {
  const seen = new Set();
  return items.filter((item: any) => {
    const id = item.id ?? item.name;
    if (seen.has(id)) return false;
    seen.add(id);
    return true;
  });
};

const serviceTypes = computed(() => dedupByParamId(allPrefs.value.filter((p: any) => p.typeServices).map((p: any) => p.typeServices).filter(Boolean)));
const competences = computed(() => dedupByParamId(allPrefs.value.filter((p: any) => p.competanceSpecifique).map((p: any) => p.competanceSpecifique).filter(Boolean)));
const zones = computed(() => dedupByParamId(allPrefs.value.filter((p: any) => p.zoneDeTravail).map((p: any) => p.zoneDeTravail).filter(Boolean)));
const langues = computed(() => dedupByParamId(allPrefs.value.filter((p: any) => p.langueParler).map((p: any) => p.langueParler).filter(Boolean)));

const horaireDisponible = computed(() => allPrefs.value.find((p: any) => p.horaireDisponible)?.horaireDisponible || null);
const frequence = computed(() => allPrefs.value.find((p: any) => p.frequenceDesServices)?.frequenceDesServices || null);
const gardeEnfants = computed(() => allPrefs.value.find((p: any) => p.gardeEnfants)?.gardeEnfants || null);
const trancheAge = computed(() => allPrefs.value.find((p: any) => p.trancheAgeEnfants)?.trancheAgeEnfants || null);
const equipementMenager = computed(() => allPrefs.value.find((p: any) => p.equipementMenager)?.equipementMenager || null);
const adresse = computed(() => allPrefs.value.find((p: any) => p.adress)?.adress || null);

const memberSince = computed(() => {
  if (!profile.value?.createdAt) return '—';
  return new Date(profile.value.createdAt).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' });
});

const statusLabel = computed(() => {
  const status = profile.value?.status;
  switch (status) {
    case 'disponible': return 'Disponible';
    case 'occupe': return 'Occupée';
    case 'indisponible': return 'Indisponible';
    default: return status || 'Disponible';
  }
});

const statusColor = computed(() => {
  const status = profile.value?.status;
  switch (status) {
    case 'disponible': return 'bg-green-50 text-green-600';
    case 'occupe': return 'bg-orange-50 text-orange-600';
    case 'indisponible': return 'bg-red-50 text-red-600';
    default: return 'bg-green-50 text-green-600';
  }
});

const statusDot = computed(() => {
  const status = profile.value?.status;
  switch (status) {
    case 'disponible': return 'bg-green-400';
    case 'occupe': return 'bg-orange-400';
    case 'indisponible': return 'bg-red-400';
    default: return 'bg-green-400';
  }
});

const certifLabel = computed(() => {
  const certif = profile.value?.certif;
  switch (certif) {
    case 'Approved': return 'Certifiée';
    case 'Pending': return 'Certification en attente';
    case 'Rejected': return 'Non certifiée';
    default: return 'Certification en attente';
  }
});

const certifColor = computed(() => {
  const certif = profile.value?.certif;
  switch (certif) {
    case 'Approved': return 'bg-teal-50 text-teal-600';
    case 'Pending': return 'bg-yellow-50 text-yellow-600';
    case 'Rejected': return 'bg-red-50 text-red-600';
    default: return 'bg-yellow-50 text-yellow-600';
  }
});

const mapProfileForEdit = (data: any) => {
  const prefs = data.preferences || [];
  const getPrefNames = (key: string) => prefs.filter((p: any) => p[key]).map((p: any) => p[key].name).filter(Boolean);
  const getPrefFirst = (key: string) => {
    const found = prefs.find((p: any) => p[key]);
    return found ? [found[key].name] : [];
  };

  const profilePhoto = findMediaByType(userMedias.value, 'photo_profil');
  const galleryPhotos = getGalleryUrls(userMedias.value);

  let parsedReferences: any[] = [];
  try {
    parsedReferences = typeof data.references === 'string' ? JSON.parse(data.references) : (data.references || []);
  } catch { parsedReferences = []; }

  let parsedEvaluations: any[] = [];
  try {
    parsedEvaluations = typeof data.evaluationPrecedentes === 'string' ? JSON.parse(data.evaluationPrecedentes) : (data.evaluationPrecedentes || []);
  } catch { parsedEvaluations = []; }

  return {
    id: data.id,
    fullname: data.fullname || '',
    age: data.age || '',
    phone: data.phone || '',
    annees_experience: data.anneesExperience || '',
    tarif_horaire: data.tarifHoraire || '',
    tarif_mensuel: data.tarifMensuel || '',
    urgences: data.urgences || false,
    flexibilite_tarifaire: data.flexibiliteTarifaire || false,
    courte_biographie: data.courteBiographie || '',
    references: parsedReferences,
    evaluation_precedentes: parsedEvaluations,
    image: resolveMediaUrl(profilePhoto),
    gallery: galleryPhotos,
    preferences: {
      adress: getPrefFirst('adress'),
      tranche_age_enfants: getPrefNames('trancheAgeEnfants'),
      competance_specifique: getPrefNames('competanceSpecifique'),
      langue_parler: getPrefNames('langueParler'),
      horaire_disponible: getPrefNames('horaireDisponible'),
      zone_de_travail: getPrefNames('zoneDeTravail'),
      certifications_criteres: getPrefNames('certificationsCriteres'),
    },
  };
};

const goToEdit = () => {
  if (profile.value) {
    const mapped = mapProfileForEdit(profile.value);
    nounuStore.ChangeInputToEdit(mapped);
  }
  router.push({ name: 'AUTH_PROFILE_NOUNU', query: { edit: 'true' } });
};

const goToCreateProfile = () => {
  authStore.setUpdateProfil(false, '');
  nounuStore.state.StepProfil = 1;
  router.push({ name: 'AUTH_PROFILE_NOUNU' });
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

const onToggleLike = async () => {
  if (!viewModeId.value) return;
  const result = await toggleLike(viewModeId.value);
  if (result === null) {
    router.push({ name: 'AUTH_SIGN_IN' });
  }
};

const contactNounu = async () => {
  if (!profile.value?.id) return;
  try {
    const userId = profile.value.user?.id || profile.value.userId;
    if (!userId) return;
    const room = await chatStore.findOrCreateRoom(userId, profile.value.id);
    if (room?.id) {
      router.push({ name: 'CHAT_MESSAGE_DETAIL', params: { id: room.id } });
    }
  } catch (e: any) {
    if (e?.status === 401) {
      router.push({ name: 'AUTH_SIGN_IN' });
    }
  }
};

onMounted(async () => {
  if (isViewMode.value) {
    await fetchProfile();
    fetchReviews();
    fetchSingleStatus(viewModeId.value);
  } else {
    // Use TanStack Query data for own profile
    if (profileData.value) {
      profile.value = profileData.value;
      userMedias.value = profileData.value?.user?.medias || [];
    }
  }
});

// Watch for TanStack Query data changes (for own profile)
watch(profileData, (newData) => {
  if (!isViewMode.value && newData) {
    profile.value = newData;
    userMedias.value = newData?.user?.medias || [];
  }
});

const fetchReviews = async (page = 1, append = false) => {
  if (!viewModeId.value) return;
  try {
    reviewsLoading.value = true;
    const data = reviewsData.value;
    if (data) {
      if (append) {
        reviewData.reviews = [...reviewData.reviews, ...(Array.isArray(data) ? data : (data?.data || []))];
      } else {
        reviewData.reviews = Array.isArray(data) ? data : (data?.data || []);
      }
      reviewData.averageRating = data?.averageRating || 0;
      reviewData.totalReviews = data?.totalReviews || 0;
      reviewData.hasNextPage = data?.pagination?.hasNextPage ?? false;
      reviewData.currentPage = page;
    }
  } catch {
    // silent fail
  } finally {
    reviewsLoading.value = false;
  }
};

const loadMoreReviews = () => {
  if (reviewData.hasNextPage && !reviewsLoading.value) {
    fetchReviews(reviewData.currentPage + 1, true);
  }
};

const getReviewerName = (review: any) => {
  return review.reviewer?.parents?.[0]?.fullname || review.reviewer?.slug || 'Anonyme';
};

const getReviewerInitial = (review: any) => {
  const name = getReviewerName(review);
  return name?.[0]?.toUpperCase() || 'A';
};

const getReviewerAvatar = (review: any) => {
  const medias = review.reviewer?.medias || [];
  const profileMedia = medias.find((m: any) => m.typeMedia?.slug === 'profil' || m.typeMedia?.slug === 'photo_profil') || medias[0];
  if (!profileMedia) return undefined;
  return resolveMediaUrl(profileMedia);
};

const formatReviewDate = (dateStr: string) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' });
};
</script>
