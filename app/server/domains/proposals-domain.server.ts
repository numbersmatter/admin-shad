import {
  readProposal,
  reviewProposals,
  updateProposal,
} from "../database/proposals.server";
import { redirect } from "@remix-run/node";

import { ProductOptionDisplay } from "../database/product.server";
import {
  DisplayField,
  ProposalCard,
  ProposalReview,
  ReviewStatus,
} from "./domain-types";

const makeTagsArray = ({
  optionSelections,
  productOptions,
}: {
  optionSelections: { [key: string]: string };
  productOptions: ProductOptionDisplay[];
}) => {
  const tags = productOptions
    .filter((option) => {
      const optionId = option.id;
      return optionSelections.hasOwnProperty(optionId);
    })
    .map((option) => {
      const optionId = option.id;
      const optionValue = optionSelections[optionId];
      const choiceMade = option.choices.find((choice) => {
        return choice.id === optionValue;
      });
      if (!choiceMade) {
        return {
          id: optionId,
          value: optionValue,
          text: "No Selection",
          color: "bg-red-50",
          index: -1,
        };
      }
      const indexChoiceMade = option.choices.indexOf(choiceMade);

      return {
        index: indexChoiceMade,
        id: optionId,
        value: optionValue,
        text: choiceMade.name,
        color: "bg-orange-700",
      };
    });

  return tags;
};

export const getProposals = async ({ storeId }: { storeId: string }) => {
  const proposals = await reviewProposals({ storeId });

  const proposalCards = proposals.map((proposal) => {
    const submittedAtString = proposal.submittedAt.toDate().toLocaleString();
    const optionSelections = proposal.optionSelections;

    const tags = makeTagsArray({
      optionSelections,
      productOptions: proposal.productOptions,
    });

    const card: ProposalCard = {
      id: proposal.id,
      humanId: proposal.humanId,
      reviewStatus: proposal.reviewStatus as ReviewStatus,
      submittedAtString,
      submittedAtDate: proposal.submittedAt.toDate(),
      productName: proposal.formTitle,
      productId: proposal.formContent.id,
      tags: tags,
    };
    return card;
  });

  return {
    proposalCards,
  };
};

export const getProposalData = async ({
  storeId,
  proposalId,
}: {
  storeId: string;
  proposalId: string;
}) => {
  const proposal = await readProposal({ storeId, proposalId });
  if (!proposal) {
    throw redirect(`/review`);
  }

  const fieldData = proposal.formContent.fieldData;

  const fieldOptions = proposal.formContent.optionsObject;

  const displayFields = proposal.formContent.fieldOrder
    .filter((fieldId) => fieldData.hasOwnProperty(fieldId))
    .map((fieldId) => {
      const field = fieldData[fieldId];

      if (field.type === "select") {
        const selectedOptionId = proposal.userResponse[fieldId];
        const optionsObject = fieldOptions[fieldId];

        const selectedOption = optionsObject.optionName[selectedOptionId];

        const displayField: DisplayField = {
          label: field.label,
          type: field.type,
          value: selectedOption,
          id: fieldId,
        };
        return displayField;
      }

      const displayField: DisplayField = {
        label: field.label,
        type: field.type,
        value: proposal.userResponse[fieldId],
        id: fieldId,
      };
      return displayField;
    });

  const tags = makeTagsArray({
    optionSelections: proposal.optionSelections,
    productOptions: proposal.productOptions,
  });

  const proposalReview: ProposalReview = {
    formContent: proposal.formContent,
    userResponse: proposal.userResponse,
    userImages: proposal.userImages,
    humanId: proposal.humanId,
    id: proposal.id,
    productName: proposal.formTitle,
    reviewStatus: proposal.reviewStatus as ReviewStatus,
    tags,
    displayFields,
  };

  return {
    proposalReview,
  };
};

export const getReviewIdPageData = async ({
  storeId,
  proposalId,
}: {
  storeId: string;
  proposalId: string;
}) => {
  const { proposalCards } = await getProposals({ storeId });

  const { proposalReview } = await getProposalData({ storeId, proposalId });

  return {
    proposalCards,
    proposalReview,
  };
};

export const updateProposalReviewStatus = async ({
  storeId,
  proposalId,
  reviewStatus,
}: {
  storeId: string;
  proposalId: string;
  reviewStatus: ReviewStatus;
}) => {
  const proposal = await readProposal({ storeId, proposalId });
  if (!proposal) {
    throw redirect(`/review`);
  }

  const updateData = {
    reviewStatus,
  };

  await updateProposal({ storeId, proposalId, proposalData: updateData });

  return {
    proposalId,
    reviewStatus,
  };
};

export const getProposalForProjectData = async ({
  storeId,
  proposalId,
}: {
  storeId: string;
  proposalId: string;
}) => {
  const proposal = await readProposal({ storeId, proposalId });
  if (!proposal) {
    throw redirect(`/review`);
  }
  const humanId = proposal.humanId;
  return {
    humanId,
  };
};

export const archiveProposal = async ({
  storeId,
  proposalId,
}: {
  storeId: string;
  proposalId: string;
}) => {
  const proposal = await readProposal({ storeId, proposalId });
  if (!proposal) {
    throw redirect(`/review`);
  }

  const updateData = {
    archived: true,
  };

  await updateProposal({ storeId, proposalId, proposalData: updateData });

  return {
    proposalId,
  };
};
