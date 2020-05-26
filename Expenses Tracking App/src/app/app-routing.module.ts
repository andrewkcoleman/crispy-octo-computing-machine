import { NgModule } from "@angular/core";
import { PreloadAllModules, Routes, RouterModule } from "@angular/router";

const routes: Routes = [
  { path: "", redirectTo: "expenses", pathMatch: "full" },
  { path: "expenses", loadChildren: "./home/home.module#HomePageModule" },
  { path: "expenses/:id", loadChildren: "./detail/detail.module#DetailPageModule" },
  //new (seems to work)
  { path: 'debug', loadChildren: './page2/page2.module#Page2PageModule' },
  //Wildcard: redirects to/notes
  { path: '**', redirectTo: "expenses", pathMatch: "full" },
  //doesn't work
  // { path: "notes/*lemon", redirectTo: "notes", pathMatch: "full" }
  {path: 'debug', children: [
    {path: '66', loadChildren: './page2/page2.module#Page2PageModule'},
  ]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
