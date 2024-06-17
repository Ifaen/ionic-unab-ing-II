import { Component, Input, OnInit, input } from "@angular/core";
import { CheckboxCustomEvent, IonModal } from "@ionic/angular";
import {
  ReportAlumbrado,
  ReportBasura,
  ReportIncendio,
  ReportVehicular,
} from "src/app/models/report.model";

@Component({
  selector: "app-information-modal",
  templateUrl: "./information-modal.component.html",
  styleUrls: ["./information-modal.component.scss"],
})
export class InformationModalComponent implements OnInit {
  @Input() modal!: IonModal;
  @Input() report:
    | ReportAlumbrado
    | ReportBasura
    | ReportIncendio
    | ReportVehicular;

  constructor() {}

  ngOnInit() {}
}
