import React, { Component } from 'react';
import '../styles/styles.css'
import axios from 'axios';

import Header from '../components/Header';
import ApiEventos from '../components/ApiEventos'

class DashboardEventos extends Component{

    constructor(props){
        super(props);
        this.mostrarioRespuesta = this.mostrarioRespuesta.bind(this);
        this.cargarMisEventos = this.cargarMisEventos.bind(this);
        this.agregarEvento = this.agregarEvento.bind(this);
        this.state = {
            bulError: false,
            bulCorrecto: false,
            mensaje: '',
            evento: ''
        };
    }

    //control de errores y respuestas al cliente
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

    //cargar eventos
    async cargarMisEventos(){
        //llave de sesion
        const token = JSON.parse(localStorage.getItem('token')) 

        let eventos = await axios.get(`http://localhost:4000/information/getEvents`, {

            params: {token: token.token}}, 

            {headers: {'Content-Type': 'application/json'}
        });

        //error al loguearte
        if(eventos.data.message === "error"){
            this.mostrarioRespuesta(false,'something is wrong')
            return
        }

        //Error en validación
        if(eventos.data.message === "Error en validación"){
            this.mostrarioRespuesta(false,'session expired')
            return
        }

        this.setState({
            evento: eventos
        })
    }

    //DOOM mounted
    componentDidMount = () =>{
        this.cargarMisEventos()
    }

    //funcion para agregar un evento
    agregarEvento = async (e) => {
        if(e !== undefined){
             //llave de sesion
             const token = JSON.parse(localStorage.getItem('token')) 

             // creacion de usuario
             const eventFollow = await axios.post(`http://localhost:4000/information/follow`, {
                 token: token.token,
                 idEvento: e.target.parentElement.parentElement.id
             })
 
             //error al loguearte
             if(eventFollow.data.message === "error"){
                 this.mostrarioRespuesta(false,'something is wrong')
                 return
             }
 
             //Error en validación
             if(eventFollow.data.message === "Error en validación"){
                 this.mostrarioRespuesta(false,'session expired')
                 return
             }

             //Ya seguiste a este usuario
             if(eventFollow.data.message === "Ya seguiste este usuario"){
                this.mostrarioRespuesta(false,'User already followed')
                return
            }

            //El evento ya acabo
            if(eventFollow.data.message === "El evento ya acabo"){
                this.mostrarioRespuesta(false,'The event is over')
                return
            }
 
             //Todo correcto
             if(eventFollow.data.message === "Seguir agregado"){
                 this.mostrarioRespuesta(true,'followed event')
                 setTimeout(() => {
                     this.cargarMisEventos()
                 }, 3000);
                 return
             }
        }
    }

    render(){
        return(
            <React.Fragment>
                <Header />
                <div className='contenedorEventos'>
                    <ApiEventos data={this.state.evento} type={'eventos'} funcionAgregar={this.agregarEvento} />
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
            </React.Fragment>
        )
    }
}

export default DashboardEventos