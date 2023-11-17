export interface StandardAPIResponse {
  success: boolean;
  message: string;
  errors: { [key: string]: string[] };
  values: { [key: string]: string };
}
