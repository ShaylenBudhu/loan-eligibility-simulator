import type { HTMLAttributes } from "react";

export interface LoaderIconProps extends HTMLAttributes<HTMLDivElement> {
  size?: number;
}

export type LoaderIconHandle = {
  startAnimation: () => void;
  stopAnimation: () => void;
};
