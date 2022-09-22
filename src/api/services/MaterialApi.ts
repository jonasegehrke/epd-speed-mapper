import axios from "axios";
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
  console.log("Posting this data: ", data);
  const response = await apiClient.post("api/material/create", data);
  console.log(response.status);
  if (response.status === 201) {
    const localResponse = await sendToLocalBackend(data);
    return localResponse;
  } else {
    alert("FAILED TO POST TO CLOUD")
    return response
  }
}

const localClient = axios.create({
  baseURL: "http://localhost:3000",
  timeout: 5000,
});

export const sendToLocalBackend = async (data: Material) => {
  const response = await localClient.post("writeMaterial", data);
  if (response.status === 200) {
    return response;
  } else {
    alert("FAILED TO POST TO LOCAL")
    return response
  }
};

export const sendLinkedToLocal = async (data: Material) => {
  const response = await localClient.post("writeLinked", data);
  if (response.status === 200) {
    return response;
  } else {
    alert("FAILED TO POST TO LOCAL")
    return response
  }
};

export async function getNextMaterial() {
  const response = await localClient.get(`getNextMaterial`);
  if (response.status === 200) {
    return response.data;
  } else {
    alert("FAILED TO GET LOCAL")
    return response
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
