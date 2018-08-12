import React, { Component } from 'react';
import styled from 'styled-components';
import Controller from '../assets/controller.svg';

let Wrapper = styled.div`
  position: absolute;
  left: ${props => `${props.position.x}px`};
  top: ${props => `${props.position.y}px`};
  width: ${props => `${props.size.width}px`};
  height: ${props => `${props.size.height}px`};
  background-color: #cbf7f7;
  line-height: 0.8;
  border-radius: 20%;
`

class Player extends Component {

  render() {
    return (
      <Wrapper position={this.props.position} size={this.props.size}>
      <img src={Controller} alt={'Controller'} />
      </Wrapper>
    );
  }
}

export default Player;
