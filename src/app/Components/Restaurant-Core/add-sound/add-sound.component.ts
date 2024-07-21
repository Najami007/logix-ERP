import { Component } from '@angular/core';

@Component({
  selector: 'app-add-sound',
  templateUrl: './add-sound.component.html',
  styleUrls: ['./add-sound.component.scss']
})
export class AddSoundComponent {



  onDocSelected(event: any) {



    let targetEvent = event.target;

    let file: File = targetEvent.files[0];

    let fileReader: FileReader = new FileReader();

    var Sound2:any = '';


    fileReader.readAsDataURL(file);
  
    fileReader.onload = (e) => {
      
      localStorage.setItem('snd', JSON.stringify(fileReader.result));
      
    }
   
    new Audio(Sound2).play()

    // this.beep()



  }

}
