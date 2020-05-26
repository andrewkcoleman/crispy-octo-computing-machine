import { Component, OnInit } from "@angular/core";
import { AlertController, NavController } from "@ionic/angular";
import { NotesService } from "../services/notes.service";
import { PhotoService } from "../services/photo.service";
import { Router } from "@angular/router";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-home",
  templateUrl: "home.page.html",
  styleUrls: ["home.page.scss"],
})
export class HomePage implements OnInit {
  constructor(
    public notesService: NotesService,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private router: Router,
    private route: ActivatedRoute,
    private photoService: PhotoService
  ) {}

  ngOnInit() {
    this.notesService.load();
    //Required to show photos after a refresh.
    this.photoService.loadSaved();
  }

  expenseTally() {
    var tally = 0;
    this.notesService.notes.forEach(function (note) {
      //Double plus needed to avoid concantecation.
      tally = tally + +note.value;
    });
    return tally;
  }

  async validationAlert() {
    const alert = await this.alertCtrl.create({
      header: "Whoops!",
      subHeader: "...try again",
      message: "enter valid values for your expense",
      buttons: ["OK"],
    });

    await alert.present();
  }

  addNote() {
    this.alertCtrl
      .create({
        header: "Add new expense",
        message: "add details of your new expense...",
        inputs: [
          {
            type: "text",
            name: "title",
            placeholder: "description",
          },
          {
            type: "number",
            name: "value",
            placeholder: "£ value",
          },
        ],
        buttons: [
          {
            text: "Cancel",
          },
          {
            text: "Add",
            handler: (data) => {
              if (data.title.length > 0 && data.value > 0) {
                this.notesService.createExpense(data.title, data.value);
              } else {
                this.validationAlert();
                return false;
              }
            },
          },
        ],
      })
      .then((alert) => {
        alert.present();
      });
  }
}
