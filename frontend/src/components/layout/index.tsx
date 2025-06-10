import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";

export const PaneHeader = (props: React.ComponentProps<"div">) => {
  return (
    <h2 className="font-serif font-semibold text-text-primary text-lg leading-none">
      {props.children}
    </h2>
  );
};

const SectionHeader = (props: React.ComponentProps<"div">) => {
  return (
    <h3 className="m-0 p-0 font-serif font-semibold text-md text-text-primary leading-none">
      {props.children}
    </h3>
  );
}

export const Section = (props: React.ComponentProps<"div"> & { title: string }) => {
  return (
    <div className="flex flex-col gap-2 w-full">
      <SectionHeader>{props.title}</SectionHeader>
      {props.children}
    </div>
  );
};

export const AccordionSection = (
  props: React.ComponentProps<"div"> & {
    title: string;
    defaultOpen: boolean;
  }
) => {
  const [showContent, setShowContent] = useState<boolean>(props.defaultOpen);
  return (
    <div className="flex flex-col gap-2 w-full">
      <div className="m-0 ml-[-16px] p-0">
        <button
          className="flex items-center cursor-pointer"
          onClick={() => setShowContent(!showContent)}
        >
          <div className="flex justify-center items-center w-4 h-4 text-text-secondary">
            {showContent ? <ChevronDown /> : <ChevronRight />}
          </div>
          <SectionHeader>{props.title}</SectionHeader>
        </button>
      </div>
      {showContent && props.children}
    </div>
  );
}