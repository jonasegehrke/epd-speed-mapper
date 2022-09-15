import apiClient from "../../api/ApiClient";
import type Material from "../../types/MaterialType";

export async function getAllEDP() {
  const response = await apiClient.get("api/material");

  if (response.status === 200) {
    return response.data;
  } else {
    return {
      status: response.status,
      message: response.statusText,
    };
  }
}

export async function getSpecificEPD(id: string) {
  const response = await apiClient.get(`api/material/${id}`);
  if (response.status === 200) {
    return response.data;
  } else {
    return {
      status: response.status,
      message: response.statusText,
    };
  }
}

export async function createMaterial(data: Material) {
  console.log("this is the data", data);
  const response = await apiClient.post("api/material/create", data);

  if (response.status === 200) {
    return response.data;
  } else {
    return {
      status: response.status,
      message: response.statusText,
    };
  }
}


export async function updateMaterial(data: Material, id: string) {
  const response = await apiClient.put(`api/material/${id}`, data);

  if (response.status === 200) {
    return response.data;
  } else {
    return {
      status: response.status,
      message: response.statusText,
    };
  }
}

export async function deleteMaterial(id: string) {
  const response = await apiClient.delete(`api/material/${id}`);

  if (response.status === 200) {
    return response.data;
  } else {
    return {
      status: response.status,
      message: response.statusText,
    };
  }
}

export async function getStageStateEnum() {
  const response = await apiClient.get("api/material/stagestateenum");

  if (response.status === 200) {
    return response.data;
  } else {
    return {
      status: response.status,
      message: response.statusText,
    };
  }
}

export async function getStageTypeEnum() {
  const response = await apiClient.get("api/Material/stagetypeenum");

  if (response.status === 200) {
    return response.data;
  } else {
    return {
      status: response.status,
      message: response.statusText,
    };
  }
}
