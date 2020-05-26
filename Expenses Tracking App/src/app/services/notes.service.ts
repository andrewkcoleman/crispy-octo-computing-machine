import { Injectable } from "@angular/core";
import { Storage } from "@ionic/storage";
import { Note } from "../interfaces/note";
import { ValueAccessor } from '@ionic/angular/dist/directives/control-value-accessors/value-accessor';
import { VirtualTimeScheduler } from 'rxjs';

@Injectable({
  providedIn: "root",
})

//Incorporates functionality from tutorials by Joshua Morony:
//https://github.com/joshuamorony

export class NotesService {
  public notes: Note[] = [];
  public loaded: boolean = false;
  public photoIdPath: photoId;
  public newNote: Note;

  constructor(private storage: Storage) {
    this.photoIdPath = {
      idname: "",
    }
  }

  load(): Promise<boolean> {
    // Return a promise for load()
    return new Promise(resolve => {
      // Load expenses in local storage
      this.storage.get("notes").then(notes => {
        // Only set this.notes to returned values if they exist.
        if (notes != null) {
          this.notes = notes;
        }

        // Data load check
        this.loaded = true;
        resolve(true);
      });
    });
  }

  save(): void {
    // Save the current array to storage
    this.storage.set("notes", this.notes);
  }

  getNote(id): Note {
    // Return the expense that has an id matching id given
    return this.notes.find(note => note.id === id);
  }

  createExpense(title, value): void {
    // Ensures creation of a unique id that is one larger than the current largest id
    let id = Math.max(...this.notes.map(note => parseInt(note.id)), 0) + 1;
    console.log(id);

    this.photoIdPath.idname = id.toString();
    //Fetch timestamp
    let datetime = Date();

    this.notes.push({
      id: id.toString(),
      title: title,
      content: "",
      datetime: datetime.toString(),
      value: value.toString()
    });

    this.save();
  }

  findPhotoId() {
    let id2 = Math.max(...this.notes.map(note => parseInt(note.id)), 0) + 1;
    const idret = id2.toString() 
    return id2

  }

  deleteNote(note): void {
    // Get the index of expense to be deleted
    let index = this.notes.indexOf(note);

    // Delete that element of the array and resave the data
    if (index > -1) {
      this.notes.splice(index, 1);
      this.save();
    }
  }
}

interface photoId {
  idname: string;
}
