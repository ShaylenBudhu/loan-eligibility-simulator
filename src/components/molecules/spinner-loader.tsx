import { useEffect, useRef } from "react";

import {
  LoaderIcon,
  type LoaderIconProps,
  type LoaderIconHandle,
} from "@/components/atoms";

export const SpinningLoader = (props: LoaderIconProps) => {
  const ref = useRef<LoaderIconHandle>(null);
  useEffect(() => {
    ref.current?.startAnimation();
  }, []);
  return <LoaderIcon ref={ref} {...props} />;
};
