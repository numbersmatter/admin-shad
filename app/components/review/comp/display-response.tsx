import { ImageUpload } from "./display-image";
import { DisplayImagesResponse } from "./display-images-response";
import { DisplayTextResponse } from "./display-text-response";


export type FormResponse = {
  label: string;
  value: string;
  images?: ImageUpload[];
}


export function DisplayResponse({
  response
}: {
  response: FormResponse,
}) {

  if (response.images) {
    return (
      <DisplayImagesResponse
        response={response}
      />
    );
  }


  return (
    <DisplayTextResponse
      response={response}
    />
  );

}