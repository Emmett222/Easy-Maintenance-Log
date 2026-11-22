import "./MeterBorder.css";
import type { ReactNode } from "react";
import { primaryColor } from "../../util/constants";
import darken from "../../util/colorUtil";

// This is needed for it to be properly rendered by React.
interface MeterBorderProps {
  children: ReactNode;
  id?: string;
  radius: number;
  color?: string; // Optional.
}

// ReactNode is any value that can be rendered by React.
function MeterBorder({
  children,
  id,
  radius = 0,
  color = darken(primaryColor, 70),
}: MeterBorderProps) {
  return (
    // Keeping styling inline because it is small.
    <section
      id="outer"
      style={{
        borderRadius: radius + "px",
        borderStyle: "inset",
        borderColor: color,
        borderWidth: "10px",
        boxShadow: "inset 0 0 60px rgba(241, 237, 237, 0.918)",
        backgroundColor: "rgba(15, 15, 15, 0.5)"
      }}
    >
      <section
        id={id}
        style={{
          borderRadius: radius + "px",
          borderStyle: "dashed",
          borderColor: "rgb(180, 180, 180)",
          borderWidth: "10px",
          padding: "4vw",

          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {children}
      </section>
    </section>
  );
}

export default MeterBorder;
