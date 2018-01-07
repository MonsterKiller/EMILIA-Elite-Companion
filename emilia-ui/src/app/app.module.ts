import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { NgSlimScrollModule } from 'ngx-slimscroll';
import { SlimscrollCustomOptions } from './slimscroll-custom-options';

import { AppComponent } from './app.component';
import { EliteMissionsComponent } from './elite-missions/elite-missions.component';
import { ClockComponent } from './clock/clock.component';
import { EliteLocationComponent } from './elite-location/elite-location.component';
import { EliteRanksComponent } from './elite-ranks/elite-ranks.component';
import { EliteInventoryComponent } from './elite-inventory/elite-inventory.component';
import { EliteBalanceComponent } from './elite-balance/elite-balance.component';
import { EliteCommanderComponent } from './elite-commander/elite-commander.component';
import { EliteShipNameComponent } from './elite-ship-name/elite-ship-name.component';
import { EliteInstanceComponent } from './elite-instance/elite-instance.component';
import { EmiliaInfoComponent } from './emilia-info/emilia-info.component';

import { JournalSocketService } from './journal-socket.service';
import { JournalDataService } from './journal-data.service';
import { LocalStorageService } from './local-storage.service';

import { TimeleftPipe } from './timeleft.pipe';
import { TimeagoPipe } from './timeago.pipe';
import { OrderByPipe } from './order-by.pipe';

// const socketConfig: SocketIoConfig = { url: 'http://' + window.location.host, options: {} };
const socketConfig: SocketIoConfig = { url: 'http://localhost:3032', options: {} };

@NgModule({
  declarations: [
    AppComponent,
    EliteMissionsComponent,
    ClockComponent,
    EliteLocationComponent,
    EliteRanksComponent,
    EliteInventoryComponent,
    EliteBalanceComponent,
    EliteCommanderComponent,
    EliteShipNameComponent,
    EliteInstanceComponent,
    EmiliaInfoComponent,
    TimeleftPipe,
    TimeagoPipe,
    OrderByPipe
  ],
  imports: [
    BrowserModule,
    SocketIoModule.forRoot(socketConfig),
    NgSlimScrollModule
  ],
  providers: [
    JournalSocketService,
    JournalDataService,
    LocalStorageService,
    SlimscrollCustomOptions
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
