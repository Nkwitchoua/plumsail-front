<template>
    <div
      class="fullscreen bg-blue text-white text-center flex flex-center"
    >
      <div>
        <div style="font-size: 30vh">404</div>
  
        <div class="text-h2" style="opacity: 0.4">
          Ooops... This page doesn't exist.
        </div>
  
        <q-btn
          class="q-mt-xl"
          color="white"
          text-color="blue"
          unelevated
          to="/"
          label="Orders"
          no-caps
        />
      </div>
    </div>
  </template>
  
  <script>
  import { defineComponent } from "vue";
  
  export default defineComponent({
    name: "NotFoundPage",
  });
  </script>
  