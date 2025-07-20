import * as React from "react";

interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
  ratio?: number;
}

const AspectRatio = React.forwardRef<HTMLDivElement, AspectRatioProps>(({ ratio = 16 / 9, style, ...props }, ref) => {
  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        width: "100%",
        paddingBottom: `${100 / ratio}%`,
        ...style,
      }}
      {...props}
    >
      <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}>{props.children}</div>
    </div>
  );
});
AspectRatio.displayName = "AspectRatio";
export { AspectRatio }; 