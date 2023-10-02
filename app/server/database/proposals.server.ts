import {
  DocumentData,
  FieldValue,
  type Timestamp,
} from "firebase-admin/firestore";
import { dataPoint, mainDb } from "./mainDb.server";
import type { RequestForm } from "./requestForm.server";

export interface Proposal extends Omit<RequestForm, "status"> {
  submittedAt: Timestamp;
  reviewStatus: "review" | "approved" | "hold" | "declined";
  archived: boolean;
}
export interface ProposalWrite extends RequestForm {
  submittedAt: Timestamp | FieldValue;
  reviewStatus: "review" | "approved" | "hold" | "declined";
  archived: boolean;
}

const proposalCollectionWrite = ({ storeId }: { storeId: string }) =>
  dataPoint<ProposalWrite>(`${mainDb}/stores/${storeId}/proposals`);

const proposalCollectionRead = ({ storeId }: { storeId: string }) =>
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

  const writeData: ProposalWrite = {
    ...proposalData,
    reviewStatus: "review",
    archived: false,
    submittedAt: FieldValue.serverTimestamp(),
  };

  await proposalCollectionWrite({ storeId }).doc(proposalId).set(writeData);
  return proposalId;
};

export const readProposal = async ({
  storeId,
  proposalId,
}: {
  storeId: string;
  proposalId: string;
}) => {
  const proposalData = await proposalCollectionRead({ storeId })
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
  await proposalCollectionRead({ storeId })
    .doc(proposalId)
    .update(proposalData);
  return proposalId;
};

export const deleteProposal = async ({
  storeId,
  proposalId,
}: {
  storeId: string;
  proposalId: string;
}) => {
  await proposalCollectionRead({ storeId }).doc(proposalId).delete();
  return proposalId;
};

export const reviewProposals = async ({ storeId }: { storeId: string }) => {
  const proposals = await proposalCollectionRead({ storeId })
    .where("archived", "==", false)
    .get();
  return proposals.docs.map((proposal) => proposal.data());
};
