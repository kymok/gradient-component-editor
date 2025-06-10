import { cn } from "../../utils/cn";

export const Table = (props: React.ComponentProps<"table">) => {
  return (
    <table className={cn(
      "w-full table-auto border-collapse border-none",
      "[&_th]:px-1 [&_th]:py-1 [&_th]:text-start [&_th]:text-sm [&_th]:font-normal [&_th]:text-text-secondary [&_th]:border-b [&_th]:border-border-primary",
      "[&_td]:px-1 [&_td]:py-1 [&_td]:text-start [&_td]:text-sm [&_td]:font-normal [&_td]:text-text-primary"
    )} {...props}>
      {props.children}
    </table>
  )
}

export const TableCellContainer = (
  props: React.ComponentProps<"div"> & { align?: "start" | "center" | "end" }
) => {
  return (
    <div
      className={cn(
        "flex w-full gap-1 items-center",
        props.align === "center" && "justify-center",
        props.align === "end" && "justify-end",
        (!props.align || props.align === "start") && "justify-start"
      )}
      {...props}
    >
      {props.children}
    </div>
  )
}

export const TableIcon = (props: React.ComponentProps<"div">) => {
  return (
    <div className="[&>svg]:w-[1em] [&>svg]:min-w-[1em] [&>svg]:h-[1em] [&>svg]:min-h-[1em] [&>svg]:text-text-primary" {...props}>
      {props.children}
    </div>
  )
}