<script setup lang="ts">
import { onMounted, ref } from "vue";
import { uploadFiles } from "../api/services/FileuploadAPi";
import {
  getNextMaterial,
  sendLinkedToLocal,
} from "../api/services/MaterialApi";
import Material from "../types/Material";
const currentMaterial = ref<Material>();
const files = ref<HTMLInputElement | null>(null);

const upload = async () => {
  //Upload files if there is anyfiles
  if (files?.value?.files != undefined && files?.value?.files?.length > 0) {
    const response = await uploadFiles(files);
    if (response?.data?.fileIds) {
      currentMaterial.value.link = response?.data?.fileIds;
    }
  }
};

onMounted(async () => {
  currentMaterial.value = await getNextMaterial();
});
const onSubmit = async () => {
  await upload();
  console.log(currentMaterial.value);
  const response = await sendLinkedToLocal(currentMaterial.value);
  console.log(response);
  if (response.status === 200) {
    files.value = null;
    currentMaterial.value = await getNextMaterial();
  }else{
    alert("Something went wrong")
  }
};
</script>

<template>
  <div
    class="flex justify-center items-center w-screen h-screen flex-col gap-3"
  >
    <h1 class="font-bold text-3xl">{{ currentMaterial?.shortName }}</h1>
    <a class="text-blue-500" :href="currentMaterial?.additionalSources[0]">{{
      currentMaterial?.additionalSources[0]
    }}</a>
    <div class="flex flex-col">
      <span class="text-lg font-bold">EPD - Upload</span>
      <div>
        <input
          type="file"
          ref="files"
          multiple
          class="block mt-1 w-full text-sm text-green-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
        />
      </div>
    </div>

    <button
      class="bg-green-400 rounded-md shadow-md p-2 text-white hover:bg-green-800"
      @click="onSubmit"
    >
      Submit
    </button>
  </div>
</template>
