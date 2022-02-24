import React, {Component} from "react";
import ReactDOM from 'react-dom';
import socketClient from "socket.io-client";
import { Alert, Button, Card, Col, Container, Row, Navbar, Nav, NavDropdown, Modal, ModalBody } from "react-bootstrap";
import "./Components.css"
import Cookies from 'universal-cookie';
import App from "../App";

export class NavComp extends Component {
    constructor () {
        super()
        this.state = {
            modalShow: false,
            alertShow: false,
            alertVar: 'success',
            alertShow2: false,
            alertVar2: 'danger'
        }
        this.socket = socketClient(`wss://Socketio.leonardoryuta05.repl.co`);
        this.cookies = new Cookies();
        this.userNameList = [];
      }    

    delay = ms => new Promise(res => setTimeout(res, ms))

    componentDidMount(){
        document.getElementById("Toggle").value = 0
        if (typeof this.cookies.get('Name') === 'undefined'){
            document.getElementById("userName").innerHTML = "Guest"
        } else {
            document.getElementById("userName").innerHTML = this.cookies.get('Name')
        }

        if (typeof this.cookies.get('messageBg') != 'undefined'){
            // document.getElementsByClassName('message').style.backgroundColor = this.cookies.get('messageBg')
        }

        var userObj = {
            user: document.getElementById('userName').innerHTML,
            room: window.location.pathname
          } 
      

        this.socket.emit('newUser', userObj)

        this.socket.on('users', (users) => {
          this.userNameList = users
          console.log(this.userNameList)
        })
    }
    
    modalShow(){
        this.setState({modalShow: true})
    }

    modalHide(){
        this.setState({modalShow: false})
    }

    async alert(){
        this.setState({alertShow: true, alertVar: 'success'})
        await this.delay(3000)
        this.setState({alertShow: false})

    }

    async alert2(){
        this.setState({alertShow2: true})
        await this.delay(3000)
        this.setState({alertShow2: false})

    }

    async changeName(newName){
        this.userNameList.forEach((user) => {
            if (newName === user.userName){
                this.alert2 ()
            } else {
                if (document.getElementById("state").innerText === "Incognito") {
                    this.changeState()
                }
                if (newName != '') {
                    if (newName != ' ') {
                        this.cookies.set('Name', newName, { path: '/' });
                        document.getElementById("userName").innerHTML = this.cookies.get('Name')
                        this.alert()
                    }
                }
            }
        })
    }

    changeState(){
        if (document.getElementById("state").innerText === "Public") {
            // this.cookies.set('prevName', this.cookies.get('Name'), { path: '/'});
            if (this.cookies.get('Name') != "🤷‍♂️" ){
                this.changeName("🤷‍♂️")
            }
            this.cookies.set('messageTxt', '', {path: '/'})
            this.cookies.set('messageBg', '', {path: '/'})
            document.getElementById("state").innerText = "Incognito"
            document.getElementById("image").src = "../images/incognito.png"
            document.getElementById("Toggle").value = 1
        } else {
            // this.changeName(this.cookies.get('prevName'))
            document.getElementById("state").innerText = "Public"
            document.getElementById("image").src = "../images/public.jpg"
            document.getElementById("Toggle").value = 0
        }
    }

    colorGenerator(value){
        let color = Math.floor(value*255255).toString(16)
        // if (color.length > 6){
        //     color.splice(0,1)
        // }
        console.log(color)
        document.getElementById("colorPreview").style.backgroundColor = `#${color}`
        color = `#${color}`
        this.cookies.set('messageBg', color, {path: '/'})
    }

    colorGenerator2(value){
        let color = Math.floor(value*255255).toString(16)
        // if (color.length > 6){
        //     color.splice(0,1)
        // }
        console.log(color)
        document.getElementById("textColor").style.backgroundColor = `#${color}`
        color = `#${color}`
        this.cookies.set('messageTxt', color, {path: '/'})
    }

    render(){
        return(
            <div className="nav">
                <div className="annonimity" onClick={()=>{this.changeState()}}>
                    <img id="image" className="stateImg" src="../images/public.jpg"></img>
                    <div id="state">Public</div>
                    <input type="range" min="0" max="1" step="1" id="Toggle" className="stateToggle"/>
                </div>
                <div className="nameArea">
                    <div id="userName" className="userName" onClick={()=>{this.modalShow()}}>
                        Guest
                    </div>
                    <Alert show={this.state.alertShow} variant={this.state.alertVar} className="alert" id="alert">
                        Username successfully changed to {this.cookies.get('Name')}
                    </Alert>
                    <div>
                        <Modal show={this.state.modalShow} backdrop={false} aria-labelledby="contained-modal-title-vcenter" centered>
                            <Modal.Header >
                                <Modal.Title>User Customization</Modal.Title>
                            </Modal.Header>

                            <Modal.Body>
                                <h3>Change Username</h3>
                                <input id="chosenName" className="inputName"/>
                                <button onClick={()=>{this.changeName(document.getElementById("chosenName").value); document.getElementById("chosenName").value = ''}}>Save</button>
                                {/* <button onClick={()=>{this.cookies.remove("Name", { path: '/' })}}>X</button> */}
                                <Alert show={this.state.alertShow2} variant={this.state.alertVar2} className="alert" id="alert2">
                                    This username has already been taken
                                </Alert>
                            </Modal.Body>

                            <Modal.Body>
                                <h3>Customize</h3>
                                <h4>Message Background Color</h4>
                                <div className="colorPicker">
                                    <div id="colorPreview" className="colorPreview"></div>
                                    <input type="range" min="0" max="10000" step="1" onChange={(e)=>{this.colorGenerator(e.target.valueAsNumber)}}></input>
                                </div>
                                <h4>Message Text Color</h4>
                                <div className="colorPicker">
                                    <div id="textColor" className="colorPreview"></div>
                                    <input type="range" min="0" max="10000" step="1" onChange={(e)=>{this.colorGenerator2(e.target.valueAsNumber)}}></input>
                                </div>
                            </Modal.Body>

                            <Modal.Footer>
                                <Button variant="secondary" onClick={()=>{this.modalHide()}}>Close</Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                </div>
            </div>
        )
    }
}