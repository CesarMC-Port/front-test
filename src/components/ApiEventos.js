import React from 'react'
import { Link } from 'react-router-dom';
import { DeleteFilled,EditOutlined,HeartOutlined } from '@ant-design/icons';

function ApiEventos(props){

    //declaracion de variables
    let cargaEventos;
    let eventos = props.data.data;
    let relacion = props.data.data

    if(eventos !== undefined){
        //object.entries de datos obtenidos en la apirest
        eventos = Object.entries(props.data.data.data)
        relacion = Object.entries(props.data.data.follow)

        //tarjetas para eventos
        if(props.type === "eventos"){

            //carga de todos los eventos que existen con el modelo de tarjeta para eventos
            cargaEventos = eventos.map((evento, sumatoria)=>(
                <div className="cardNuevoEvento" key={sumatoria}>
                    <Link to={"/eventos/"+evento[1].Id_evento} className="linkCard" >
                        <h1>{evento[1].Title}</h1>
                        <p className='letrasCards'>{evento[1].Description}</p>
                        <p className='letrasCards'>{evento[1].StartDate}</p>
                        <p className='letrasCards'>{evento[1].EndDate}</p>
                    </Link>
                    {optionSeguir(evento[1].Id_user_organizer, evento[1].Id_evento )}
                    <div className='members'>Members:</div>
                    <select className='selectCard'>{miembrosFuncionEventos(evento[1].Id_evento)}</select>
                </div>
            ));

            //carga de los miembros que siguen este evento
            function miembrosFuncionEventos(id){
                let filtrado = relacion.filter(re=>{return re[1].Id_evento === id});
                let cargaMiembros = filtrado.map((relacion,sumatoria) =>(
                    <option key={sumatoria}>{relacion[1].Nombre}</option>
                ));
                return cargaMiembros
            }

            //carga del boton de seguir, este no se colocara si eres propietario de ese evento
            function optionSeguir(id, idEvento){
                let variableSeguir
                if(props.data.data.id === id){
                    variableSeguir = <div></div>
                }else{
                    variableSeguir = <div onClick={props.funcionAgregar} className="meGusta" id={idEvento}><HeartOutlined style={{ fontSize: '24px' ,color: 'red' }} id={idEvento} /></div>
                }
                return variableSeguir
            }
        }
        //tarjetas para mis eventos
        if(props.type === "miseventos"){

            //carga de todos los eventos de un usuario con el modelo de tarjeta para miseventos
            cargaEventos = eventos.map((evento, sumatoria)=>(
                <div className="cardNuevoEvento" key={sumatoria}>
                    <Link to={"/eventos/"+evento[1].Id_evento} className="linkCard">
                        <h1>{evento[1].Title}</h1>
                        <p className='letrasCards'>{evento[1].Description}</p>
                        <p className='letrasCards'>{evento[1].StartDate}</p>
                        <p className='letrasCards'>{evento[1].EndDate}</p>
                    </Link>
                    <div className='contenedorBotones'>
                        <div onClick={props.funcionEliminar} id={evento[1].Id_evento}><DeleteFilled style={{ fontSize: '24px' ,color: 'gray' }} id={evento[1].Id_evento}/></div>
                        <div onClick={props.funcionEditar} id={evento[1].Id_evento}><EditOutlined style={{ fontSize: '24px' ,color: 'gray' }} id={evento[1].Id_evento}/> </div>
                    </div>
                    <div className='members'>Members:</div>
                    <select className='selectCard'>{miembrosFuncionMisEventos(evento[1].Id_evento)}</select>
                </div>
            ));

            //carga de los miembros que siguen este evento
            function miembrosFuncionMisEventos(id){
                let filtrado = relacion.filter(re=>{return re[1].Id_evento === id});
                let cargaMiembros = filtrado.map((relacion,sumatoria) =>(
                    <option key={sumatoria}>{relacion[1].Nombre}</option>
                ));
                return cargaMiembros
            }
        }
    }else if(eventos === undefined){
        //si no se revio nada aun de la apirest
        cargaEventos = <p></p>
    }

    return cargaEventos
    
}

export default ApiEventos;

