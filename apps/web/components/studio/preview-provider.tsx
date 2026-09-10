"use client";

import {
  createContext,
  useContext,
  useReducer,
  type Dispatch,
  type ReactNode,
} from "react";
import {
  initialPreview,
  previewReducer,
  type PreviewAction,
  type PreviewPayload,
  type PreviewState,
} from "@/lib/studio-preview";

const PreviewContext = createContext<{
  payload: PreviewPayload;
  state: PreviewState;
  dispatch: Dispatch<PreviewAction>;
} | null>(null);

export function PreviewProvider({
  payload,
  children,
}: {
  payload: PreviewPayload;
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(previewReducer, payload, initialPreview);
  return (
    <PreviewContext.Provider value={{ payload, state, dispatch }}>
      {children}
    </PreviewContext.Provider>
  );
}

export function useStudioPreview() {
  const context = useContext(PreviewContext);
  if (!context) throw new Error("The workspace preview provider is missing.");
  return context;
}

export function useOptionalStudioPreview() {
  return useContext(PreviewContext);
}
