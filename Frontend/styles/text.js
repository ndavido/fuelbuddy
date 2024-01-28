import React from 'react';
import styled from 'styled-components/native';

const applyMargins = props => {
    if (props.margin) {
        return `margin: ${props.margin};`;
    } else {
        return `
      margin-bottom: ${props.bmargin || '0px'};
      margin-top: ${props.tmargin || '0px'};
      margin-left: ${props.lmargin || '0px'};
      margin-right: ${props.rmargin || '0px'};
    `;
    }
};

const applyColor = props => {
    if (props.color) {
        return `color: ${props.color};`;
    } else {
        return `
      
    `;
    }
};

const applyPosition = props => {
    if (props.position) {
        return `position: ${props.position};`;
    } else {
        return `
      
    `;
    }
};

const applyWidth = props => {
    if (props.width) {
        return `width: ${props.width};`;
    } else {
        return `
        
        `;
    }
}

const getFontFamily = (weight) => {
    switch (weight) {
        case '400':
            return 'Poppins_400Regular';
        case '500':
            return 'Poppins_500Medium';
        case '600':
            return 'Poppins_600SemiBold';
        default:
            return 'Poppins_500Medium'; // Default case
    }
};

export const H1 = styled.Text`
  font-size: 32px;
  font-family: ${props => getFontFamily(props.weight)};
  ${applyMargins}
  ${applyColor}
  ${applyPosition}
  ${applyWidth}
`;

export const H2 = styled.Text`
  font-size: 28px;
  font-family: ${props => getFontFamily(props.weight)};
  ${applyMargins}
  ${applyColor}
  ${applyPosition}
  ${applyWidth}
`;

export const H3 = styled.Text`
  font-size: 22px;
  font-family: ${props => getFontFamily(props.weight)};
  ${applyMargins}
  ${applyColor}
  ${applyPosition}
  ${applyWidth}
`;

export const H4 = styled.Text`
  font-size: 20px;
  font-family: ${props => getFontFamily(props.weight)};
  ${applyMargins}
  ${applyPosition}
  ${applyWidth}
`;

export const H5 = styled.Text`
  font-size: 16px;
  font-family: ${props => getFontFamily(props.weight)};
  ${applyMargins}
  ${applyColor}
  ${applyPosition}
  ${applyWidth}
`;

export const H6 = styled.Text`
  font-size: 14px;
  font-family: ${props => getFontFamily(props.weight)};
  ${applyMargins}
  ${applyColor}
  ${applyPosition}
  ${applyWidth}
`;

export const H7 = styled.Text`
  font-size: 12px;
  font-family: ${props => getFontFamily(props.weight)};
  ${applyMargins}
  ${applyColor}
  ${applyPosition}
  ${applyWidth}
`;

export const H8 = styled.Text`
  font-size: 10px;
  font-family: ${props => getFontFamily(props.weight)};
  ${applyMargins}
  ${applyColor}
  ${applyPosition}
  ${applyWidth}
`;

export const Img = styled.Image`
  height: 160px;
`;

export const Txt = styled.View`
  position: relative;
  text-align: center;
  width: 100%;
`;