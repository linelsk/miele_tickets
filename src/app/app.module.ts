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
import { CalendarModule } from 'angular-calendar';
import { DemoUtilsModule } from './demo-utils/module';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';

//Chips
import { TagInputModule } from 'ngx-chips';
//
//Data table
//
import { AppRoutingModule } from './app-routing/app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule, MatPaginatorIntl } from '@angular/material';
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
import { NuevoClienteComponent } from './nuevo-cliente/nuevo-cliente.component';
import { ServicioDetalleComponent } from './servicio-detalle/servicio-detalle.component';
import { NuevoServicioComponent, DialogFactura, DialogIbsDialog, DialogAgenda } from './nuevo-servicio/nuevo-servicio.component';
import { BuscarServicioComponent } from './buscar-servicio/buscar-servicio.component';
import { Daterangepicker } from 'ng2-daterangepicker';
import { EditarServicioComponent, DialogEditarEstatus, DialogCancelarEstatus, DialogFinal } from './editar-servicio/editar-servicio.component';
import { FocusDirective } from './focus.directive';

//light box
import { LightboxModule } from 'angular2-lightbox';

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
    DialogFactura,
    DialogIbsDialog,
    DialogAgenda,
    DialogEditarEstatus,
    DialogCancelarEstatus,
    DialogFinal,
    BuscarServicioComponent,
    EditarServicioComponent,
    FocusDirective
  ],
  entryComponents: [DialogFactura, DialogIbsDialog, DialogAgenda, DialogEditarEstatus, DialogCancelarEstatus, DialogFinal],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    CalendarModule.forRoot(),
    CalendarWeekHoursViewModule,
    DemoUtilsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpModule,
    TagInputModule,
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
