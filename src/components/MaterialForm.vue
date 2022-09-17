<script setup lang="ts">
import SearchDropdown from "search-dropdown-vue";
import { onMounted, ref } from "vue";
import { uploadFiles } from "../api/services/FileuploadAPi";
import { createMaterial } from "../api/services/MaterialApi";
import { getAllOwners } from "../api/services/OwnerApi";
import Material from "../types/Material";
import Stage from "../types/Stage";
import InputContainer from "./InputContainer.vue";
import SystemBoundary from "./SystemBoundary.vue";

const stages = ref<Array<Stage>>([]);
const boundries = ref({});
const currentTag = ref("");
const currentLink = ref("");
const files = ref<HTMLInputElement | null>(null);
const uploadedFiles = ref<string[]>([]);
const errorMessage = ref<Array<String>>([]);
const isFormOk = ref<boolean>(true);
const rawEmissionData = ref();

const selectedUnitValues = ref([
  { text: "G", value: 0 },
  { text: "KG", value: 1 },
  { text: "Ton", value: 2 },
  { text: "M", value: 3 },
  { text: "M^2", value: 4 },
  { text: "M^3", value: 5 },
  { text: "PSC", value: 6 },
  { text: "MJ", value: 7 },
  { text: "KGKM", value: 8 },
  { text: "A", value: 9 },
]);

const selectedMassValues = ref([
  { text: "KG/M", value: 0 },
  { text: "KG/M^2", value: 1 },
  { text: "KG/M^3", value: 2 },
  { text: "KG/PSC", value: 3 },
  { text: "KG/KG", value: 4 },
  { text: "T/M", value: 5 },
  { text: "T/M^2", value: 6 },
  { text: "T/M^3", value: 7 },
  { text: "T/PSC", value: 8 },
  { text: "KG/dm3", value: 9 },
]);

const newMaterial = ref<Material>({
  ownerId: "",
  custom: false,
  scraped: false,
  generic: false,
  expectedLifespan: -1,
  shortName: "",
  description: "",
  additionalSources: [],
  link: uploadedFiles.value,
  stages: stages,
  declaredUnit: {
    declaredUnit: -1,
    declaredValue: -1,
    mass: -1,
    massUnit: -1,
  },
  epdInfo: {
    epdSpecificationForm: -1,
    epdProductIndustryType: -1,
    issuedAt: "",
    validTo: "",
  },
  tags: [],
});

const allOwners = ref([]);

const onSelectedOwnerOption = (payload: any) => {
  newMaterial.value.ownerId = payload.id;
};

const getDataFromEPDInput = (data, rawData) => {
  newMaterial.value.stages = data;
  rawEmissionData.value = rawData;
};
const getSystemBoundries = (data) => {
  boundries.value = data;
};

const addTag = () => {
  newMaterial.value.tags.push(currentTag.value);
};
const deleteTag = (tag) => {
  const index = newMaterial.value.tags.indexOf(tag);
  if (index > -1) {
    newMaterial.value.tags.splice(index, 1);
  }
};

const addLink = () => {
  newMaterial.value.additionalSources.push(currentLink.value);
};
const deleteLink = (link) => {
  const index = newMaterial.value.additionalSources.indexOf(link);
  if (index > -1) {
    newMaterial.value.additionalSources.splice(index, 1);
  }
};

const fetchData = async () => {
  const response = await getAllOwners();
  allOwners.value = response;
};

onMounted(async () => {
  fetchData();
});

const onSubmit = async () => {
  if(newMaterial.value.expectedLifespan === -2){
    delete newMaterial.value.expectedLifespan
  }
  
  errorMessage.value = [];

  //Upload files if there is anyfiles
  if (files?.value?.files != undefined && files?.value?.files?.length > 0) {
    const response = await uploadFiles(files);
    if (response?.data?.fileIds) {
      newMaterial.value.link = response?.data?.fileIds;
    }
  }

  isFormOk.value = true;

  validateForm();

  if (!isFormOk.value) {
    return;
  }

  Object.keys(boundries.value).forEach((bound, index) => {
    if (boundries.value[bound] === "R") {
      newMaterial.value.stages[index].stageStatus = 2;
    } else if (boundries.value[bound] === "MND") {
      newMaterial.value.stages[index].stageStatus = 1;
    } else if (boundries.value[bound] === "MNR") {
      newMaterial.value.stages[index].stageStatus = 0;
    }
  });

  const response = await createMaterial(newMaterial.value)
  console.log(response)
  if(response.status === 200){
    emits("toggleView")
  }else{
    alert("some error occured while posting")
  }

  
};

const validateForm = () => {
  if (Object.keys(boundries.value).length < 18) {
    errorMessage.value.push("Indsæt alle Systemgrænser");
    isFormOk.value = false;
  }
  if (newMaterial.value.shortName.length <= 1) {
    errorMessage.value.push("Navn skal udfyldes");
    isFormOk.value = false;
  }
  if (newMaterial.value.additionalSources.length <= 0) {
    errorMessage.value.push("Additional Sources skal udfyldes");
    isFormOk.value = false;
  }
  if (newMaterial.value.description.length <= 0) {
    errorMessage.value.push("Beskrivelse skal udfyldes");
    isFormOk.value = false;
  }
  if (newMaterial.value.link.length <= 0) {
    errorMessage.value.push("Upload af EPD mangler");
    isFormOk.value = false;
  }
  if (newMaterial.value.epdInfo.issuedAt.length <= 0) {
    errorMessage.value.push("Issued At skal udfyldes");
    isFormOk.value = false;
  }
  if (newMaterial.value.epdInfo.validTo.length <= 0) {
    errorMessage.value.push("Valid to skal udfyldes");
    isFormOk.value = false;
  }
  if (newMaterial.value.ownerId === undefined) {
    errorMessage.value.push("Owner skal udfyldes");
    isFormOk.value = false;
  }
  if (newMaterial.value.epdInfo.epdProductIndustryType <= -1) {
    errorMessage.value.push("EPD type skal udfyldes");
    isFormOk.value = false;
  }
  if (newMaterial.value.epdInfo.epdSpecificationForm <= -1) {
    errorMessage.value.push("EPD Specification skal udfyldes");
    isFormOk.value = false;
  }
  if (newMaterial.value.expectedLifespan === -1) {
    errorMessage.value.push("Lifespan skal udfyldes");
    isFormOk.value = false;
  }
  if (newMaterial.value.declaredUnit.declaredValue <= -1) {
    errorMessage.value.push("Declared unit skal udfyldes");
    isFormOk.value = false;
  }
  if (newMaterial.value.declaredUnit.declaredUnit <= -1) {
    errorMessage.value.push("Declared unit skal udfyldes");
    isFormOk.value = false;
  }
  if (newMaterial.value.declaredUnit.mass <= -1) {
    errorMessage.value.push("Mass unit skal udfyldes");
    isFormOk.value = false;
  }
  if (newMaterial.value.declaredUnit.massUnit <= -1) {
    errorMessage.value.push("Mass unit skal udfyldes");
    isFormOk.value = false;
  }

  rawEmissionData.value.value.forEach((element) => {
    Object.keys(element).forEach((key, idx) => {
      if (element[key].unit.match(/\[[^\]]*\]/gm) === null) {
        errorMessage.value.push("Valider venligst din emission data");
        isFormOk.value = false;
        return;
      }
    });
  });

  if (newMaterial.value.tags.length <= 0) {
    errorMessage.value.push("Angiv venligst tags");
    isFormOk.value = false;
  }
};

const emits = defineEmits(["toggleView"]);
</script>

<template>
  <div class="flex m-10 justify-center items-start flex-col gap-4 w-full">
    <div class="flex flex-col">
      <span class="text-lg font-bold">Additional Sources</span>
      <div class="flex gap-2">
        <input
          class="rounded-md shadow-md p-2"
          type="link"
          placeholder="link"
          v-model="currentLink"
          v-on:keyup.enter="addLink"
        />
        <button
          @click="addLink"
          class="bg-blue-400 rounded-md shadow-md w-10 h-10 text-white hover:bg-blue-800"
        >
          +
        </button>
      </div>
      <div class="flex flex-col gap-2 mt-4 justify-between">
        <span
          v-for="link in newMaterial.additionalSources"
          class="bg-slate-300 rounded-md flex justify-between p-2"
        >
          {{ link }}<button @click="deleteLink(link)" class="bg-red-500 w-6 rounded-md shadow-md text-white text-sm font-bold hover:bg-red-800">x</button>
        </span>
      </div>
    </div>

    <div class="flex flex-col">
      <span class="text-lg font-bold">Navn</span>
      <input
        class="rounded-md shadow-md p-2"
        type="text"
        placeholder="Navn"
        v-model="newMaterial.shortName"
      />
    </div>

    <div class="flex flex-col w-11/12">
      <span class="text-lg font-bold">Beskrivelse</span>
      <textarea
        rows="4"
        class="block p-2.5 w-full text-sm rounded-md shadow-md"
        placeholder="beskrivelse"
        v-model="newMaterial.description"
      ></textarea>
    </div>

    <div class="flex flex-col">
      <span class="text-lg font-bold">Kategori (tags)</span>
      <div class="flex gap-2">
        <input
          type="text"
          v-model="currentTag"
          class="rounded-md shadow-md p-2"
          placeholder="tags"
          v-on:keyup.enter="addTag"
        />
        <button
          @click="addTag"
          class="bg-blue-400 rounded-md shadow-md w-10 h-10 text-white hover:bg-blue-800"
        >
          +
        </button>
      </div>

      <div class="flex flex-col gap-2 mt-4 justify-between">
        <span
          v-for="tag in newMaterial.tags"
          class="bg-slate-300 rounded-md flex justify-between p-2"
        >
          <p>{{ tag }}</p>
          <button @click="deleteTag(tag)" class="bg-red-500 w-6 rounded-md shadow-md text-white text-sm font-bold hover:bg-red-800">x</button>
        </span>
      </div>
    </div>

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

    <div class="flex">
      <div class="flex flex-col mr-6">
        <span class="text-lg font-bold">Issued at</span>
        <input
          type="date"
          class="rounded-md shadow-md p-2"
          v-model="newMaterial.epdInfo.issuedAt"
        />
      </div>
      <div class="flex flex-col">
        <span class="text-lg font-bold">Valid to</span>
        <input
          type="date"
          class="rounded-md shadow-md p-2"
          v-model="newMaterial.epdInfo.validTo"
        />
      </div>
    </div>

    <div class="flex flex-col">
      <span class="text-lg font-bold">Owner</span>
      <SearchDropdown
        class="search-dropdown"
        :maxItem="5"
        placeholder="Search for the owner"
        :options="allOwners"
        v-on:selected="onSelectedOwnerOption"
      />
    </div>

    <div class="flex">
      <div class="flex flex-col mr-6">
        <span class="text-lg font-bold">EPD type</span>
        <select
          class="mt-2 shadow-md rounded-md p-2"
          v-model="newMaterial.epdInfo.epdProductIndustryType"
        >
          <option :value="0">Industry</option>
          <option :value="1">Product</option>
        </select>
      </div>
      <div class="flex flex-col">
        <span class="text-lg font-bold">EPD Specification</span>
        <select
          class="mt-2 shadow-md rounded-md p-2"
          v-model="newMaterial.epdInfo.epdSpecificationForm"
        >
          <option :value="0">EN15804+A1</option>
          <option :value="1">EN15804+A2</option>
        </select>
      </div>
    </div>

    <div class="flex flex-col w-11/12">
      <span class="text-lg font-bold">Systemgrænser</span>
      <SystemBoundary @getSystemBoundries="getSystemBoundries" />
    </div>

    <div class="flex flex-col">
      <span class="text-lg font-bold">Lifespan</span>
      <input
        class="rounded-md shadow-md p-2"
        type="number"
        placeholder="lifespan"
        v-model="newMaterial.expectedLifespan"
      />
    </div>

    <div class="flex flex-col">
      <span class="text-lg font-bold">
        Units
      </span>
      <div class="flex">
        <input
          v-model="newMaterial.declaredUnit.declaredValue"
          type="number"
          placeholder="Amount"
          class="p-2 mr-1 focus:outline-1 focus:border-indigo-600 block shadow-md sm:text-sm border-gray-300 rounded-md"
        />
        <select
          v-model="newMaterial.declaredUnit.declaredUnit"
          class="rounded-md shadow-md"
        >
          <option v-for="option in selectedUnitValues" :value="option.value">
            {{ option.text }}
          </option>
        </select>
      </div>

      <div class="flex mt-1">
        <input
          type="number"
          v-model="newMaterial.declaredUnit.mass"
          placeholder="Amount"
          class="p-2 mr-1 focus:outline-1 focus:border-indigo-600 block shadow-md sm:text-sm border-gray-300 rounded-md"
        />
        <select
          v-model="newMaterial.declaredUnit.massUnit"
          class="rounded-md shadow-md"
        >
          <option v-for="option in selectedMassValues" :value="option.value">
            {{ option.text }}
          </option>
        </select>
      </div>
    </div>

    <div class="flex flex-col w-11/12">
      <span class="text-lg font-bold">Emission - values</span>
      <InputContainer @getDataFromEPDInput="getDataFromEPDInput" />
    </div>

    <!-- 
    <div class="flex flex-col gap-2 mt-4 justify-between">
      <span>Brændstoftype</span>
      <input
        class="rounded-md shadow-md p-2"
        type="text"
        placeholder="Brændstoftype"
        v-model="newMaterial.transport.fuelType"
      />
      <div class="w-full flex flex-col">
        <span>Transporttype</span>
        <input
          class="rounded-md shadow-md p-2"
          type="text"
          placeholder="Transporttype"
          v-model="newMaterial.transport.transportType"
        />
        <div class="flex gap-4 justify-between">
          <div class="flex flex-col w-full">
            <span>Transport afstand</span>

            <input
              class="rounded-md shadow-md p-2"
              type="number"
              v-model="newMaterial.transport.distance.value"
            />
          </div>
          <div class="flex flex-col">
            <span>Enhed</span>
            <input
              type="text"
              class="rounded-md shadow-md p-2"
              v-model="newMaterial.transport.distance.unit"
            />
          </div>
        </div>
        <div class="flex gap-4 justify-between">
          <div class="flex flex-col w-full">
            <span>Kapacitetsudnyttelse (inkl. tom returkørsel)</span>

            <input
              class="rounded-md shadow-md p-2"
              type="number"
              v-model="newMaterial.transport.capacityUtilizationInclEmpty.value"
            />
          </div>
          <div class="flex flex-col">
            <span>Enhed</span>
            <input
              type="text"
              class="rounded-md shadow-md p-2"
              v-model="newMaterial.transport.capacityUtilizationInclEmpty.unit"
            />
          </div>
        </div>
        <div class="flex gap-4 justify-between">
          <div class="flex flex-col w-full">
            <span>Brutto masse transporteret per deklareret enhed</span>

            <input
              class="rounded-md shadow-md p-2"
              type="number"
              v-model="newMaterial.transport.massPerDeclaredUnit.value"
            />
          </div>
          <div class="flex flex-col">
            <span>Enhed</span>
            <input
              type="text"
              class="rounded-md shadow-md p-2"
              v-model="newMaterial.transport.massPerDeclaredUnit.unit"
            />
          </div>
        </div>
        <div class="flex gap-4 justify-between">
          <div class="flex flex-col w-full">
            <span>Kapacitetsudnyttelse, volumenfaktor</span>

            <input
              class="rounded-md shadow-md p-2"
              type="number"
              v-model="newMaterial.transport.capacityUtilizationVolume.value"
            />
          </div>
          <div class="flex flex-col">
            <span>Enhed</span>
            <input
              type="text"
              class="rounded-md shadow-md p-2"
              v-model="newMaterial.transport.capacityUtilizationVolume.unit"
            />
          </div>
        </div>
      </div>
    </div>
 -->
    <div class="flex flex-col text-red-600 font-bold" v-if="!isFormOk">
      <span v-for="error in errorMessage"> {{ error }}</span>
    </div>

    <button
      class="bg-green-400 rounded-md shadow-md p-2 text-white hover:bg-green-800"
      @click="onSubmit"
    >
      Submit
    </button>
  </div>
</template>

<style scoped>
.search-dropdown {
  margin: 0 !important;
  padding: 0 !important;
}
</style>
