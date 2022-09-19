<script setup lang="ts">
import SearchDropdown from "search-dropdown-vue";
import { onMounted, ref, watch } from "vue";
import { uploadFiles } from "../api/services/FileuploadAPi";
import { getAllOwners } from "../api/services/OwnerApi";
import { store } from "../store";
import Material from "../types/Material";
import Stage from "../types/Stage";
import MultiInputContainer from "./MultiInputContainer.vue";
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
const amountOfEPD = ref<number>(1);
const allOwners = ref([]);

const description = ref("");
const issuedAt = ref("");
const validTo = ref("");
const epdProductIndustryType = ref(-1);
const epdSpecificationForm = ref(-1);
const expectedLifespan = ref(-1);

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

const allNewMaterials = ref<Array<Material>>([
  {
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
  },
]);

watch(amountOfEPD, (newAmount, _oldAmount) => {
  allNewMaterials.value = [];
  for (let i = 0; i < newAmount; i++) {
    const copy = JSON.parse(JSON.stringify(newMaterial.value));
    allNewMaterials.value.push(copy);
  }
});

watch(allNewMaterials, (newAllNewMaterials, _oldAllNewMaterials) => {
  store.allNewMaterials = allNewMaterials;
});

const onSelectedOwnerOption = (payload: any) => {
  allNewMaterials.value.forEach((material) => {
    material.ownerId = payload.id;
  });
};

const getSystemBoundries = (data) => {
  boundries.value = data;
};

const addTag = () => {
  allNewMaterials.value.forEach((material) => {
    material.tags.push(currentTag.value);
  });
};

const deleteTag = (tag) => {
  allNewMaterials.value.forEach((material) => {
    const index = material.tags.indexOf(tag);
    if (index > -1) {
      material.tags.splice(index, 1);
    }
  });
};

const addLink = () => {
  allNewMaterials.value.forEach((material) => {
    material.additionalSources.push(currentLink.value);
  });
};
const deleteLink = (link) => {
  allNewMaterials.value.forEach((material) => {
    const index = material.additionalSources.indexOf(link);
    if (index > -1) {
      material.additionalSources.splice(index, 1);
    }
  });
};

const fetchData = async () => {
  const response = await getAllOwners();
  allOwners.value = response;
};

const setDescription = () => {
  if (description.value === "") {
    errorMessage.value.push("Missing description");
    isFormOk.value = false;
    return;
  }
  allNewMaterials.value.forEach((material) => {
    material.description = description.value;
  });
};

const setIssuedAt = () => {
  if (issuedAt.value === "") {
    errorMessage.value.push("Missing issuedAt");
    isFormOk.value = false;
    return;
  }
  allNewMaterials.value.forEach((material) => {
    material.epdInfo.issuedAt = issuedAt.value;
  });
};
const setValidTo = () => {
  if (validTo.value === "") {
    errorMessage.value.push("Missing validTo");
    isFormOk.value = false;
    return;
  }
  allNewMaterials.value.forEach((material) => {
    material.epdInfo.validTo = validTo.value;
  });
};
const setEpdProductIndustryType = () => {
  if (epdProductIndustryType.value <= -1) {
    errorMessage.value.push("Missing epdProductIndustryType");
    isFormOk.value = false;
    return;
  }
  allNewMaterials.value.forEach((material) => {
    material.epdInfo.epdProductIndustryType = epdProductIndustryType.value;
  });
};
const setEpdSpecificationForm = () => {
  if (epdSpecificationForm.value <= -1) {
    errorMessage.value.push("Missing epdSpecificationForm");
    isFormOk.value = false;
    return;
  }
  allNewMaterials.value.forEach((material) => {
    material.epdInfo.epdSpecificationForm = epdSpecificationForm.value;
  });
};
const setExpectedLifespan = () => {
  if (expectedLifespan.value < -1) {
    errorMessage.value.push("Missing expectedLifespan");
    isFormOk.value = false;
    return;
  }
  allNewMaterials.value.forEach((material) => {
    material.expectedLifespan = expectedLifespan.value;
  });
};

const uploadFileAndAssign = async () => {
  if (files?.value?.files != undefined && files?.value?.files?.length > 0) {
    const response = await uploadFiles(files);
    if (response?.data?.fileIds) {
      allNewMaterials.value.forEach((material) => {
        material.link = response?.data?.fileIds;
      });
    }
  } else {
    errorMessage.value.push("Missing EPD Upload");
    isFormOk.value = false;
  }
};

onMounted(async () => {
  fetchData();
});

const onSubmit = async () => {
  errorMessage.value = [];

  setDescription();
  uploadFileAndAssign();
  setIssuedAt();
  setValidTo();
  setEpdProductIndustryType();
  setEpdSpecificationForm();
  setExpectedLifespan();
  isFormOk.value = true;
  validateForm();
  if (!isFormOk.value) {
    return;
  }

  allNewMaterials.value.forEach((material) => {
    if (material.expectedLifespan === -2) {
      delete material.expectedLifespan;
    }
    Object.keys(boundries.value).forEach((bound, index) => {
      if (boundries.value[bound] === "R") {
        material.stages[index].stageStatus = 2;
      } else if (boundries.value[bound] === "MND") {
        material.stages[index].stageStatus = 1;
      } else if (boundries.value[bound] === "MNR") {
        material.stages[index].stageStatus = 0;
      }
    });
  });

  console.log(allNewMaterials.value);
  /* 
  allNewMaterials.value.forEach(async (material) => {
    const response = await createMaterial(material);
    console.log(response);
    if (response.status === 200) {
      emits("toggleView");
    } else {
      alert("some error occured while posting");
    }
  }); 
   */
};

const validateForm = () => {
  allNewMaterials.value.forEach((material) => {
    if (material.additionalSources.length <= 0) {
      errorMessage.value.push("Missing additionalSources");
      isFormOk.value = false;
    }
    if (material.tags.length <= 0) {
      errorMessage.value.push("Missing tags");
      isFormOk.value = false;
    }
    if (material.ownerId === undefined) {
      errorMessage.value.push("Missing ownerId");
      isFormOk.value = false;
    }
    if (material.declaredUnit.declaredUnit === -1) {
      errorMessage.value.push("Missing declaredUnit");
      isFormOk.value = false;
    }
    if (material.declaredUnit.declaredValue === -1) {
      errorMessage.value.push("Missing declaredValue");
      isFormOk.value = false;
    }
    if (material.declaredUnit.mass === -1) {
      errorMessage.value.push("Missing mass");
      isFormOk.value = false;
    }
    if (material.declaredUnit.massUnit === -1) {
      errorMessage.value.push("Missing massUnit");
      isFormOk.value = false;
    }
    allNewMaterials.value.forEach((material) => {
      if (material.stages.length > 18) {
        errorMessage.value.push(
          "Emission data length er:",
          material.stages.length
        );
        isFormOk.value = false;
      }
    });

    store.rawMultiEPDData.forEach((element) => {
      console.log(element);
      element.forEach((prox) => {
        Object.keys(prox).forEach((key, idx) => {
          if (prox[key].unit.match(/\[[^\]]*\]/gm) === null) {
            errorMessage.value.push("Valider venligst din emission data");
            isFormOk.value = false;
            return;
          }
        });
      });
    });
  });
};

const emits = defineEmits(["toggleView"]);
</script>

<template>
  <div class="flex m-10 justify-center items-start flex-col gap-4 w-full">
    <div class="flex flex-col">
      <span class="text-lg font-bold">Amount Of EPD's</span>
      <input
        class="rounded-md shadow-md p-2"
        type="number"
        placeholder="amount"
        v-model="amountOfEPD"
      />
    </div>
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
          v-for="link in allNewMaterials[0].additionalSources"
          class="bg-slate-300 rounded-md flex justify-between p-2"
        >
          {{ link
          }}<button
            @click="deleteLink(link)"
            class="bg-red-500 w-6 rounded-md shadow-md text-white text-sm font-bold hover:bg-red-800"
          >
            x
          </button>
        </span>
      </div>
    </div>
    <div class="flex flex-col gap-2">
      <span class="text-lg font-bold">Names</span>
      <div
        v-for="material in allNewMaterials"
        class="flex gap-2 justify-between"
      >
        <div class="flex flex-col">
          <span>Name</span>
          <input
            class="rounded-md shadow-md p-2"
            type="text"
            placeholder="Navn"
            v-model="material.shortName"
          />
        </div>
      </div>
    </div>

    <div class="flex flex-col w-11/12">
      <span class="text-lg font-bold">Beskrivelse</span>
      <textarea
        rows="4"
        class="block p-2.5 w-full text-sm rounded-md shadow-md"
        placeholder="beskrivelse"
        v-model="description"
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
          v-for="tag in allNewMaterials[0].tags"
          class="bg-slate-300 rounded-md flex justify-between p-2"
        >
          <p>{{ tag }}</p>
          <button
            @click="deleteTag(tag)"
            class="bg-red-500 w-6 rounded-md shadow-md text-white text-sm font-bold hover:bg-red-800"
          >
            x
          </button>
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
          v-model="issuedAt"
        />
      </div>
      <div class="flex flex-col">
        <span class="text-lg font-bold">Valid to</span>
        <input type="date" class="rounded-md shadow-md p-2" v-model="validTo" />
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
          v-model="epdProductIndustryType"
        >
          <option :value="0">Industry</option>
          <option :value="1">Product</option>
        </select>
      </div>
      <div class="flex flex-col">
        <span class="text-lg font-bold">EPD Specification</span>
        <select
          class="mt-2 shadow-md rounded-md p-2"
          v-model="epdSpecificationForm"
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
        v-model="expectedLifespan"
      />
    </div>

    <div class="flex flex-col">
      <span class="text-lg font-bold"> Units </span>
      <div class="flex gap-8 flex-col">
        <div v-for="material in allNewMaterials" class="flex flex-col gap-2">
          <span>{{ material.shortName }}</span>
          <div class="flex">
            <input
              v-model="material.declaredUnit.declaredValue"
              type="number"
              placeholder="Amount"
              class="p-2 mr-1 focus:outline-1 focus:border-indigo-600 block shadow-md sm:text-sm border-gray-300 rounded-md"
            />
            <select
              v-model="material.declaredUnit.declaredUnit"
              class="rounded-md shadow-md"
            >
              <option
                v-for="option in selectedUnitValues"
                :value="option.value"
              >
                {{ option.text }}
              </option>
            </select>
          </div>

          <div class="flex">
            <input
              type="number"
              v-model="material.declaredUnit.mass"
              placeholder="Amount"
              class="p-2 mr-1 focus:outline-1 focus:border-indigo-600 block shadow-md sm:text-sm border-gray-300 rounded-md"
            />
            <select
              v-model="material.declaredUnit.massUnit"
              class="rounded-md shadow-md"
            >
              <option
                v-for="option in selectedMassValues"
                :value="option.value"
              >
                {{ option.text }}
              </option>
            </select>
          </div>
        </div>
      </div>
    </div>

    <div class="flex flex-col w-11/12">
      <span class="text-lg font-bold">Emission - values</span>
      <!-- TODO fix multi -->
      <MultiInputContainer />
    </div>

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
