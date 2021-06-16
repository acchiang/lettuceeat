import { useState } from 'react'
import styled from "styled-components";
import Input from './Input.js';

const DropdownSelect = styled.select`
font-size: ${(p) => p.size ? p.theme.fontSizes[p.size] : p.theme.fontSizes.default};
font-family: ${(p) => p.theme.fonts};
font-weight: ${(p) => p.theme.fontWeight};
color: ${(p) => p.theme.colors.text};
padding: 10px;
border-radius: 5px;
margin: 0.25em;
padding: 0.25em 0.25em;
`;

const Dropdown = ({ options, defaultOption, size, showInput, setShowInput, customValue, ...props }) => {
    const [selected, setSelected] = useState(defaultOption);

    const handleSelect = (event, customValue) => {
        let selectedValue = event.target.value;
        setSelected(selectedValue);
        if (setShowInput) {
            setShowInput(selectedValue === customValue)
        }
    }

    return (
        <div>
            <DropdownSelect size={size} value={selected} onChange={(e) => handleSelect(e, customValue)}>
                {options.map((option, key) => { return (<option value={option} key={key}>{option}</option>) })}
            </DropdownSelect>
            {showInput && <Input size={size} placeholder={customValue} />}
        </div>
    )
}

export default Dropdown;