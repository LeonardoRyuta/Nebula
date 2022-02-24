import React, {Component} from "react";
import ReactDOM from 'react-dom';
import socketClient from "socket.io-client";
import { Alert, Button, Card, Col, Container, Row, Navbar, Nav, NavDropdown, Modal } from "react-bootstrap";
import "./Components.css"
import Cookies from 'universal-cookie';
import App from "../App";

export class Sidebar extends Component {
    constructor () {
        super()
        this.state = {
            createModalShow: false
        }
        this.socket = socketClient(`wss://Socketio.leonardoryuta05.repl.co`);
        this.cookies = new Cookies();
        this.rooms = []
        this.activeTab = 'Rooms'
        this.userNameList1 = []
        this.roomState = []
        this.createRoomState = ''
      }    

    delay = ms => new Promise(res => setTimeout(res, ms))

    componentDidMount(){
        const appjs = new App()

        console.log(appjs.oiweio)

        this.socket.on('Rooms', (rooms) => {
            console.log(rooms)
            this.rooms = rooms
            this.showRooms()
        })

        this.socket.on('users', (users) => {
            this.userNameList1 = users
            console.log(this.userNameList1)
            this.renderDms()
        })
    }

    renderDms(){
        console.log("rendering dms...")
        const dms = (
            <div>
                {this.userNameList1.map((users) => {
                    console.log(users)
                    return(
                        <div className="dmStyle">
                            <div className="displayRooms">
                                {users.userName}
                            </div>
                        </div>
                    )
                })}
            </div>
        )
        ReactDOM.render(dms, document.getElementById('pageDm'))
    }

    showRooms(){
        console.log("making rooms...")
        const rooms = (
            <div>
              {this.rooms.map((Room)=> {
                console.log(Room);
                return(
                    <div className="roomStyle" onClick={()=>{window.location.href = Room}}>
                        <div className="displayRooms">
                            {Room}
                        </div>
                    </div>
                )
              })}
            </div>
          )  
          ReactDOM.render(rooms, document.getElementById('rooms'))
    }

    changePage(id){
        if (id === 'dm'){
            document.getElementById('dm').style.backgroundColor = '#290121'
            document.getElementById('roomPage').style.backgroundColor = 'transparent'
            document.getElementById('pageDm').className = "rooms"
            document.getElementById('pageRooms').className = "rooms hidden"
        } else if (id === 'roomPage') {
            console.log("roompage")
            document.getElementById('roomPage').style.backgroundColor = '#290121'
            document.getElementById('dm').style.backgroundColor = 'transparent'
            document.getElementById('pageRooms').className = "rooms"
            document.getElementById('pageDm').className = "rooms hidden"
        }
    }

    createRoom(){
        if(this.createRoomState != ''){
            if(this.createRoomState === "Private") {
                if (document.getElementById("roomPass").value != ''){
                    let room = Math.floor(Math.random()*1677721255326455).toString(32)
                    let roomObj = {
                        roomPath: room,
                        roomState: this.createRoomState,
                        passWord: document.getElementById("roomPass").value
                    }
                    console.log(roomObj)
                    this.roomState.push(roomObj)
                    window.location.href = `${room}`
                }
            } else {
                let room = Math.floor(Math.random()*1677721255326455).toString(32)
                let roomObj = {
                    roomPath: room,
                    roomState: this.createRoomState
                }
                console.log(roomObj)
                this.roomState.push(roomObj)
                window.location.href = `${room}`
            }

        }
        this.socket.emit('newRoom', this.roomState)
        console.log(this.roomState)
    }

    createModal(){
        this.setState({createModalShow:true})
    }

    createModalHide(){
        this.setState({createModalShow:false})
    }

    showInputPass(e){
        if (e.target.value === "Private") {
            document.getElementById("roomPass").className = "inputPassword"
        } else {
            document.getElementById("roomPass").className = "inputPassword hidden"
        }
    }

    render(){    
        return(
            <div className="sideBar1">
                <div className="navSidebar">
                    <div id="roomPage" style={{backgroundColor:"#290121"}} className="sideTabs" onClick={(e)=>{this.changePage(e.target.id)}}> Rooms </div>
                    <div id="dm" className="sideTabs" onClick={(e)=>{this.changePage(e.target.id)}}> DM </div>
                </div>


                <div id="pageDm" className="rooms hidden">
                    <div  id="rooms">
                            
                    </div>
                </div>

                <Modal show={this.state.createModalShow} backdrop={false} aria-labelledby="contained-modal-title-vcenter" centered>
                    <Modal.Header >
                        <Modal.Title>Create Room</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <div>
                            <input type={"radio"} id="Public" name="pState" value="Public" onChange={(e)=>{this.createRoomState = "Public"; this.showInputPass(e)}}></input>
                            <label for="Public">Public</label>
                        </div>
                        <div>
                            <input type={"radio"} id="Private" name="pState" value="Private" onChange={(e)=>{this.createRoomState = "Private"; this.showInputPass(e)}}></input>
                            <label for="Private">Private</label>
                        </div>
                        <div>
                            <input className="inputPassword hidden" id="roomPass" type={"password"} placeholder="Input password here"></input>
                        </div>
                        <div>
                            <button onClick={()=>{this.createRoom()}}>Create</button>
                        </div>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button variant="secondary" onClick={()=>{this.createModalHide()}}>Close</Button>
                    </Modal.Footer>
                </Modal>
                
                <div id="pageRooms" className="rooms">
                    <div className="createRoom" aria-disabled onClick={()=>{this.createModal()}}>
                        {/* Create Room */}
                        SOON
                    </div>
                    <div className="roomStyle1" onClick={()=>{window.location.href = "/"}}>
                        <div className="displayRooms">
                           Main Chat
                        </div>
                    </div>
                    <div  id="rooms">
                        
                    </div>
                </div>

            </div>
        )
    }
}