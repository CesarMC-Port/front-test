import React, { Component } from 'react';
import { Form, Input, Button } from 'antd';
import { Link, Navigate } from "react-router-dom";
import axios from 'axios';
import 'antd/dist/antd.min.css'; // or 'antd/dist/antd.less'
import '../styles/styles.css'

class Registro extends Component{

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
        //testeadores
        let comprobadorEmail = /\w+@\w+\.+[a-z]/;
        let comprobadorPassword = /^[0-9a-zA-Z]+$/;
        let comprobadorNumeros = /^[0-9]+$/;
        let comprobadorLetras = /^[a-zA-Z]+$/
        

        //request de la informacion
        const {firstName,lastName,email,password} = datos;

        //password revision largoMin 6 caracteres
        if(password.length < 6){
            this.mostrarioRespuesta(false,'password must be more than 6 characters')
            return
        }

        //nombre revision largo
        if(firstName.length > 2){
            this.mostrarioRespuesta(false,'your name can only contain 2 characters')
            return
        }

        //nombre solo letras
        if(comprobadorLetras.test(firstName) === false){
            this.mostrarioRespuesta(false,'your name must contain only letters')
            return
        }

        //si password no tiene solo textos o numeros
        if(comprobadorNumeros.test(password) === false && comprobadorLetras.test(password) === false){
            if(comprobadorPassword.test(password) === false){
                this.mostrarioRespuesta(false,'The password must contain only numbers and letters.')
                return
            }
        }else{
            this.mostrarioRespuesta(false,'the password must contain numbers and letters')
            return
        }

        //comprobador de haber ingresado un correo
        if(comprobadorEmail.test(email) === false){
            this.mostrarioRespuesta(false,'please enter an email')
            return
        }    

        // creacion de usuario
        const user = await axios.post(`http://localhost:4000/information`, {
            nombre: firstName,
            apellido: lastName,
            email: email,
            password: password
        })

        if(user.data.message === "Usuario creado"){
            const token = await axios.post(`http://localhost:4000/login`, {
                email: email,
                password: password
            })
            localStorage.setItem('token', JSON.stringify(token.data));
            this.mostrarioRespuesta(true,'account created')
            return
        }
        
    }

    render(){
        return(
            <React.Fragment>
                <div className='cardFormulario'>
                    <Form name='formulario' className='formLogin' onFinish={this.formSucess}>
                        <Form.Item
                            label="First name"
                            name="firstName"
                            className='formItems alignItems'
                            rules={[{ required: true, message: 'Please input your First name!' }]}
                        >
                            <Input maxLength={2}/>
                        </Form.Item>

                        <Form.Item
                            label="Last name"
                            name="lastName"
                            className='formItems alignItems'
                            rules={[{ required: true, message: 'Please input your Last name!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Email"
                            name="email"
                            className='formItems alignItems'
                            rules={[{ required: true, message: 'Please input your email!' }]}
                        >
                            <Input />
                        </Form.Item>

                        <Form.Item
                            label="Password"
                            name="password"
                            className='formItems alignItems'
                            rules={[{ required: true, message: 'Please input your password!' }]}
                        >
                            <Input.Password minLength={6}/>
                        </Form.Item>

                        <p className='signUp formItems'>Do you want to <Link to="/">Sign in</Link>?</p>

                        <Form.Item>
                            <Button type="primary" htmlType="submit">
                                Register
                            </Button>
                        </Form.Item>
                    </Form>
                </div>
                {this.state.bulError ? <div className='contenedorMensaje'>
                    <div className='mensajeError'>
                        {this.state.mensaje}
                    </div>
                </div> : <div></div>}
                {this.state.bulCorrecto ? <div className='contenedorMensaje'>
                    <div className='mensajeCorrecto'>
                        {this.state.mensaje}
                    </div>
                </div> : <div></div>}
                {this.state.bulRedirect ? <Navigate to="/miseventos" /> : <div></div>}
            </React.Fragment>
        )
    }
}

export default Registro