import type { SVGProps } from "react";
import { iconSizeVariants } from ".";

export interface IconProps {
  size: "sm" | "md" | "lg";
}

interface CrossIconProps extends SVGProps<SVGSVGElement>, IconProps {
  size: "sm" | "md" | "lg"; // required for your internal className logic
}

export const CrossIcon = ({ size, className = "", ...props }: CrossIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={`${iconSizeVariants[size]} ${className}`}
      {...props} // spread other SVG props like style, onClick, etc.
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  );
};
