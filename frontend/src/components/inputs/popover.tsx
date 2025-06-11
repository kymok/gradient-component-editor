import { Popover as RadixPopover } from "radix-ui";
import { cn } from "../../utils/cn";

export const Popover = ({
  icon,
  label,
  children,
  disabled
}: {
  icon: React.ReactNode;
  label?: string;
  children: React.ReactNode;
  disabled?: boolean;
}) => {
  return (
    <div className="relative">
      <RadixPopover.Root>
        <RadixPopover.Trigger asChild disabled={disabled}>
          <button
            type="button"
            className={cn(
              "flex items-center justify-center gap-1 w-fit p-0 border-none cursor-pointer text-sm leading-normal",
              "text-button-default-text",
              "px-1 py-0.5 bg-button-default-bg rounded-sm",
              "hover:bg-button-default-bg-hover",
              label ? "px-1" : "px-0.5",
            )}
            disabled={disabled}
          >
            <div className="flex justify-center items-center w-4 h-4 text-button-default-icon">
              {icon}
            </div>
            {label}
          </button>
        </RadixPopover.Trigger>
        <RadixPopover.Portal>
          <RadixPopover.Content
            className={cn(
              "text-button-default-text",
              "bg-surface-background",
              "border-[1px] border-border-primary",
              "p-4 rounded-lg shadow-lg"
            )}
            sideOffset={1}
            align="start"
            onCloseAutoFocus={(e) => {
              e.preventDefault();
            }}
          >
            {children}
          </RadixPopover.Content>
        </RadixPopover.Portal>
      </RadixPopover.Root>
    </div>
  );
}