<template>
  <IonPage>
    <IonContent class="font-love fixed" slot="fixed">
      <!-- Banner -->
      <PageLoader v-if="LoadingNounu" />
      <ContentProfil
        :DataNounu="DataNounu"
        :id_profil="route.params.id"
        v-else-if="DataNounu && !LoadingNounu"
      />
      <!-- Gestion des erreurs -->
      <div v-else-if="ISErrorNounu" class="text-center mt-8">
        <E404Error />
      </div>

      <!-- Aucun contenu disponible -->
      <div v-else class="text-center mt-8">
        <E404Error />
      </div>
    </IonContent>
  </IonPage>
</template>

<script lang="ts" setup>
import Avatar from "@/components/avatars/avatar.vue";
import ActionProfilButton from "@/components/buttons/actionProfilButton.vue";
import IcIcons from "@/components/icons/IcIcons.vue";
import { GetGreetingUtils } from "@/utils/greeting.utils";
import { IonContent, IonPage } from "@ionic/vue";
import { computed, onMounted, ref } from "vue";
import PropositionJobParentProfil from "./_partials/propositionJobParentProfil.vue";
import { RouterLink, useRoute, useRouter } from "vue-router";
import { useQuery } from "@tanstack/vue-query";
import { URL_API_ROUTE } from "@/routes/_requests/index.request";
import { SettingServices } from "@/services/setting.services";
import CardInfoProfil from "./_partials/cardInfoProfil.vue";
import { StorageUtils } from "@/utils/store.utils";
import ContentProfil from "./_partials/contentProfil.vue";
import PageLoader from "@/components/loaders/pageLoader.vue";
import E404Error from "@/components/errors/e404.error.vue";

//   import IcIcons from "@/components/icons/IcIcons.vue";
const route = useRoute();
const router = useRouter();

const ListProfilNounu = async () => {
  return await SettingServices().listSetting(
    URL_API_ROUTE.NOUNU_ALL + "/" + route.params.id
  );
};



const {
  data: DataNounu,
  error: ErrorNounu,
  isLoading: LoadingNounu,
  isError: ISErrorNounu,
} = useQuery({
  queryKey: ["ListProfilNounu", route.params.id],
  queryFn: ListProfilNounu,
});

const Greeting = ref("Hello");

onMounted(() => {
  Greeting.value = GetGreetingUtils();
});

defineProps(["Type"]);
</script>
<style scoped></style>
