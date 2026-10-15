export type ScorecardCriterion = {
  id: string;
  name: string;
  description: string | null;
  sortOrder: number;
  required: boolean;
  weight: number;
  createdAt: string;
  updatedAt: string;
};

export type ScorecardTemplate = {
  id: string;
  name: string;
  description: string | null;
  active: boolean;
  criteria: ScorecardCriterion[];
  createdAt: string;
  updatedAt: string;
};

export type CreateScorecardCriterionRequest = {
  name: string;
  description?: string | null;
  sortOrder: number;
  required: boolean;
  weight: number;
};

export type UpdateScorecardCriterionRequest = {
  name: string;
  description?: string | null;
  sortOrder: number;
  required: boolean;
  weight: number;
};

export type CreateScorecardTemplateRequest = {
  name: string;
  description?: string | null;
  criteria?: CreateScorecardCriterionRequest[];
};

export type UpdateScorecardTemplateRequest = {
  name: string;
  description?: string | null;
};
