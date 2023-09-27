import { DisplayImage, ImageUpload } from "./display-image";
import { FormResponse } from "./display-response";



export function DisplayImagesResponse({
  response
}: {
  response: FormResponse
}
) {
  const { label, images } = response;
  const imagesArray: ImageUpload[] = images ?? [];

  return (
    <div className="px-2 py-2" aria-labelledby="gallery-heading">
      <p id="gallery-heading" className="text-slate-200">
        {label}
      </p>
      <ul
        className="grid grid-cols-1 gap-x-4 gap-y-8  "
      >
        {imagesArray.map((image) => (
          <li key={image.id} className="relative flex flex-row">
            <DisplayImage
              image={image}
            />
          </li>
        ))}
      </ul>
    </div>
  );
}
