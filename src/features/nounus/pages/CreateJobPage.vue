<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6 py-6">
    <!-- Step indicator + back -->
    <div class="flex items-center justify-between mb-4">
      <span class="font-love text-xs text-gray-400">Étape {{ jobStore.state.stepJob }} / 9</span>
      <button
        v-if="jobStore.state.stepJob > 1"
        @click="jobStore.previousStep"
        class="px-3 py-1.5 rounded-xl bg-gray-50 text-gray-500 hover:bg-gray-100 font-love text-xs font-medium transition-colors flex items-center gap-1.5"
      >
        <i class="ri ri-arrow-left-s-line" style="font-size: 16px;"></i>
        Retour
      </button>
    </div>

    <!-- Progress bar -->
    <div class="h-1.5 bg-rose-50 rounded-full mb-6 overflow-hidden">
      <div
        class="h-full bg-rose-400 rounded-full transition-all duration-300"
        :style="{ width: `${(jobStore.state.stepJob / 9) * 100}%` }"
      ></div>
    </div>

    <!-- Step content -->
    <div class="bg-white rounded-3xl p-5 sm:p-6 shadow-sm">
      <!-- Error -->
      <div v-if="jobStore.state.in_error?.message" class="mb-4 bg-red-50 border border-red-100 rounded-xl p-3 flex items-center gap-2">
        <i class="ri ri-error-warning-line text-red-500" style="font-size: 18px;"></i>
        <p class="font-love text-xs text-red-600">{{ jobStore.state.in_error.message }}</p>
      </div>

      <!-- Step 1: Informations générales -->
      <div v-if="jobStore.state.stepJob === 1" class="space-y-4">
        <h2 class="font-anton text-lg text-gray-900">Informations générales</h2>
        <div>
          <label class="block font-love text-xs font-medium text-gray-700 mb-1.5">Titre de l'offre *</label>
          <input
            v-model="jobStore.state.informationsGenerales.titre"
            type="text"
            placeholder="Ex: Nounou pour 2 enfants"
            class="w-full font-love text-sm bg-gray-50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:bg-white transition-all"
          />
        </div>
        <div>
          <label class="block font-love text-xs font-medium text-gray-700 mb-1.5">Description * (min. 50 caractères)</label>
          <textarea
            v-model="jobStore.state.informationsGenerales.description"
            rows="4"
            placeholder="Décrivez vos besoins..."
            class="w-full font-love text-sm bg-gray-50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:bg-white transition-all resize-none"
          ></textarea>
          <p class="font-love text-[10px] text-gray-400 mt-1">{{ jobStore.state.informationsGenerales.description.length }} / 50 caractères minimum</p>
        </div>
        <div>
          <label class="block font-love text-xs font-medium text-gray-700 mb-1.5">Moyens de contact *</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="item in jobStore.DataMoyensContact"
              :key="item.value"
              @click="toggleSelection(jobStore.state.informationsGenerales.moyens_de_contact, item)"
              :class="[
                'px-3 py-2 rounded-xl font-love text-xs font-medium transition-all border',
                isSelected(jobStore.state.informationsGenerales.moyens_de_contact, item)
                  ? 'bg-rose-400 text-white border-rose-400'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              ]"
            >
              {{ item.name }}
            </button>
          </div>
        </div>
        <div>
          <label class="block font-love text-xs font-medium text-gray-700 mb-1.5">Localisation *</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="item in preferenceOptions.adress"
              :key="item.id"
              @click="toggleSelection(jobStore.state.informationsGenerales.adress, item)"
              :class="[
                'px-3 py-2 rounded-xl font-love text-xs font-medium transition-all border',
                isSelected(jobStore.state.informationsGenerales.adress, item)
                  ? 'bg-rose-400 text-white border-rose-400'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              ]"
            >
              {{ item.name }}
            </button>
          </div>
        </div>
        <div>
          <label class="block font-love text-xs font-medium text-gray-700 mb-1.5">Zone de travail *</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="item in preferenceOptions.zone_de_travail"
              :key="item.id"
              @click="toggleSelection(jobStore.state.informationsGenerales.zone_de_travail, item)"
              :class="[
                'px-3 py-2 rounded-xl font-love text-xs font-medium transition-all border',
                isSelected(jobStore.state.informationsGenerales.zone_de_travail, item)
                  ? 'bg-rose-400 text-white border-rose-400'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              ]"
            >
              {{ item.name }}
            </button>
          </div>
        </div>
      </div>

      <!-- Step 2: Type de service -->
      <div v-if="jobStore.state.stepJob === 2" class="space-y-4">
        <h2 class="font-anton text-lg text-gray-900">Type de service</h2>
        <div>
          <label class="block font-love text-xs font-medium text-gray-700 mb-1.5">Types de services *</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="item in preferenceOptions.type_services"
              :key="item.id"
              @click="selectSingle(jobStore.state.typeService.type_services, item)"
              :class="[
                'px-3 py-2 rounded-xl font-love text-xs font-medium transition-all border',
                isSelected(jobStore.state.typeService.type_services, item)
                  ? 'bg-rose-400 text-white border-rose-400'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              ]"
            >
              {{ item.name }}
            </button>
          </div>
        </div>
        <div>
          <label class="block font-love text-xs font-medium text-gray-700 mb-1.5">Combinaison de services *</label>
          <div class="space-y-2">
            <button
              v-for="item in jobStore.DataCombinationServices"
              :key="item.id"
              @click="selectSingle(jobStore.state.typeService.combinaison_service, item)"
              :class="[
                'w-full text-left px-4 py-3 rounded-xl font-love text-xs font-medium transition-all border',
                isSelected(jobStore.state.typeService.combinaison_service, item)
                  ? 'bg-rose-400 text-white border-rose-400'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              ]"
            >
              {{ item.name }}
            </button>
          </div>
        </div>
        <div>
          <label class="block font-love text-xs font-medium text-gray-700 mb-1.5">Tâches *</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="item in preferenceOptions.taches"
              :key="item.id"
              @click="toggleSelection(jobStore.state.typeService.taches, item)"
              :class="[
                'px-3 py-2 rounded-xl font-love text-xs font-medium transition-all border',
                isSelected(jobStore.state.typeService.taches, item)
                  ? 'bg-rose-400 text-white border-rose-400'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              ]"
            >
              {{ item.name }}
            </button>
          </div>
        </div>
      </div>

      <!-- Step 3: Détails de la mission -->
      <div v-if="jobStore.state.stepJob === 3" class="space-y-4">
        <h2 class="font-anton text-lg text-gray-900">Détails de la mission</h2>
        <div>
          <label class="block font-love text-xs font-medium text-gray-700 mb-1.5">Fréquence des services *</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="item in preferenceOptions.frequence_des_services"
              :key="item.id"
              @click="selectSingle(jobStore.state.detailsMission.frequence_des_services, item)"
              :class="[
                'px-3 py-2 rounded-xl font-love text-xs font-medium transition-all border',
                isSelected(jobStore.state.detailsMission.frequence_des_services, item)
                  ? 'bg-rose-400 text-white border-rose-400'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              ]"
            >
              {{ item.name }}
            </button>
          </div>
        </div>
        <div>
          <label class="block font-love text-xs font-medium text-gray-700 mb-1.5">Horaires souhaités *</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="item in preferenceOptions.horaire_souhaites"
              :key="item.id"
              @click="toggleSelection(jobStore.state.detailsMission.horaire_souhaites, item)"
              :class="[
                'px-3 py-2 rounded-xl font-love text-xs font-medium transition-all border',
                isSelected(jobStore.state.detailsMission.horaire_souhaites, item)
                  ? 'bg-rose-400 text-white border-rose-400'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              ]"
            >
              {{ item.name }}
            </button>
          </div>
        </div>
        <div>
          <label class="block font-love text-xs font-medium text-gray-700 mb-1.5">Inclus week-end ? *</label>
          <div class="flex gap-2">
            <button
              @click="jobStore.state.detailsMission.inclus_weekend = [{ name: 'Oui', value: true }]"
              :class="[
                'px-4 py-2 rounded-xl font-love text-xs font-medium transition-all border',
                jobStore.state.detailsMission.inclus_weekend[0]?.value === true
                  ? 'bg-rose-400 text-white border-rose-400'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              ]"
            >
              Oui
            </button>
            <button
              @click="jobStore.state.detailsMission.inclus_weekend = [{ name: 'Non', value: false }]"
              :class="[
                'px-4 py-2 rounded-xl font-love text-xs font-medium transition-all border',
                jobStore.state.detailsMission.inclus_weekend[0]?.value === false
                  ? 'bg-rose-400 text-white border-rose-400'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              ]"
            >
              Non
            </button>
          </div>
        </div>
      </div>

      <!-- Step 4: Nounou -->
      <div v-if="jobStore.state.stepJob === 4" class="space-y-4">
        <h2 class="font-anton text-lg text-gray-900">Informations sur les enfants</h2>
        <div>
          <label class="block font-love text-xs font-medium text-gray-700 mb-1.5">Nombre d'enfants</label>
          <input
            v-model="jobStore.state.nounou.nombre_enfants"
            type="text"
            placeholder="Ex: 2"
            class="w-full font-love text-sm bg-gray-50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:bg-white transition-all"
          />
        </div>
        <div>
          <label class="block font-love text-xs font-medium text-gray-700 mb-1.5">Garde d'enfants</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="item in preferenceOptions.garde_enfants"
              :key="item.id"
              @click="selectSingle(jobStore.state.nounou.garde_enfants, item)"
              :class="[
                'px-3 py-2 rounded-xl font-love text-xs font-medium transition-all border',
                isSelected(jobStore.state.nounou.garde_enfants, item)
                  ? 'bg-rose-400 text-white border-rose-400'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              ]"
            >
              {{ item.name }}
            </button>
          </div>
        </div>
        <div>
          <label class="block font-love text-xs font-medium text-gray-700 mb-1.5">Besoins spécifiques</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="item in preferenceOptions.besions_specifiques"
              :key="item.id"
              @click="toggleSelection(jobStore.state.nounou.besions_specifiques, item)"
              :class="[
                'px-3 py-2 rounded-xl font-love text-xs font-medium transition-all border',
                isSelected(jobStore.state.nounou.besions_specifiques, item)
                  ? 'bg-rose-400 text-white border-rose-400'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              ]"
            >
              {{ item.name }}
            </button>
          </div>
        </div>
        <div>
          <label class="block font-love text-xs font-medium text-gray-700 mb-1.5">Compétences spécifiques</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="item in preferenceOptions.competance_specifique"
              :key="item.id"
              @click="toggleSelection(jobStore.state.nounou.competance_specifique, item)"
              :class="[
                'px-3 py-2 rounded-xl font-love text-xs font-medium transition-all border',
                isSelected(jobStore.state.nounou.competance_specifique, item)
                  ? 'bg-rose-400 text-white border-rose-400'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              ]"
            >
              {{ item.name }}
            </button>
          </div>
        </div>
        <div>
          <label class="block font-love text-xs font-medium text-gray-700 mb-1.5">Langues parlées</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="item in preferenceOptions.langue_parler"
              :key="item.id"
              @click="toggleSelection(jobStore.state.nounou.langue_parler, item)"
              :class="[
                'px-3 py-2 rounded-xl font-love text-xs font-medium transition-all border',
                isSelected(jobStore.state.nounou.langue_parler, item)
                  ? 'bg-rose-400 text-white border-rose-400'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              ]"
            >
              {{ item.name }}
            </button>
          </div>
        </div>
      </div>

      <!-- Step 5: Femme de ménage -->
      <div v-if="jobStore.state.stepJob === 5 && jobStore.state.typeService.type_services.some((s: any) => s.slug === 'menagere')" class="space-y-4">
        <h2 class="font-anton text-lg text-gray-900">Aide ménagère</h2>
        <div>
          <label class="block font-love text-xs font-medium text-gray-700 mb-1.5">Aide ménagère</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="item in preferenceOptions.aide_menagere"
              :key="item.id"
              @click="toggleSelection(jobStore.state.femmeDeMenage.aide_menagere, item)"
              :class="[
                'px-3 py-2 rounded-xl font-love text-xs font-medium transition-all border',
                isSelected(jobStore.state.femmeDeMenage.aide_menagere, item)
                  ? 'bg-rose-400 text-white border-rose-400'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              ]"
            >
              {{ item.name }}
            </button>
          </div>
        </div>
        <div>
          <label class="block font-love text-xs font-medium text-gray-700 mb-1.5">Équipement ménager</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="item in preferenceOptions.equipement_menager"
              :key="item.id"
              @click="toggleSelection(jobStore.state.femmeDeMenage.equipement_menager, item)"
              :class="[
                'px-3 py-2 rounded-xl font-love text-xs font-medium transition-all border',
                isSelected(jobStore.state.femmeDeMenage.equipement_menager, item)
                  ? 'bg-rose-400 text-white border-rose-400'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              ]"
            >
              {{ item.name }}
            </button>
          </div>
        </div>
      </div>

      <!-- Step 6: Critères de sélection -->
      <div v-if="jobStore.state.stepJob === 6" class="space-y-4">
        <h2 class="font-anton text-lg text-gray-900">Critères de sélection</h2>
        <div>
          <label class="block font-love text-xs font-medium text-gray-700 mb-1.5">Expérience minimum requise ? *</label>
          <div class="space-y-2">
            <button
              v-for="item in jobStore.DataExperienceMinimum"
              :key="item.name"
              @click="selectSingle(jobStore.state.criteres.experience_minimun, item)"
              :class="[
                'w-full text-left px-4 py-3 rounded-xl font-love text-xs font-medium transition-all border',
                isSelected(jobStore.state.criteres.experience_minimun, item)
                  ? 'bg-rose-400 text-white border-rose-400'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              ]"
            >
              {{ item.name }}
            </button>
          </div>
        </div>
        <div v-if="jobStore.state.criteres.experience_minimun[0]?.value === true">
          <label class="block font-love text-xs font-medium text-gray-700 mb-1.5">Années d'expérience *</label>
          <input
            v-model="jobStore.state.criteres.annee_experience"
            type="text"
            placeholder="Ex: 3"
            class="w-full font-love text-sm bg-gray-50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:bg-white transition-all"
          />
        </div>
        <div>
          <label class="block font-love text-xs font-medium text-gray-700 mb-1.5">Certifications</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="item in preferenceOptions.certifications"
              :key="item.id"
              @click="toggleSelection(jobStore.state.criteres.certifications, item)"
              :class="[
                'px-3 py-2 rounded-xl font-love text-xs font-medium transition-all border',
                isSelected(jobStore.state.criteres.certifications, item)
                  ? 'bg-rose-400 text-white border-rose-400'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              ]"
            >
              {{ item.name }}
            </button>
          </div>
        </div>
        <div>
          <label class="block font-love text-xs font-medium text-gray-700 mb-1.5">Critères de sélection *</label>
          <div class="flex flex-wrap gap-2">
            <button
              v-for="item in preferenceOptions.criteres_selections"
              :key="item.id"
              @click="toggleSelection(jobStore.state.criteres.criteres_selections, item)"
              :class="[
                'px-3 py-2 rounded-xl font-love text-xs font-medium transition-all border',
                isSelected(jobStore.state.criteres.criteres_selections, item)
                  ? 'bg-rose-400 text-white border-rose-400'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              ]"
            >
              {{ item.name }}
            </button>
          </div>
        </div>
      </div>

      <!-- Step 7: Rémunération -->
      <div v-if="jobStore.state.stepJob === 7" class="space-y-4">
        <h2 class="font-anton text-lg text-gray-900">Rémunération</h2>
        <div>
          <label class="block font-love text-xs font-medium text-gray-700 mb-1.5">Tarif proposé (FCFA) *</label>
          <input
            v-model="jobStore.state.remuneration.tarifPropose"
            type="text"
            placeholder="Ex: 5000"
            class="w-full font-love text-sm bg-gray-50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:bg-white transition-all"
          />
        </div>
        <div>
          <label class="block font-love text-xs font-medium text-gray-700 mb-1.5">Tarif négociable ? *</label>
          <div class="space-y-2">
            <button
              v-for="item in jobStore.DataNegociable"
              :key="item.name"
              @click="selectSingle(jobStore.state.remuneration.negociable, item)"
              :class="[
                'w-full text-left px-4 py-3 rounded-xl font-love text-xs font-medium transition-all border',
                isSelected(jobStore.state.remuneration.negociable, item)
                  ? 'bg-rose-400 text-white border-rose-400'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              ]"
            >
              {{ item.name }}
            </button>
          </div>
        </div>
      </div>

      <!-- Step 8: Date de début -->
      <div v-if="jobStore.state.stepJob === 8" class="space-y-4">
        <h2 class="font-anton text-lg text-gray-900">Date de début</h2>
        <div>
          <label class="block font-love text-xs font-medium text-gray-700 mb-1.5">Date de début *</label>
          <input
            v-model="jobStore.state.dateDebut.dateDebut"
            type="date"
            class="w-full font-love text-sm bg-gray-50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:bg-white transition-all"
          />
        </div>
        <div>
          <label class="block font-love text-xs font-medium text-gray-700 mb-1.5">Mission urgente ? *</label>
          <div class="space-y-2">
            <button
              v-for="item in jobStore.DataUrgence"
              :key="item.name"
              @click="selectSingle(jobStore.state.dateDebut.missionUrgente, item)"
              :class="[
                'w-full text-left px-4 py-3 rounded-xl font-love text-xs font-medium transition-all border',
                isSelected(jobStore.state.dateDebut.missionUrgente, item)
                  ? 'bg-rose-400 text-white border-rose-400'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-gray-300'
              ]"
            >
              {{ item.name }}
            </button>
          </div>
        </div>
      </div>

      <!-- Step 9: Autres infos -->
      <div v-if="jobStore.state.stepJob === 9" class="space-y-4">
        <h2 class="font-anton text-lg text-gray-900">Informations complémentaires</h2>
        <div>
          <label class="block font-love text-xs font-medium text-gray-700 mb-1.5">Description complémentaire * (min. 100 caractères)</label>
          <textarea
            v-model="jobStore.state.autresInfos.descriptionComplementaire"
            rows="5"
            placeholder="Ajoutez toute information utile..."
            class="w-full font-love text-sm bg-gray-50 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-rose-100 focus:bg-white transition-all resize-none"
          ></textarea>
          <p class="font-love text-[10px] text-gray-400 mt-1">{{ jobStore.state.autresInfos.descriptionComplementaire.length }} / 100 caractères minimum</p>
        </div>
        <div>
          <label class="block font-love text-xs font-medium text-gray-700 mb-1.5">Photos / Vidéos (optionnel)</label>
          <input
            type="file"
            multiple
            accept="image/*,video/*"
            @change="handleFileUpload"
            class="w-full font-love text-sm text-gray-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-medium file:bg-rose-50 file:text-rose-500 hover:file:bg-rose-100 transition-all"
          />
        </div>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-3 mt-6 pt-5 border-t border-gray-50">
        <button
          v-if="jobStore.state.stepJob > 1"
          @click="jobStore.previousStep"
          class="px-4 py-2.5 rounded-xl bg-gray-50 text-gray-600 hover:bg-gray-100 font-love text-sm font-medium transition-colors"
        >
          Précédent
        </button>
        <button
          v-if="jobStore.state.stepJob < 9"
          @click="nextStep"
          :disabled="jobStore.state.loading"
          class="flex-1 py-2.5 rounded-xl bg-rose-400 text-white hover:bg-rose-500 font-love text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          Continuer
          <i class="ri ri-arrow-right-s-line" style="font-size: 16px;"></i>
        </button>
        <button
          v-else
          @click="submitJob"
          :disabled="jobStore.state.loading"
          class="flex-1 py-2.5 rounded-xl bg-rose-400 text-white hover:bg-rose-500 font-love text-sm font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <i v-if="jobStore.state.loading" class="ri ri-loader-4-line animate-spin" style="font-size: 16px;"></i>
          <i v-else class="ri ri-check-line" style="font-size: 16px;"></i>
          {{ jobStore.isUpdateJob ? 'Mettre à jour' : 'Publier l\'offre' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useJobStore } from '@/stores/jobStore';
import { URL_API_ROUTE } from '@/routes/_requests/index.request';
import axios from 'axios';
import { useAllSettings } from '@/features/settings/hooks/useSettings';

const router = useRouter();
const jobStore = useJobStore();

// TanStack Query for settings
const { data: settingsData } = useAllSettings();

type PrefItem = { id: number | string; name: string; slug?: string };

const preferenceOptions = reactive<Record<string, PrefItem[]>>({
  adress: [],
  zone_de_travail: [],
  type_services: [],
  taches: [],
  frequence_des_services: [],
  horaire_souhaites: [],
  garde_enfants: [],
  besions_specifiques: [],
  competance_specifique: [],
  langue_parler: [],
  aide_menagere: [],
  equipement_menager: [],
  certifications: [],
  criteres_selections: [],
});

const slugToKey: Record<string, string> = {
  adresse: 'adress',
  zone: 'zone_de_travail',
  type_service: 'type_services',
  taches: 'taches',
  frequence: 'frequence_des_services',
  horaire_souhaite: 'horaire_souhaites',
  tranche_age: 'garde_enfants',
  garde: 'garde_enfants',
  besoins: 'besions_specifiques',
  competence: 'competance_specifique',
  langue: 'langue_parler',
  aide_menagere: 'aide_menagere',
  equipement: 'equipement_menager',
  certifications: 'certifications',
  criteres_selection: 'criteres_selections',
};

const fetchPreferences = async () => {
  try {
    const data = settingsData.value;
    (data || []).forEach((p: any) => {
      const slug = p?.typeParameter?.slug;
      const key = slugToKey[slug];
      if (key) preferenceOptions[key].push({ id: p.id, name: p.name, slug: p.slug });
    });
    // Fallback: if 'adress' is empty (no parameters seeded under 'adresse' type),
    // use 'zone' parameters since they represent the same geographic areas
    if (preferenceOptions.adress.length === 0 && preferenceOptions.zone_de_travail.length > 0) {
      preferenceOptions.adress = [...preferenceOptions.zone_de_travail];
    }
  } catch (err) {
    console.error('[CreateJobPage] Failed to fetch preferences:', err);
  }
};

const getItemKey = (item: any) => item.id ?? item.value ?? item.name;

const toggleSelection = (arr: any[] | undefined, item: any) => {
  if (!arr) return;
  const key = getItemKey(item);
  const idx = arr.findIndex((x) => getItemKey(x) === key);
  if (idx >= 0) arr.splice(idx, 1);
  else arr.push(item);
};

const selectSingle = (arr: any[] | undefined, item: any) => {
  if (!arr) return;
  arr.splice(0, arr.length, item);
};

const isSelected = (arr: any[] | undefined, item: any) => {
  if (!arr) return false;
  const key = getItemKey(item);
  return arr.some((x) => getItemKey(x) === key);
};

const nextStep = () => {
  const stepHandlers: Record<number, () => void> = {
    1: jobStore.InfoGeneralJob,
    2: jobStore.TypeServiceJob,
    3: jobStore.DetailsMissionJob,
    4: jobStore.NounouJob,
    5: jobStore.FemmeDeMenageJob,
    6: jobStore.CriteresJob,
    7: jobStore.RemunerationJob,
    8: jobStore.DateDebutJob,
  };
  const handler = stepHandlers[jobStore.state.stepJob];
  if (handler) handler();
};

const submitJob = () => {
  jobStore.AutresInfosJob();
};

const handleFileUpload = (e: Event) => {
  const target = e.target as HTMLInputElement;
  if (target.files) {
    jobStore.state.autresInfos.photoVideo = Array.from(target.files);
  }
};

const goBack = () => {
  router.push({ name: 'HOME' });
};

onMounted(() => {
  fetchPreferences();
});
</script>
