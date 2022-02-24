import React, {Component} from "react";
import ReactDOM from 'react-dom';
import socketClient from "socket.io-client";
import { Alert, Button, Card, Col, Container, Row, Navbar, Nav, NavDropdown, Modal } from "react-bootstrap";
import "./webDisplay.css"
import Cookies from 'universal-cookie';
import App from "../App";

export class WebShow extends Component {
    constructor () {
        super()
        this.state = {
        }
        this.socket = socketClient(`wss://Socketio.leonardoryuta05.repl.co`);
        this.cookies = new Cookies();
      }    

    delay = ms => new Promise(res => setTimeout(res, ms))

    componentDidMount(){
        console.log("webdisply here")
    }

    render(){    
        return(
            <div className="display hidden">
                <div><iframe src="https://simulator-mu.vercel.app/" id="serverurl" width="500" height="300"></iframe></div>
            </div>
        )
    }
}