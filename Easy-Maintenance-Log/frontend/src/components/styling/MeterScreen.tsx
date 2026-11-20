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
        borderTop: "5px groove rgb(180, 180, 180)",
        borderBottom: "5px groove rgb(180, 180, 180)",
        backgroundColor: "rgba(180, 180, 180, 0.1)",

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
