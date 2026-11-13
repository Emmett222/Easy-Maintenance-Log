import type { ReactNode } from "react";

// This is needed for it to be properly rendered by React.
interface BrightHeaderProps {
  children: ReactNode;
  onClick?: any; // Optional.
  type?: "button" | "submit" | "reset"; // Optional.
  color?: string; // Optional.
  borderRadius: string;
  width: string;
  height: string;
}

// ReactNode is any value that can be rendered by React.
function BrightHeader({
  children,
  onClick,
  type = "button",
  color = "rgb(70, 211, 199)",
  borderRadius,
  width,
  height,
}: BrightHeaderProps) {
  const style = {
    borderColor: color,
    borderWidth: "5px",
    borderStyle: "double",
    borderRadius: borderRadius,

    backgroundColor: "rgb(0,0,0,0.5)",
    boxShadow: "inset 0 0 5px rgba(241, 237, 237, 0.918)",
    color: "rgb(255,255,255)",

    width: width,
    height: height,
  };

  return (
    <button style={style} onClick={onClick} type={type}>
      {children}
    </button>
  );
}

export default BrightHeader;
