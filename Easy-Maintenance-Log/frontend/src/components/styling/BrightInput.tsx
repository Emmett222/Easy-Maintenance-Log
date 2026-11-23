import { primaryColor } from "../../util/constants";

// This is needed for it to be properly rendered by React.
interface BrightInputProps {
  type: "text" | "number" | "color" | "password";
  id: string;
  name?: string; // Optional.
  min?: number; // Optional.
  step?: number; // Optional.
  placeholder?: string; // Optional.
  value?: any; // Optional.
  onChange: any;
  required: boolean;

  color?: string; // Optional.
  width?: string;
}

// ReactNode is any value that can be rendered by React.
function BrightInput({
  type,
  id,
  name,
  min,
  step,
  placeholder = "",
  value,
  onChange,
  required,
  color = primaryColor,
  width = "5vw",
}: BrightInputProps) {
  const style = {
    borderColor: color,
    borderWidth: "5px",
    borderStyle: "double",
    borderRadius: "10px",

    backgroundColor: "rgb(0,0,0,0.5)",
    boxShadow: "inset 0 0 4px rgba(241, 237, 237, 0.918)",
    color: "rgb(255,255,255)",

    "--double-box-shadow": "10px",
  };

  switch (type) {
    case "text":
      return (
        <input
          type={type}
          id={id}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          style={style}
          className="hoverGlow"
          width={width}
        >
        </input>
      );
    case "number":
      return (
        <input
          type={type}
          id={id}
          name={name}
          min={min}
          step={step}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          style={style}
          className="hoverGlow"
          width={width}
        >
        </input>
      );
    case "color":
      return (
        <input
          type={type}
          id={id}
          name={name}
          onChange={onChange}
          required={required}
          style={style}
          className="hoverGlow"
          width={width}
        >
        </input>
      );
    case "password":
      return (
        <input
          type={type}
          id={id}
          name={name}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          style={style}
          className="hoverGlow"
          width={width}
        >
        </input>
      );
  }
}

export default BrightInput;
