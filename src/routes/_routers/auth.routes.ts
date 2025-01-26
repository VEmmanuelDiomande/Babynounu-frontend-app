import BasicPage from "@/views/BasicPage.vue";
import AgencyAuth from "@/views/auth/agencyAuth.vue";
import DeliveryAuth from "@/views/auth/deliveryAuth.vue";
import SginInAuth from "@/views/auth/sginInAuth.vue";
import SignAuth from "@/views/auth/signAuth.vue";
import SignUpAuth from "@/views/auth/signUpAuth.vue";

export const AuthRoutes = {
  path: "/auth",
  redirect: "/auth/sign",
  component: BasicPage,

  children: [
    {
      path: "sign",
      meta: {
        requiresAuth: false,
        title: `Se connecter`,
        description: "",
        "og:title": ``,
        "og:description": "",
        keywords: `reseau social`,
      },
      name: "SignAuth",
      component: SignAuth,
    },

    {
      path: "sign-in",
      meta: {
        requiresAuth: false,
        title: `Se connecter`,
        description: "",
        "og:title": ``,
        "og:description": "",
        keywords: `reseau social`,
      },
      name: "SginInAuth",
      component: SginInAuth,
    },
    {
      path: "sign-up",
      meta: {
        requiresAuth: false,
        title: `Se connecter`,
        description: "",
        "og:title": ``,
        "og:description": "",
        keywords: `reseau social`,
      },
      name: "SignUpAuth",
      component: SignUpAuth,
    },
    {
      path: "agency",
      meta: {
        requiresAuth: false,
        title: `Se connecter`,
        description: "",
        "og:title": ``,
        "og:description": "",
        keywords: `reseau social`,
      },
      name: "AgencyAuth",
      component: AgencyAuth,
    },
    {
      path: "delivery",
      meta: {
        requiresAuth: false,
        title: `Se connecter`,
        description: "",
        "og:title": ``,
        "og:description": "",
        keywords: `reseau social`,
      },
      name: "DeliveryAuth",
      component: DeliveryAuth,
    },
   

     
  ],
};
