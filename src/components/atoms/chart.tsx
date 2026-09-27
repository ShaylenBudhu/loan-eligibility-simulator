import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { mountChart } from "@tanstack/charts";
import type {
  ChartHost,
  ChartHostOptions,
  DomChartDefinition,
  ChartPoint,
  ChartValue,
} from "@tanstack/charts";

interface ChartProps<
  TDatum = unknown,
  TXValue extends ChartValue = ChartValue,
  TYValue extends ChartValue = ChartValue,
> {
  definition: DomChartDefinition<TDatum, TXValue, TYValue>;
  height?: number;
  className?: string;
  ariaLabel?: string;
  renderTooltipBody?: (context: {
    primaryPoint?: ChartPoint<TDatum, TXValue, TYValue> | null;
  }) => ReactNode;
}

export function Chart<
  TDatum = unknown,
  TXValue extends ChartValue = ChartValue,
  TYValue extends ChartValue = ChartValue,
>({
  definition,
  height,
  className,
  ariaLabel = "",
  renderTooltipBody,
}: ChartProps<TDatum, TXValue, TYValue>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const hostRef = useRef<ChartHost<TDatum, TXValue, TYValue> | null>(null);
  const tooltipContainerRef = useRef<HTMLDivElement | null>(null);
  const [focusedPoint, setFocusedPoint] = useState<ChartPoint<TDatum, TXValue, TYValue> | null>(null);

  const buildOptions = (
    def: DomChartDefinition<TDatum, TXValue, TYValue>,
    h: number | undefined,
    label: string,
  ): ChartHostOptions<TDatum, TXValue, TYValue> => ({
    definition: def,
    height: h,
    ariaLabel: label,
    onFocusChange: renderTooltipBody
      ? (point) => setFocusedPoint(point)
      : undefined,
  });

  useEffect(() => {
    if (!containerRef.current) return;

    const host = mountChart<TDatum, TXValue, TYValue>(
      containerRef.current,
      buildOptions(definition, height, ariaLabel),
    );

    hostRef.current = host;

    return () => {
      host.destroy();
      hostRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    hostRef.current?.update(buildOptions(definition, height, ariaLabel));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [definition, height, renderTooltipBody]);

  return (
    <>
      <div
        ref={containerRef}
        className={className}
        aria-label={ariaLabel}
        style={height ? { height } : undefined}
      />
      <div ref={tooltipContainerRef} />
      {renderTooltipBody && tooltipContainerRef.current
        ? createPortal(
            renderTooltipBody({ primaryPoint: focusedPoint }),
            tooltipContainerRef.current,
          )
        : null}
    </>
  );
}
