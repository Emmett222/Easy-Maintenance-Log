import { useState, type ReactNode } from "react";

interface THArrowProps {
  children: ReactNode;
}

function THArrow({ children }: THArrowProps) {
  const [arrow, setArrow] = useState<string>("↓");
  const [isHovered, setIsHovered] = useState(false);

  function arrowSwap() {
    if (arrow === "↓") {
      setArrow("↑");
    } else {
      setArrow("↓");
    }
  }

  return (
    <section
      id="THContainer"
      onClick={arrowSwap}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 0,
        margin: 0,
        userSelect: "none",

        paddingLeft: "5%",
        paddingRight: " 5%",
      }}
    >
      {children}
      <p id="arrow"> {isHovered ? arrow : ""} </p>
    </section>
  );
}

export default THArrow;
