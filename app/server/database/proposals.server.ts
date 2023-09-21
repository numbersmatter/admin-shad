import {
  DocumentData,
  FieldValue,
  type Timestamp,
} from "firebase-admin/firestore";
import { dataPoint, mainDb } from "./mainDb.server";
import type { RequestForm } from "./requestForm.server";

export interface Proposal extends RequestForm {
  submittedAt: Timestamp | FieldValue;
  reviewStatus: "review" | "approved" | "hold" | "declined";
  archived: boolean;
}
const proposalCollection = ({ storeId }: { storeId: string }) =>
  dataPoint<Proposal>(`${mainDb}/stores/${storeId}/proposals`);

// Proposal CRUD
export const createProposal = async ({
  storeId,
  proposalData,
}: {
  storeId: string;
  proposalData: RequestForm;
}) => {
  const proposalId = proposalData.id;

  const writeData: Proposal = {
    ...proposalData,
    reviewStatus: "review",
    archived: false,
    submittedAt: FieldValue.serverTimestamp(),
  };

  await proposalCollection({ storeId }).doc(proposalId).set(writeData);
  return proposalId;
};

export const readProposal = async ({
  storeId,
  proposalId,
}: {
  storeId: string;
  proposalId: string;
}) => {
  const proposalData = await proposalCollection({ storeId })
    .doc(proposalId)
    .get();
  return proposalData.data();
};

export const updateProposal = async ({
  storeId,
  proposalId,
  proposalData,
}: {
  storeId: string;
  proposalId: string;
  proposalData: DocumentData;
}) => {
  await proposalCollection({ storeId }).doc(proposalId).update(proposalData);
  return proposalId;
};

export const deleteProposal = async ({
  storeId,
  proposalId,
}: {
  storeId: string;
  proposalId: string;
}) => {
  await proposalCollection({ storeId }).doc(proposalId).delete();
  return proposalId;
};

export const reviewProposals = async ({ storeId }: { storeId: string }) => {
  const proposals = await proposalCollection({ storeId })
    .where("archived", "==", false)
    .get();
  return proposals.docs.map((proposal) => proposal.data());
};
