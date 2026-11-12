import type { ReactNode } from "react";

// This is needed for it to be properly rendered by React.
interface MeterBorderProps {
  children: ReactNode;
  radius: number;
}

// ReactNode is any value that can be rendered by React.
function MeterBorder({ children, radius = 0 }: MeterBorderProps) {
  return (
    // Keeping styling inline because it is small.
    <section
      id="solidLines"
      style={{
        borderRadius: radius + "px",
        borderStyle: "inset",
        borderColor: "rgb(70, 211, 199)",
        borderWidth: "10px",
        boxShadow: "inset 0 0 40px rgba(241, 237, 237, 0.918)",
      }}
    >
      <section
        id="dashedLines"
        style={{
          borderRadius: radius + "px",
          borderStyle: "dashed",
          borderColor: "rgb(180, 180, 180)",
          borderWidth: "10px",
          padding: "4vw",
        }}
      >
        {children}
      </section>
    </section>
  );
}

export default MeterBorder;
