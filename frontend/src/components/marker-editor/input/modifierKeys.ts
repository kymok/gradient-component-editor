// import { useState, useEffect } from "react";

// type modifierKeyState = {
//   shift: boolean;
//   ctrl: boolean;
//   meta: boolean;
//   alt: boolean;
// }

// const useModifierKeys = () => {
//   const [modifierKeys, setModifierKeys] = useState<modifierKeyState>({ shift: false, ctrl: false, meta: false, alt: false });
//   useEffect(() => {
//     const handleKeyDown = (e: KeyboardEvent) => {
//       if (e.key === "Shift") {
//         setModifierKeys((prev) => ({ ...prev, shift: true }));
//       } else if (e.key === "Control") {
//         setModifierKeys((prev) => ({ ...prev, ctrl: true }));
//       } else if (e.key === "Meta") {
//         setModifierKeys((prev) => ({ ...prev, meta: true }));
//       } else if (e.key === "Alt") {
//         setModifierKeys((prev) => ({ ...prev, alt: true }));
//       }
//     }
//     const handleKeyUp = (e: KeyboardEvent) => {
//       if (e.key === "Shift") {
//         setModifierKeys((prev) => ({ ...prev, shift: false }));
//       } else if (e.key === "Control") {
//         setModifierKeys((prev) => ({ ...prev, ctrl: false }));
//       } else if (e.key === "Meta") {
//         setModifierKeys((prev) => ({ ...prev, meta: false }));
//       } else if (e.key === "Alt") {
//         setModifierKeys((prev) => ({ ...prev, alt: false }));
//       }
//     }
//     window.addEventListener("keydown", handleKeyDown);
//     window.addEventListener("keyup", handleKeyUp);
//     return () => {
//       window.removeEventListener("keydown", handleKeyDown);
//       window.removeEventListener("keyup", handleKeyUp);
//     }
//   }, [])
//   return modifierKeys;
// }

// export const useSelectionModifierKeys = () => {
//   const modifierKeys = useModifierKeys();
//   const isMultiSelectKeyPressed = modifierKeys.meta || modifierKeys.ctrl;
//   const isDeselectKeyPressed = modifierKeys.alt;
//   const isRangeSelectKeyPressed = modifierKeys.shift;
//   return {
//     isMultiSelectKeyPressed,
//     isDeselectKeyPressed,
//     isRangeSelectKeyPressed
//   };
// }

export const getSelectionModifier = (e: MouseEvent) => {
  const isMultiSelectKeyPressed = e.metaKey || e.ctrlKey;
  const isDeselectKeyPressed = e.altKey;
  const isRangeSelectKeyPressed = e.shiftKey;
  return {
    isMultiSelectKeyPressed,
    isDeselectKeyPressed,
    isRangeSelectKeyPressed
  };
}