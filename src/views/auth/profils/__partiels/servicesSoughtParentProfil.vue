<template>
  <IonContent class="ion-padding h-full">
    <div class="flex justify-center mb-8">
      <HeadingText text="Services recherchés" size="medium" />
    </div>

    <div class="flex flex-col gap-4">
      <div class="w-full flex flex-col gap-2">
        <div class="grid grid-cols-2 gap-2 w-full mb-8 hidden">
          <div
            v-for="(item, index) in Date_type_of_service_sought"
            :key="index"
            class="flex gap-2"
          >
            <div
              @click="toggleActiveMenu_type_of_service_sought(index)"
              class="flex justify-center font-love text-sm font-semibold p-2 w-full text-center border-zinc-500/50 rounded-lg"
              :class="item.actived ? 'bg-primary text-white' : 'border-[1px]'"
            >
              {{ item.name }}
            </div>
          </div>
        </div>
      </div>

      <InputBoxForm
        label="Garde d'enfants"
        type="text"
        name="garde_enfants"
        placeholder="Nounou à temps plein, partiel, baby-sitting occasionnel"
        v-model="useProfilStore().state.ServicesRecherches.garde_enfants"
        :error="useProfilStore().state.in_error"
        :options="DataChildCares?.parameter"
        optionName="name"
      />

      <InputBoxForm
        label="Aide ménagère"
        type="text"
        name="aide_menagere"
        placeholder="Femmes de ménage pour entretien de la maison, repassage"
        v-model="useProfilStore().state.ServicesRecherches.aide_menagere"
        :error="useProfilStore().state.in_error"
        :options="DataHousekeepers?.parameter"
        optionName="name"
      />

      <InputBoxForm
        label="Fréquence des services "
        type="text"
        name="frequence_des_services"
        placeholder="Toutes (Nounou à temps plein, partiel) ou ponctuels."
        v-model="
          useProfilStore().state.ServicesRecherches.frequence_des_services
        "
        :error="useProfilStore().state.in_error"
        :options="DataServiceFrequency?.parameter"
        optionName="name"
      />

      <InputBoxForm
        label="Horaires souhaités "
        type="text"
        name="horaire_souhaites"
        placeholder="Matin, après-midi, soir, week-end, en urgence"
        v-model="useProfilStore().state.ServicesRecherches.horaire_souhaites"
        :error="useProfilStore().state.in_error"
        :options="DataDesiredTimes?.parameter"
        optionName="name"
      />
    </div>
  </IonContent>
</template>

<script setup lang="ts">
import InputBoxForm from "@/components/forms/inputBoxForm.vue";
import InputForm from "@/components/forms/inputForm.vue";
import HeadingText from "@/components/texts/headingText.vue";
import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { SettingServices } from "@/services/setting.services";
import { useProfilStore } from "@/stores/authProfilStore";
import { IonContent } from "@ionic/vue";
import { useQuery } from "@tanstack/vue-query";
import { reactive, ref } from "vue";

// TYPE OF SERVICE
const activeMenu_type_of_service_sought = ref(0);
const ListHousekeepers = async () =>
  await SettingServices().listSetting(URL_API_ROUTE.SETTING_HOUSEKEEPER);
const {
  data: DataHousekeepers,
  error: ErrorHousekeepers,
  isLoading: LoadingHousekeepers,
  isError: ISErrorHousekeepers,
} = useQuery({
  queryKey: ["ListHousekeepers"],
  queryFn: ListHousekeepers,
});

const ListChildCares = async () =>
  await SettingServices().listSetting(URL_API_ROUTE.SETTING_CHILD_CARE);
const {
  data: DataChildCares,
  error: ErrorChildCares,
  isLoading: LoadingChildCares,
  isError: ISErrorChildCares,
} = useQuery({
  queryKey: ["ListChildCares"],
  queryFn: ListChildCares,
});

const ListServiceFrequency = async () =>
  await SettingServices().listSetting(URL_API_ROUTE.SETTING_SERVICE_FREQUENCY);
const {
  data: DataServiceFrequency,
  error: ErrorServiceFrequency,
  isLoading: LoadingServiceFrequency,
  isError: ISErrorServiceFrequency,
} = useQuery({
  queryKey: ["ListServiceFrequency"],
  queryFn: ListServiceFrequency,
});

const ListDesiredTimes = async () =>
  await SettingServices().listSetting(URL_API_ROUTE.SETTING_DESIRED_TIMES);
const {
  data: DataDesiredTimes,
  error: ErrorDesiredTimes,
  isLoading: LoadingDesiredTimes,
  isError: ISErrorDesiredTimes,
} = useQuery({
  queryKey: ["ListDesiredTimes"],
  queryFn: ListDesiredTimes,
});

const Date_type_of_service_sought = reactive([
  {
    name: "Garde d’enfants",
    actived: true,
  },
  {
    name: "Aide ménagère",
    actived: false,
  },
]);

const toggleActiveMenu_type_of_service_sought = (index: number) => {
  Date_type_of_service_sought.forEach((menu, i) => {
    menu.actived = i === index;

    if (menu.actived) {
      activeMenu_type_of_service_sought.value = index;
    }
  });
};
//End - TYPE OF SERVICE
</script>
