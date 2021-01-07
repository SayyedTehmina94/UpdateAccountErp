
import { NgModule } from '@angular/core';

import { appDeclarations } from './app.declarations';
import { appImports } from './app.imports';
import { appProviders } from './app.providers';

import { AppComponent } from './app.component';

@NgModule({
  declarations: appDeclarations,
  imports: appImports,
  providers: appProviders,
  bootstrap: [AppComponent]
})
export class AppModule { }
