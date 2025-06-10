import { cn } from "../../utils/cn";

export const ColorWell = (props: { color: string }) => {
  return (
    <div
      className={cn(
        "w-4 h-4",
        "first-of-type:rounded-ss-sm first-of-type:rounded-es-sm",
        "last-of-type:rounded-se-sm last-of-type:rounded-ee-sm",
      )}
      style={{
        backgroundColor: props.color,
      }}
    />
  );
}