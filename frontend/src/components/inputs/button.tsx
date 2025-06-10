import { cn } from "../../utils/cn";

type variant = "default" | "primary" | "danger";

export const IconButton = (props: React.ComponentProps<"button"> & {
  icon: React.ReactNode,
  label: string,
  variant?: variant
}) => {
  return (
    <button
      type="button"
      onClick={props.onClick}
      className={
        cn(
          "flex items-center justify-center gap-1 w-fit border-none cursor-pointer",
          "text-sm leading-normal text-button-default-text",
          "px-1 py-0.5 bg-button-default-bg rounded-md hover:bg-button-default-bg-hover",
          props.variant === "danger" && [
            "bg-button-danger-bg",
            "text-button-danger-text",
            "hover:bg-button-danger-bg-hover",
            "focus-visible:outline-button-danger-icon",
          ],
          props.disabled && [
            "bg-button-disabled-bg",
            "text-button-disabled-text",
            "hover:bg-button-disabled-bg",
            "focus-visible:outline-button-disabled-icon",
          ],
        )
      }
      disabled={props.disabled}
    >
      <div className="flex justify-center items-center w-4 h-4">
        {props.icon}
      </div>
      {props.label}
    </button>
  )
}
