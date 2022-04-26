import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import 'antd/dist/antd.min.css'; // or 'antd/dist/antd.less'

import Inicio from '../pages/Login.js';
import Registro from '../pages/Registro.js';
import DashboardEventos from '../pages/DashboardEventos';
import DashboardMisEventos from '../pages/DashboardMisEventos';
import NotFound from '../pages/NotFound.js';
import PrivateRoute from '../components/PrivateRoute.js';

function App() {

  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Inicio />} />
        <Route path="/register" element={<Registro />} />
        <Route element={<PrivateRoute/>}>
          <Route path="/eventos" element={<DashboardEventos />} />
          <Route path="/miseventos" element={<DashboardMisEventos />} />
        </Route>
        <Route element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
