import { ReviewStatus } from "~/routes/review_.$reviewId";
import { ProductOptionDisplay } from "../database/product.server";
import { FormTemplate } from "../database/formTemplate.server";

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

// Review

export interface Tag {
  text: string;
  color: string;
  id: string;
  optionId?: string;
  index: number;
}

export interface ProposalCard {
  humanId: string;
  id: string;
  productId: string;
  productName: string;
  submittedAtDate: Date;
  reviewStatus: ReviewStatus;
  submittedAtString: string;
  tags: Tag[];
}

export interface ImageUpload {
  id: string;
  url: string;
  name: string;
}

export interface ProposalReview {
  formContent: FormTemplate;
  userResponse: { [key: string]: string };
  userImages: { [key: string]: ImageUpload[] };
  productName: string;
  humanId: string;
  tags: Tag[];
  id: string;
  reviewStatus: ReviewStatus;
  displayFields: DisplayField[];
}

export interface DisplayField {
  label: string;
  value: string;
  type: string;
  id: string;
}
