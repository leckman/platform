import React, { Component } from 'react';
import Player from './components/Player';
import Interactor from './components/Interactor';
import styled from 'styled-components';
import Resume from './components/interactors/Resume'
import ResumeIcon from './assets/resume.svg'

let Wrapper = styled.div`
  text-align: center;
  &:focus {
    outline: none;
  }
`

const LEFT = 'LEFT'
const RIGHT = 'RIGHT'
const UP = 'UP'
const DOWN = 'DOWN'

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      playerPosition: { x: 10, y: 10},
      playerSize: { width: 40, height: 40},
      interactors: [
        {
          label: 'Resume',
          icon: ResumeIcon,
          position: { x: 200, y: 100 },
          size: { width: 75, height: 100 },
          contact: false,
          subComponent:  ( <Resume /> )
        }
      ],
      bounds: { },
      STEP_SIZE: 25
    }

    this.ref = null;
    this.keyDownHandler = this.keyDownHandler.bind(this);
    this.updateWindowDimensions = this.updateWindowDimensions.bind(this);
    this.moveX = this.moveX.bind(this);
    this.moveY = this.moveY.bind(this);
    this.getEdgePoints = this.getEdgePoints.bind(this);
    this.overlaps = this.overlaps.bind(this);
    this.getContactDirection = this.getContactDirection.bind(this);
    this.focusElement = this.focusElement.bind(this)
  }

  updateWindowDimensions() {
    this.setState((state, props) => {
      let bounds = {
        minX: 0,
        minY: 0,
        maxX: window.innerWidth - state.playerSize.width,
        maxY: window.innerHeight - state.playerSize.height
      }
      let playerPosition = { // make sure player stays in bounds
        x: Math.min(state.playerPosition.x, bounds.maxX),
        y: Math.min(state.playerPosition.y, bounds.maxY)
      }
      return { bounds, playerPosition }
    })
  }

  focusElement() {
    if (this.ref) this.ref.focus()
  }

  componentDidMount() {
    this.focusElement()
    this.updateWindowDimensions()
    window.addEventListener('resize', this.updateWindowDimensions);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.updateWindowDimensions);
  }

  getEdgePoints(interactors) {
    return interactors.map((el) => { return {
      label: el.label,
      left: el.position.x,
      right: el.position.x + el.size.width,
      top: el.position.y,
      bottom: el.position.y + el.size.height
    }})
  }

  overlaps(rect1, rect2) {
    return rect1.left < rect2.right &&
          rect2.left < rect1.right &&
          rect1.top < rect2.bottom &&
          rect2.top < rect1.bottom
  }

  contacts(rect1, rect2) {
    let topRightCorner = (rect1.right === rect2.left && rect1.top === rect2.bottom) ||
                          (rect2.right === rect1.left && rect2.top === rect1.bottom)
    let topLeftCorner = (rect1.left === rect2.right && rect1.top === rect2.bottom) ||
                          (rect2.left === rect1.right && rect2.top === rect1.bottom)
    let horizontalTouch = (rect1.left === rect2.right || rect2.left === rect1.right) &&
                          !(rect1.top > rect2.bottom || rect2.top > rect1.bottom)
    let verticalTouch = (rect1.top === rect2.bottom || rect2.top === rect1.bottom) &&
                          !(rect1.left > rect2.right || rect2.left > rect1.right)
    return (horizontalTouch || verticalTouch) && !(topRightCorner || topLeftCorner)
  }

  getContactDirection(interactor, player) {
    interactor = this.getEdgePoints([interactor])[0]
    if (player.left === interactor.right) {
      return RIGHT
    } else if (player.right === interactor.left) {
      return LEFT
    } else if (player.bottom === interactor.top) {
      return UP
    } else if (player.top === interactor.bottom) {
      return DOWN
    } else {
      return false
    }
  }

  moveX(x){
    this.setState((state,props) => {
      let direction = x < 0 ? LEFT : RIGHT;
      let playerEdges = (i) => { return {
        left: i,
        right: i + state.playerSize.width,
        top: state.playerPosition.y,
        bottom: state.playerPosition.y + state.playerSize.height
      }}
      let newX = state.playerPosition.x + x
      let overlapPoints = this.getEdgePoints(state.interactors).filter((range) => {
        return this.overlaps(range, playerEdges(newX))
      })
      if (direction === LEFT && overlapPoints.length) {
        newX = Math.max( ...overlapPoints.map(p => p.right) );
      } else if (direction === RIGHT && overlapPoints.length) {
        newX = Math.min( ...overlapPoints.map(p => p.left) ) - state.playerSize.width;
      }
      if (newX < state.bounds.minX) {
        newX = state.bounds.minX
      } else if (newX > state.bounds.maxX) {
        newX = state.bounds.maxX
      }
      let contactInteractors = this.getEdgePoints(state.interactors).filter((range) => {
        return this.contacts(range, playerEdges(newX))
      }).map(el => el.label)
      let newInteractors = state.interactors.map((el) => {
        return {
          ...el,
          contact: contactInteractors.includes(el.label) && this.getContactDirection(el, playerEdges(newX))
        }
      })
      return { interactors: newInteractors, playerPosition: { x: newX, y: state.playerPosition.y } }
    })
  }

  moveY(y){
    this.setState((state,props) => {
      let direction = y < 0 ? UP : DOWN;
      let playerEdges = (i) => { return {
        left: state.playerPosition.x,
        right: state.playerPosition.x + state.playerSize.width,
        top: i,
        bottom: i + state.playerSize.height
      }}
      let newY = state.playerPosition.y + y
      let overlapPoints = this.getEdgePoints(state.interactors).filter((range) => {
        return this.overlaps(range, playerEdges(newY))
      })
      if (direction === UP && overlapPoints.length) {
        newY = Math.max( ...overlapPoints.map(p => p.bottom) );
      } else if (direction === DOWN && overlapPoints.length) {
        newY = Math.min( ...overlapPoints.map(p => p.top) ) - state.playerSize.height;
      }
      if (newY < state.bounds.minY) {
        newY = state.bounds.minY
      } else if (newY > state.bounds.maxY) {
        newY = state.bounds.maxY
      }
      let contactInteractors = this.getEdgePoints(state.interactors).filter((range) => {
        return this.contacts(range, playerEdges(newY))
      }).map(el => el.label)
      let newInteractors = state.interactors.map((el) => {
        return {
          ...el,
          contact: contactInteractors.includes(el.label) && this.getContactDirection(el, playerEdges(newY))
        }
      })
      return { interactors: newInteractors, playerPosition: { x: state.playerPosition.x, y: newY } }
    })
  }

  keyDownHandler(e) {
    let moveLeft = () => this.moveX(-1*this.state.STEP_SIZE)
    let moveRight = () => this.moveX(this.state.STEP_SIZE)
    let moveUp = () => this.moveY(-1*this.state.STEP_SIZE)
    let moveDown = () => this.moveY(this.state.STEP_SIZE)
    switch(e.which) {
      case 37: // left arrow
          moveLeft()
          break
      case 72: // h vi navigation
          moveLeft()
          break
      case 65: // a
          moveLeft()
          break
      case 38: // up arrow
          moveUp()
          break
      case 75: // k vi navigation
          moveUp()
          break
      case 87: // w
          moveUp()
          break
      case 39: // right arrow
          moveRight()
          break
      case 76: // l vi navigation
          moveRight()
          break
      case 68: // d
          moveRight()
          break
      case 40: // down arrow
          moveDown()
          break
      case 74: // j vi navigation
          moveDown()
          break
      case 83: // s
          moveDown()
          break
      default:
          return
    }
  }

  render() {
    return (
      <Wrapper
        tabIndex="0"
        innerRef={el => this.ref = el}
        onKeyDown={this.keyDownHandler}
        onBlur={this.focusElement}
      >
        <Player position={this.state.playerPosition} size={this.state.playerSize} />
        { this.state.interactors.map((interactor, index) => <Interactor
            key={index}
            interactor={interactor}
            />
        )}
      </Wrapper>
    );
  }
}

export default App;
