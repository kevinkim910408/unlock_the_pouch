import { ElementType, ReactNode } from "react";

type TextSize = "xl" | "lg" | "md" | "sm" | "xs";

const SIZE_CLASS: Record<TextSize, string> = {
  xl: "t-1",
  lg: "t-2",
  md: "t-3",
  sm: "t-4",
  xs: "t-5",
};

type TextProps<T extends ElementType = "p"> = {
  as?: T;
  size?: TextSize;
  className?: string;
  children: ReactNode;
};

export default function Text<T extends ElementType = "p">({
  as,
  size = "sm",
  className = "",
  children,
}: TextProps<T>) {
  const Component = (as ?? "p") as ElementType;
  const cls = `${SIZE_CLASS[size]} ${className}`.trim();

  return <Component className={cls}>{children}</Component>;
}
