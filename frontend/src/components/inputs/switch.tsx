import { cn } from "../../utils/cn";
import { Switch as RadixSwitch } from "radix-ui";

export const Switch = (props: React.ComponentProps<typeof RadixSwitch.Root>) => {
  return (
    <label
      className={cn(
        "flex items-center justify-center gap-1 text-text-tertiary text-sm border-none",
        "border-b border-border-primary w-fit leading-normal",
        "has-[:disabled]:text-text-disabled",
        "text-text-primary"
      )}
    >
      <RadixSwitch.Root {...props} className={cn(
        "relative inline-flex h-[20px] w-[32px] items-center rounded-full",
        "bg-control-checked-bg",
        "hover:bg-control-checked-bg-hover",
        "disabled:bg-control-disabled-bg",
        "disabled:border-control-disabled-border",
        "data-[state=checked]:disabled:bg-control-disabled-bg",
        "data-[state=checked]:disabled:border-control-disabled-border"
      )}>
        <RadixSwitch.Thumb className={cn(
          "inline-block h-[16px] w-[16px] rounded-full",
          "bg-control-checked-icon",
          "transition-transform duration-200",
          "translate-x-[2px]",
          "data-[state=checked]:translate-x-[14px]",
          "data-[state=checked]:bg-control-checked-icon",
          "disabled:bg-control-disabled-icon",
          "data-[state=checked]:disabled:bg-control-disabled-icon"
        )} />
      </RadixSwitch.Root>
    </label>
  )
}