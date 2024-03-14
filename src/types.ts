export interface Rule {
  matches: string[];
  elementsToRemove?: string[];
  topClassToRemove?: string;
  rebindRules?: boolean;
  removalAttempts?: number;
  customScriptToRun?: string;
}

export type Rules = { [name: string]: Rule };

export interface IgnoreRule {
  matches: string[];
  link: string;
}

export type IgnoreRules = { [name: string]: IgnoreRule };

export type DoneCallback = () => void;

export type IssueQueryStringParams = {
  title?: string;
  body?: string;
};
