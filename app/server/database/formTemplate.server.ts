// import { DocumentData, FieldValue, Timestamp } from "firebase-admin/firestore";
import type { DocumentData, FieldValue } from "firebase-admin/firestore";
import { dataPoint, mainDb } from "./mainDb.server";

// interface ImageUpload {
//   id: string;
//   url: string;
//   name: string;
// }

export type FieldType =
  | "textField"
  | "textArea"
  | "imageUpload"
  | "select"
  | "emailField";

export const formTemplateFieldTypes = [
  "textField",
  "textArea",
  "imageUpload",
  "select",
  "emailField",
];

export interface SelectableOption {
  name: string;
  value: string;
}

// interface ZodOption {
//   type: "required" | "enum" | "email";
//   min: number;
//   message: string;
// }
export interface FormTemplateField {
  id: string;
  type: FieldType;
  label: string;
}

export interface RequiredData {
  min: number;
  message: string;
  required: boolean;
}

interface OptionData {
  optionOrder: string[];
  optionName: { [key: string]: string };
}
export interface FormTemplate {
  fieldOrder: string[];
  fieldData: { [key: string]: FormTemplateField };
  placeholders: { [key: string]: string };
  optionsObject: { [key: string]: OptionData };
  radio: string[];
  storeId: string;
  userId: string;
  id: string;
  required: {
    [key: string]: RequiredData;
  };
}

export const newFormTemplate: FormTemplate = {
  fieldOrder: [],
  fieldData: {},
  placeholders: {},
  optionsObject: {},
  radio: [],
  storeId: "",
  userId: "",
  id: "",
  required: {},
};

export const formTemplateStarter = (data: {
  storeId: string;
  userId: string;
  formTemplateId: string;
}) => ({
  fieldOrder: [],
  fieldData: {},
  placeholders: {},
  optionsObject: {},
  radio: [],
  storeId: data.storeId,
  userId: data.userId,
  userImages: {},
  userResponse: {},
  formTemplateId: "",
  required: {},
  zod: {},
  id: data.formTemplateId,
});

const formTemplateCollection = (storeId: string) =>
  dataPoint<FormTemplate>(`${mainDb}/stores/${storeId}/formTemplates`);

// const randomId = () => formTemplateCollection("random").doc().id;

// Form Template CRUD

export const createFormTemplate = async (data: {
  storeId: string;
  userId: string;
  formTemplateId: string;
}) => {
  const { storeId, userId, formTemplateId } = data;

  const formTemplateRef = formTemplateCollection(storeId).doc(formTemplateId);

  const formTemplateData: FormTemplate = formTemplateStarter({
    storeId,
    userId,
    formTemplateId,
  });

  return await formTemplateRef.set(formTemplateData);
};

export const writeFormTemplate = async (data: {
  storeId: string;
  formTemplateId: string;
  formTemplateData: FormTemplate;
}) => {
  const { storeId, formTemplateId, formTemplateData } = data;

  await formTemplateCollection(storeId)
    .doc(formTemplateId)
    .set(formTemplateData);
};

export const readFormTemplate = async (data: {
  storeId: string;
  formTemplateId: string;
}) => {
  const { storeId, formTemplateId } = data;

  const formTemplate = await formTemplateCollection(storeId)
    .doc(formTemplateId)
    .get();

  return formTemplate.data();
};

export const updateFormTemplate = async (data: {
  storeId: string;
  formTemplateId: string;
  updateData: DocumentData;
}) => {
  const { storeId, formTemplateId, updateData } = data;

  return await formTemplateCollection(storeId)
    .doc(formTemplateId)
    .update(updateData);
};

// export const updateFieldOnFormTemplate = async (data: {
//   providerId: string;
//   formTemplateId: string;
//   fieldId: string;
//   fieldData: FormTemplateField;
//   required: { min: number; message: string; required: boolean };
//   placeholderText: string;
// }) => {
//   const { providerId, formTemplateId, fieldId, fieldData } = data;

//   const formTemplate = await readFormTemplate({
//     providerId,
//     formTemplateId,
//   });
//   if (!formTemplate)
//     throw new Response("No form template found", { status: 404 });

//   const updateData = {
//     [`fieldData.${fieldId}`]: fieldData,
//     [`required.${fieldId}`]: {
//       required: data.required.required,
//       min: data.required.min,
//       message: data.required.message,
//     },
//     [`placeholders.${fieldId}`]: data.placeholderText,
//   };

//   return await formTemplateCollection(providerId)
//     .doc(formTemplateId)
//     // @ts-ignore
//     .update(updateData);
// };

// export const updateFieldNameOnFormTemplate = async (data: {
//   providerId: string;
//   formTemplateId: string;
//   fieldId: string;
//   label: string;
// }) => {
//   const { providerId, formTemplateId, fieldId, label } = data;

//   const formTemplate = await readFormTemplate({
//     providerId,
//     formTemplateId,
//   });
//   if (!formTemplate) {
//     throw new Response("No form template found", { status: 404 });
//   }

//   const currentFields = [...formTemplate.fields];

//   const updatedFields = currentFields.map((field) => {
//     if (field.id === fieldId) {
//       return { ...field, label };
//     }

//     return field;
//   });

//   const updateData = {
//     fields: updatedFields,
//   };

//   return await formTemplateCollection(providerId)
//     .doc(formTemplateId)
//     .update(updateData);
// };

// export const addFieldToFormTemplate = async (data: {
//   providerId: string;
//   formTemplateId: string;
//   fieldType: FieldType;
//   label: string;
// }) => {
//   const { providerId, formTemplateId, fieldType, label } = data;

//   const field: FormTemplateField = {
//     id: randomId(),
//     type: fieldType,
//     label,
//   };

//   const updateData = {
//     fields: FieldValue.arrayUnion(field),
//   };

//   return await formTemplateCollection(providerId)
//     .doc(formTemplateId)
//     .update(updateData);
// };

// export const addOptionToField = async (data: {
//   providerId: string;
//   formTemplateId: string;
//   fieldId: string;
//   optionName: string;
// }) => {
//   const { providerId, formTemplateId, fieldId, optionName } = data;

//   const option: SelectableOption = {
//     name: optionName,
//     value: randomId(),
//   };

//   const updateData = {
//     [`selectOptions.${fieldId}`]: FieldValue.arrayUnion(option),
//   };

//   return await formTemplateCollection(providerId)
//     .doc(formTemplateId)
//     .update(updateData);
// };

// export const removeOptionFromField = async (data: {
//   providerId: string;
//   formTemplateId: string;
//   fieldId: string;
//   option: { name: string; value: string };
// }) => {
//   const { providerId, formTemplateId, fieldId, option } = data;

//   const updateData = {
//     [`selectOptions.${fieldId}`]: FieldValue.arrayRemove(option),
//   };

//   return await formTemplateCollection(providerId)
//     .doc(formTemplateId)
//     .update(updateData);
// };

// export const milaCommission: FormTemplate = {
//   userImages: {
//     backgroundReferences: [],
//     characterReferences: [],
//   },
//   userResponse: {},
//   providerId: "milachu92",
//   uuid: "ozgICZ3XMHNdVOQcfcA7GNEuocm1",
//   formTemplateId: "commission",
//   fields: [
//     { id: "characterActions", type: "textArea" },
//     { id: "characterReferences", type: "imageUpload" },
//     { id: "typeOfBackground", type: "select" },
//     { id: "describeBackground", type: "textArea" },
//     { id: "backgroundReferences", type: "imageUpload" },
//     { id: "contactInformation", type: "textField" },
//     { id: "confirmationEmail", type: "emailField" },
//     { id: "additionalNotes", type: "textArea" },
//   ],
//   zod: {
//     characterActions: [
//       {
//         type: "required",
//         min: 10,
//         message: "Please tell me more more about what you want me to draw.",
//       },
//     ],
//     describeBackground: [
//       {
//         type: "required",
//         min: 10,
//         message: "Please describe your background.",
//       },
//     ],
//     contactInformation: [
//       {
//         type: "required",
//         min: 1,
//         message: "Please enter your contact information.",
//       },
//     ],
//     confirmationEmail: [
//       { type: "required", min: 1, message: "Please enter a valid email." },
//     ],
//   },
//   required: {},
//   selectOptions: {
//     typeOfBackground: [
//       { value: "bedroom", name: "Bedroom" },
//       { value: "club", name: "Night Club" },
//       { value: "cafe", name: "Cafe" },
//       { value: "park", name: "Forest or Park" },
//       { value: "beach", name: "Beach" },
//       { value: "other", name: "Other" },
//     ],
//   },
//   placeholders: {
//     contactInformation: "Your discord name, twitter, telegram, etc.",
//     describeBackground: "Brief description of the background you want.",
//     additionalNotes: "Any additional information you want to add?",
//     confirmationEmail: "Your confirmation email will be sent here.",
//     characterActions: "What would you like the characters to be doing?",
//   },
//   radio: [],
// };
// export const milaReference: FormTemplate = {
//   userImages: {
//     characterReferences: [],
//   },
//   userResponse: {},
//   providerId: "milachu92",
//   uuid: "ozgICZ3XMHNdVOQcfcA7GNEuocm1",
//   formTemplateId: "reference",
//   required: {},
//   fields: [
//     { id: "characterName", type: "textField" },
//     { id: "characterPoses", type: "textArea" },
//     { id: "characterReferences", type: "imageUpload" },
//     { id: "describeCharacter", type: "textArea" },
//     { id: "contactInformation", type: "textField" },
//     { id: "confirmationEmail", type: "emailField" },
//     { id: "additionalNotes", type: "textArea" },
//   ],
//   zod: {
//     characterName: [
//       {
//         type: "required",
//         min: 1,
//         message: "Please enter your character's name.",
//       },
//     ],
//     characterPoses: [
//       {
//         type: "required",
//         min: 10,
//         message: "Please tell me more more about the poses.",
//       },
//     ],
//     describeCharacter: [
//       {
//         type: "required",
//         min: 10,
//         message: "Please describe your character.",
//       },
//     ],
//     contactInformation: [
//       {
//         type: "required",
//         min: 1,
//         message: "Please enter your contact information.",
//       },
//     ],
//     confirmationEmail: [
//       { type: "required", min: 1, message: "Please enter your email." },
//     ],
//   },
//   selectOptions: {},
//   placeholders: {
//     contactInformation: "Your discord name, twitter, telegram, etc.",
//     describeCharacter:
//       "Describe your character’s body, attire, quirks, flaws, traits, and everything else you’d want to see on the reference sheet",
//     additionalNotes: "Any additional information you want to add?",
//     confirmationEmail: "Your confirmation email will be sent here.",
//     characterPoses:
//       "What would you like the characters poses to be? (front, back, side, front 45 degrees, etc)",
//   },
//   radio: [],
// };

// export const milaComic: FormTemplate = {
//   userImages: {
//     characterReferences: [],
//   },
//   userResponse: {},
//   providerId: "milachu92",
//   uuid: "ozgICZ3XMHNdVOQcfcA7GNEuocm1",
//   required: {},
//   formTemplateId: "reference",
//   fields: [
//     { id: "describeComic", type: "textArea" },
//     { id: "characterReferences", type: "imageUpload" },
//     { id: "contactInformation", type: "textField" },
//     { id: "confirmationEmail", type: "emailField" },
//     { id: "additionalNotes", type: "textArea" },
//   ],
//   zod: {
//     describeComic: [
//       {
//         type: "required",
//         min: 10,
//         message: "Please tell me more more about the comic.",
//       },
//     ],
//     contactInformation: [
//       {
//         type: "required",
//         min: 1,
//         message: "Please enter your contact information.",
//       },
//     ],
//     confirmationEmail: [
//       { type: "required", min: 1, message: "Please enter your email." },
//     ],
//   },
//   selectOptions: {},
//   placeholders: {
//     contactInformation: "Your discord name, twitter, telegram, etc.",
//     describeComic: " What would you like the comic to be about?",
//     additionalNotes: "Any additional information you want to add?",
//     confirmationEmail: "Your confirmation email will be sent here.",
//   },
//   radio: [],
// };

// export const puffsFlatForm: FormTemplate = {
//   userImages: {
//     characterReferences: [],
//   },
//   userResponse: {},
//   providerId: "puffs",
//   required: {},
//   uuid: "nqXBpIz8iVNZdkJzHpOSx1Fgs2i1",
//   formTemplateId: "full-render",
//   fields: [
//     { id: "username", type: "textField" },
//     { id: "contactInformation", type: "textField" },
//     { id: "paypalEmail", type: "emailField" },
//     { id: "clientPrivacy", type: "select" },
//     { id: "describeStory", type: "textArea" },
//     { id: "storyMultipleChapters", type: "select" },
//     { id: "commissionDetails", type: "textArea" },
//     { id: "referenceLinks", type: "textArea" },
//     { id: "characterReferences", type: "imageUpload" },
//     { id: "additionalNotes", type: "textArea" },
//   ],
//   zod: {
//     username: [
//       {
//         type: "required",
//         min: 1,
//         message: "Username is required.",
//       },
//     ],
//     contactInformation: [
//       {
//         type: "required",
//         min: 1,
//         message: "Please enter your contact information.",
//       },
//     ],
//     payPalEmail: [
//       { type: "required", min: 1, message: "Please enter your email." },
//     ],
//   },
//   selectOptions: {
//     clientPrivacy: [
//       { value: "public", name: "Public" },
//       { value: "publicAnon", name: "Public but Anonymous" },
//       { value: "privateStreamable", name: "Private, yes stream, no upload" },
//       { value: "private", name: "Private, no stream, no upload" },
//     ],
//     storyMultipleChapters: [
//       { value: "yes", name: "Yes" },
//       { value: "no", name: "No" },
//     ],
//   },
//   placeholders: {
//     contactInformation: "Your discord name, twitter, telegram, FA, etc.",
//     describeStory: "What would you like the story to be about?",
//     commissionDetails: "What would you like the commission to be about?",
//     referenceLinks: "Any links to references you want to provide?",
//     additionalNotes: "Any additional information you want to add?",
//     paypalEmail: "Your PayPal email for invoice.",
//   },
//   radio: [],
// };
// export const puffsFullForm: FormTemplate = {
//   required: {},
//   userImages: {
//     characterReferences: [],
//   },
//   userResponse: {},
//   providerId: "puffs",
//   uuid: "nqXBpIz8iVNZdkJzHpOSx1Fgs2i1",
//   formTemplateId: "flat-color",
//   fields: [
//     { id: "username", type: "textField" },
//     { id: "contactInformation", type: "textField" },
//     { id: "paypalEmail", type: "emailField" },
//     { id: "clientPrivacy", type: "select" },
//     { id: "describeStory", type: "textArea" },
//     { id: "storyMultipleChapters", type: "select" },
//     { id: "commissionDetails", type: "textArea" },
//     { id: "referenceLinks", type: "textArea" },
//     { id: "characterReferences", type: "imageUpload" },
//     { id: "additionalNotes", type: "textArea" },
//   ],
//   zod: {
//     username: [
//       {
//         type: "required",
//         min: 1,
//         message: "Username is required.",
//       },
//     ],
//     contactInformation: [
//       {
//         type: "required",
//         min: 1,
//         message: "Please enter your contact information.",
//       },
//     ],
//     payPalEmail: [
//       { type: "required", min: 1, message: "Please enter your email." },
//     ],
//   },
//   selectOptions: {
//     clientPrivacy: [
//       { value: "public", name: "Public" },
//       { value: "publicAnon", name: "Public but Anonymous" },
//       { value: "privateStreamable", name: "Private, yes stream, no upload" },
//       { value: "private", name: "Private, no stream, no upload" },
//     ],
//     storyMultipleChapters: [
//       { value: "yes", name: "Yes" },
//       { value: "no", name: "No" },
//     ],
//   },
//   placeholders: {
//     contactInformation: "Your discord name, twitter, telegram, FA, etc.",
//     describeStory: "What would you like the story to be about?",
//     commissionDetails: "What would you like the commission to be about?",
//     referenceLinks: "Any links to references you want to provide?",
//     additionalNotes: "Any additional information you want to add?",
//     paypalEmail: "Your PayPal email for invoice.",
//   },
//   radio: [],
// };
