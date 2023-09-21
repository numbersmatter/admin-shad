import { DocumentData, FieldValue, Timestamp } from "firebase-admin/firestore";
import { FormTemplate } from "./formTemplate.server";
import { dataPoint, mainDb } from "./mainDb.server";
import { ProductOptionDisplay } from "./product.server";

export interface RequestForm {
  id: string;
  formTitle: string;
  formContent: FormTemplate;
  createdAt: Timestamp;
  humanId: string;
  productOptions: ProductOptionDisplay[];
  optionSelections: { [key: string]: string };
  status: string;
  userImages: { [key: string]: ImageUpload[] };
  userResponse: DocumentData;
}

const requestFormCollection = dataPoint<RequestForm>(`${mainDb}/requestForms`);

//
// RequestForm CRUD
//

export const createRequestForm = async ({
  formContent,
  productOptions,
  optionSelections,
  status,
  userImages,
  userResponse,
  formTitle,
}: {
  formContent: FormTemplate;
  productOptions: ProductOptionDisplay[];
  optionSelections: { [key: string]: string };
  status: string;
  userImages: DocumentData;
  userResponse: DocumentData;
  formTitle: string;
}) => {
  const requestFormDecRef = requestFormCollection.doc();
  const requestFormId = requestFormDecRef.id;

  const humanId = makeRandomHumanReadableId();

  const requestForm: RequestForm = {
    formContent,
    id: requestFormId,
    humanId,
    productOptions,
    optionSelections,
    status,
    userImages,
    userResponse,
    formTitle,
    // @ts-ignore
    createdAt: FieldValue.serverTimestamp(),
  };

  const writeResult = await requestFormDecRef.set(requestForm);

  return { requestFormId, writeResult };
};

export const readRequestForm = async ({
  requestFormId,
}: {
  requestFormId: string;
}) => {
  const requestForm = await requestFormCollection.doc(requestFormId).get();

  return requestForm.data();
};

export const updateRequestForm = async ({
  requestFormId,
  updateData,
}: {
  requestFormId: string;
  updateData: DocumentData;
}) => {
  return await requestFormCollection.doc(requestFormId).update(updateData);
};
