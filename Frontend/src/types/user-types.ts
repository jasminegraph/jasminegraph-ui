export interface IUserAccessData {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  enabled: boolean;
}

export interface ISelectProp {
  value: string;
  label: string;
}

export interface ISelectNumProp {
  value: number;
  label: string;
}