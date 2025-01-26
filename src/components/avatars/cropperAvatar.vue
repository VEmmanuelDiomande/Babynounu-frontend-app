<template>

<IonModal ref="modalCopperProfile" trigger="modal-copper-profile" >

    
    <IonContent class="h-full">

      <IonButtons class="fixed top-3 right-4 " >
            <IonButton @click="cancel()" class="bg-zinc-800/40 rounded-full size-10 flex items-center justify-center" >
                <RiCloseLargeLine size="20" class="text-white"/>
            </IonButton>
          </IonButtons>

      <div class="cropper-wrapper h-full flex justify-center items-center">
      <div
        :style="{ backgroundImage: 'url(' + img + ')' }"
        class="image-background"
      ></div>
      <cropper
        :debounce="false"
        :style="flipStyle"
        :stencil-props="{
          aspectRatio: 1,
        }"
        :stencil-component="CircleStencil"
        @change="change"
       v-lazy="img"
        background-class="cropper-background"
        
      />
      <!-- Button to finalize cropping -->
    </div>
  
   
    </IonContent>
   
    <IonFooter class="shadow-none p-5  bg-black border-2 border-black w-full">
      <!-- <EditButton title="Envoyer"  /> -->
        <!-- Buttons for flipping -->
    <div class="flex justify-between items-center w-full">
      
      <div class="flex flex-row items-center gap-6">
        <RiFlipVerticalLine @click="flipVertical" size="24px" class="text-white" />
      <RiFlipHorizontalLine @click="flipHorizontal " size="24px" class="text-white" />
      <RiClockwise2Line @click="rotateTransform" size="24px" class="text-white" />
      </div>

      <div class="">
        <button
        @click="onCrop"
        class="px-4 h-10 font-bold flex justify-center items-center bg-zinc-800 text-white rounded-lg   z-50 font-love text-ng"
      >
        Terminer
      </button>
      </div>
  
    </div>
    </IonFooter>
</IonModal>

    
  </template>
  
  <script lang="ts" setup>
  import { IonButton, IonButtons, IonContent, IonFooter, IonModal } from "@ionic/vue";
import { RiClockwise2Line, RiCloseLargeLine, RiFlipHorizontalLine, RiFlipVerticalLine } from "@remixicon/vue";
import { ref, computed } from "vue";
  import { Cropper, CircleStencil } from "vue-advanced-cropper";
  import "vue-advanced-cropper/dist/style.css";

  defineProps(["idModal", "content", "header", "info", "sizeText"]);
  
  const img = ref(
    "https://images.pexels.com/photos/4323307/pexels-photo-4323307.jpeg"
  );

  const modalCopperProfile = ref()
  
  const flipX = ref(1);
  const flipY = ref(1);
  const rotate = ref(0);
  
  const flipStyle = computed(() => ({
    transform: `scale(${flipX.value}, ${flipY.value}) rotate(${rotate.value}deg)`,
    transition: "transform 0.3s ease",
    height: "800px",
  }));
  
  const flipHorizontal = () => {
    flipX.value *= -1;
  };
  
  const flipVertical = () => {
    flipY.value *= -1;
  };

  const rotateTransform = () => {
    rotate.value = rotate.value + 90;
  };
  
  const cropperImah = ref();
  const change = (ui: any) => {
    cropperImah.value = ui;
  };

  const cancel = () => modalCopperProfile.value.$el.dismiss(null, 'cancel');
  
  const onCrop = () => {
    console.log(cropperImah.value.canvas.toDataURL());
    cancel()
  };

  
  </script>
  <style scoped>
  .cropper-wrapper {
    overflow: hidden;
    position: relative;
    background: black;
  }
  .cropper-background {
    background: none;
  }
  .image-background {
    position: absolute;
    width: calc(100% + 20px);
    height: calc(100% + 20px);
    left: -10px;
    top: -10px;
    background-size: cover;
    background-position: 50%;
    filter: blur(50px);
  }
  </style>
  