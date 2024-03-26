import { Component, OnInit, inject } from '@angular/core';
import { FirestoreService } from 'src/app/services/firestore.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateProductComponent } from 'src/app/shared/component/add-update-product/add-update-product.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  firebaseSvc = inject(FirestoreService);
  utilSvc = inject(UtilsService);


  ngOnInit() {
  }

  //===== cerrar sesion============

  signOut() {
    this.firebaseSvc.signOut();
  }

  //======agregar o actualizar producto========

  addUdateProduct() {
    this.utilSvc.presentModal({
      component: AddUpdateProductComponent,
      cssClass: 'add-update-modal'
    })
  }


}
