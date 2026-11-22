import type { ReactNode } from "react";
import darken from "../../util/colorUtil";
import { primaryColor } from "../../util/constants";

// This is needed for it to be properly rendered by React.
interface BrightButtonProps {
  children: ReactNode;
  onClick?: any; // Optional.
  type?: "button" | "submit" | "reset"; // Optional.
  color?: string; // Optional.
  borderRadius: string;
  width: string;
  height: string;
}

// ReactNode is any value that can be rendered by React.
function BrightButton({
  children,
  onClick,
  type = "button",
  color = primaryColor,
  borderRadius,
  width,
  height,
}: BrightButtonProps) {
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

    "--double-box-shadow": "10px",
    "--clicked-in-color": darken(color, 50),
    transition: "box-shadow 0.3s ease"
  };

  return (
    <button style={style} onClick={onClick} type={type} className="hoverGlow clickDeepen">
      {children}
    </button>
  );
}

export default BrightButton;
