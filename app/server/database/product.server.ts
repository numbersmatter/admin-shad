import { dataPoint, mainDb, randomId } from "./mainDb.server";
import type { DocumentData, FieldValue } from "firebase-admin/firestore";

export interface ImageObject {
  id: string;
  name: string;
  src: string;
  alt: string;
}

export interface DetailItem {
  id: string;
  value: string;
}

export interface ProductDetail {
  id: string;
  name: string;
  itemOrder: string[];
  itemData: { [key: string]: DetailItem };
  type: "bullet" | "paragraph";
}

export interface ProductDetailsObject {
  detailData: { [key: string]: ProductDetail };
  detailOrder: string[];
}

export interface OptionChoice {
  name: string;
  id: string;
  priceRange: string;
  description: string;
}

export interface ProductOption {
  id: string;
  name: string;
  choiceOrder: string[];
  choiceData: { [key: string]: OptionChoice };
}

export interface ProductOptionDisplay {
  id: string;
  name: string;
  choices: OptionChoice[];
}

export interface ProductOptionsObject {
  optionData: { [key: string]: ProductOption };
  optionOrder: string[];
}

export interface ProductBasic {
  description: string;
  name: string;
  priceRange: string;
  pricing: string;
  ordering?: number;
}

export interface Product {
  id: string;
  productImages: {
    imageOrder: string[];
    imageData: { [key: string]: ImageObject };
  };
  availability: "open" | "closed";
  basic: ProductBasic;
  productDetails: ProductDetailsObject;
  productOptions: ProductOptionsObject;
}

const productCollection = (storeId: string) =>
  dataPoint<Product>(`${mainDb}/stores/${storeId}/products`);

// Product CRUD

export const createProduct = async ({
  storeId,
  productBasic,
}: {
  storeId: string;
  productBasic: ProductBasic;
}) => {
  const productRef = productCollection(storeId).doc();

  const productData: Product = {
    id: productRef.id,
    productImages: {
      imageOrder: [],
      imageData: {},
    },
    availability: "closed",
    basic: productBasic,
    productDetails: {
      detailData: {},
      detailOrder: [],
    },
    productOptions: {
      optionData: {},
      optionOrder: [],
    },
  };

  await productRef.set(productData);

  return productRef.id;
};

export const readProduct = async ({
  storeId,
  productId,
}: {
  storeId: string;
  productId: string;
}) => {
  const productData = await productCollection(storeId).doc(productId).get();
  return productData.data();
};

export const updateProduct = async ({
  storeId,
  productId,
  updateData,
}: {
  storeId: string;
  productId: string;
  updateData: DocumentData;
}) => {
  return await productCollection(storeId).doc(productId).update(updateData);
};

export const deleteProduct = async ({
  storeId,
  productId,
}: {
  storeId: string;
  productId: string;
}) => {
  await productCollection(storeId).doc(productId).delete();
};

// Product Queries

export const getOpenProducts = async (storeId: string) => {
  const products = await productCollection(storeId)
    .where("availability", "==", "open")
    .get();

  return products.docs.map((product) => product.data());
};

export const getProducts = async ({ storeId }: { storeId: string }) => {
  const products = await productCollection(storeId).get();

  return products.docs.map((product) => product.data());
};
