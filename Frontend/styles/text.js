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

export const H1 = styled.Text`
  font-size: 32px;
  font-family: 'Poppins_500Medium';
  ${applyMargins}
`;

export const H2 = styled.Text`
  font-size: 28px;
  font-family: 'Poppins_500Medium';
  ${applyMargins}
`;

export const H3 = styled.Text`
  font-size: 22px;
  font-family: 'Poppins_500Medium';
  ${applyMargins}
`;

export const H4 = styled.Text`
  font-size: 20px;
  font-family: 'Poppins_500Medium';
  ${applyMargins}
`;

export const H5 = styled.Text`
  font-size: 16px;
  font-family: 'Poppins_500Medium';
  ${applyMargins}
`;

export const H6 = styled.Text`
  font-size: 14px;
  font-family: 'Poppins_500Medium';
  ${applyMargins}
`;