import { Injectable } from "@angular/core";
import {
  Plugins,
  CameraResultType,
  Capacitor,
  FilesystemDirectory,
  CameraPhoto,
  CameraSource,
  PushNotificationDeliveredList,
} from "@capacitor/core";
import { Platform } from "@ionic/angular";
import { NotesService } from "../services/notes.service";
import { Note } from "../interfaces/note";
import { load } from "@angular/core/src/render3";
import { NavController } from "@ionic/angular";
import { Events } from "@ionic/angular";

const { Camera, Filesystem, Storage } = Plugins;

@Injectable({
  providedIn: "root",
})

// Implementation of photo service based upon method ulitised in Angular documentation: 
// https://ionicframework.com/docs/angular/your-first-app

export class PhotoService {
  public photos: Photo[] = [];
  private PHOTO_STORAGE: string = "photos";
  private platform: Platform;
  public selectedphoto: photoId;
  public note33: Note;
  public notes: Note[] = [];
  public item9: Photo;

  constructor(
    platform: Platform,
    private notesService: NotesService,
    private navCtrl: NavController,
    public events: Events
  ) {
    this.platform = platform;
  }

  ngOnInit() {}

  public async loadSaved() {
    // Retrieve cached photo array data
    const photos = await Storage.get({ key: this.PHOTO_STORAGE });
    this.photos = JSON.parse(photos.value) || [];

    // If running as a web app:
    if (!this.platform.is("hybrid")) {
      // Display photo by reading into base64 format
      for (let photo of this.photos) {
        // Read each saved photo's data from the Filesystem
        const readFile = await Filesystem.readFile({
          path: photo.filepath,
          directory: FilesystemDirectory.Data,
        });

        // Web only: Save the photo into the base64 field
        photo.base64 = `data:image/jpeg;base64,${readFile.data}`;
      }
    }
  }

  public selectedExamplePhoto(arg: string) {
    let item1 = this.photos.find((i) => i.filepath === arg + ".jpeg");
    return item1;
  }

  public selectedExamplePhoto2(argument) {
    let item1 = this.photos.find((i) => i.filepath === argument);
    return item1;
  }

  /* Use the device camera to take a photo:
  // https://capacitor.ionicframework.com/docs/apis/camera
  
  // Store the photo data into permanent file storage:
  // https://capacitor.ionicframework.com/docs/apis/filesystem
  
  // Store a reference to all photo filepaths using Storage API:
  // https://capacitor.ionicframework.com/docs/apis/storage
  */

  public async loadId() {
    return this.notesService.load().then(() => {
      this.note33 = this.notesService.notes.slice(-1)[0];
      console.log("note ID: " + this.note33.id);
      return this.note33;
    });
  }

  public async addNewToGallery(arg: string) {
    // Take a photo
    const capturedPhoto = await Camera.getPhoto({
      resultType: CameraResultType.Uri, // file-based data; provides best performance
      source: CameraSource.Camera, // automatically take a new photo with the camera
      quality: 100, // highest quality (0 to 100)
    });

    const savedImageFile = await this.savePicture(capturedPhoto, arg);
    const eventualFileName = arg;

    // Add new photo to Photos array
    this.photos.unshift(savedImageFile);

    // Cache all photo data for future retrieval
    Storage.set({
      key: this.PHOTO_STORAGE,
      value: this.platform.is("hybrid")
        ? JSON.stringify(this.photos)
        : JSON.stringify(
            this.photos.map((p) => {
              // Don't save the base64 representation of the photo data,
              // since it's already saved on the Filesystem
              const photoCopy = { ...p };
              delete photoCopy.base64;

              return photoCopy;
            })
          ),
    });
  }

  // Save picture to file on device
  public async savePicture(cameraPhoto: CameraPhoto, argsave: string) {
    const options = {
      resultType: CameraResultType.Uri,
    };

    // Convert photo to base64 format, required by Filesystem API to save
    const base64Data = await this.readAsBase64(cameraPhoto);

    const argSaveEvent = argsave;

    const fileName = argSaveEvent + ".jpeg";

    this.loadId;

    const savedFile = await Filesystem.writeFile({
      path: fileName,
      data: base64Data,
      directory: FilesystemDirectory.Data,
    });

    const finalPhotoUri = await Filesystem.getUri({
      directory: FilesystemDirectory.Data,
      path: fileName,
    });

    let photoPath = Capacitor.convertFileSrc(finalPhotoUri.uri);
    //Reload photo view:
    window.location.reload();

    if (this.platform.is("hybrid")) {
      // Display the new image by rewriting the 'file://' path to HTTP
      // Details: https://ionicframework.com/docs/building/webview#file-protocol
      return {
        filepath: savedFile.uri,
        webviewPath: Capacitor.convertFileSrc(savedFile.uri),
      };
    } else {
      // Use webPath to display the new image instead of base64 since it's
      // already loaded into memory
      return {
        filepath: fileName,
        webviewPath: cameraPhoto.webPath,
      };
    }
  }

  // Read camera photo into base64 format based on the platform the app is running on
  private async readAsBase64(cameraPhoto: CameraPhoto) {
    // "hybrid" will detect Cordova or Capacitor
    if (this.platform.is("hybrid")) {
      // Read the file into base64 format
      const file = await Filesystem.readFile({
        path: cameraPhoto.path,
      });

      return file.data;
    } else {
      // Fetch the photo, read as a blob, then convert to base64 format
      const response = await fetch(cameraPhoto.webPath!);
      const blob = await response.blob();

      return (await this.convertBlobToBase64(blob)) as string;
    }
  }

  removePHOTO(argPhoto: Photo) {
    console.log("Photo deletion filepath: " + argPhoto.filepath);
    this.photos.forEach((item, index) => {
      if (item.filepath === argPhoto.filepath) this.photos.splice(index, 1);
    });
  }

  // Delete picture by removing it from reference data and the filesystem
  public async deletePicture(photo: Photo, position: number) {
    const holdingPosition = position;

    // Remove photo based upon matching filename:
    this.removePHOTO(photo);

    // Update photos array cache by overwriting the existing photo array
    Storage.set({
      key: this.PHOTO_STORAGE,
      value: JSON.stringify(this.photos),
    });

    // delete photo file from filesystem
    const filename = photo.filepath.substr(photo.filepath.lastIndexOf("/") + 1);
    await Filesystem.deleteFile({
      path: filename,
      directory: FilesystemDirectory.Data,
    });
  }

  convertBlobToBase64 = (blob: Blob) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onload = () => {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
}

interface Photo {
  filepath: string;
  webviewPath: string;
  base64?: string;
}

interface photoId {
  idname: string;
}
