<script setup lang="ts">
import { ref, watch } from "vue";

const props = defineProps({
  id: Number,
});

const data: any = ref();

const emit = defineEmits(["handleCollectData"]);
watch(data, (newData, _oldData) => {
  emit("handleCollectData", handleSubmit(), props.id);
});

const handleSubmit = () => {
  data.value = data.value.replace(/\n(?=1)/gm, "")
  data.value = data.value.replace(/ – /gm, "-")
  const firstNewLineIndex = data.value.indexOf("\n");

  const firstLine = data.value.substr(0, firstNewLineIndex);

  if (firstLine.match(/[A-z](?=[0-9])/g) === null) {
    //do shit
    let test = data.value.replace(/\n/m, " ");
    const newFirstline = test.substr(0, test.indexOf("\n"));
    if (newFirstline.match(/[A-z](?=[0-9])/g) === null) {
      let test2 = test.replace(/\n/m, " ");
      const newFirstLine2 = test2.substr(0, test2.indexOf("\n"));

      data.value =
        test2.substr(0, firstNewLineIndex) +
        " " +
        test2.substr(newFirstLine2.search(/[A-z](?=[0-9])/), test2.length);


    }
  }

  const allColumns = data.value
    .substr(0, firstNewLineIndex)
    .replace(/ (?=[0-9])/gm, "")
    .split(" ");

  if (allColumns[0].toLowerCase().includes("indi")) {
    allColumns.splice(0, 1);
  }
  if (!allColumns[0].toLowerCase().includes("para")) {
    allColumns.splice(0, 0, "Parameter");
  }
  if (
    allColumns[1].toLowerCase().includes("enhed") ||
    allColumns[1].toLowerCase().includes("unit")
  ) {
  
  } else {
    allColumns.splice(1, 0, "Enhed");
  }


  let rows = data.value.substr(firstNewLineIndex, data.value.length);
  rows = rows.replace(/\n*$/gm, "");
  //add square brackets around units if missing
  if (rows.indexOf("[") === -1) {
    rows = rows.replace(/\n(?=-(?= ))/gm, " [");
    rows = rows.replace(/ (?=[a-z])/gm, " [");
    rows = rows.replace(/\n(?=[0-9])/gm, "] ");
  }

  const allRows = rows.split(/(?<!\[[^\]]*)[ \n]/);

  allRows.splice(0, 1); //remove leading ''

  const rowChunks = [];

  for (let i = 0; i < allRows.length; i += allColumns.length) {
    const chunk = allRows.slice(i, i + allColumns.length);
    rowChunks.push(chunk);
  }

  const result = {};

  rowChunks.forEach((row: Array<String>, rowIndex: number) => {

    let currentKey = "";
    row.forEach((value, valueIndex) => {
      value = value.replace(/\n/g, " ");
      if (valueIndex === 0) {
        value = value.replace(/[0-9]/g, "");
        value = value.replace(/[*]/gm, "");
        currentKey = value;
        result[currentKey] = {};
        return;
      }
      if (valueIndex === 1) {
        if (value.includes("SO2")) {
          value.replace("SO2", "SO\u2082");
        } else if (value.includes("PO43")) {
          value.replace("PO43", "SO\u2084\u00B3");
        } else if (value.includes("M2")) {
          value.replace("M2", "M\u00B2");
        } else if (value.includes("M3")) {
          value.replace("M3", "M\u00B3");
        } else if (value.includes("CO2")) {
          value.replace("CO2", "CO\u2082");
        }

        result[currentKey].unit = value;
        return;
      }

      if (allColumns[valueIndex].includes("-")) {
        if (allColumns[valueIndex] != "A1-A3") {
          //Split B2-B7 to B2, B3, B4...
          const splitFirst = allColumns[valueIndex].substr(0, 2).split("");
          const splitLast = allColumns[valueIndex].substr(3, 5).split("");
          let key = splitFirst[0];
          let itteratorCap = Number(splitLast[1]);
          if (splitLast[0] === "C") {
            itteratorCap = 7 - Number(splitFirst[1]) + Number(splitLast[1]);
          }
          for (let i = Number(splitFirst[1]); i < itteratorCap + 1; i++) {
            result[currentKey][key + `${i}`] = value;

            if (i == 7 && splitLast[0] === "C") {
              key = splitLast[0];
            }
          }

          return;
        } else {
          allColumns[valueIndex] = "A1A3";
        }
      }
      result[currentKey][allColumns[valueIndex]] = value;
    });
  });

  return result;
};


</script>

<template>
  <textarea
    v-model="data"
    rows="5"
    class="rounded-md shadow-md indent-2 w-full"
  ></textarea>
</template>
