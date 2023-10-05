import { Tab } from '@headlessui/react'
import { cn } from '~/lib/utils';



export function ProductImageGallery({ images }: { images: { id: string; name: string; src: string; alt: string; }[]; }) {
  return (
    <Tab.Group as="div" className="flex flex-col-reverse">
      {/* Image selector */}
      <div className="mx-auto mt-6  w-full max-w-2xl  lg:max-w-none">
        <Tab.List className="grid grid-cols-4 gap-6">
          {images.map((image) => (
            <Tab
              key={image.id}
              className="relative flex h-24 cursor-pointer items-center justify-center rounded-md  text-sm font-medium uppercase  hover:bg-gray-50 focus:outline-none focus:ring focus:ring-opacity-50 focus:ring-offset-4"
            >
              {({ selected }) => (
                <>
                  <span className="sr-only">{image.name}</span>
                  <span className="absolute inset-0 overflow-hidden rounded-md">
                    <img src={image.src} alt="" className="h-full w-full object-cover object-center" />
                  </span>
                  <span
                    className={cn(
                      selected ? 'ring-indigo-500' : 'ring-transparent',
                      'pointer-events-none absolute inset-0 rounded-md ring-2 ring-offset-2'
                    )}
                    aria-hidden="true" />
                </>
              )}
            </Tab>
          ))}
        </Tab.List>
      </div>

      <Tab.Panels className="aspect-h-1 aspect-w-1 w-full">
        {images.map((image) => (
          <Tab.Panel key={image.id}>
            <a
              href={image.src}
              target="_blank"
              rel="noreferrer"
            >
              <img
                src={image.src}
                alt={image.alt}
                className="h-full w-full object-cover object-center sm:rounded-lg" />
            </a>
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
}
