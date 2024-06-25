import { Component } from "@angular/core";
import { ReportService } from "./services/deleteReport.service";
import { MapaComponent } from "./shared/component/mapa/mapa.component";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent {
  //constructor() {}

  constructor(private firestoreService: ReportService) {}

  //BORRA COLECCION COMPLETA

  //ngOnInit() {}

  //   this.firestoreService.deleteColection("reports").subscribe(
  //     () => {
  //       console.log("Colección users eliminada exitosamente!");
  //     },
  //     (error) => {
  //       console.error("Error al eliminar la colección: ", error);
  //     }
  //   );

  // }

  //BORRA UN REPORTE ESPECIFICO SEGUN EL NOMBRE Y VALOR DEL CAMPO

  ngOnInit() {
    //   const parentCollection = "reports"; // Nombre de la colección principal
    //   const field = "module"; // Nombre del campo que quieres usar para filtrar
    //   const value = "basura"; // Valor del campo que quieres usar para filtrar
    //   this.firestoreService
    //     .deleteDocumentsByFieldValue(parentCollection, field, value)
    //     .subscribe(
    //       () => {
    //         console.log("Documents deleted successfully");
    //       },
    //       (error) => {
    //         console.error("Error deleting documents: ", error);
    //       }
    //     );
  }
}
