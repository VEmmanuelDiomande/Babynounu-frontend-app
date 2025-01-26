<template>
  
  <IonPage  @ionScroll="onScroll($event)" :scroll-events="true">
    
    <IonContent>
      <HeaderMenuLayout Title="Messageries" PlaceholderSearch="Rechercher dans messageries" :countScroll="countScroll" />
      
      <CardMessagerie :Messages="Messages" />
    </IonContent>
  </IonPage>
</template>

<script lang="ts" setup>
import MainSideBar from "@/components/headers/sidebars/MainSideBar.vue";
import HeaderMenuLayout from "@/layouts/HeaderMenuLayout.vue";
import { IonContent, IonPage } from "@ionic/vue";
import CardMessagerie from "./__partials/cardMessagerie.vue";
import { ref } from "vue";
import { ScrollUtils } from "@/utils/scroll.utils";


const {  countScroll, onScroll} = ScrollUtils();
const Messages = ref([
  {
    "name": "Alice Johnson",
    "message": "It was great catching up with you earlier. Let’s do it again soon!",
    "createdAt": "2024-11-05 22:58:00",
    "viewed": true
  },
  {
    "name": "Robert Williams",
    "message": "Just wanted to say thank you for all the support you’ve given me lately.",
    "createdAt": "2024-10-31 02:44:12",
    "viewed": true
  },
  {
    "name": "Charles Brown",
    "message": "I hope this message finds you well and in good spirits.",
    "createdAt": "2024-10-22 23:17:10",
    "viewed": false
  },
  {
    "name": "Diana Smith",
    "message": "Please let me know if there's anything else I can help you with.",
    "createdAt": "2024-11-14 22:51:46",
    "viewed": true
  },
  {
    "name": "Evelyn Garcia",
    "message": "Looking forward to our next meeting. Let me know if the time still works.",
    "createdAt": "2024-10-27 07:16:28",
    "viewed": true
  },
  {
    "name": "Frank Harris",
    "message": "I wanted to check in and see how everything is going on your end.",
    "createdAt": "2024-11-07 10:13:39",
    "viewed": false
  },
  {
    "name": "Grace Martinez",
    "message": "Your insights during the last meeting were incredibly helpful. Thank you!",
    "createdAt": "2024-11-13 14:22:47",
    "viewed": false
  },
  {
    "name": "Henry Lee",
    "message": "If you have any questions, don’t hesitate to reach out at any time.",
    "createdAt": "2024-11-08 10:49:11",
    "viewed": false
  },
  {
    "name": "Isabella Taylor",
    "message": "I’ll be sending over the details shortly. Thanks for your patience.",
    "createdAt": "2024-10-25 01:02:52",
    "viewed": true
  },
  {
    "name": "Jack Wilson",
    "message": "It’s always a pleasure working with you. Keep up the amazing work!",
    "createdAt": "2024-11-11 02:21:10",
    "viewed": false
  }
]

)
</script>
<style scoped></style>
