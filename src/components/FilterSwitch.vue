<script setup lang="ts">
import { ref } from "vue";
const props = defineProps({
  id: String,
});

const emit = defineEmits(["changeMonoPolyEPD"]);

const isSingleEPD = ref(true); //TODO CHANGE

const switchLeft = () => {
  if (isSingleEPD.value) return;
  isSingleEPD.value = true;
  toggle();
};

const switchRight = () => {
  if (!isSingleEPD.value) return;
  isSingleEPD.value = false;
  toggle();
};

const toggle = () => {
  emit("changeMonoPolyEPD", props.id);
};
</script>

<template>
  <div
    id="switch-button"
    class="w-96 h-7 text-center will-change-transform cursor-pointer transition-all duration-300 ease-in-out border border-white font-bold rounded-sm"
  >
    <span
      id="active"
      class="text-[#151515] bg-white absolute top-0 w-1/2 h-full z-0 transition-all duration-300 ease-in-out"
      :class="{ 'left-0': isSingleEPD, 'left-1/2': !isSingleEPD }"
    ></span>
    <button
      id="left"
      @click="switchLeft"
      class="inline-block w-1/2 h-full relative transition-all duration-300 ease-in-out uppercase tracking-wide pb-[1px] hover:text-gray-500 hover:cursor-pointer"
      :class="{ 'text-black': isSingleEPD, 'text-white': !isSingleEPD }"
    >
      Single
    </button>
    <button
      id="right"
      @click="switchRight"
      class="inline-block w-1/2 h-full relative transition-all duration-300 ease-in-out uppercase tracking-wide pb-[1px] hover:text-gray-500 hover:cursor-pointer"
      :class="{ 'text-black': !isSingleEPD, 'text-white': isSingleEPD }"
    >
      Multi
    </button>
  </div>
</template>
