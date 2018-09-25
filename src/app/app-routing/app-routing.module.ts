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
import { VerRefaccionComponent } from '../ver-refaccion/ver-refaccion.component';
import { NuevoRefaccionComponent } from '../nuevo-refaccion/nuevo-refaccion.component';
import { AsignacionRefaccionesComponent } from '../asignacion-refacciones/asignacion-refacciones.component';
import { CalendariHomeComponent } from '../calendari-home/calendari-home.component';
import { UltimosServiciosComponent } from '../ultimos-servicios/ultimos-servicios.component';
import { ModificarPreciosComponent } from '../modificar-precios/modificar-precios.component';
import { NuevaVisitaComponent } from '../nueva-visita/nueva-visita.component';
import { DevolucionInventarioComponent } from '../devolucion-inventario/devolucion-inventario.component';
import { NgxPermissionsGuard } from 'ngx-permissions';

const routes: Routes = [
  //{ path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: '', component: LoginComponent },
  {
    path: 'main',
    component: StarterComponent
  },
  {
    path: 'addtecnico',
    component: TecnicosComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['Service Director', 'Technical Mangement'],
        redirectTo: '/main'
      }
    }
  },
  {
    path: 'recuperarpassword',
    component: RecuperarPasswordComponent
  },
  {
    path: 'perfil',
    component: PerfilComponent
  },
  {
    path: 'configuracion',
    component: ConfiguracionComponent
  },
  {
    path: 'verservicio',
    component: VerServicioComponent
  },
  {
    path: 'addcliente',
    component: NuevoClienteComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['Contact Center'],
        redirectTo: '/main'
      }
    }
  },
  {
    path: 'serviciodetalle/:id',
    component: ServicioDetalleComponent
  },
  {
    path: 'nuevoservicio/:id',
    component: NuevoServicioComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['Contact Center'],
        redirectTo: '/main'
      }
    }
  },
  { path: 'buscacarservicio', component: BuscarServicioComponent },
  {
    path: 'editarservicio/:id',
    component: EditarServicioComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['Contact Center'],
        redirectTo: '/main'
      }
    }
  },
  { path: 'buscar_cliente', component: BusquedaClienteComponent },
  { path: 'buscar_tecnico', component: BusquedaTecnicoComponent },
  { path: 'info_tecnico/:id', component: InfoTecnicoComponent },
  { path: 'ver_refacciones', component: VerRefaccionComponent },
  { path: 'nueva_refaccion', component: NuevoRefaccionComponent },
  { path: 'asignacion_refaccion', component: AsignacionRefaccionesComponent },
  { path: 'vercalendario', component: CalendariHomeComponent },
  { path: 'ultimosservicios', component: UltimosServiciosComponent },
  { path: 'modificarprecios', component: ModificarPreciosComponent },
  {
    path: 'nuevavisita/:id_cliente/:id',
    component: NuevaVisitaComponent,
    canActivate: [NgxPermissionsGuard],
    data: {
      permissions: {
        only: ['Contact Center'],
        redirectTo: '/main'
      }
    }
  },
  { path: 'devolucion', component: DevolucionInventarioComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
