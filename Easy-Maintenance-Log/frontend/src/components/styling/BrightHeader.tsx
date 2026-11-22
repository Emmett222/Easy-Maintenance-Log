import "./BrightHeader.css";
import type { ReactNode } from "react";
import { primaryColor } from "../../util/constants";
import darken from "../../util/colorUtil";

// This is needed for it to be properly rendered by React.
interface BrightHeaderProps {
  children: ReactNode;
  headerNumber: number;
  color?: string; // Optional.
}

// ReactNode is any value that can be rendered by React.
function BrightHeader({
  children,
  headerNumber,
  color = darken(primaryColor, 70),
}: BrightHeaderProps) {

  const style = {
    color: "rgb(255,255,255)",
    textShadow: ("2px 2px 20px " + color)
  };

  switch (headerNumber) {
    case 1:
        return (<h1 style={style}>{children}</h1>);
    case 2:
        return (<h2 style={style}>{children}</h2>);
    case 3:
        return (<h3 style={style}>{children}</h3>);
    case 4:
        return (<h4 style={style}>{children}</h4>);
    case 5:
        return (<h5 style={style}>{children}</h5>);
    case 6:
        return (<h6 style={style}>{children}</h6>);
  }
}

export default BrightHeader;
