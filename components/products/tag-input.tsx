import React, { Dispatch, forwardRef, SetStateAction, useState } from "react";
import { Input } from "../ui/input";
import { XIcon } from "lucide-react";

type TagInputProps = {
  value: string[];
  handleOnChange: Dispatch<SetStateAction<string[]>>;
};

const TagsInput = forwardRef<HTMLInputElement, TagInputProps>(
  ({ value, handleOnChange, ...props }, ref) => {
    const [tag, setTag] = useState("");

    const addNewTag = () => {
      if (tag.trim() !== "") {
        const newTag = new Set([...value, tag]);
        handleOnChange(Array.from(newTag));
        setTag("");
      }
    };

    return (
      <div>
        <div className=" flex gap-1 mb-2 flex-wrap">
          {value.map((tag, index) => (
            <div
              key={index}
              className="rounded gap-1 bg-muted px-2 py-1 text-xs font-semibold flex justify-center items-center"
            >
              <span>{tag}</span>
              <XIcon
                onClick={() =>
                  handleOnChange(value.filter((_, i) => i !== index))
                }
                className="w-4 h-4 cursor-pointer"
              />
            </div>
          ))}
        </div>
        <Input
          value={tag}
          type="text"
          {...props}
          onKeyDown={(e) => {
            if (e.key === "Tab") {
              e.preventDefault();
              addNewTag();
            }
          }}
          onChange={(e) => {
            setTag(e.target.value);
          }}
          placeholder="Press tab key to add new tag"
        />
      </div>
    );
  }
);
export default TagsInput;
