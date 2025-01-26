<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="bg-primary">
        <ion-title class="text-white">Pricing</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="flex flex-col items-center p-4 bg-gray-50">
      <!-- Header -->
      <div class="text-center mb-6">
        <h1 class="text-2xl font-bold">Choose Your Plan</h1>
        <p class="text-gray-600 mt-2">Affordable pricing for everyone!</p>
      </div>

      <!-- Pricing Cards -->
      <div class="w-full max-w-md space-y-4">
        <!-- Nounou Plan -->
        <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 class="text-xl font-semibold text-primary">Nounou</h2>
          <p class="text-gray-700 mt-2">
            For babysitters who want to connect with parents.
          </p>
          <p class="text-3xl font-bold text-primary mt-4">2000 FCFA</p>
          <ul class="text-gray-600 mt-4 space-y-2">
            <li class="flex items-center">
              <ion-icon
                name="checkmark-circle-outline"
                class="text-green-500 mr-2"
              ></ion-icon>
              Access to parent requests
            </li>
            <li class="flex items-center">
              <ion-icon
                name="checkmark-circle-outline"
                class="text-green-500 mr-2"
              ></ion-icon>
              Profile visibility
            </li>
          </ul>
          <ion-button expand="block" class="mt-6">Choose Nounou</ion-button>
        </div>

        <!-- Parent Plan -->
        <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
          <h2 class="text-xl font-semibold text-primary">Parent</h2>
          <p class="text-gray-700 mt-2">
            For parents looking for trusted babysitters.
          </p>
          <p class="text-3xl font-bold text-primary mt-4">5000 FCFA</p>
          <ul class="text-gray-600 mt-4 space-y-2">
            <li class="flex items-center">
              <ion-icon
                name="checkmark-circle-outline"
                class="text-green-500 mr-2"
              ></ion-icon>
              Unlimited babysitter search
            </li>
            <li class="flex items-center">
              <ion-icon
                name="checkmark-circle-outline"
                class="text-green-500 mr-2"
              ></ion-icon>
              Chat with babysitters
            </li>
          </ul>
          <ion-button expand="block" class="mt-6">Choose Parent</ion-button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>


<script setup lang="ts">
// Déclaration de CinetPay (si nécessaire)
declare const CinetPay: any;

// Fonction pour gérer le paiement
const checkout = () => {
  CinetPay.setConfig({
    apikey: '', // VOTRE APIKEY
    site_id: '', // VOTRE_SITE_ID
    notify_url: 'http://mondomaine.com/notify/',
    mode: 'PRODUCTION'
  });

  CinetPay.getCheckout({
    transaction_id: Math.floor(Math.random() * 100000000).toString(), // VOTRE TRANSACTION ID
    amount: 100,
    currency: 'XOF',
    channels: 'ALL',
    description: 'Test de paiement',
    customer_name: "Joe",
    customer_surname: "Down",
    customer_email: "down@test.com",
    customer_phone_number: "088767611",
    customer_address: "BP 0024",
    customer_city: "Antananarivo",
    customer_country: "CM",
    customer_state: "CM",
    customer_zip_code: "06510",
  });

  CinetPay.waitResponse((data: any) => {
    if (data.status === "REFUSED") {
      if (alert("Votre paiement a échoué")) {
        window.location.reload();
      }
    } else if (data.status === "ACCEPTED") {
      if (alert("Votre paiement a été effectué avec succès")) {
        window.location.reload();
      }
    }
  });

  CinetPay.onError((data: any) => {
    console.log(data);
  });
};
</script>

<style>
.sdk {
  display: block;
  position: absolute;
  background-position: center;
  text-align: center;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
</style>
