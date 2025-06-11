export const Toolbar = ( props: React.ComponentProps<"div"> ) => {
  return (
    <div className="flex flex-row justify-between items-center gap-2 p-0">
      {props.children}
    </div>
  );
}
