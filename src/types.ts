export interface Rule {
  matches: string[];
  elementsToRemove?: string[];
  topClassToRemove?: string;
  rebindRules?: boolean;
  removalAttempts?: number;
  customScriptToRun?: string;
}

export type Rules = { [name: string]: Rule };

export type DoneCallback = () => void;

export type IssueQueryStringParams = {
  title?: string;
  body?: string;
};
