<script setup lang="ts">
import { onMounted, ref } from "vue";
import { getAllEDP } from "../api/services/MaterialApi";
import MaterialForm from "./MaterialForm.vue";
import FilterSwitch from "./FilterSwitch.vue";
import MultiMaterialForm from "./MultiMaterialForm.vue";
import AssignLinkToEpd from "./AssignLinkToEpd.vue";

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

  <div class="flex w-full h-full items-center flex-col ml-5">
    <AssignLinkToEpd />
  </div>

</template>
