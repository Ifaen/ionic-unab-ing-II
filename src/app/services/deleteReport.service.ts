import { Injectable } from "@angular/core";
import {
  ReportAlumbrado,
  ReportBasura,
  ReportIncendio,
  Report,
  ReportVehicular,
} from "../models/report.model";
import { AngularFirestore } from "@angular/fire/compat/firestore";
import { LoadingController, NavController } from "@ionic/angular";
import { CameraService } from "./camera.service";
import { doc } from "firebase/firestore";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { from } from "rxjs";
import { switchMap } from "rxjs/operators";
@Injectable({
  providedIn: "root",
})
export class ReportService {
  public formData:
    | ReportAlumbrado
    | ReportBasura
    | ReportIncendio
    | ReportVehicular;

  constructor(private firestore: AngularFirestore) {}

  getReport() {
    return this.firestore.collection("reports").snapshotChanges();
  }

  updateReport(docId: string, data: any) {
    return this.firestore.collection("reports").doc(docId).update(data);
  }

  deleteReport(docId: string) {
    return this.firestore.collection("reports").doc(docId).delete();
  }

  //   deleteCollection(collectionPath: string): Observable<void> {
  //     const collectionRef = this.firestore.collection("collectionPath");
  //     return collectionRef.snapshotChanges().pipe(
  //       map((actions) => {
  //         actions.forEach((action) => {
  //           const docRef = collectionRef.doc(action.payload.doc.id);
  //           docRef.delete();
  //         });
  //       })
  //     );
  //   }

  //BORRAR COLECCION COMPLETA EN FIREBASE
  //   deleteColection(collectionPath: string) {
  //     const collectionRef = this.firestore.collection(collectionPath).ref;
  //     return from(collectionRef.get()).pipe(
  //       switchMap((snapshot) => {
  //         const batch = this.firestore.firestore.batch();
  //         snapshot.docs.forEach((doc) => {
  //           batch.delete(doc.ref);
  //         });
  //         return from(batch.commit());
  //       })
  //     );
  //   }

  //BORRAR SUBCOLECCION EN FIREBASE
  deleteDocumentsByFieldValue(
    parentCollection: string,
    field: string,
    value: string
  ) {
    // Obtén la referencia a la colección principal con el filtro basado en el valor del campo específico
    const collectionRef = this.firestore.collection(parentCollection, (ref) =>
      ref.where(field, "==", value)
    ).ref;

    // Obtén los documentos que coinciden con el campo y valor especificados, y los elimina en un lote
    return from(collectionRef.get()).pipe(
      switchMap((snapshot) => {
        const batch = this.firestore.firestore.batch();
        snapshot.docs.forEach((doc) => {
          if (doc.data()[field] === value) {
            batch.delete(doc.ref);
          }
        });
        return from(batch.commit());
      })
    );
  }
}
