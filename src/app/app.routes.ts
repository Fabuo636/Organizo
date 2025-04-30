import { Routes } from '@angular/router';
import { IndexComponent } from './pages/index/index.component';
import { InscriptionComponent } from './pages/inscription/inscription.component';
import { ConnexionComponent } from './pages/connexion/connexion.component';
import { HomeComponent } from './pages/home/home.component';
import { AgendaComponent } from './pages/agenda/agenda.component';

export const routes: Routes = [
    { path: '', component: IndexComponent },
    { path: 'inscription', component: InscriptionComponent },
    { path: 'connexion', component: ConnexionComponent },
    { path: 'home', component: HomeComponent },
    { path: 'agenda', component: AgendaComponent }
];
