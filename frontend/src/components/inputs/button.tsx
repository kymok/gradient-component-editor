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
        )
      }
      disabled={props.disabled}
    >
      <div className={cn(
        "flex justify-center items-center w-4 h-4 text-button-default-icon",
        props.variant === "danger" && "text-button-danger-icon",
      )}>
        {props.icon}
      </div>
      {props.label}
    </button>
  )
}
