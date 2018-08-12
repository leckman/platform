import React, { Component } from 'react';
import styled from 'styled-components';

class Resume extends Component {

  render() {
    const StyledIFrame = styled.iframe`
      width: ${window.innerWidth/1.5}px;
      height: ${window.innerHeight/1.7}px;
    `
    return (
      <StyledIFrame src='/Laura_Eckman_Resume.pdf' />
    );
  }
}

export default Resume;
