import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import localeEs from '@angular/common/locales/es';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'; // <-- NgModel lives here
import { HttpClientModule } from '@angular/common/http';
import { HttpModule, Http } from '@angular/http';
import { TextMaskModule } from 'angular2-text-mask';
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
import { CalendarWeekHoursViewModule } from './modules/calendar-week-hours-view/calendar-week-hours-view.module';
//import { CalendarMonthModule } from './modules/month/calendar-month.module';
import { CalendarModule } from 'angular-calendar';
import { DemoUtilsModule } from './demo-utils/module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule } from '@angular/material/chips';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatGridListModule } from '@angular/material/grid-list';

//Chips
//import { TagInputModule } from 'ngx-chips';
//
//Data table
//
import { NgxPermissionsModule } from 'ngx-permissions';
import { AppRoutingModule } from './app-routing/app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatPaginatorIntl, MatNativeDateModule } from '@angular/material';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatChipInputEvent } from '@angular/material';
import { MatRadioModule } from '@angular/material/radio';
import { MatTabsModule } from '@angular/material/tabs';
import { MatDividerModule } from '@angular/material/divider';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { getDutchPaginatorIntl } from './buscar-servicio/dutch-paginator-intl';

//Menu lateral y header 
import { AppComponent } from './app.component';
import { StarterComponent } from './starter/starter.component';
import { StarterHeaderComponent } from './starter/starter-header/starter-header.component';
import { StarterLeftSideComponent } from './starter/starter-left-side/starter-left-side.component';
import { StarterContentComponent } from './starter/starter-content/starter-content.component';
import { StarterFooterComponent } from './starter/starter-footer/starter-footer.component';
import { StarterControlSidebarComponent } from './starter/starter-control-sidebar/starter-control-sidebar.component';
//Login
import { LoginComponent } from './login/login.component';
//Servicio
import { DatosService } from './datos.service';
//Admin
import { TecnicosComponent } from './tecnicos/tecnicos.component';
import { RecuperarPasswordComponent } from './recuperar-password/recuperar-password.component';
import { PerfilComponent } from './perfil/perfil.component';
import { ConfiguracionComponent } from './configuracion/configuracion.component';
import { VerServicioComponent } from './ver-servicio/ver-servicio.component';
import { NuevoClienteComponent, DialogIbsCliente } from './nuevo-cliente/nuevo-cliente.component';
import { ServicioDetalleComponent } from './servicio-detalle/servicio-detalle.component';
import { NuevoServicioComponent, DialogIbsDialog } from './nuevo-servicio/nuevo-servicio.component';
import { BuscarServicioComponent } from './buscar-servicio/buscar-servicio.component';
import { Daterangepicker } from 'ng2-daterangepicker';
import { EditarServicioComponent, DialogEditarEstatus, DialogCancelarEstatus, DialogEditarEstatusVisita, DialogFinal, DialogValidacionNo_visitas } from './editar-servicio/editar-servicio.component';
import { FocusDirective } from './focus.directive';

//light box
import { LightboxModule } from 'angular2-lightbox';
import { BusquedaClienteComponent } from './busqueda-cliente/busqueda-cliente.component';
import { BusquedaTecnicoComponent } from './busqueda-tecnico/busqueda-tecnico.component';
import { InfoTecnicoComponent, DialogEditarRefaccionTecnico, DialogEliminarRefaccionTecnico } from './info-tecnico/info-tecnico.component';
import { DialogTroubleshootingComponent } from './dialogs/dialog-troubleshooting/dialog-troubleshooting.component';
import { VerRefaccionComponent, DialogEditarRefaccion, DialogAsignarRefaccion, DialogEliminarRefaccion, DialogCantidadRefaccion } from './ver-refaccion/ver-refaccion.component';
import { NuevoRefaccionComponent } from './nuevo-refaccion/nuevo-refaccion.component';
import { AsignacionRefaccionesComponent } from './asignacion-refacciones/asignacion-refacciones.component';
import { CalendarioComponent } from './calendario/calendario.component';
import { DialogVisitaHoraClienteComponent } from './dialogs/dialog-visita-hora-cliente/dialog-visita-hora-cliente.component';
import { CalendariHomeComponent } from './calendari-home/calendari-home.component';
import { UltimosServiciosComponent } from './ultimos-servicios/ultimos-servicios.component';
import { ModificarPreciosComponent } from './modificar-precios/modificar-precios.component';
import { DialogNuevoGrupoPrecioComponent } from './dialogs/dialog-nuevo-grupo-precio/dialog-nuevo-grupo-precio.component';
import { DialogEditarGrupoPrecioComponent } from './dialogs/dialog-editar-grupo-precio/dialog-editar-grupo-precio.component';
import { DialogEditarPrecioRefaccionComponent } from './dialogs/dialog-editar-precio-refaccion/dialog-editar-precio-refaccion.component';
import { NuevaVisitaComponent } from './nueva-visita/nueva-visita.component';
import { DevolucionInventarioComponent } from './devolucion-inventario/devolucion-inventario.component';

registerLocaleData(localeFr);
registerLocaleData(localeEs);

@NgModule({
  declarations: [
    AppComponent,
    StarterComponent,
    StarterHeaderComponent,
    StarterLeftSideComponent,
    StarterContentComponent,
    StarterFooterComponent,
    StarterControlSidebarComponent,
    LoginComponent,
    TecnicosComponent,
    RecuperarPasswordComponent,
    PerfilComponent,
    ConfiguracionComponent,
    VerServicioComponent,
    NuevoClienteComponent,
    ServicioDetalleComponent,
    NuevoServicioComponent,
    DialogIbsDialog,
    DialogIbsCliente,
    DialogEditarEstatus,
    DialogEditarEstatusVisita,
    DialogCancelarEstatus,
    DialogFinal,
    DialogValidacionNo_visitas,
    DialogEditarRefaccion,
    DialogAsignarRefaccion,
    DialogEliminarRefaccion,
    DialogEditarRefaccionTecnico,
    DialogEditarRefaccionTecnico,
    DialogEliminarRefaccionTecnico,
    DialogCantidadRefaccion,
    BuscarServicioComponent,
    EditarServicioComponent,
    FocusDirective,
    BusquedaClienteComponent,
    BusquedaTecnicoComponent,
    InfoTecnicoComponent,
    DialogTroubleshootingComponent,
    VerRefaccionComponent,
    NuevoRefaccionComponent,
    AsignacionRefaccionesComponent,
    CalendarioComponent,
    DialogVisitaHoraClienteComponent,
    CalendariHomeComponent,
    UltimosServiciosComponent,
    ModificarPreciosComponent,
    DialogNuevoGrupoPrecioComponent,
    DialogEditarGrupoPrecioComponent,
    DialogEditarPrecioRefaccionComponent,
    NuevaVisitaComponent,
    DevolucionInventarioComponent
  ],
  entryComponents: [DialogIbsDialog, DialogIbsCliente, DialogEditarEstatus, DialogEditarEstatusVisita, DialogCancelarEstatus, DialogFinal, DialogValidacionNo_visitas, DialogEditarRefaccion, DialogAsignarRefaccion, DialogEliminarRefaccion, DialogEditarRefaccionTecnico, DialogEliminarRefaccionTecnico, DialogCantidadRefaccion, DialogTroubleshootingComponent, CalendarioComponent, DialogVisitaHoraClienteComponent, DialogNuevoGrupoPrecioComponent, DialogEditarGrupoPrecioComponent, DialogEditarPrecioRefaccionComponent],
  imports: [
    BrowserModule,
    NgxPermissionsModule.forRoot(),
    AppRoutingModule,
    FormsModule,
    CalendarModule.forRoot(),
    CalendarWeekHoursViewModule,
    //CalendarMonthModule,
    DemoUtilsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpModule,
    //TagInputModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatCardModule,
    MatDialogModule,
    MatAutocompleteModule,
    MatInputModule,
    MatSlideToggleModule,
    MatRadioModule,
    MatTabsModule,
    MatDividerModule,
    TextMaskModule,
    MatTableModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatSelectModule,
    MatIconModule,
    MatExpansionModule,
    MatChipsModule,
    MatDatepickerModule,
    MatGridListModule,
    MatNativeDateModule,
    NgProgressModule.forRoot({
      spinnerPosition: 'right',
      color: '#A5000D',
      thick: true
    }),
    NgProgressHttpModule,
    Daterangepicker,
    LightboxModule
  ],
  exports: [MatButtonModule, MatCheckboxModule],
  providers: [{ provide: MatPaginatorIntl, useValue: getDutchPaginatorIntl() }, DatosService],
  bootstrap: [AppComponent]
})
export class AppModule { }
