import React, { Component } from 'react';
import '../styles/styles.css'
import { PlusCircleFilled, CloseOutlined } from '@ant-design/icons';
import { Form, Input, Button, DatePicker, Select} from 'antd';
import axios from 'axios';
import moment from 'moment'

import Header from '../components/Header';
import ApiEventos from '../components/ApiEventos'

class DashboardMisEventos extends Component{

    constructor(props){
        super(props);
        this.crearEvento = this.crearEvento.bind(this);
        this.mostrarioRespuesta = this.mostrarioRespuesta.bind(this);
        this.formSucess = this.formSucess.bind(this);
        this.cerrarCrearEvento = this.cerrarCrearEvento.bind(this);
        this.formSucessEdit = this.formSucessEdit.bind(this);
        this.state = {
            bulError: false,
            bulCorrecto: false,
            mensaje: '',
            bulCrearEvento: false,
            evento: '',
            bulEditarEvento: false,
            idEvento: ''
        };
    }

    //boton de abrir interfaz de crear evento
    crearEvento(){
        this.setState({
            bulCrearEvento: true
        });
    }

    //boton de cerrar interfaz de crear evento
    cerrarCrearEvento(){
        this.setState({
            bulCrearEvento: false,
            bulEditarEvento: false,
            idEvento: ''
        });
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

    //funcion para la creacion de un evento
    async formSucess(datos){
        //testers
        let comprobadorLetras = /^[a-zA-Z]+$/
        let comprobadorHora = /[0-1]+[0-9]:\d\d/

        //request de la informacion
        let {title,description,startDate,endDate,timeDate,timeDate2,zonDate,zonDate2} = datos; 
        startDate = moment(startDate._d).format('YYYY-MM-DD hh:mm a');
        endDate = moment(endDate._d).format('YYYY-MM-DD hh:mm a');
        startDate = startDate.substring(0,10)
        endDate = endDate.substring(0,10)

        //request de token
        const token = JSON.parse(localStorage.getItem('token')) 

        //nombre solo letras
        if(comprobadorHora.test(timeDate) === false){
            this.mostrarioRespuesta(false,'invalid time format')
            return
        }

        //la hora debe de cumplir un formato
        if(comprobadorLetras.test(title) === false){
            this.mostrarioRespuesta(false,'your name must contain only letters')
            return
        }

        // creacion de usuario
        const eventCreate = await axios.post(`http://localhost:4000/information/event`, {
            token: token.token,
            titulo: title,
            descripcion: description,
            fechaInicial: `${startDate} ${timeDate} ${zonDate}`,
            fechaFinal: `${endDate} ${timeDate2} ${zonDate2}`
        })

        //error al loguearte
        if(eventCreate.data.message === "error"){
            this.mostrarioRespuesta(false,'something is wrong')
            return
        }

        //Error en validación
        if(eventCreate.data.message === "Error en validación"){
            this.mostrarioRespuesta(false,'session expired')
            return
        }

        //Evento creado
        if(eventCreate.data.message === 'Evento creado'){
            this.mostrarioRespuesta(true,'event created')
            setTimeout(() => {
                this.cargarMisEventos()
                this.setState({
                    bulCrearEvento: false
                });
            }, 3000);
        }
        
    }

    //funcion para la edicion de un evento
    async formSucessEdit(datos){
        //testers
        let comprobadorLetras = /^[a-zA-Z]+$/

        //request de la informacion
        let {title2,description2,startDate2,endDate2,timeDate3,timeDate4,zonDate3,zonDate4} = datos; 
        startDate2 = moment(startDate2._d).format('YYYY-MM-DD hh:mm a');
        endDate2 = moment(endDate2._d).format('YYYY-MM-DD hh:mm a');
        startDate2 = startDate2.substring(0,10)
        endDate2 = endDate2.substring(0,10)
        //request de token
        const token = JSON.parse(localStorage.getItem('token')) 

        //nombre solo letras
        if(comprobadorLetras.test(title2) === false){
            this.mostrarioRespuesta(false,'your name must contain only letters')
            return
        }

        // creacion de usuario
        const eventCreate = await axios.post(`http://localhost:4000/information/update`, {
            token: token.token,
            titulo: title2,
            descripcion: description2,
            fechaInicial: `${startDate2} ${timeDate3} ${zonDate3}`,
            fechaFinal: `${endDate2} ${timeDate4} ${zonDate4}`,
            idEvento: this.state.idEvento
        })

        //error al loguearte
        if(eventCreate.data.message === "error"){
            this.mostrarioRespuesta(false,'something is wrong')
            return
        }

        //Error en validación
        if(eventCreate.data.message === "Error en validación"){
            this.mostrarioRespuesta(false,'session expired')
            return
        }

        //Evento creado
        if(eventCreate.data.message === 'Evento editado'){
            this.mostrarioRespuesta(true,'edited event')
            setTimeout(() => {
                this.cargarMisEventos()
                this.setState({
                    bulEditarEvento: false,
                    idEvento: ''
                });
            }, 3000);
        }
        
    }

    //cargar mis eventos
    async cargarMisEventos(){
        //llave de sesion
        const token = JSON.parse(localStorage.getItem('token')) 

        let eventos = await axios.get(`http://localhost:4000/information/getEventsUser`, {

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

    //DOOM montado
    componentDidMount = () =>{
        this.cargarMisEventos()
    }

    //mostrar interfaz para la edicion de eventos
    editarEvento = async (e) =>{
        
        if(e !== undefined){
            this.setState({
                bulEditarEvento: true,
                idEvento: e.target.parentElement.parentElement.id
            });
        }
        
    }

    //funcion la eliminacion de un evento
    eliminarEvento = async (e) =>{
        if(e !== undefined){
             //llave de sesion
            const token = JSON.parse(localStorage.getItem('token')) 

            // creacion de usuario
            const eventDelete = await axios.post(`http://localhost:4000/information/delete`, {
                token: token.token,
                idEvento: e.target.parentElement.parentElement.id
            })

            //error al loguearte
            if(eventDelete.data.message === "error"){
                this.mostrarioRespuesta(false,'something is wrong')
                return
            }

            //Error en validación
            if(eventDelete.data.message === "Error en validación"){
                this.mostrarioRespuesta(false,'session expired')
                return
            }

            //Todo correcto
            if(eventDelete.data.message === "Evento eliminada"){
                this.mostrarioRespuesta(true,'deleted event')
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
                    <div className='cardNuevoEvento'>
                        <div className='linkCard' onClick={this.crearEvento}>
                            <PlusCircleFilled style={{ fontSize: '24px' ,color: 'gray' }}/>
                        </div>
                    </div>
                    <ApiEventos data={this.state.evento} type={'miseventos'} funcionEditar={this.editarEvento} funcionEliminar={this.eliminarEvento} />
                </div>
                {this.state.bulCrearEvento ? <div className='contenedorMensaje'>
                    <div className='contenedorFormEvento'>
                        <div className='x-salir' onClick={this.cerrarCrearEvento}><CloseOutlined style={{ fontSize: '15px' ,color: 'gray' }} /></div>
                        <Form name='formulario' className='formLogin' onFinish={this.formSucess}>
                            <Form.Item
                                label="Title"
                                name="title"
                                className='formItems alignItems'
                                rules={[{ required: true, message: 'Please input your title event!' }]}
                            >
                                <Input maxLength={2}/>
                            </Form.Item>

                            <Form.Item
                                label="Description"
                                name="description"
                                className='formItems alignItems'
                                rules={[{ required: true, message: 'Please input your description event!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Start date"
                                className='formItems alignItems'
                            >
                                <Input.Group compact>
                                    <Form.Item name="startDate" rules={[{ required: true, message: 'Please input your start date event!' }]} style={{ width: '50%' }}><DatePicker style={{ width: '100%' }} /></Form.Item>
                                    <Form.Item name="timeDate" rules={[{ required: true, message: 'Please input your start date event!' }]} style={{ width: '30%' }}><Input style={{ width: '100%' }} placeholder='Hora: 00:00' /></Form.Item>
                                    <Form.Item name="zonDate" rules={[{ required: true, message: 'Please input your start date event!' }]} style={{ width: '20%' }}><Select  style={{ width: '100%' }}>
                                        <Select.Option value="am">am</Select.Option>
                                        <Select.Option value="pm">pm</Select.Option>
                                    </Select></Form.Item>
                                </Input.Group>
                            </Form.Item>

                            <Form.Item
                                label="End date"
                                className='formItems alignItems'
                            >
                                <Input.Group compact>
                                    <Form.Item name="endDate" rules={[{ required: true, message: 'Please input your end date event!' }]} style={{ width: '50%' }}><DatePicker style={{ width: '100%' }} /></Form.Item>
                                    <Form.Item name="timeDate2" rules={[{ required: true, message: 'Please input your end date event!' }]} style={{ width: '30%' }}><Input style={{ width: '100%' }} placeholder='Hora: 00:00' /></Form.Item>
                                    <Form.Item name="zonDate2" rules={[{ required: true, message: 'Please input your end date event!' }]} style={{ width: '20%' }}><Select  style={{ width: '100%' }}>
                                        <Select.Option value="am">am</Select.Option>
                                        <Select.Option value="pm">pm</Select.Option>
                                    </Select></Form.Item>
                                </Input.Group>
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Register
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div> : <div></div>}
                {this.state.bulEditarEvento ? <div className='contenedorMensaje'>
                    <div className='contenedorFormEvento'>
                        <div className='x-salir' onClick={this.cerrarCrearEvento}><CloseOutlined style={{ fontSize: '15px' ,color: 'gray' }} /></div>
                        <Form name='formulario' className='formLogin' onFinish={this.formSucessEdit}>
                            <Form.Item
                                label="Title"
                                name="title2"
                                className='formItems alignItems'
                                rules={[{ required: true, message: 'Please input your title event!' }]}
                            >
                                <Input maxLength={2}/>
                            </Form.Item>

                            <Form.Item
                                label="Description"
                                name="description2"
                                className='formItems alignItems'
                                rules={[{ required: true, message: 'Please input your description event!' }]}
                            >
                                <Input />
                            </Form.Item>

                            <Form.Item
                                label="Start date"
                                className='formItems alignItems'
                            >
                                <Input.Group compact>
                                    <Form.Item name="startDate2" rules={[{ required: true, message: 'Please input your start date event!' }]} style={{ width: '50%' }}><DatePicker style={{ width: '100%' }} /></Form.Item>
                                    <Form.Item name="timeDate3" rules={[{ required: true, message: 'Please input your start date event!' }]} style={{ width: '30%' }}><Input style={{ width: '100%' }} placeholder='Hora: 00:00' /></Form.Item>
                                    <Form.Item name="zonDate3" rules={[{ required: true, message: 'Please input your start date event!' }]} style={{ width: '20%' }}><Select  style={{ width: '100%' }}>
                                        <Select.Option value="am">am</Select.Option>
                                        <Select.Option value="pm">pm</Select.Option>
                                    </Select></Form.Item>
                                </Input.Group>
                            </Form.Item>

                            <Form.Item
                                label="End date"
                                className='formItems alignItems'
                            >
                                <Input.Group compact>
                                    <Form.Item name="endDate2" rules={[{ required: true, message: 'Please input your end date event!' }]} style={{ width: '50%' }}><DatePicker style={{ width: '100%' }} /></Form.Item>
                                    <Form.Item name="timeDate4" rules={[{ required: true, message: 'Please input your end date event!' }]} style={{ width: '30%' }}><Input style={{ width: '100%' }} placeholder='Hora: 00:00' /></Form.Item>
                                    <Form.Item name="zonDate4" rules={[{ required: true, message: 'Please input your end date event!' }]} style={{ width: '20%' }}><Select  style={{ width: '100%' }}>
                                        <Select.Option value="am">am</Select.Option>
                                        <Select.Option value="pm">pm</Select.Option>
                                    </Select></Form.Item>
                                </Input.Group>
                            </Form.Item>

                            <Form.Item>
                                <Button type="primary" htmlType="submit">
                                    Edit event
                                </Button>
                            </Form.Item>
                        </Form>
                    </div>
                </div> : <div></div>}
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

export default DashboardMisEventos