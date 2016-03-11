import React from 'react'
import { MorseMap } from './MorseMap'
/*eslint-disable no-unused-vars*/
import css from './sass/style.scss'
/*eslint-enable no-unused-vars*/
import FastClick from 'fastclick'


const DIT_DURATION = 200

export const MorseGuide = React.createClass ({
  toDahDit: function(item){
    return item
      .split('')
      .map( (letter, index) => {
        if (letter === '-'){
          return 'dah'
        } else if(letter === '.' && index < item.length - 1){
          return 'di'
        } else {
          return 'dit'
        }
      })
      .join('-')
  },
  render: function(){
    let rows = Object.keys(MorseMap).map((item, index) => {
      return (
        <tr key={'row-' + index}>
          <td>{item}</td>
          <td><em>{this.toDahDit(item)}</em></td>
          <td>{MorseMap[item]}</td>
        </tr>
      )
    })

    return (
      <table>
        <tbody>
          {rows}
        </tbody>
      </table>
    )
  }
})



export const Tono = React.createClass({
  getInitialState: function(){
    return {
      makingTone: false,
      toneStack: [],
      message: ''
    }
  },
  componentDidMount: function(){
    FastClick.attach(document.body)
    let audioCtx = new (window.AudioContext || window.webkitAudioContext)()
    let oscillator = audioCtx.createOscillator()

    oscillator.type = 'sine'
    oscillator.frequency.value = 800 // value in hertz
    oscillator.start()

    this.oscillator = oscillator
    this.audioContext = audioCtx
    this.lastToneStarted = 0

    this.keyTimer = null
  },
  didKeyDown: function(){
    this.setState({
      makingTone: true
    })
    this.lastToneStarted = new Date()
    this.oscillator.connect(this.audioContext.destination)
    clearTimeout(this.keyResolveTimer)
  },
  didKeyUp: function(evt){
    evt.preventDefault()
    let toneLength = new Date() - this.lastToneStarted
    this.oscillator.disconnect(this.audioContext.destination)

    this.setState({
      makingTone: false,
      lastToneLength: toneLength,
      toneStack: this.state.toneStack.concat([toneLength <= DIT_DURATION ? '.': '-'])
    })

    this.keyResolveTimer = setTimeout(() => {
      let tones = this.state.toneStack.join('')
      let char
      if(MorseMap.hasOwnProperty(tones)){
        char = MorseMap[tones]
      } else {
        char = '?'
      }
      this.setState({
        toneStack: [],
        message: this.state.message + char
      })
    }, DIT_DURATION)
  },
  render: function() {
    let tones = this.state.toneStack.map((item, index) => {
      return (
        <span key={index}>{item}</span>
      )
    })
    return (
      <div>
        <div className="cwKey"
          onMouseDown={this.didKeyDown}
          onMouseUp={this.didKeyUp}
          onTouchStart={this.didKeyDown}
          onTouchEnd={this.didKeyUp}>
          <div className="bar"></div>
          <div className={this.state.makingTone ? 'button keyDown': 'button'} />
        </div>
        {tones}
        <p>{this.state.message}</p>
        <MorseGuide />
      </div>
    )
  }
})
