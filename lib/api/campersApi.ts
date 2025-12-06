// lib/api/campersApi.ts

import axios, { AxiosResponse } from "axios";
import type { Camper } from "@/types/camper";

const BASE_URL = "https://66b1f8e71ca8ad33d4f5f63e.mockapi.io";

export const api = axios.create({
  baseURL: BASE_URL,
});

export interface CampersListResponse {
  total: number;
  items: Camper[];
}

// фільтри і пагінація
export interface CampersQueryParams {
  page?: number;
  limit?: number;
  [key: string]: string | number | boolean | undefined;
}

// список кемперів
export const getCampers = (params?: CampersQueryParams) => {
  return api
    .get<CampersListResponse>("/campers", { params })
    .then((res: AxiosResponse<CampersListResponse>) => res.data);
};

// один кемпер за id
export const getCamperById = (id: string) => {
  return api
    .get<Camper>(`/campers/${id}`)
    .then((res: AxiosResponse<Camper>) => res.data);
};
