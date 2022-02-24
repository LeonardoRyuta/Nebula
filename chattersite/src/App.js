import React, {Component} from "react";
import ReactDOM from 'react-dom';
import socketClient from "socket.io-client";
import logo from './logo.svg';
import { Alert, Button, Card, Col, Container, Row, Navbar, Nav, NavDropdown } from "react-bootstrap";
import './App.css';
import Cookies from 'universal-cookie';
import { NavComp } from "./Components/Navbar";
import { Sidebar } from "./Components/Sidebar";
import { WebShow } from "./Components/websiteDisplay";

export default class App extends Component {
  constructor () {
    super()
    this.state={
      locked: true
    }
    this.socket = socketClient(`wss://Socketio.leonardoryuta05.repl.co`);
    this.itemList = []
    this.imgList = []
    this.cookies = new Cookies();
    this.oiweio = "heloo this is from app.js"
    this.roomState = []
    this.currentUrl = window.location.pathname.replace('/','')
  }

  async componentDidMount() {
    this.socket.on('RoomsStates', (rooms)=>{
      this.cookies.set('roomState', rooms, {path:'/'})
      this.roomState = this.cookies.get('roomState')
      console.log(this.roomState)
    })

    if (window.location.pathname === "/"){
      this.setState({locked:false})
    }

    this.roomState = this.cookies.get('roomState')

    // this.roomState.forEach((room) => {
    //   console.log(room)
    //   if (this.currentUrl === room.roomPath){
    //     if (room.roomState === "Public"){
    //       this.setState({locked: false})
    //     }
    //   }
    // })

    this.socket.on('newMessage', (msg) => {
      if (msg.path === window.location.pathname){
        this.itemList.push(msg)
        this.newMessage()
      }
    })

    this.socket.addEventListener('message', event => {
      console.log(event.message)
    })

    document.getElementById("main").addEventListener('dragover', (event) => {
      event.stopPropagation();
      event.preventDefault();
      event.dataTransfer.dropEffect = 'copy';
   });

    document.getElementById("main").addEventListener("drop", (e) => {
      console.log(e)
      e.stopPropagation();
      e.preventDefault();
      const fileList = e.dataTransfer.files;
      this.sendImage(fileList[0])
    })

    document.getElementById("main").addEventListener('keydown', (e) => {
      if (e.key === "Enter"){
        this.sendMessage(document.getElementById("input").value)
      }
    })
  }

  sendMessage(message){
    var msgObj = {
      user: document.getElementById('userName').innerHTML,
      msg: message,
      room: window.location.pathname,
      msgBg: this.cookies.get('messageBg'),
      txtC: this.cookies.get('messageTxt')
    } 

    if (document.getElementById("input").value != ''){
      if (document.getElementById("input").value.substring(0,1) != ' '){
        this.socket.emit('message', msgObj, (response) => {
          this.itemList.push(response.message)
          this.newMessage()
        })
        document.getElementById("input").value = ''
        document.getElementById("msgSendBut").style.display = "none"
      }
    } 
  }

  sendImage(image){
    var imge = URL.createObjectURL(image)
    this.socket.emit('message', imge)
  }

  newMessage(){
    console.log(this.itemList)
    const messages = (
      <div>
        {this.itemList.map((msg)=> {
          if (msg.message.substring(0,4) === "blob"){
            return(
              <div className="image" key={msg.message}>
                <div className="innerText">
                  <img className="img" src={`${msg.message}`} />
                </div>
              </div>
            )
          }
          else if(msg.message.substring(0,5) === "https"){
            return(
              <div className="message" key={msg.message} style={{backgroundColor: msg.bg}}>
                <div className="innerText">
                  <iframe src={msg.message} id="serverurl" width="500" height="300" className="iframe"></iframe>
                </div>
              </div>
            )
          }
          else{
            const index = this.itemList.findIndex(item => item.message === msg.message);
            console.log(index)
            console.log(msg.message)
            return(
              <div className="message" key={msg.message} id={index} style={{backgroundColor: msg.bg}}>
                <div className="innerText">
                  <b>{msg.user}</b> <br/>
                  <p style={{color: msg.txt}}>
                    {msg.message}
                  </p>
                </div>
              </div>
            )
          }
        })}
      </div>
    )  
    ReactDOM.render(messages, document.getElementById('chatPart'))
    document.getElementById(`${this.itemList.length - 1}`).scrollIntoView()
    // this.itemList.map((msg)=> {
    //   if (msg.user === this.cookies.get('Name')){
              
    //   }
    // })
  }

  showSendBut(){
    if (document.getElementById("input").value != ''){
      if (document.getElementById("input").value.substring(0,1) != ' '){
        document.getElementById("msgSendBut").style.display = "flex"
      } else {
        document.getElementById("msgSendBut").style.display = "none"
      }
    } else {
      document.getElementById("msgSendBut").style.display = "none"
    }

  }

  accessPassword(){
    this.setState({locked:false})
  }

  render(){
    return (
      <div>
        <div>
          <Sidebar/>
          <div id="main" className="main">
            <NavComp/>
            {
              this.state.locked ?
              <div className="lockedScreen">
                <div className="lockedScreenContent">This page is private</div>
                <div className="lockedScreenContent">Input password to access this page</div>
                <div>
                  <input id="lockedPassword"></input>
                  <button onClick={()=>{this.accessPassword()}}>Next</button>
                </div>
              </div>
              :
              <div>
                <div id="chatPart" className="chatPart">
                  {/* <div className="message">
                    <div className="innerText">
                      This is a test message
                    </div>
                  </div> */}
                </div>
                <div className="inputs2"></div>
                <div className="inputs">
                  <div className="inputPart">
                    <div className="inputArea">
                      <button className="imgButton" onClick={()=>{document.getElementById("imageInput").click()}}>
                        
                      </button>
                      <input id="imageInput" hidden title=" " type="file" accept="image/*" onChange={(e)=>{this.sendImage(e.target.files[0])}}/>
                      <input className="messageInput" onChange={()=>{this.showSendBut()}} id="input"/>
                      <button className="msgSendBut" id="msgSendBut" onClick={()=>{this.sendMessage(document.getElementById("input").value)}}>
                        Send
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            }
          </div>
          <WebShow/>
        </div>
      </div>
    );
  };
}


