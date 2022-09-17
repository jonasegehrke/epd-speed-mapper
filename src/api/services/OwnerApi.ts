import apiClient from '../ApiClient';
import type Owner from "@/types/OwnerType";

export async function getAllOwners()  {
const response = await apiClient.get('api/owner')

if (response.status === 200) {
    return response.data 
} else {
        return {
        status: response.status,
        message: response.statusText
    }
    }
}

export async function createOwner(data: Owner) {
 const response = await apiClient.post('api/owner/create', data)

if (response.status === 200) {
    return response.data 
} else {
    return {
    status: response.status,
    message: response.statusText
    }
}
}

export async function getSpecificOwner(id: string)  {
    const response = await apiClient.get(`api/owner/${id}`)
    
    if (response.status === 200) {
        return response.data 
    } else {
            return {
            status: response.status,
            message: response.statusText
        }
     }
    }

export async function editOwner(id: string, data: Owner)  {
    const response = await apiClient.put(`api/owner/${id}`, data)
    
    if (response.status === 200) {
        return response 
    } else {
            return {
            status: response.status,
            message: response.statusText
        }
        }
    }