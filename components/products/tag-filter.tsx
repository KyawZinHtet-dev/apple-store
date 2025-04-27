import { cn } from "@/lib/utils";
import { useState } from "react";

type TagFilterProps = {
  tags: string[];
  filterProductsByTag: (tag: string) => void;
};
const TagFilter = ({ tags, filterProductsByTag }: TagFilterProps) => {
  const filteredTags = tags.filter((tag, index) => tags.indexOf(tag) === index);
  const [activeTag, setActiveTag] = useState("All");

  return (
    <div>
      <div className="flex gap-1 mb-2 overflow-x-auto max-w-screen-lg pr-2 py-2">
        <div
          onClick={() => {
            filterProductsByTag("All");
            setActiveTag("All");
          }}
          className={cn(
            activeTag === "All" && "bg-primary text-primary-foreground",
            activeTag !== "All" && "bg-muted",
            "rounded gap-1 px-2 py-1 text-xs font-semibold flex justify-center items-center cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all duration-200"
          )}
        >
          <span className=" whitespace-nowrap">All</span>
        </div>
        {filteredTags.map((tag, index) => (
          <div
            onClick={() => {
              filterProductsByTag(tag);
              setActiveTag(tag);
            }}
            key={index}
            className={cn(
              activeTag === tag && "bg-primary text-primary-foreground",
              activeTag !== tag && "bg-muted",
              "rounded gap-1 px-2 py-1 text-xs font-semibold flex justify-center items-center cursor-pointer hover:bg-primary hover:text-primary-foreground transition-all duration-200"
            )}
          >
            <span className=" whitespace-nowrap">{tag}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TagFilter;
