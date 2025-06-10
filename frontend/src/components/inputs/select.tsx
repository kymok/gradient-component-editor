import { Select as RadixSelect } from "radix-ui";
import { cn } from "../../utils/cn";
import { ChevronDown } from "lucide-react";

export const Select = (
  props: React.ComponentProps<typeof RadixSelect.Root> & {
    items: { value: string; label: string }[];
    label?: string;
  }
) => {
  const { items, ...rest } = props;
  return (
    <div className="flex flex-row justify-between items-center gap-1 p-0">
      {props.label && (<span className={cn(
        "flex items-center justify-center gap-1 text-button-default-text text-sm border-none w-fit leading-normal",
      )}>
        {props.label}
      </span>)}
      <div className="relative">
        <RadixSelect.Root {...rest}>
          <RadixSelect.Trigger className={cn(
            "flex items-center justify-center gap-1 w-fit p-0 border-none cursor-pointer text-sm leading-normal",
            "text-button-default-text",
            "px-1 py-0.5 bg-button-default-bg rounded-sm",
            "hover:bg-button-default-bg-hover",
          )}>
            <RadixSelect.Value placeholder="Choose…" />
            <RadixSelect.Icon>
              <ChevronDown className="w-4 h-4 text-button-default-icon" />
            </RadixSelect.Icon>
          </RadixSelect.Trigger>
          <RadixSelect.Portal>
            <RadixSelect.Content className={cn(
              "text-button-default-text",
              "bg-surface-background",
              "border-[1px] border-border-primary",
              "p-2 rounded-lg shadow-lg"
              )}>
              <RadixSelect.Viewport>
                {items.map((item) => (
                  <RadixSelect.Item
                    key={item.value}
                    value={item.value}
                    className={cn(
                      "text-sm leading-normal px-1 py-0.5 rounded-sm",
                      "hover:bg-surface-hover",
                      "focus-visible:outline-none focus-visible:bg-surface-hover"
                    )}
                  >
                    <RadixSelect.ItemText>{item.label}</RadixSelect.ItemText>
                  </RadixSelect.Item>
                ))}
              </RadixSelect.Viewport>
            </RadixSelect.Content>
          </RadixSelect.Portal>
        </RadixSelect.Root>
      </div>
    </div>
  );
}
