<script setup lang="ts">
import { ref } from "vue";
import { getStageTypeEnum } from "../api/services/MaterialApi";
import EPDInput from "./EPDInput.vue";

const emits = defineEmits(["getDataFromEPDInput"])

const amountOfInputs = ref(1);
const stages = ref([]);
const inputsData: any = ref([]);

const addNewInput = () => {
  amountOfInputs.value++;
  inputsData.value.push([]);
};

const handleCollectData = (data, id) => {
  inputsData.value[id] = data;
  console.log(inputsData.value)
  collectStages()
  
};

const collectStages = async () => {
  stages.value = []
  const stageEnums = await getStageTypeEnum();
  Object.keys(stageEnums).forEach((stageNumber) => {
    const result = {};
    result.stageType = Number(stageNumber);
    result.measures = {};
    inputsData.value.forEach((inputfield) => {
      Object.keys(inputfield).forEach((field) => {
        if (inputfield[field][stageEnums[stageNumber].Enum] === undefined) {
          //result.measures[field] = null;
          return;
        }
        if (inputfield[field][stageEnums[stageNumber].Enum] === "MNR" || inputfield[field][stageEnums[stageNumber].Enum] === "MND") {
          return;
        }

        result.measures[field] =
          Number(inputfield[field][stageEnums[stageNumber].Enum].replace(/,/gm, "."))
      });
    });
    stages.value.push(result);
  });
  console.log(stages)
  emits("getDataFromEPDInput", stages, inputsData)
};

</script>

<template>
  <div>
    <div v-for="amount in amountOfInputs">
      <EPDInput @handleCollectData="handleCollectData" :id="amount" />
    </div>
    <div class="flex gap-6">
     
      <button
        @click="addNewInput"
        class="bg-blue-400 p-2 rounded-md shadow-md h-10 text-white hover:bg-blue-800"
      >
        Add another table
      </button>
    </div>
    <div class="gap-4 flex flex-col">
      <div v-for="input in inputsData" class="flex flex-col gap-1">
        <div
          v-for="(value, key) in input"
          class="bg-slate-300 rounded-md p-1 justify-between flex w-96"
        >
          <span>{{ key }}</span>
          <span>{{ value.unit }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
