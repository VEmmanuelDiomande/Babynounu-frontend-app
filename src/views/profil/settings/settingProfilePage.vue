<template>
  <ion-page class="font-love">
    <ion-header class="">
      <div class="flex justify-between h-12 items-center">
        <div class="flex flex-row justify-between items-center px-4 w-full">
          <IcIcons
            @click="$router.go(-1)"
            :size="24"
            name="RiArrowLeftLine"
            class="text-black/90"
          ></IcIcons>
          <ion-title class="text-black font-anton text-lg"
            >Paramètres</ion-title
          >
          <span></span>
        </div>
      </div>
    </ion-header>

    <ion-content class="bg-gray-50 font-love">
      <div class="max-w-md mx-auto pb-4 px-4">
        <!-- Section Compte -->
        <div
          class="bg-white rounded-xl shadow-sm mb-6 overflow-hidden font-love"
        >

          <div class="p-4 border-b border-gray-100">
            <h2 class="font-semibold text-lg text-gray-800">Compte</h2>
          </div>
          <ion-list lines="none">
            <ion-item button detail>
              <ion-avatar slot="start" class="w-10 h-10">
                <img v-lazy="GetDataProfil?.image?.originalUrl" alt="Profil" />
              </ion-avatar>
              <span class="font-love">
                <span class="font-medium text-lg"> {{ GetDataProfil.fullname }} </span>
                <p class="text-gray-500 text-sm"> {{ GetDataProfil.adresse_mail }} </p>
              </span>
            </ion-item>
            <ion-item button detail @click="openEditModal">
              <ion-icon
                slot="start"
                :icon="personCircle"
                class="text-primary"
              ></ion-icon>
              <span class="font-love">Modifier le profil</span>
            </ion-item>
            <ion-item button detail @click="shareProfile">
              <ion-icon
                slot="start"
                :icon="shareSocial"
                class="text-primary"
              ></ion-icon>
              <span class="font-love">Partager mon profil</span>
            </ion-item>
          </ion-list>
        </div>

        <!-- Section Préférences -->
        <div class="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
          <div class="p-4 border-b border-gray-100">
            <h2 class="font-semibold text-lg text-gray-800">Préférences</h2>
          </div>
          <ion-list lines="none" class="font-love">
            <ion-item class="flex gap-2">
              <ion-icon
                slot="start"
                :icon="notifications"
                class="text-primary"
              ></ion-icon>
              <span class="font-love">Notifications</span>
              <ion-toggle
                class="ml-8"
                :checked="notificationsEnabled"
                @ionChange="toggleNotifications"
                color="primary"
              ></ion-toggle>
            </ion-item>
            <ion-item button detail class="font-love">
              <ion-icon
                slot="start"
                :icon="language"
                class="text-primary"
              ></ion-icon>
              <span class="font-love">Langue</span>
              <span slot="end" class="text-gray-500 relative font-love"
                >Français</span
              >
            </ion-item>
          </ion-list>
        </div>

        <!-- Section Aide et Confidentialité -->
        <div class="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
          <div class="p-4 border-b border-gray-100">
            <h2 class="font-semibold text-lg text-gray-800">
              Aide et Confidentialité
            </h2>
          </div>
          <ion-list lines="none">
            <ion-item button detail @click="openAssistanceModal">
              <ion-icon
                slot="start"
                :icon="helpCircle"
                class="text-primary"
              ></ion-icon>
              <span class="font-love">Assistance et informations</span>
            </ion-item>
            <ion-item button detail @click="openPolicyModal">
              <ion-icon
                slot="start"
                :icon="shieldCheckmark"
                class="text-primary"
              ></ion-icon>
              <span class="font-love">Politique de confidentialité</span>
            </ion-item>
          </ion-list>
        </div>

        <!-- Section Connexion -->
        <div class="bg-white rounded-xl shadow-sm overflow-hidden">
          <ion-list lines="none">
            <ion-item button @click="logout" class="text-red-500">
              <ion-icon
                slot="start"
                :icon="logOut"
                class="text-red-500"
              ></ion-icon>
              <span class="font-love">Déconnexion</span>
            </ion-item>
          </ion-list>
        </div>

        <!-- Version de l'application -->
        <div class="text-center mt-8 text-gray-400 text-sm">Version 1.0.0</div>
      </div>
    </ion-content>

    <!-- Modal Assistance -->
    <ModalAssistanceSetting :modelValue="assistanceModalOpen" @update:modelValue="assistanceModalOpen = false" />

    <!-- Modal Politique de confidentialité -->
     
   <ModalTermNounu :type="nType_Profil" :modelValue="policyModalOpen" @update:modelValue="policyModalOpen = false" />

  
  </ion-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonToggle,
  IonAvatar,
  IonIcon,
  IonNote,
  IonModal,
  IonButton,
  IonButtons,
  IonInput,
} from "@ionic/vue";
import {
  notifications,
  language,
  helpCircle,
  shieldCheckmark,
  logOut,
  personCircle,
  shareSocial,
} from "ionicons/icons";
import { Share } from "@capacitor/share";
import IcIcons from "@/components/icons/IcIcons.vue";
import { useAuthStore } from "@/stores/auth.store";
import { useProfilStore } from "@/stores/authProfilStore";
import { useProfiNounulStore } from "@/stores/authProfilNounuStore";
import { StorageUtils } from "@/utils/store.utils";
import ModalTermNounu from "./modalTermNounu.vue";
import ModalAssistanceSetting from "./modalAssistanceSetting.vue";
import { LocalNotifications, PermissionStatus } from "@capacitor/local-notifications";
import { useRouter } from "vue-router";
import { Preferences } from "@capacitor/preferences";
import { useUserStore } from "@/stores/user.store";

const notificationsEnabled = ref(true);
const assistanceModalOpen = ref(false);
const policyModalOpen = ref(false);
const editModalOpen = ref(false);
const nType_Profil = ref();

const editForm = ref({
  name: "Jean Dupont",
  email: "jean.dupont@example.com",
});


onMounted(async() => {
  nType_Profil.value = (await StorageUtils().getStore("nType_Profil")).value;
  const { value } = await Preferences.get({ key: 'notificationsEnabled' });
  notificationsEnabled.value = value === 'true';
});

const toggleNotifications = async ({ detail }: { detail: { checked: boolean } }) => {
  notificationsEnabled.value = detail.checked;
  console.log(detail.checked)
  
  // Save preference
  await Preferences.set({
    key: 'notificationsEnabled',
    value: String(detail.checked)
  });

  if (detail.checked) {
    // Request permission if enabling
    try {
      const { display } = await LocalNotifications.requestPermissions();
      if (display !== 'granted') {
        notificationsEnabled.value = false;
        await Preferences.set({
          key: 'notificationsEnabled',
          value: 'false'
        });
        // Show error to user
        return;
      }
      
      // Schedule example notification (optional)
      await LocalNotifications.schedule({
        notifications: [{
          title: "Notifications activées",
          body: "Vous recevrez maintenant nos notifications",
          id: 1
        }]
      });
    } catch (e) {
      console.error('Notification permission error:', e);
    }
  } else {
    // Cancel all notifications if disabling (optional)
    await LocalNotifications.cancel({
      notifications: [{ id: 1 }]
    });
  }
};

const logout = () => {
  StorageUtils().clearStore()
  useRouter().push({name: "SginInAuth"});
};

const openAssistanceModal = () => {
  assistanceModalOpen.value = true;
};

const openPolicyModal = () => {
  policyModalOpen.value = true;
};

const GetDataProfil = computed(() => {
  return useUserStore().dataProfil;
})


/**
 * Ouvre la modale d'édition du profil
 * @param {string} type Type de profil ('nounu' ou 'parent')
 */

const openEditModal = async (props: any) => {
  useAuthStore().isUpdateProfil = true;
  const isUpdateProfil: any = document.getElementById("is-update-profil");
  isUpdateProfil.value = true;

  const nType_Profil = await StorageUtils().getStore("nType_Profil");
  let OpenModal: any = document.querySelector(`#open-modal-auth-profil`);
  useProfilStore().state.activeMenu_typeOfProfil = `open-modal-auth-profil-${nType_Profil.value}`;
  OpenModal.click();

  if (nType_Profil.value == "nounu") {
    useProfiNounulStore().ChangeInputToEdit(GetDataProfil.value);
  } else {
    useProfilStore().ChangeInputToEdit(GetDataProfil.value);
  }
};

const checkPermissionsStrict = async (): Promise<PermissionStatus> => {
  try {
    const status = await LocalNotifications.checkPermissions();
    if (status.display === "granted") {
      return status;
    }
    return await LocalNotifications.requestPermissions();
  } catch (error) {
    console.error("Permission check failed:", error);
    return { display: "denied" };
  }
};

const saveProfile = () => {
  console.log("Profil sauvegardé:", editForm.value);
  editModalOpen.value = false;
};

const changeProfilePicture = () => {
  console.log("Changer la photo de profil");
  // Ici vous pourriez implémenter la logique pour sélectionner une image
};

const shareProfile = async () => {
  try {
    await Share.share({
      title: "Mon profil",
      text: "Découvrez mon profil sur application babyNounu :",
      url: "https://example.com/profile/jean.dupont",
      dialogTitle: "Partager mon profil",
    });
  } catch (error) {
    console.error("Erreur lors du partage:", error);
  }
};
</script>

<style scoped>
ion-item {
  --padding-start: 16px;
  --padding-end: 16px;
  --inner-padding-end: 0;
  --min-height: 56px;
}

ion-toggle {
  --handle-width: 20px;
  --handle-height: 20px;
  --handle-spacing: 2px;
  --handle-background: #eb7769;
  --handle-background-checked: #7f4ec3;
}
</style>
