import "./MeterBorder.css";
import type { ReactNode } from "react";
import { primaryColor } from "../../util/constants";
import darken from "../../util/colorUtil";

interface MeterBorderProps {
  children: ReactNode;
  id?: string;
  radius: number;
  color?: string;
}

function MeterBorder({
  children,
  id,
  radius = 0,
  color = darken(primaryColor, 70),
}: MeterBorderProps) {
  const responsiveRadius = `min(${radius}px, 12vw)`;

  return (
    <section
      id="outer"
      style={{
        borderRadius: responsiveRadius,
        borderStyle: "inset",
        borderColor: color,
        borderWidth: "10px",
        boxShadow: "inset 0 0 60px rgba(241, 237, 237, 0.918)",
        backgroundColor: "rgba(15, 15, 15, 0.5)",
      }}
    >
      <section
        id={id}
        style={{
          borderRadius: responsiveRadius,
          borderStyle: "dashed",
          borderColor: "rgb(180, 180, 180)",
          borderWidth: "10px",
          padding: "min(4vw, 60px)",

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