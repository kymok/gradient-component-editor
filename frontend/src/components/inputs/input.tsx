import { cn } from "../../utils/cn";

export const Input = (props: React.ComponentProps<"input"> & { label?: string }) => {
  const { label, ...inputProps } = props;
  return (

    <label
      className={cn(
        "flex items-center justify-center gap-1 text-text-secondary text-sm",
        "border px-1 py-0.5 rounded-md border-border-primary w-full leading-normal",
        "has-[:disabled]:text-text-disabled"
      )}
    >
      {label}
      <input
        className={cn(
          "border-border-primary p-0 text-sm text-text-primary w-full",
          "disabled:bg-surface-secondary disabled:text-text-disabled disabled:cursor-default"
        )}
        {...inputProps}
      />
    </label>
  )
}

export const ParamInput = (props: React.ComponentProps<"input"> & { label?: string }) => {
  const { label, ...inputProps } = props;
  return (
    <label
      className={cn(
        "flex items-center justify-center gap-1 text-text-secondary text-sm",
        "border px-1 py-0.5 rounded-md border-border-primary w-fit leading-normal",
        "has-[:disabled]:text-text-disabled"
      )}
    >
      {label}
      <input
        className={cn(
          "border-border-primary text-sm text-text-primary",
          "disabled:bg-surface-secondary disabled:text-text-disabled disabled:cursor-default",
          "w-[4em] text-end"
        )}
        {...inputProps}
      />
    </label>
  )
}