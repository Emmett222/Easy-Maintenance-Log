import type { ReactNode } from "react";

interface MeterScreenProps {
  children: ReactNode;
  id?: string;
}

function MeterScreen({ children, id }: MeterScreenProps) {
  return (
    <section
      id={id}
      style={{
        borderTop: "10px double rgb(180, 180, 180)",
        borderBottom: "10px double rgb(180, 180, 180)",
        borderRadius: "10px",
        backgroundColor: "rgba(60, 60, 60, 0.5)",

        height: "95%",
        width: "90%",

        overflowY: "scroll",
      }}
    >
      {children}
    </section>
  );
}

export default MeterScreen;
