import styled from "styled-components";

import Dropdown from "../client/src/components/Dropdown";

const TipAmountStyle = styled.div`
  color: ${(p) => p.theme.colors.text };
  opacity: ${p => p.disabled ? "0.5" : "1"};
  cursor: ${p => p.disabled ? "not-allowed" : "auto"};
  font-size: ${(p) => p.size ? p.theme.fontSizes[p.size] : p.theme.fontSizes.default};
  font-family: ${(p) => p.theme.fonts};
  font-weight: ${(p) => p.theme.fontWeight};
  border: "default";
  border-radius: 5px;
  margin: 0.25em;
  display: inline-block;
`;

const TipAmount = ({ size, label, options, feedValueToParent }) => (
  <>
    <TipAmountStyle size={size}>{label}: </TipAmountStyle>
    <Dropdown options={options} feedValueToParent={feedValueToParent} />
  </>
  
);

export default TipAmount;