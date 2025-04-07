<script setup lang="ts">
import { IonContent, IonFooter } from "@ionic/vue";
import { ref } from "vue";
import SelectTagForm from "../forms/selectTagForm.vue";
import { SettingServices } from "@/services/setting.services";
import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { useQuery } from "@tanstack/vue-query";
import { useNounuStore } from "@/stores/nounu.store";
import AuthButton from "../buttons/authButton.vue";
import { useParentStore } from "@/stores/parent.store";

const props = defineProps([]);
const { searchPreferences, searchValueData } = useNounuStore();
const { searchParentPreferences } = useParentStore();

const CatFilter = ref([
  {
    name: "Nounus",
    ref: "nounus",
  },
  {
    name: "Parents",
    ref: "parents",
  },
]);

const ActivedCardFilter = ref("nounus");
const _ActivedCardFilter = (_ref: any) => {
  ActivedCardFilter.value = _ref;
};

const adresss = ref([]);

const ListLocalizations = async () =>
  await SettingServices().listSetting(URL_API_ROUTE.SETTING_ALL);
const {
  data: DataLocalizations,
  error: ErrorLocalizations,
  isLoading: LoadingLocalizations,
  isError: ISErrorLocalizations,
} = useQuery({
  queryKey: ["ListLocalizations"],
  queryFn: ListLocalizations,
});


const applyFilter = () => {
  if (ActivedCardFilter.value == "nounus") {
    useNounuStore().searchNounu(searchValueData);
  } else {
    useParentStore().searchParent(searchValueData);
  }
}

</script>

<template>
  <IonContent class="font-love">
    <div class="flex flex-col">
      <!--  -->
      <div
        class="bg-primary/20 grid grid-cols-2 gap-2 p-2 w-10/12 m-auto rounded-full"
      >
        <div v-for="cat in CatFilter">
          <div
            class="rounded-full text-center font-bold py-2"
            :class="
              ActivedCardFilter != cat.ref
                ? ' text-primary'
                : 'bg-primary text-white'
            "
            @click="_ActivedCardFilter(cat.ref)"
          >
            {{ cat.name }}
          </div>
        </div>
      </div>

      <!-- Nounus -->
      <div class="w-11/12 flex flex-col gap-4 py-8 m-auto" v-show="ActivedCardFilter == 'nounus'" >
        <div class="z-50">
          <SelectTagForm
            label="Adresse"
            optionName="name"
            :options="DataLocalizations?.parameter['localisations']"
            name="adresse"
            v-model="searchPreferences.adress"
          />
        </div>

        <SelectTagForm
          label="Zone de travail"
          optionName="name"
          :options="DataLocalizations?.parameter['localisations']"
          name="zone_de_travail"
          v-model="searchPreferences.zone_de_travail"
        />

        <SelectTagForm
          label="Heures disponibles"
          optionName="name"
          :options="DataLocalizations?.parameter['horaires-souhaites']"
          name="horaire_disponible"
          v-model="searchPreferences.horaire_disponible"
        />

        <SelectTagForm
          label="Tranches d'age des enfants"
          optionName="name"
          :options="DataLocalizations?.parameter['age-des-enfants']"
          name="tranche_age_enfants"
          v-model="searchPreferences.tranche_age_enfants"
        />

        <SelectTagForm
          label="Comp tences sp cifi ques"
          optionName="name"
          :options="DataLocalizations?.parameter['competences-specifiques']"
          name="competance_specifique"
          v-model="searchPreferences.competance_specifique"
        />

        <SelectTagForm
          label="Langues parl es"
          optionName="name"
          :options="DataLocalizations?.parameter['langues-parlees']"
          name="langue_parler"
          v-model="searchPreferences.langue_parler"
        />
      </div>

      <!-- Parents -->
      <div class="w-11/12 flex flex-col gap-4 py-8 m-auto" v-show="ActivedCardFilter == 'parents'">
        <SelectTagForm
          label="Besoins sp cifi ques"
          optionName="name"
          :options="DataLocalizations?.parameter['besoins-specifique']"
          name="besions_specifiques"
          v-model="searchParentPreferences.besions_specifiques"
        />

        <SelectTagForm
          label="Garde d'enfants"
          optionName="name"
          :options="DataLocalizations?.parameter['age-des-enfants']"
          name="garde_enfants"
          v-model="searchParentPreferences.garde_enfants"
        />

        <SelectTagForm
          label="Aide m nag re"
          optionName="name"
          :options="DataLocalizations?.parameter['aide-menagere']"
          name="aide_menagere"
          v-model="searchParentPreferences.aide_menagere"
        />

        <SelectTagForm
          label="Fr quence des services"
          optionName="name"
          :options="DataLocalizations?.parameter['frequence-de-services']"
          name="frequence_des_services"
          v-model="searchParentPreferences.frequence_des_services"
        />

        <SelectTagForm
          label="Horaires souhait s"
          optionName="name"
          :options="DataLocalizations?.parameter['horaires-souhaites']"
          name="horaire_souhaites"
          v-model="searchParentPreferences.horaire_souhaites"
        />

        <SelectTagForm
          label="Zone g ographique du prestataire"
          optionName="name"
          :options="
            DataLocalizations?.parameter['localisations']
          "
          name="zone_geographique_prestataire"
          v-model="searchParentPreferences.zone_geographique_prestataire"
        />

        <SelectTagForm
          label="Disponibilit  du prestataire"
          optionName="name"
          :options="
            DataLocalizations?.parameter['disponibilite-du-prestataire']
          "
          name="disponibility_du_prestataire"
          v-model="searchParentPreferences.disponibility_du_prestataire"
        />
      </div>
    </div>
  </IonContent>

  <ion-footer class="ion-no-border py-4 px-4 font-love">
    <AuthButton
      :title="'Appliquer'"
      setcolor="bg-primary"
      :loading="useNounuStore().loading"
      @click="applyFilter"
    />
  </ion-footer>
</template>
