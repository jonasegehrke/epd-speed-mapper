<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getAllEDP } from "../api/services/MaterialApi";
import MaterialForm from "./MaterialForm.vue";
import FilterSwitch from "./FilterSwitch.vue";
import MultiMaterialForm from "./MultiMaterialForm.vue";

const materialArray = ref();
const createNewView = ref<Boolean>(false); //TODO CHANGE
const isSingleEPD = ref<boolean>(true); //TODO CHANGE

const fetchEPDs = async () => {
  const response = await getAllEDP();
  materialArray.value = response;
};

onMounted(() => {
  fetchEPDs();
});


const toggleView = () => {
  createNewView.value = !createNewView.value;
};

const changeMonoPolyEPD = () => {
  isSingleEPD.value = !isSingleEPD.value
}


</script>

<template>
  

  <div v-if="createNewView" class="flex w-full h-full items-center flex-col ml-5">
    <FilterSwitch @changeMonoPolyEPD="changeMonoPolyEPD"/>
    <MaterialForm v-if="isSingleEPD" @toggleView=toggleView />
    <MultiMaterialForm v-if="!isSingleEPD" @toggleView=toggleView />
  </div>

  <div v-else class="flex flex-col m-10 justify-center items-center">
    <button
      @click="toggleView"
      class="bg-slate-500 rounded-md shadow-md text-white font-bold p-2 my-10 w-4/12"
    >
      Create Material
    </button>
    <div
      class="bg-slate-300 flex justify-center flex-col items-center rounded-md shadow-md w-full"
    >
      <div
        class="flex justify-between border w-full"
        v-for="material in materialArray"
      >
        <span>{{ material.id }}</span>
        <span>{{ material.shortName }}</span>
      </div>
    </div>
  </div>
</template>
