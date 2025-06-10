import { DropdownMenu as RadixDropdownMenu } from "radix-ui";
import { cn } from "../../utils/cn";

export const DropDownMenu = ({
  icon,
  label,
  actions,
  disabled
}: {
  icon: React.ReactNode;
  label: string;
  actions: {
    name: string;
    action: () => void;
  }[];
  disabled?: boolean;
}) => {
  return (
    <div className="relative">
      <RadixDropdownMenu.Root>
        <RadixDropdownMenu.Trigger asChild disabled={disabled}>
          <button
            type="button"
            className={cn(
              "flex items-center justify-center gap-1 w-fit p-0 border-none cursor-pointer text-sm leading-normal",
              "text-button-default-text",
              "px-1 py-0.5 bg-button-default-bg rounded-sm",
              "hover:bg-button-default-bg-hover",
            )}
            disabled={disabled}
          >
            <div className="flex justify-center items-center w-4 h-4 text-button-default-icon">
              {icon}
            </div>
            {label}
          </button>
        </RadixDropdownMenu.Trigger>
        <RadixDropdownMenu.Portal>
          <RadixDropdownMenu.Content
            className={cn(
              "text-button-default-text",
              "bg-surface-background",
              "border-[1px] border-border-primary",
              "p-2 rounded-lg shadow-lg"
            )}
            sideOffset={1}
            align="start"
            onCloseAutoFocus={(e) => {
              e.preventDefault();
            }}
          >
            {actions.map((preset) => (
              <RadixDropdownMenu.Item
                key={preset.name}
                className={cn(
                  "text-sm leading-normal px-1 py-1 rounded-sm",
                  "hover:bg-surface-hover",
                  "focus-visible:outline-none focus-visible:bg-surface-hover"
                )}
                onClick={preset.action}
              >
                {preset.name}
              </RadixDropdownMenu.Item>
            ))}
          </RadixDropdownMenu.Content>
        </RadixDropdownMenu.Portal>
      </RadixDropdownMenu.Root>
    </div>
  );
}