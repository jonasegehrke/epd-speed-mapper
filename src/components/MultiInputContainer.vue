<script setup lang="ts">
import { ref } from "vue";
import { getStageTypeEnum } from "../api/services/MaterialApi";
import { store } from "../store";
import MultiEPDInput from "./MultiEPDInput.vue";

const amountOfInputs = ref(1);
const stages = ref([]);
const inputsData: any = ref([]);

const addNewInput = () => {
  amountOfInputs.value++;
  inputsData.value.push([]);
};

const handleCollectData = (data, id) => {
  inputsData.value[id] = data;
  collectStages();
};

const collectStages = async () => {
  const stageEnums = await getStageTypeEnum();

  store.allNewMaterials.forEach((material, materialIndex) => {
    stages.value = [];

    Object.keys(stageEnums).forEach((stageNumber) => {
      const result = {};
      result.stageType = Number(stageNumber);
      result.measures = {};
      inputsData.value.forEach((input) => {
        input.forEach((inputField, inputFieldIndex) => {
          if (inputFieldIndex === materialIndex) {
            Object.keys(inputField).forEach((field) => {
              if (
                inputField[field][stageEnums[stageNumber].Enum] === undefined
              ) {
                return;
              }
              if (
                inputField[field][stageEnums[stageNumber].Enum] === "MNR" ||
                inputField[field][stageEnums[stageNumber].Enum] === "MND"
              ) {
                return;
              }

              result.measures[field] = Number(
                inputField[field][stageEnums[stageNumber].Enum].replace(
                  /,/gm,
                  "."
                )
              );
            });
          } else {
            return;
          }
        });
      });
      if (stages.value.length != 18) {
        stages.value.push(result);
      }
    });
    material.stages = stages.value;
  });
  store.rawMultiEPDData = inputsData.value;
};
</script>

<template>
  <div>
    <div v-for="amount in amountOfInputs">
      <MultiEPDInput @handleCollectData="handleCollectData" :id="amount" />
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
        <div v-for="(value, idx) in input">
          <div
            v-for="(v, k) in value"
            v-if="idx === 0"
            class="bg-slate-300 rounded-md p-1 justify-between flex w-96"
          >
            <span>{{ k }}</span>
            <span>{{ v.unit }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
