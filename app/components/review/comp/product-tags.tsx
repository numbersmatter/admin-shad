import { cn } from "~/lib/utils";

export interface Tag {
  text: string;
  id: string;
  optionId?: string;
  index: number;
}



export function ProductTags({ tags, size }: { tags: Tag[], size?: "small" | "large" }) {
  const tagStyles = {
    0: "text-sky-200 bg-sky-700/70 ring-sky-300/10 ring-inset ring-2",
    1: "text-green-300 bg-green-700/40 ring-green-300/10 ring-inset ring-2",
    2: "text-yellow-300 bg-yellow-400/40 ring-yellow-400/10 ring-inset ring-2",
    3: "text-rose-200 bg-rose-700/40 ring-rose-300/10 ring-inset ring-2",
  }

  const sizeClass = size == undefined ? "small" : size;

  const sizeStyles = {
    small: "py-1 px-2 text-xs",
    large: "text-sm py-2 px-3"
  }


  return <div className="px-2 py-1 flex flex-wrap gap-2">
    {tags.map((tag) => {
      if (tag.index < 0) return null;

      const cssText = tag.index > 3
        ? tagStyles[3]
        // @ts-ignore
        : tagStyles[tag.index];

      return (
        <div
          key={tag.id}
          className={cn(
            cssText,
            sizeStyles[sizeClass],
            'rounded-full flex-none  font-medium '
          )}
        >
          {tag.text}
        </div>
      );
    })}
  </div>;
}
