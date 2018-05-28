import { StarterComponent } from './../starter/starter.component';
import { LoginComponent } from './../login/login.component';
import { TecnicosComponent } from './../tecnicos/tecnicos.component';
import { RecuperarPasswordComponent } from './../recuperar-password/recuperar-password.component';
import { PerfilComponent } from './../perfil/perfil.component';
import { ConfiguracionComponent } from './../configuracion/configuracion.component';
import { VerServicioComponent } from './../ver-servicio/ver-servicio.component';
import { NuevoClienteComponent } from './../nuevo-cliente/nuevo-cliente.component';
import { ServicioDetalleComponent } from './../servicio-detalle/servicio-detalle.component';
import { NuevoServicioComponent } from './../nuevo-servicio/nuevo-servicio.component';
import { BuscarServicioComponent } from './../buscar-servicio/buscar-servicio.component';
import { EditarServicioComponent } from './../editar-servicio/editar-servicio.component';
import { BusquedaClienteComponent } from './../busqueda-cliente/busqueda-cliente.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { BusquedaTecnicoComponent } from '../busqueda-tecnico/busqueda-tecnico.component';
import { InfoTecnicoComponent } from '../info-tecnico/info-tecnico.component';

const routes: Routes = [
  //{ path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '', component: LoginComponent },
  { path: 'main', component: StarterComponent },
  { path: 'addtecnico', component: TecnicosComponent },
  { path: 'recuperarpassword', component: RecuperarPasswordComponent },
  { path: 'perfil', component: PerfilComponent },
  { path: 'configuracion', component: ConfiguracionComponent },
  { path: 'verservicio', component: VerServicioComponent },
  { path: 'addcliente', component: NuevoClienteComponent },
  { path: 'serviciodetalle/:id', component: ServicioDetalleComponent },
  { path: 'nuevoservicio/:id', component: NuevoServicioComponent },
  { path: 'buscacarservicio', component: BuscarServicioComponent },
  { path: 'editarservicio/:id', component: EditarServicioComponent },
  { path: 'buscar_cliente', component: BusquedaClienteComponent },
  { path: 'buscar_tecnico', component: BusquedaTecnicoComponent },
  { path: 'info_tecnico/:id', component: InfoTecnicoComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
