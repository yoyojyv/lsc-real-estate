import { ModuleWithProviders } from '@angular/core';

export interface IRouting {
  routes: ModuleWithProviders,
  components: any[]
}

export interface IUser {
  _id: string;
  username: string;
  name: string;
  email: string;
  mainPhone: string;
  userPhone: string;
  role: string;
  created: number;
}

export interface IProperty {

  _id?: string;
  no: number;
  personInCharge: any;
  status: string;
  type: string;
  typeDetail: string;
  title: string;
  address1: string;
  address2: string;
  zip: string;
  currentBusinessType: string;
  suggestedBusinessType: string;
  sizeSupplyPyeong: number;
  sizeSupplySquareMeter: number;
  floor: number;
  deposit: number;
  premium: number;
  monthlyRevenue?: number;
  monthlyRent?: number;
  description: string;
  remarks: string;
  priority: string;

}

export interface IPagedPrams {
  page: number;
  limit: number;
  search?: string;
  sort?: any;
}

export interface IPagedResults<T> {
  totalElements: number;
  totalPages: number;
  content: T;
}
