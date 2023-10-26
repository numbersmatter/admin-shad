import { randomId } from "../database/mainDb.server";
import type {
  ImageObject,
  OptionChoice,
  ProductBasic,
} from "../database/product.server";
import {
  createProduct,
  getProducts,
  readProduct,
  updateProduct,
} from "../database/product.server";
import { makeDomainFunction } from "domain-functions";
import type {
  FieldType,
  FormTemplateField,
} from "../database/formTemplate.server";
import {
  createFormTemplate,
  readFormTemplate,
  updateFormTemplate,
} from "../database/formTemplate.server";
import { FieldValue } from "firebase-admin/firestore";
import { redirect } from "@remix-run/node";
import { getTaskLists } from "../database/tasklist.server";
import { performMutation } from "remix-forms";
import {
  FieldSettingsData,
  ImageUploadFormData,
  ProductData,
  ProductStoreItem,
  ProductWorkItem,
} from "./domain-types";
import {
  AddOptionSchema,
  MoveOptionSchema,
  ProductBasicsSchema,
} from "./product-schemas";
import id from "date-fns/esm/locale/id/index.js";
// import type { ImageUploadFormData } from "~/ui/work/Pages/ProductImagesEditPage";
// import type { FieldSettingsData } from "~/ui/work/PageComponents/FormFieldSettings";
// import type { ProductStoreItem } from "~/ui/work/PageComponents/StoreControl";
// import type { ProductWorkItem } from "~/ui/work/Pages/ProductWorkPage";
// import type { ProductData } from "~/ui/Pages/ClientProductPage";

//
// Client Side Functions
//
//

export const getProductData = async ({
  productId,
  storeId,
}: {
  productId: string;
  storeId: string;
}) => {
  const product = await readProduct({ storeId, productId });
  if (!product) {
    throw new Response("Product not found", { status: 404 });
  }

  //
  // Images
  //
  const imageIds = product?.productImages?.imageOrder ?? [];
  const imageData = product?.productImages?.imageData ?? {};
  const valideImageIds = imageIds.filter((imageId) => {
    return imageData.hasOwnProperty(imageId);
  });

  const images = valideImageIds.map((imageId) => {
    const image = imageData[imageId];
    return image;
  });

  //
  // Details
  //
  const detailData = product.productDetails.detailData;
  const detailOrder = product.productDetails.detailOrder;

  const validDetails = detailOrder
    .filter((detailId) => {
      return detailData.hasOwnProperty(detailId);
    })
    .map((detailId) => {
      const detail = detailData[detailId];

      const items = detail.itemOrder
        .filter((itemId) => {
          return detail.itemData.hasOwnProperty(itemId);
        })
        .map((itemId) => {
          const item = detail.itemData[itemId];
          return item;
        });

      return {
        id: detail.id,
        name: detail.name,
        items: items,
        type: detail.type,
      };
    });

  //
  // Options
  //
  const optionData = product.productOptions.optionData;
  const optionOrder = product.productOptions.optionOrder;

  const validOptions = optionOrder
    .filter((optionId) => {
      return optionData.hasOwnProperty(optionId);
    })
    .map((optionId) => {
      const option = optionData[optionId];

      const choices = option.choiceOrder
        .filter((choiceId) => {
          return option.choiceData.hasOwnProperty(choiceId);
        })
        .map((choiceId) => {
          const choice = option.choiceData[choiceId];
          return choice;
        });

      return {
        id: option.id,
        name: option.name,
        choices: choices,
      };
    });

  const productData: ProductData = {
    storeId: storeId,
    productId: productId,
    productName: product.basic.name,
    description: product.basic.description,
    priceRange: product.basic.priceRange,
    backUrl: "/store",
    images,
    details: validDetails,
    options: validOptions,
  };
  return productData;
};

//
// Authorized User Functions
//
//

export const getDashboardProductItems = async ({
  storeId,
}: {
  storeId: string;
}) => {
  const products = await getProducts({ storeId });

  const productItems = products.map((product) => {
    const productItem: ProductStoreItem = {
      id: product.id,
      name: product.basic.name,
      status: product.availability,
      providerText: product.basic.description,
    };
    return productItem;
  });

  return productItems;
};

export const getProductsPageData = async ({ storeId }: { storeId: string }) => {
  const products = await getProducts({ storeId });

  const productData = products
    .map((product) => {
      return {
        id: product.id,
        name: product.basic.name,
        description: product.basic.description,
        availability: product.availability,
        ordering: product.basic.ordering ?? 0,
      };
    })
    .sort((a, b) => {
      return a.ordering - b.ordering;
    });

  const productPageData: { products: ProductWorkItem[] } = {
    products: productData,
  };

  return { productPageData };
};

export const toggleProductAvailability = async ({
  productId,
  storeId,
  availability,
}: {
  productId: string;
  storeId: string;
  availability: string;
}) => {
  const updateData = {
    availability: availability,
  };

  await updateProduct({ storeId, updateData, productId });
};

export const handleUserProductCreation = async ({
  storeId,
  userId,
  request,
}: {
  userId: string;
  storeId: string;
  request: Request;
}) => {
  const mutation = makeDomainFunction(ProductBasicsSchema)(async (values) => {
    const partialProduct = {
      name: values.name,
      priceRange: values.priceRange,
      description: values.description,
      pricing: values.pricing,
    };
    const newProductId = await createProduct({
      storeId,
      productBasic: partialProduct,
    });

    await createFormTemplate({
      storeId,
      userId,
      formTemplateId: newProductId,
    });

    return { productId: newProductId };
  });

  const result = await performMutation({
    request,
    schema: ProductBasicsSchema,
    mutation,
  });

  if (!result.success) {
    throw new Response("Error creating product", { status: 500 });
  }

  return redirect(`/products/${result.data.productId}`);
};

export const getProductEditData = async ({
  productId,
  storeId,
}: {
  productId: string;
  storeId: string;
}) => {
  const product = await readProduct({ storeId, productId });
  if (!product) {
    throw new Response("Product not found", { status: 404 });
  }

  const detailData = product.productDetails.detailData;
  const detailOrder = product.productDetails.detailOrder;

  const validDetails = detailOrder
    .filter((detailId) => {
      return detailData.hasOwnProperty(detailId);
    })
    .map((detailId) => {
      const detail = detailData[detailId];
      const items = detail.itemOrder
        .filter((itemId) => {
          return detail.itemData.hasOwnProperty(itemId);
        })
        .map((itemId) => {
          const item = detail.itemData[itemId];
          return item;
        });

      return {
        id: detailId,
        name: detail.name,
        items: items,
        type: detail.type,
      };
    });

  const secondaryNavigation = [
    {
      name: "Product Basics",
      to: `/products/${productId}`,
      end: true,
    },
    {
      name: "Product Images",
      to: `/products/${productId}/images`,
      end: false,
    },
    {
      name: "Product Details",
      to: `/products/${productId}/details`,
      end: false,
    },
    {
      name: "Product Options",
      to: `/products/${productId}/options`,
      end: false,
    },
    {
      name: "Product Form",
      to: `/products/${productId}/form`,
      end: false,
    },
    {
      name: "Task List",
      to: `/products/${productId}/task-list`,
      end: false,
    },
  ];

  const imageIds = product?.productImages?.imageOrder ?? [];
  const imageData = product?.productImages?.imageData ?? {};
  const valideImageIds = imageIds.filter((imageId) => {
    return imageData.hasOwnProperty(imageId);
  });

  const images = valideImageIds.map((imageId) => {
    const image = imageData[imageId];
    return image;
  });

  const productBasic = product.basic;

  const returnUrl = `/products/${productId}/images`;
  const uploadUrl = `/api/product/${productId}/image-upload`;

  const imageUploadFormData: ImageUploadFormData = {
    type: "productImage",
    attachId: productId,
    uploadUrl,
    returnUrl,
    storeId,
  };

  const productOptions = product.productOptions.optionOrder
    .filter((optionId) => {
      return product.productOptions.optionData.hasOwnProperty(optionId);
    })
    .map((optionId) => {
      const option = product.productOptions.optionData[optionId];
      const choices = option.choiceOrder
        .filter((choiceId) => {
          return option.choiceData.hasOwnProperty(choiceId);
        })
        .map((choiceId) => {
          const choice = option.choiceData[choiceId];
          return choice;
        });

      return {
        id: option.id,
        name: option.name,
        choices,
      };
    });

  return {
    details: validDetails,
    secondaryNavigation,
    productBasic,
    images,
    imageUploadFormData,
    options: productOptions,
  };
};

//
// Product Basics Functions
//
//

export const updateProductBasic = async ({
  productId,
  storeId,
  productBasic,
}: {
  productId: string;
  storeId: string;
  productBasic: ProductBasic;
}) => {
  const updateData = {
    basic: productBasic,
  };

  await updateProduct({
    storeId,
    productId,
    updateData,
  });
};

export const updateProductBasicField = async ({
  productId,
  storeId,
  fieldId,
  fieldValue,
}: {
  productId: string;
  storeId: string;
  fieldId: string;
  fieldValue: string | number;
}) => {
  const updateData = {
    [`basic.${fieldId}`]: fieldValue,
  };

  await updateProduct({
    storeId,
    productId,
    updateData,
  });
};

//
// Product Images Functions
//
//

export const addProductImage = async ({
  productId,
  storeId,
  image,
}: {
  productId: string;
  storeId: string;
  image: {
    name: string;
    src: string;
    alt: string;
  };
}) => {
  const imageId = randomId();
  const imageData = {
    name: image.name,
    src: image.src,
    alt: image.alt,
    id: imageId,
  };
  const updateData = {
    [`productImages.imageOrder`]: FieldValue.arrayUnion(imageId),
    [`productImages.imageData.${imageId}`]: imageData,
  };

  await updateProduct({
    storeId,
    productId,
    updateData,
  });

  return imageId;
};

export const deleteProductImage = async ({
  productId,
  storeId,
  imageId,
}: {
  productId: string;
  storeId: string;
  imageId: string;
}) => {
  const updateData = {
    [`productImages.imageOrder`]: FieldValue.arrayRemove(imageId),
    [`productImages.imageData.${imageId}`]: FieldValue.delete(),
  };

  await updateProduct({
    storeId,
    productId,
    updateData,
  });
};

export const migrateProductImages = async ({
  productId,
  storeId,
  images,
}: {
  productId: string;
  storeId: string;
  images: ImageObject[];
}) => {
  const imageIds = images.map((image) => {
    return image.id;
  });

  const imageData = images.reduce((acc, image) => {
    return {
      ...acc,
      [image.id]: image,
    };
  }, {});

  const updateData = {
    productImages: {
      imageOrder: imageIds,
      imageData,
    },
  };

  await updateProduct({ storeId, productId, updateData });
};

//
// Product Details Functions
//
//
//

export const addProductDetail = async ({
  productId,
  storeId,
  detailData,
}: {
  productId: string;
  storeId: string;
  detailData: {
    name: string;
    type: "bullet" | "paragraph";
  };
}) => {
  const detailId = randomId();
  const detail = {
    name: detailData.name,
    type: detailData.type,
    itemOrder: [],
    itemData: {},
  };

  const updateData = {
    [`productDetails.detailOrder`]: FieldValue.arrayUnion(detailId),
    [`productDetails.detailData.${detailId}`]: detail,
  };

  await updateProduct({
    storeId,
    productId,
    updateData,
  });

  return detailId;
};

export const updateProductDetail = async ({
  productId,
  storeId,
  detailId,
  detailData,
}: {
  productId: string;
  storeId: string;
  detailId: string;
  detailData: {
    name: string;
    type: "bullet" | "paragraph";
  };
}) => {
  const updateData = {
    [`productDetails.detailData.${detailId}.name`]: detailData.name,
    [`productDetails.detailData.${detailId}.type`]: detailData.type,
  };

  await updateProduct({
    storeId,
    productId,
    updateData,
  });
};

export const deleteProductDetail = async ({
  productId,
  storeId,
  detailId,
}: {
  productId: string;
  storeId: string;
  detailId: string;
}) => {
  const updateData = {
    [`productDetails.detailOrder`]: FieldValue.arrayRemove(detailId),
    [`productDetails.detailData.${detailId}`]: FieldValue.delete(),
  };

  await updateProduct({
    storeId,
    productId,
    updateData,
  });

  return detailId;
};

export const addProductDetailItem = async ({
  productId,
  storeId,
  detailId,
  itemValue,
}: {
  productId: string;
  storeId: string;
  detailId: string;
  itemValue: string;
}) => {
  const itemId = randomId();
  const item = {
    value: itemValue,
    id: itemId,
  };

  const updateData = {
    [`productDetails.detailData.${detailId}.itemOrder`]:
      FieldValue.arrayUnion(itemId),
    [`productDetails.detailData.${detailId}.itemData.${itemId}`]: item,
  };

  await updateProduct({
    storeId,
    productId,
    updateData,
  });

  return itemId;
};

export const updateProductDetailItem = async ({
  productId,
  storeId,
  detailId,
  itemId,
  itemValue,
}: {
  productId: string;
  storeId: string;
  detailId: string;
  itemId: string;
  itemValue: string;
}) => {
  const updateData = {
    [`productDetails.detailData.${detailId}.itemData.${itemId}.value`]:
      itemValue,
  };

  await updateProduct({
    storeId,
    productId,
    updateData,
  });
};

export const deleteProductDetailItem = async ({
  productId,
  storeId,
  detailId,
  itemId,
}: {
  productId: string;
  storeId: string;
  detailId: string;
  itemId: string;
}) => {
  const updateData = {
    [`productDetails.detailData.${detailId}.itemOrder`]:
      FieldValue.arrayRemove(itemId),
    [`productDetails.detailData.${detailId}.itemData.${itemId}`]:
      FieldValue.delete(),
  };

  await updateProduct({
    storeId,
    productId,
    updateData,
  });
};

export const migrateProductDetails = async ({
  productId,
  storeId,
  fromId,
}: {
  productId: string;
  storeId: string;
  fromId: string;
}) => {
  const fromDoc = await readProduct({ storeId, productId: fromId });

  if (!fromDoc) {
    throw new Response("Product not found", { status: 404 });
  }

  const detailData = fromDoc.productDetails.detailData;
  const detailOrder = fromDoc.productDetails.detailOrder;

  const updateData = {
    "productDetails.detailData": detailData,
    "productDetails.detailOrder": detailOrder,
  };

  await updateProduct({
    storeId,
    productId,
    updateData,
  });

  return { message: "Success" };
};

//
// Product Options Functions
//
//

export const getProductOption = async ({
  storeId,
  productId,
  optionId,
}: {
  storeId: string;
  productId: string;
  optionId: string;
}) => {
  const product = await readProduct({ storeId, productId });
  if (!product) {
    throw new Response("Product not found", { status: 404 });
  }

  const optionData = product.productOptions.optionData;

  if (!optionData.hasOwnProperty(optionId)) {
    throw new Response("Option not found", { status: 404 });
  }

  const option = optionData[optionId];

  const choices = option.choiceOrder
    .filter((choiceId) => {
      return option.choiceData.hasOwnProperty(choiceId);
    })
    .map((choiceId) => {
      const choice = option.choiceData[choiceId];
      return choice;
    });

  const productOption = {
    option,
    choices,
  };

  return productOption;
};

export const getProductOptions = async ({
  storeId,
  productId,
}: {
  storeId: string;
  productId: string;
}) => {
  const product = await readProduct({ storeId, productId });
  if (!product) {
    throw new Response("Product not found", { status: 404 });
  }

  const optionData = product.productOptions.optionData;
  const optionOrder = product.productOptions.optionOrder;

  const validOptions = optionOrder
    .filter((optionId) => {
      return optionData.hasOwnProperty(optionId);
    })
    .map((optionId) => {
      const option = optionData[optionId];

      const choices = option.choiceOrder
        .filter((choiceId) => {
          return option.choiceData.hasOwnProperty(choiceId);
        })
        .map((choiceId) => {
          const choice = option.choiceData[choiceId];
          return choice;
        });

      return {
        productId,
        optionId: option.id,
        name: option.name,
        choices: choices,
      };
    });

  return validOptions;
};

export const addProductOption = async ({
  productId,
  storeId,
  optionData,
}: {
  productId: string;
  storeId: string;
  optionData: {
    name: string;
  };
}) => {
  const optionId = randomId();
  const option = {
    name: optionData.name,
    choiceOrder: [],
    choiceData: {},
    id: optionId,
  };

  const updateData = {
    [`productOptions.optionOrder`]: FieldValue.arrayUnion(optionId),
    [`productOptions.optionData.${optionId}`]: option,
  };

  await updateProduct({
    storeId,
    productId,
    updateData,
  });

  return optionId;
};

export const deleteProductOption = async ({
  productId,
  storeId,
  optionId,
}: {
  productId: string;
  storeId: string;
  optionId: string;
}) => {
  const updateData = {
    [`productOptions.optionOrder`]: FieldValue.arrayRemove(optionId),
    [`productOptions.optionData.${optionId}`]: FieldValue.delete(),
  };

  await updateProduct({
    storeId,
    productId,
    updateData,
  });
};

export const rearrangeProductOptions = async ({
  productId,
  storeId,
  activeId,
  overId,
}: {
  productId: string;
  storeId: string;
  activeId: string;
  overId: string;
}) => {
  const product = await readProduct({ storeId, productId });
  if (!product) {
    throw new Response("Product not found", { status: 404 });
  }

  const optionOrder = product.productOptions.optionOrder;

  const activeIndex = optionOrder.findIndex((optionId) => {
    return optionId === activeId;
  });

  const overIndex = optionOrder.findIndex((optionId) => {
    return optionId === overId;
  });

  if (activeIndex === -1 || overIndex === -1) {
    return { message: "Option not found" };
  }

  const newOptionOrder = optionOrder.filter((optionId) => {
    return optionId !== activeId;
  });

  newOptionOrder.splice(overIndex, 0, activeId);

  const updateData = {
    "productOptions.optionOrder": newOptionOrder,
  };

  await updateProduct({
    storeId,
    productId,
    updateData,
  });

  return { message: "Success" };
};

export const renameProductOption = async ({
  productId,
  storeId,
  optionId,
  optionName,
}: {
  productId: string;
  storeId: string;
  optionId: string;
  optionName: string;
}) => {
  const updateData = {
    [`productOptions.optionData.${optionId}.name`]: optionName,
  };

  await updateProduct({
    storeId,
    productId,
    updateData,
  });
};

export const addProductOptionChoice = async ({
  productId,
  storeId,
  optionId,
  choiceData,
}: {
  productId: string;
  storeId: string;
  optionId: string;
  choiceData: OptionChoice;
}) => {
  const choiceId = randomId();
  const choice = {
    ...choiceData,
    id: choiceId,
  };

  const updateData = {
    [`productOptions.optionData.${optionId}.choiceOrder`]:
      FieldValue.arrayUnion(choiceId),
    [`productOptions.optionData.${optionId}.choiceData.${choiceId}`]: choice,
  };

  await updateProduct({
    storeId,
    productId,
    updateData,
  });

  return choiceId;
};

export const updateProductOptionChoice = async ({
  productId,
  storeId,
  optionId,
  choiceId,
  choiceData,
}: {
  productId: string;
  storeId: string;
  optionId: string;
  choiceId: string;
  choiceData: OptionChoice;
}) => {
  const updateData = {
    [`productOptions.optionData.${optionId}.choiceData.${choiceId}`]:
      choiceData,
  };

  await updateProduct({
    storeId,
    productId,
    updateData,
  });
};

export const deleteProductOptionChoice = async ({
  productId,
  storeId,
  optionId,
  choiceId,
}: {
  productId: string;
  storeId: string;
  optionId: string;
  choiceId: string;
}) => {
  const product = await readProduct({ storeId, productId });
  if (!product) {
    throw new Response("Product not found", { status: 404 });
  }

  const option = product.productOptions.optionData[optionId];

  if (!option) {
    return { message: "Option not found" };
  }

  const updateData = {
    [`productOptions.optionData.${optionId}.choiceOrder`]:
      FieldValue.arrayRemove(choiceId),
    [`productOptions.optionData.${optionId}.choiceData.${choiceId}`]:
      FieldValue.delete(),
  };

  await updateProduct({
    storeId,
    productId,
    updateData,
  });

  return { message: "Choice was deleted", choiceId };
};

//
// Product Form Functions
//
//

export const getProductFormData = async ({
  productId,
  storeId,
}: {
  productId: string;
  storeId: string;
}) => {
  const formTemplate = await readFormTemplate({
    storeId,
    formTemplateId: productId,
  });

  if (!formTemplate) {
    throw new Response("Form Template Not Found", { status: 404 });
  }

  const formPlaceholders = formTemplate?.placeholders ?? {};
  const requiredData = formTemplate?.required ?? {};

  const formFields: FieldSettingsData[] = formTemplate.fieldOrder
    .filter((fieldId) => {
      return formTemplate.fieldData.hasOwnProperty(fieldId);
    })
    .map((fieldId) => {
      const optionsObject = formTemplate?.optionsObject ?? {};
      const optionData = optionsObject[fieldId] ?? {
        optionOrder: [],
        optionData: {},
      };
      const options = optionData.optionOrder.map((optionId) => {
        const optionName = optionData.optionName[optionId];
        return {
          value: optionId,
          name: optionName,
        };
      });

      const fieldRequired = requiredData.hasOwnProperty(fieldId)
        ? requiredData[fieldId]
        : { min: 0, message: "", required: false };
      const fieldData = formTemplate.fieldData[fieldId];
      return {
        fieldLabel: fieldData.label,
        fieldType: fieldData.type,
        fieldId,
        requiredData: fieldRequired,
        placeholder: formPlaceholders[fieldId] ?? "",
        options,
      };
    });

  return {
    formFields,
  };
};

export const addProductFormField = async ({
  productId,
  storeId,
  fieldData,
}: {
  productId: string;
  storeId: string;
  fieldData: FormTemplateField;
}) => {
  const fieldId = randomId();

  const saveFieldData: FormTemplateField = {
    type: fieldData.type,
    label: fieldData.label,
    id: fieldId,
  };

  const updateData = {
    [`fieldOrder`]: FieldValue.arrayUnion(fieldId),
    [`fieldData.${fieldId}`]: saveFieldData,
  };

  await updateFormTemplate({
    storeId,
    formTemplateId: productId,
    updateData,
  });

  return fieldId;
};

export const deleteProductFormField = async ({
  productId,
  storeId,
  fieldId,
}: {
  productId: string;
  storeId: string;
  fieldId: string;
}) => {
  const updateData = {
    [`fieldOrder`]: FieldValue.arrayRemove(fieldId),
    [`fieldData.${fieldId}`]: FieldValue.delete(),
    [`required.${fieldId}`]: FieldValue.delete(),
    [`placeholders.${fieldId}`]: FieldValue.delete(),
  };

  await updateFormTemplate({
    storeId,
    formTemplateId: productId,
    updateData,
  });
};

export const updateTextFormField = async ({
  productId,
  storeId,
  fieldId,
  fieldData,
}: {
  productId: string;
  storeId: string;
  fieldId: string;
  fieldData: {
    name: string;
    type: FieldType;
    placeholder: string;
    required: boolean;
    minimumLength: number;
  };
}) => {
  const formField: FormTemplateField = {
    label: fieldData.name,
    type: fieldData.type,
    id: fieldId,
  };
  const updateData = {
    [`fieldData.${fieldId}`]: formField,
    [`required.${fieldId}`]: {
      required: fieldData.required,
      min: fieldData.minimumLength,
      message: `Please enter at least ${fieldData.minimumLength} characters`,
    },
    [`placeholders.${fieldId}`]: fieldData.placeholder,
  };

  await updateFormTemplate({
    storeId,
    formTemplateId: productId,
    updateData,
  });
};

export const addSelectOption = async ({
  productId,
  storeId,
  fieldId,
  optionName,
}: {
  productId: string;
  storeId: string;
  fieldId: string;
  optionName: string;
}) => {
  const optionId = randomId();

  const updateData = {
    [`optionsObject.${fieldId}.optionOrder`]: FieldValue.arrayUnion(optionId),
    [`optionsObject.${fieldId}.optionName.${optionId}`]: optionName,
  };

  await updateFormTemplate({
    storeId,
    formTemplateId: productId,
    updateData,
  });

  return optionId;
};

export const deleteSelectOption = async ({
  productId,
  storeId,
  fieldId,
  optionId,
}: {
  productId: string;
  storeId: string;
  fieldId: string;
  optionId: string;
}) => {
  const updateData = {
    [`optionsObject.${fieldId}.optionOrder`]: FieldValue.arrayRemove(optionId),
    [`optionsObject.${fieldId}.optionName.${optionId}`]: FieldValue.delete(),
  };

  await updateFormTemplate({
    storeId,
    formTemplateId: productId,
    updateData,
  });
};

export const ChangeFormFieldName = async ({
  productId,
  storeId,
  fieldId,
  fieldName,
}: {
  productId: string;
  storeId: string;
  fieldId: string;
  fieldName: string;
}) => {
  const updateData = {
    [`fieldData.${fieldId}.label`]: fieldName,
  };

  await updateFormTemplate({
    storeId,
    formTemplateId: productId,
    updateData,
  });
};

export const rearrangeFormFields = async ({
  productId,
  storeId,
  activeId,
  overId,
}: {
  productId: string;
  storeId: string;
  activeId: string;
  overId: string;
}) => {
  const formTemplate = await readFormTemplate({
    storeId,
    formTemplateId: productId,
  });

  if (!formTemplate) {
    throw new Response("Form Template Not Found", { status: 404 });
  }

  const fieldOrder = formTemplate.fieldOrder;

  const activeIndex = fieldOrder.findIndex((fieldId) => {
    return fieldId === activeId;
  });

  const overIndex = fieldOrder.findIndex((fieldId) => {
    return fieldId === overId;
  });

  if (activeIndex === -1 || overIndex === -1) {
    return { message: "Field not found" };
  }

  const newFieldOrder = fieldOrder.filter((fieldId) => {
    return fieldId !== activeId;
  });

  newFieldOrder.splice(overIndex, 0, activeId);

  const updateData = {
    fieldOrder: newFieldOrder,
  };

  await updateFormTemplate({
    storeId,
    formTemplateId: productId,
    updateData,
  });

  return { message: "Success" };
};

export const migrateFormTemplate = async ({
  productId,
  storeId,
  fromFormTemplateId,
  toFormTemplateId,
}: {
  productId: string;
  storeId: string;
  fromFormTemplateId: string;
  toFormTemplateId: string;
}) => {
  const fromFormTemplate = await readFormTemplate({
    storeId,
    formTemplateId: fromFormTemplateId,
  });

  if (!fromFormTemplate) {
    throw new Response("Form Template Not Found", { status: 404 });
  }

  const updateData = {
    fieldOrder: fromFormTemplate.fieldOrder,
    fieldData: fromFormTemplate.fieldData,
    required: fromFormTemplate.required,
    placeholders: fromFormTemplate.placeholders,
    optionsObject: fromFormTemplate.optionsObject,
  };

  await updateFormTemplate({
    storeId,
    formTemplateId: toFormTemplateId,
    updateData,
  });
};

export const getTaskListData = async ({
  productId,
  storeId,
}: {
  productId: string;
  storeId: string;
}) => {
  const product = await readProduct({ storeId, productId });
  if (!product) {
    throw new Response("Product not found", { status: 404 });
  }

  const taskList = await getTaskLists({ storeId, productId });

  return {
    taskList,
  };
};

export const addTaskList = async ({
  productId,
  storeId,
  taskListData,
}: {
  productId: string;
  storeId: string;
  taskListData: {
    name: string;
  };
}) => {
  const taskListId = randomId();
  const taskList = {
    name: taskListData.name,
    taskOrder: [],
    taskData: {},
    id: taskListId,
  };

  const updateData = {
    [`taskLists.${taskListId}`]: taskList,
  };

  await updateProduct({
    storeId,
    productId,
    updateData,
  });

  return taskListId;
};

//
// Product Mutations
//
export const updateProductBasicFieldMutation = (idData: {
  storeId: string;
  productId: string;
}) =>
  makeDomainFunction(ProductBasicsSchema.partial())(async (values) => {
    const product = await readProduct({
      storeId: idData.storeId,
      productId: idData.productId,
    });

    if (!product) {
      throw new Response("Product not found", { status: 404 });
    }

    const ordering = product.basic.ordering ?? 0;

    const basic: ProductBasic = {
      ordering: values.ordering ?? ordering,
      name: values.name ?? product.basic.name,
      description: values.description ?? product.basic.description,
      priceRange: values.priceRange ?? product.basic.priceRange,
      pricing: values.pricing ?? product.basic.pricing,
    };

    console.log("basic", basic);

    await updateProductBasic({
      storeId: idData.storeId,
      productId: idData.productId,
      productBasic: basic,
    });

    return { message: "Success", success: true };
  });

export const moveProductOptionMutation = (idData: {
  storeId: string;
  productId: string;
}) =>
  makeDomainFunction(MoveOptionSchema)(async (values) => {
    const product = await readProduct({
      storeId: idData.storeId,
      productId: idData.productId,
    });

    if (!product) {
      throw new Response("Product not found", { status: 404 });
    }

    const optionId = values.optionId;
    const optionOrder = product.productOptions.optionOrder;
    const optionLength = optionOrder.length;

    const optionIndex = optionOrder.findIndex((optionIdText) => {
      return optionId === optionIdText;
    });

    if (optionIndex === -1) {
      throw new Response("Option not found", { status: 404 });
    }

    const newOptionOrder = optionOrder.filter((optionIdText) => {
      return optionId !== optionIdText;
    });

    if (values.direction === "up") {
      const newIndex = optionIndex <= 0 ? 0 : optionIndex - 1;
      newOptionOrder.splice(newIndex, 0, optionId);
    } else {
      const newIndex =
        optionIndex >= optionLength - 1 ? optionLength - 1 : optionIndex + 1;
      newOptionOrder.splice(newIndex, 0, optionId);
    }

    const updateData = {
      "productOptions.optionOrder": newOptionOrder,
    };

    await updateProduct({
      storeId: idData.storeId,
      productId: idData.productId,
      updateData,
    });

    return { message: "Success", success: true };
  });

export const addProductOptionMutation = (idData: {
  storeId: string;
  productId: string;
}) =>
  makeDomainFunction(AddOptionSchema)(async (values) => {
    const product = await readProduct({
      storeId: idData.storeId,
      productId: idData.productId,
    });

    if (!product) {
      throw new Response("Product not found", { status: 404 });
    }

    const optionId = await addProductOption({
      storeId: idData.storeId,
      productId: idData.productId,
      optionData: {
        name: values.name,
      },
    });

    return optionId;
  });
