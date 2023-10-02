import { ProductOptionDisplay } from "../database/product.server";

export interface ImageUploadFormData {
  type: string;
  attachId: string;
  uploadUrl: string;
  returnUrl: string;
  storeId: string;
}

export interface ProductStoreItem {
  name: string;
  id: string;
  status: string;
  providerText: string;
}

export interface ProductDetailDisplay {
  id: string;
  name: string;
  type: "bullet" | "paragraph";
  items: { id: string; value: string }[];
}

export interface ProductWorkItem {
  id: string;
  name: string;
  description: string;
  status: string;
}

export interface ProductData {
  productName: string;
  storeId: string;
  images: { id: string; name: string; src: string; alt: string }[];
  priceRange: string;
  description: string;
  details: ProductDetailDisplay[];
  options: ProductOptionDisplay[];
  backUrl: string;
  productId: string;
}

export type FieldType =
  | "textField"
  | "textArea"
  | "imageUpload"
  | "select"
  | "emailField";

export interface FieldSettingsData {
  fieldLabel: string;
  fieldType: FieldType;
  requiredData: { required: boolean; min: number; message: string };
  placeholder: string;
  fieldId: string;
  options: { name: string; value: string }[];
}
