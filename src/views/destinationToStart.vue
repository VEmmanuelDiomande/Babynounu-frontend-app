<template>
  <IonPage id="main-content">
    <IonContent>
      <section class="h-screen">
        <!-- Header -->
        <div
          class="h-[38vh] flex flex-col gap-2 items-center text-center w-10/12 pt-8 m-auto"
        >
          <img
            src="/images/logos/logo_babynounu_2.png"
            class="h-[120px]"
            alt="Logo Baby Nounu"
          />
          <div class="flex flex-col font-love gap-1">
            <span class="text-ng w-11/12 m-auto"
              >Confiez votre enfant à des professionnels qualifiés et
              engagés.</span
            >
          </div>
        </div>

        <!-- Content -->
        <div class="flex flex-col gap-6 w-11/12 m-auto font-love">
          <div class="flex flex-col gap-2">
            <span class="font-love text-ng"
              >Que recherchez-vous principalement sur Baby Nounus ?</span
            >
            <span class="text-lg font-extrabold"> Continuez en tant que </span>
          </div>

          <div class="flex flex-col gap-2 font-love">
            <div v-for="(item, index) in destinationOptions" :key="index">
              <button
                @click="redirectToPath(item.path)"
                class="border-[1px] ring-[1px] ring-primary/30 bg-primary/5 flex gap-4 p-4 rounded-xl text-zinc-700"
                :disabled="isButtonDisabled(item.name)"
                :class="{
                  'opacity-50 cursor-not-allowed': isButtonDisabled(item.name),
                }"
              >
                <div class="w-14 h-14">
                  <img v-lazy="item.icon" :alt="`Icône ${item.name}`" />
                </div>

                <div class="flex flex-col text-start gap-2 w-10/12">
                  <span class="text-ng text-primary font-bold">
                    {{ item.name }}
                  </span>
                  <span class="text-sm">{{ item.description }}</span>
                </div>
              </button>
            </div>
          </div>
        </div>
      </section>
    </IonContent>
  </IonPage>
</template>

<script lang="ts" setup>
import { IonContent, IonPage } from "@ionic/vue";
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useUserStore } from "@/stores/user.store";
import { StorageUtils } from "@/utils/store.utils";
import { useTabHook } from "@/hooks/menuHooks/useTab.hook";

// Définition du type pour les options de destination
interface DestinationOption {
  name: string;
  isAll: boolean;
  path: string;
  icon: string;
  description: string;
}

// Liste des options de destination
const destinationOptions: DestinationOption[] = [
  {
    name: "Parents",
    isAll: true,
    path: "/home/nounus",
    icon: "/images/starter/icon_job_start.png",
    description: "Vous êtes parent et recherchez une nounou ou une ménagère ?",
  },
  {
    name: "Nounu/Ménagère",
    isAll: true,
    path: "/home/jobs",
    icon: "/images/starter/icon_famille_start.png",
    description:
      "Vous êtes une nounou ou une ménagère à la recherche d'un emploi ? ",
  },
  {
    name: "Operateurs",
    isAll: true,
    path: "/admin/chats",
    icon: "/images/starter/icon_admin_start.png",
    description: "Gestionnaires, services clients et opérateurs de Baby Nounus",
  },
];

// Référence pour le rôle de l'utilisateur
const userRole = ref<string | null>(null);

// Récupération du rôle au montage du composant
onMounted(async () => {
  const roleData = await StorageUtils().getStore("nRole");
  userRole.value = roleData?.value || null;
});

/**
 * Détermine si un bouton doit être désactivé en fonction du rôle de l'utilisateur
 * @param buttonName Nom du bouton à vérifier
 * @returns Booléen indiquant si le bouton doit être désactivé
 */
const isButtonDisabled = (buttonName: string): boolean => {
  // Si pas connecté (userRole null), tous les boutons sont actifs
  if (!userRole.value) return false;

  // Si admin, désactiver Parents et Nounu/Ménagère
  if (userRole.value === "admin") {
    return buttonName === "Parents" || buttonName === "Nounu/Ménagère";
  }

  // Si autre rôle que admin, désactiver Operateurs
  return buttonName === "Operateurs";
};

const router = useRouter();
const route = useRoute();
const { state } = useTabHook();

/**
 * Redirige l'utilisateur vers le chemin spécifié
 * @param path Chemin de redirection
 */
const redirectToPath = async (path: string): Promise<void> => {
  // Vérification pour l'accès à la section admin
  const adminId = await StorageUtils().getStore("nAdmin_Id");

  if (adminId?.value == null && path === "/admin/chats") {
    router.push({ name: "SignAuth" });
    return;
  }

  // Mise à jour du type de page et redirection
  await Promise.all([
    StorageUtils().removeStore("nPageType"),
    StorageUtils().setStore("nPageType", path),
  ]);

  useUserStore().pageType = path;
  router.replace(path);
};
</script>

<style scoped>
/* Styles spécifiques au composant */
</style>
