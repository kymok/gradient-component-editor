import { CurveEditor as CurveEditorEditor } from "../../marker-editor/curve-editor";
import { Toolbar } from "./toolbar";
import { ComponentProps, useState } from "react";

export const CurveEditor = (props:
  Omit<
    ComponentProps<typeof CurveEditorEditor> &
    ComponentProps<typeof Toolbar> & {
      width?: number;
      height?: number;
      children?: React.ReactNode;
    },
    "selectedPointIds" | "setSelectedPointIds"
  >
) => {
  const height = props.height ?? 128;
  const [selectedPointIds, setSelectedPointIds] = useState<string[]>([]);

  return (
    <div style={{
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      gap: "8px",
    }}>
      {/* Editor */}
      <div style={{
        width: "100%",
        height,
        position: "relative",
      }}>
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}>
          {props.children}
        </div>
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}>
          <CurveEditorEditor
            {...props}
            selectedPointIds={selectedPointIds}
            setSelectedPointIds={setSelectedPointIds}
          />
        </div>
      </div>

      {/* Toolbar */}
      <Toolbar
        controlPoints={props.controlPoints}
        setControlPoints={props.setControlPoints}
        selectedPointIds={selectedPointIds}
        setSelectedPointIds={setSelectedPointIds}
        controlPointBound={props.controlPointBound}
        onClear={props.onClear}
      />
    </div>
  );
}
