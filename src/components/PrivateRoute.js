//import React from 'react';
import React, { Component } from 'react';
import axios from 'axios';
import { Navigate, Outlet } from "react-router-dom";

class PrivateRoute extends Component{

    constructor(props){
        super(props);
        this.mostrarioRespuesta = this.mostrarioRespuesta.bind(this);
        this.state = {
            bulDoom: false,
            bulRedirect: false,
        };
    }

    async mostrarioRespuesta(){

        //recoger token de verificacion
        let token
        if(localStorage.getItem('token') !== null && localStorage.getItem('token') !== undefined && localStorage.getItem('token') !== ''){
           token = JSON.parse(localStorage.getItem('token')) 
        }else{
            token = null
        }
        
        //revisar token 
        if(token !== null){
            let bul = await axios.post(`http://localhost:4000/login/ver`, {
                Authorization: token
            })

            //sesion correcta
            if(bul.data.message === true){
                this.setState({
                    bulDoom: true
                });
            }else{
                //sesion expirada
                this.setState({
                    bulDoom: false,
                    bulRedirect: true
                });
            }
        }else{
            //logout
            this.setState({
                bulDoom: false,
                bulRedirect: true
            });
        }
    }

    componentDidMount = () =>{
        this.mostrarioRespuesta()
    }

    render(){
        return(
            <React.Fragment>
                {this.state.bulRedirect ? <Navigate to="/" /> : <div></div>}
                {this.state.bulDoom ? <Outlet /> : <div></div>}
            </React.Fragment>
        )
    }
}

export default PrivateRoute;