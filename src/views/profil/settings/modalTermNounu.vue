<template>
  <ion-modal :is-open="policyModalOpen" @didDismiss="policyModalOpen = false">
    <ion-header>
      <ion-toolbar class="bg-primary">
        <ion-title class="text-black text-lg font-anton">
          Conditions Générales d'Utilisation
        </ion-title>
        <ion-buttons slot="end">
          <ion-button @click="policyModalOpen = false">
            <IcIcons
              :size="24"
              name="RiCloseLine"
              class="text-black/90"
            ></IcIcons>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding font-love">
      <div class="space-y-4">
        <template v-if="type === 'nounu'">
          <h3 class="font-bold text-lg">
            Conditions Générales d'Utilisation pour les Nounous - Baby Nounu
          </h3>
          <p>
            Bienvenue sur Baby Nounu, l'application mobile qui met en relation
            les nounous, baby-sitters, et femmes de ménage avec les parents à la
            recherche de services de garde d'enfants ou d'aide à domicile.
          </p>

          <h4 class="font-bold">1. Définitions</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li>
              <strong>Application</strong> : désigne l'application mobile Baby
              Nounu
            </li>
            <li>
              <strong>Prestataire</strong> : désigne les personnes inscrites
              pour proposer des services de garde d'enfants ou d'aide ménagère
            </li>
            <li>
              <strong>Services</strong> : désigne les prestations de garde
              d'enfants et d'aide ménagère proposées via l'application
            </li>
          </ul>

          <h4 class="font-bold">2. Inscription et utilisation</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li>
              Vous devez fournir des informations exactes et à jour et payer vos
              frais d'inscription
            </li>
            <li>
              Vous pouvez créer un profil détaillé en indiquant vos compétences,
              expériences, disponibilités et tarifs
            </li>
            <li>
              Vous pouvez être invité à fournir des documents de vérification
              (pièce d'identité, références)
            </li>
          </ul>

          <h4 class="font-bold">3. Obligations des Prestataires</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li>
              Fournir des informations exactes sur vos compétences et
              qualifications
            </li>
            <li>
              Fournir un service professionnel répondant aux attentes des
              parents
            </li>
            <li>
              Respecter les horaires et conditions convenues avec les parents
            </li>
          </ul>

          <h4 class="font-bold">4. Réservation et paiement</h4>
          <ul class="list-disc pl-5 space-y-2">
            <li>Les parents peuvent réserver vos services via l'application</li>
            <li>
              Vous recevrez votre rémunération après validation de la mission
            </li>
            <li>
              Baby Nounu applique une commission de 15% sur chaque mission
            </li>
          </ul>

          <h4 class="font-bold">5. Annulation</h4>
          <p>
            En cas d'annulation de votre part, vous devez informer le parent au
            moins 24h à l'avance. Des annulations fréquentes peuvent affecter
            votre profil.
          </p>
        </template>

        <template v-if="type === 'parent'">
          <!-- Section Titre et Introduction -->
          <div class="text-center mb-6">
            <h1 class="font-bold text-xl mb-2">Conditions Générales d'Utilisation pour les Parents</h1>
            <h2 class="text-lg">Baby Nounu</h2>
          </div>
          
          <p class="text-justify mb-6">
            Bienvenue sur Baby Nounu, l'application mobile qui vous permet de trouver des services de garde d'enfants et d'aide à domicile en toute simplicité. En utilisant notre application, vous acceptez les présentes Conditions Générales d'Utilisation. Veuillez les lire attentivement avant d'utiliser nos services.
          </p>

          <div class="border-t border-gray-200 pt-4 mb-6"></div>

          <!-- Section 1: Définitions -->
          <section class="mb-6">
            <h3 class="font-bold text-lg mb-3">1. Définitions</h3>
            <ul class="list-disc pl-5 space-y-2">
              <li><strong>Application</strong> : désigne l'application mobile Baby Nounu</li>
              <li><strong>Utilisateur</strong> : toute personne utilisant l'application</li>
              <li><strong>Parent</strong> : personne recherchant des services de garde</li>
              <li><strong>Prestataire</strong> : nounous et femmes de ménage proposant leurs services</li>
              <li><strong>Services</strong> : prestations de garde et ménage via l'application</li>
            </ul>
          </section>

          <!-- Section 2: Inscription -->
          <section class="mb-6">
            <h3 class="font-bold text-lg mb-3">2. Inscription et utilisation</h3>
            <ul class="list-disc pl-5 space-y-2">
              <li>Création de compte avec informations exactes et à jour</li>
              <li>Paiement des frais d'inscription requis</li>
              <li>Recherche de prestataires qualifiés selon vos besoins</li>
              <li>Création d'un profil parent complet (nombre d'enfants, localisation, horaires)</li>
            </ul>
          </section>

          <!-- Section 3: Sélection -->
          <section class="mb-6">
            <h3 class="font-bold text-lg mb-3">3. Sélection des Prestataires</h3>
            <ul class="list-disc pl-5 space-y-2">
              <li>Accès à des profils vérifiés avec évaluations</li>
              <li>Votre responsabilité dans le choix du prestataire</li>
              <li>Baby Nounu n'est pas responsable des prestations insatisfaisantes</li>
            </ul>
          </section>

          <!-- Section 4: Paiement -->
          <section class="mb-6">
            <h3 class="font-bold text-lg mb-3">4. Réservation et paiement</h3>
            <ul class="list-disc pl-5 space-y-2">
              <li>Réservation directe via l'application selon disponibilités</li>
              <li>Paiement sécurisé intégré à l'application</li>
              <li>Règlement du montant convenu avant la mission</li>
            </ul>
          </section>

          <!-- Section 5: Annulation -->
          <section class="mb-6">
            <h3 class="font-bold text-lg mb-3">5. Annulation et Remboursement</h3>
            <ul class="list-disc pl-5 space-y-2">
              <li>Annulation sans frais jusqu'à 24h avant la mission</li>
              <li>Frais de 10% pour annulation tardive (après 24h)</li>
              <li>Remboursement automatique si annulation par le prestataire</li>
              <li>Remboursement sous 7 jours ouvrables</li>
            </ul>
          </section>

          <!-- Sections 6-10 -->
          <section class="mb-6">
            <h3 class="font-bold text-lg mb-3">6. Responsabilité</h3>
            <p>Vous êtes responsable de l'utilisation des services. Les évaluations doivent être honnêtes.</p>
          </section>

          <section class="mb-6">
            <h3 class="font-bold text-lg mb-3">7. Données personnelles</h3>
            <p>Protection de vos données conformément à notre Politique de Confidentialité.</p>
          </section>

          <section class="mb-6">
            <h3 class="font-bold text-lg mb-3">8. Modification des CGU</h3>
            <p>Baby Nounu se réserve le droit de modifier ces conditions à tout moment.</p>
          </section>

          <section class="mb-6">
            <h3 class="font-bold text-lg mb-3">9. Résiliation</h3>
            <p>Vous pouvez désactiver votre compte à tout moment.</p>
          </section>

          <section class="mb-6">
            <h3 class="font-bold text-lg mb-3">10. Contact</h3>
            <p>Service client disponible pour toute question.</p>
          </section>

          <div class="border-t border-gray-200 pt-4 mb-6"></div>

          <p class="text-center italic">
            En utilisant Baby Nounu, vous acceptez pleinement ces Conditions Générales. Nous vous remercions de votre confiance.
          </p>
          
          <p class="text-center font-bold mt-4">
            Baby Nounu – La tranquillité d'esprit pour la garde d'enfant
          </p>
        </template>

        

        <div class="pt-4">
          <button
            class="bg-primary text-white py-4 px-4 rounded-lg shadow-md w-full"
            @click="policyModalOpen = false"
          >
            J'ai compris
          </button>
        </div>
      </div>
    </ion-content>
  </ion-modal>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
} from "@ionic/vue";
import IcIcons from "@/components/icons/IcIcons.vue";

const props = defineProps({
  type: {
    type: String,
    required: true,
    validator: (value: string) => ["nounu", "parent"].includes(value),
  },
  modelValue: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);

const policyModalOpen = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});
</script>
