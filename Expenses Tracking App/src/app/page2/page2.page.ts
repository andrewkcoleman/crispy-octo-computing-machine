import { Component } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { PhotoService } from '../services/photo.service';
import { OnInit } from "@angular/core";

// Page used to debug app during development:

@Component({
  selector: 'app-page2',
  templateUrl: 'page2.page.html',
  styleUrls: ['page2.page.scss']
})
export class Page2Page implements OnInit {

  constructor(public photoService: PhotoService, public actionSheetController: ActionSheetController) {}

  ngOnInit() {
    this.photoService.loadSaved();
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
