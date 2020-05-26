import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import { ActivatedRoute } from "@angular/router";
import { NotesService } from "../services/notes.service";
import { Note } from "../interfaces/note";
import { Photo } from "../interfaces/photo";
import { PhotoService } from '../services/photo.service';
import { ActionSheetController } from '@ionic/angular'; 
import { Events } from '@ionic/angular';

@Component({
  selector: "app-detail",
  templateUrl: "./detail.page.html",
  styleUrls: ["./detail.page.scss"]
})
export class DetailPage implements OnInit {
  public note: Note;
  public item9: Photo;
  public item10: Note;
  public noteIdd: string;

  constructor(
    private route: ActivatedRoute,
    private notesService: NotesService,
    private navCtrl: NavController,
    public photoService: PhotoService,
    public actionSheetController: ActionSheetController,
    public events: Events
  ) {
    // Initialise placeholders
    this.note = {
      id: "",
      title: "",
      content: "",
      datetime: "",
      value: 0
    };

    this.item9 = {
      filepath: "",
      webviewPath: "",
      base64: ""
    }
  }

  ngOnInit() {
    this.photoService.loadSaved();

    // Get the id of the note from the URL
    let noteId = this.route.snapshot.paramMap.get("id");
    this.noteIdd = this.route.snapshot.paramMap.get("id");

    //Assign photo that matches given expense
    this.item9 = this.photoService.selectedExamplePhoto(this.noteIdd);

    // Check data laoded before retreiving expense
    // Handle the case where the expense is loaded directly via the URL:
    if (this.notesService.loaded) {
      this.note = this.notesService.getNote(noteId);
    } else {
      this.notesService.load().then(() => {
        this.note = this.notesService.getNote(noteId);
        //Ensures item9 is recreated when the page reloads.
        this.item9 = this.photoService.selectedExamplePhoto(this.noteIdd);
      });
    }
  }

  noteChanged() {
    this.notesService.save();
  }

  addNewButton() {
    if (this.item9) {
      this.photoService.deletePicture(this.item9, this.photoService.photos.indexOf(this.item9));
      this.photoService.addNewToGallery(this.noteIdd);
    } else {
      this.photoService.addNewToGallery(this.noteIdd);
    }
    this.photoService.loadSaved()
  }

  deleteExpense() {
    if (this.item9) {
      const Pindex = this.photoService.photos.indexOf(this.item9);
      this.notesService.deleteNote(this.note);
      this.photoService.deletePicture(this.item9, Pindex);
      this.navCtrl.navigateBack("/notes");
    } else
    {this.notesService.deleteNote(this.note);
     this.navCtrl.navigateBack("/notes")};

  }

  public async showActionSheet(photo, position) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Photos',
      buttons: [{
        text: 'Delete',
        role: 'destructive',
        icon: 'trash',
        handler: () => {
          this.photoService.deletePicture(photo, position);
        }
      }, {
        text: 'Cancel',
        icon: 'close',
        role: 'cancel',
        handler: () => {
          // Nothing to do, action sheet is automatically closed
         }
      }]
    });
    await actionSheet.present();
  }
}
