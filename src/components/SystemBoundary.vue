<script setup lang="ts">
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import { AgGridVue } from "ag-grid-vue3";
import { ref } from "vue";

const emits = defineEmits(["getSystemBoundries"])
const columnDefs = ref([
  { headerName: "A1A3", field: "A1A3" },
  { headerName: "A1", field: "A1" },
  { headerName: "A2", field: "A2" },
  { headerName: "A3", field: "A3" },
  { headerName: "A4", field: "A4" },
  { headerName: "A5", field: "A5" },
  { headerName: "B1", field: "B1" },
  { headerName: "B2", field: "B2" },
  { headerName: "B3", field: "B3" },
  { headerName: "B4", field: "B4" },
  { headerName: "B5", field: "B5" },
  { headerName: "B6", field: "B6" },
  { headerName: "B7", field: "B7" },
  { headerName: "C1", field: "C1" },
  { headerName: "C2", field: "C2" },
  { headerName: "C3", field: "C3" },
  { headerName: "C4", field: "C4" },
  { headerName: "D", field: "D" },
]);

const rowData = ref<{}[]>([{ "A1A3": "R" }]);

const valueMappings = ["R", "MNR", "MND"];


const defaultColDef = ref({
  editable: true,
  width: 70,
  cellEditor: "agSelectCellEditor",
  cellEditorParams: { values: valueMappings },
});

const onCellValueChanged = (event: any) => {
  rowData.value.map((row, idx) => {
    if (idx === event.rowIndex) {
      row === event.data;
    }
  });


  if(Object.keys(rowData.value[0]).length === 18){
    emits("getSystemBoundries", rowData.value[0])
  }

};
</script>

<template>
  <div>
    <div class="my-1 w-full"></div>

    <ag-grid-vue
      style="width: 100%; height: 110px"
      class="ag-theme-alpine"
      :columnDefs="columnDefs"
      :rowData="rowData"
      :defaultColDef="defaultColDef"
      @cell-value-changed="onCellValueChanged"
    >
    </ag-grid-vue>
  </div>
</template>
