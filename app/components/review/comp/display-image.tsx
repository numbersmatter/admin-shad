
export interface ImageUpload {
  id: string;
  url: string;
  name: string;
}

export function DisplayImage({
  image
}: {
  image: ImageUpload,
}
) {
  return (
    <a target="_blank" rel="noreferrer" href={image.url}>
      <div
        className={'aspect-w-10 aspect-h-4 border-2 group block w-1/2 overflow-hidden rounded-lg bg-gray-100'
        }
      >
        <img
          src={image.url}
          alt=""
          className={
            'pointer-events-none object-cover'
          }
        />
      </div>
      <div>
        <p className=" px-3 py-2">{image.name}</p>
      </div>
    </a>
  )
}
