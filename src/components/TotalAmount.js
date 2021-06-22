import styled from "styled-components";
import DollarAmount from "./DollarAmount";

const TotalAmountStyle = styled.div`
  color: ${(p) => p.theme.colors.text };
  opacity: ${p => p.disabled ? "0.5" : "1"};
  cursor: ${p => p.disabled ? "not-allowed" : "auto"};
  font-size: ${(p) => p.size ? p.theme.fontSizes[p.size] : p.theme.fontSizes.default};
  font-family: ${(p) => p.theme.fonts};
  font-weight: ${(p) => p.theme.fontWeight};
  border: ${(p) => p.type === "text" ? "none" : "default"};
  border-radius: 5px;
  margin: 0.25em;
`;

const TotalAmount = ({ size, menuAmount, tipAmount, finalAmount }) => (
    <>
    <TotalAmountStyle>
        <DollarAmount size={size} label={"Menu Total"} amount={menuAmount}></DollarAmount>
        <DollarAmount size={size} label={"Tip Total"} amount={tipAmount}></DollarAmount>
        <DollarAmount size={size} label={"Final Total"} amount={finalAmount}></DollarAmount>
    </TotalAmountStyle>
    </>
);

export default TotalAmount;