import React, { Component } from 'react';
import styled from 'styled-components';

let Wrapper = styled.div`
  position: absolute;
  left: ${props => `${props.position.x}px`};
  top: ${props => `${props.position.y}px`};
  width: ${props => `${props.size.width}px`};
  height: ${props => `${props.size.height}px`};
  opacity: ${props => props.contact ? 1.0 : 0.5};
  background-color: rgb(200, 200, 200);
`

let SubComponent = styled.div`
  position: absolute;
  left: ${props => `${props.position.x}px`};
  top: ${props => `${props.position.y}px`};
`

class InteractorSubComponent extends Component {
  render() {
    return (
      <SubComponent position={this.props.position} >
        {this.props.subComponent}
      </SubComponent>
    )
  }
}

class Interactor extends Component {

  constructor(props) {
    super(props)
    this.getSubPosition = this.getSubPosition.bind(this);
  }

  getSubPosition() {
    const add_padding = { horizontal: 10, vertical: 10 }
    let { contact, size } = this.props.interactor
    switch (contact) {
      case 'RIGHT': // open to the bottom
        return {
          x: 0,
          y: size.height + add_padding.vertical
        }
      default: // open to the right
        return {
          x: size.width + add_padding.horizontal,
          y: 0
        }
    }
  }

  render() {
    let { position, size, label, icon, contact, subComponent } = this.props.interactor;
    return (
      <Wrapper
        position={position}
        size={size}
        contact={contact}
      >
      {label}
      <img src={icon} alt={`${label} icon`} />
      { contact &&
        <InteractorSubComponent
          subComponent={subComponent}
          position={this.getSubPosition()}
        />
      }
      </Wrapper>
    );
  }
}

export default Interactor;
