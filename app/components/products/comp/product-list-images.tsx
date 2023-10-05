import { useFetcher } from "@remix-run/react";
import { ImageObject } from "~/server/database/product.server";


export function ListProductImages({ images }: { images: ImageObject[] }) {
  return (
    <div className="py-3 text-slate-300">
      <ul>
        {images.map((image, index) => {
          return (
            <li key={index} className="my-4">
              <ImageCard image={image} index={index} />
            </li>
          )
        })}
      </ul>
    </div>
  )
};

function ImageCard({ image, index }: { image: ImageObject, index: number }) {
  const fetcher = useFetcher();

  return (
    <fetcher.Form method="post" className="border bg-slate-950 flex px-2 py-2 justify-between">
      <p>Image {index + 1}</p>
      <p>{image.name}</p>
      <input hidden readOnly name="imageId" value={image.id} />
      <input hidden readOnly name="imageAlt" value={image.alt} />
      <input hidden readOnly name="imageSrc" value={image.src} />
      <input hidden readOnly name="imageName" value={image.name} />
      <button name="_action" value="deleteImage" type="submit" className="text-slate-100">Delete</button>
    </fetcher.Form>
  )
}