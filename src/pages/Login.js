import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';
import { Link, Navigate } from "react-router-dom";
import axios from 'axios';
import 'antd/dist/antd.min.css'; // or 'antd/dist/antd.less'
import '../styles/styles.css'

class Inicio extends Component{

    constructor(props){
        super(props);
        this.formSucess = this.formSucess.bind(this);
        this.state = {
            bulError: false,
            bulCorrecto: false,
            mensaje: '',
            bulRedirect: false
        };
    }

    mostrarioRespuesta(type,text){
        if(type === true){
            this.setState({
                bulCorrecto: true,
                mensaje: text
            });
            setTimeout(() => {
                this.setState({
                    bulCorrecto: false,
                    mensaje: '',
                    bulRedirect: true
                });
            }, 3000);
        }
        if(type === false){
            this.setState({
                bulError:true,
                mensaje:text
            });
            setTimeout(() => {
                this.setState({
                    bulError:false,
                    mensaje:''
                });
            }, 3000);
        }
    }

    async formSucess(datos){
        //request de la informacion
        const {email,password} = datos; 

        // creacion de usuario
        const token = await axios.post(`http://localhost:4000/login`, {
            email: email,
            password: password
        })

        //error al loguearte
        if(token.data.message === "Uno o mas campos son incorrectos"){
            this.mostrarioRespuesta(false,'wrong email or password')
            return
        }

        //el usuario no existe
        if(token.data.message === "el usuario no existe"){
            this.mostrarioRespuesta(false,'Username does not exist')
            return
        }

        //logueo exitoso
        if(token.data.token !== undefined){
            localStorage.setItem('token', JSON.stringify(token.data));
            this.mostrarioRespuesta(true,'successful login')
            return
        }
        
    }

    render(){
        return(
            <React.Fragment>
                <div className='cardFormulario'>
                    <Form name='formulario' className='formLogin' onFinish={this.formSucess}>
                        <Form.Item
                            label="Email"
                            name="email"
                            className='formItems alignItems'
                            rules={[{ required: true, message: 'Please input your email!' }]}
                        >
                            <Input className='input' />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            className='formItems alignItems'
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password className='input' />
                        </Form.Item>

                        <p className='signUp formItems'>Do you want to <Link to="/register">Sign up</Link>?</p>

                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Login
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
                {this.state.bulError ? <div className='contenedorMensaje'>
                    <div className='mensajeError'>
                        {this.state.mensaje}
                    </div>
                </div> : <div></div> }

                {this.state.bulCorrecto ? <div className='contenedorMensaje'>
                    <div className='mensajeCorrecto'>
                        {this.state.mensaje}
                    </div>
                </div> : <div></div> }

                {this.state.bulRedirect ? <Navigate to="/miseventos" /> : <div></div>}
            </React.Fragment>
        )
    }
}

export default Inicio