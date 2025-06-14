import { Check } from "lucide-react";
import { cn } from "../../utils/cn";
import { Checkbox as RadixCheckbox } from "radix-ui";

export const Checkbox = (props: React.ComponentProps<typeof RadixCheckbox.Root> & { label?: string }) => {
  return (
    <label
      className={cn(
        "flex items-center justify-center gap-1 text-text-tertiary text-sm border-none",
        "border-b border-border-primary w-fit leading-normal",
        "has-[:disabled]:text-text-disabled",
        "text-text-primary"
      )}
    >
      <RadixCheckbox.Root {...props} className={cn(
        "appearance-none w-[1em] h-[1em] p-0 border-[1px] border-control-default-border bg-control-default-bg",
        "hover:bg-control-default-bg-hover",
        "data-[state=checked]:bg-control-checked-bg",
        "data-[state=checked]:hover:bg-control-checked-bg-hover",
        "data-[state=checked]:border-control-checked-border",
        "data-[state=checked]:text-control-checked-icon",
        "rounded-sm",
        "disabled:bg-control-disabled-bg",
        "disabled:border-control-disabled-border",
        "disabled:text-control-disabled-icon",
        "data-[state=checked]:disabled:bg-control-disabled-bg",
        "data-[state=checked]:disabled:border-control-disabled-border",
        "data-[state=checked]:disabled:text-control-disabled-icon"
      )}>
        <RadixCheckbox.Indicator>
          <div className="flex justify-center items-center w-full h-full">
            <Check style={{ strokeWidth: 4 }}/>
          </div>
        </RadixCheckbox.Indicator>
      </RadixCheckbox.Root>
      {props.label && (props.label.length > 0) &&
        <span className="text-text-primary">
          {props.label}
        </span>
      }
    </label>
  )
}