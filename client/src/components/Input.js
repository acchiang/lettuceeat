import styled from "styled-components";

const inputSize = {
  small: 12,
  medium: 24,
  large: 36,
  default: 24,
};

const InputBox = styled.input`
  width: ${(p) => (inputSize[`${p.size}`] ?? inputSize["default"]) * 9}px;
  height: ${(p) => inputSize[`${p.size}`] ?? inputSize["default"]}px;
  min-width: ${(p) => p["min-width"]}
  min-height: ${(p) => p["min-height"]}
  font-size: ${(p) => inputSize[`${p.size}`] ?? inputSize["default"]}px;
  font-family: ${(p) => p.theme.fonts};
  font-weight: ${(p) => p.theme.fontWeight};
  color: ${(p) => p.fontColor ?? p.theme.colors.text};
  background-color: ${(p) => p.theme.colors.secondary};
  cursor: ${(p) => (p.disabled ? "not-allowed" : "text")};
  margin: ${(p) => (inputSize[`${p.size}`] ?? inputSize["default"]) / 3}px
    ${(p) => (inputSize[`${p.size}`] ?? inputSize["default"]) / 3}px;
  padding: 10px;
  border: ${(p) => p.border ?? "1px solid black"};
  border-radius: 3px;
  
  :placeholder{
    color: ${(p) => p.placeholderColor ?? "black"}
  }
  :disabled {
    opacity: 0.5;
  }
  ${p => p.theme.mediaQueries.mobile} {
    width: ${inputSize["small"] * 9}px;
    padding: 5px;
  }
`;

export const Label = styled.label`
  color: ${(p) => p.theme.colors.text};
  display: inline-block;
  font-size: ${(p) => inputSize[`${p.size}`] ?? inputSize["default"]}px;
  font-family: ${(p) => p.theme.fonts};
  font-weight: ${(p) => p.theme.fontWeight};
  min-width: ${(p) => (inputSize[`${p.size}`] ?? inputSize["default"]) * 6}px;
  max-width: ${(p) => (inputSize[`${p.size}`] ?? inputSize["default"]) * 6}px;
  text-align: left;
  ${p => p.theme.mediaQueries.mobile} {
    font-size: ${inputSize["small"] * 1.5}px;
    text-align: right;
  }
`;

const Input = ({ label, size, setValue, placeholder, ...props }) => (
  <>
    {label && <Label size={size}>{label}:</Label>}
    <InputBox
      size={size}
      name={label ?? placeholder}
      placeholder={placeholder}
      onChange={setValue ? (e) => setValue(e.target.value) : null}
      {...props}
    />
  </>
);

export default Input;
