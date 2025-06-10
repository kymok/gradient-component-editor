import { ComponentProps } from "react";

export const RadioButton = (props: ComponentProps<"input">) => {
  return (
    <label className="relative flex justify-center items-center w-full h-full">
      <input
      type="radio"
      className="bg-control-default-bg checked:bg-control-checked-bg checked:hover:bg-control-checked-bg-hover hover:bg-control-default-bg-hover disabled:bg-control-disabled-bg border-[1px] border-control-default-border checked:border-control-checked-border disabled:border-control-disabled-border rounded-full w-4 h-4 appearance-none"
      {...props}
      />
      {props.checked && (
      <div className="absolute inset-0 flex justify-center items-center w-full h-full">
        <div className="bg-control-checked-icon rounded-full w-1 h-1" />
      </div>
      )}
    </label>
  );
}
