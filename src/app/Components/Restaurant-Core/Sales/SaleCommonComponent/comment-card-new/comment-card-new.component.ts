import { HttpClient } from '@angular/common/http';
import { Component, EventEmitter, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { GlobalDataModule } from 'src/app/Shared/global-data/global-data.module';
import { NotificationService } from 'src/app/Shared/service/notification.service';
import { environment } from 'src/environments/environment.development';

@Component({
  selector: 'app-comment-card-new',
  templateUrl: './comment-card-new.component.html',
  styleUrls: ['./comment-card-new.component.scss']
})
export class CommentCardNewComponent {




    @Output() saveEmitter = new EventEmitter();


    constructor(
        private http: HttpClient,
        private msg: NotificationService,
    
        public global: GlobalDataModule,
        private dialogue: MatDialog,
        private route: Router
      ) {
       
    
    
      }
  


  // ===========================
  // UI
  // ===========================

  showRecorder = true;

  feedback = '';

  selectedEmoji = 0;

  recordingTime = '00:00';

  isRecording = false;

  // ===========================
  // Customer
  // ===========================

  customer = {

    name: '',

    email: '',

    phone: ''

  };

  // ===========================
  // Ratings
  // ===========================

  ratings = [
    {
      title: 'Food Quality',
      rating: 0,
    },
    {
      title: 'Service',
      rating: 0,
    },
    {
      title: 'Ambience',
      rating: 0,
    },
    {
      title: 'Cleanliness',
      rating: 0,
    },
    {
      title: 'Value For Money',
      rating: 0,
    },
  ];




  emojis = [

    {
      icon: '😡',
      label: 'Terrible',
      value: 1
    },

    {
      icon: '😞',
      label: 'Poor',
      value: 2
    },

    {
      icon: '😐',
      label: 'Average',
      value: 3
    },

    {
      icon: '😊',
      label: 'Good',
      value: 4
    },

    {
      icon: '🤩',
      label: 'Excellent',
      value: 5
    }

  ];

  // ===========================
  // Voice Recording
  // ===========================

  mediaRecorder!: MediaRecorder;

  chunks: Blob[] = [];

  audioBlob!: Blob;

  audioUrl: any;

  audioBase64 = '';

  timer: any;

  seconds = 0;

  // ===========================
  // Emoji
  // ===========================

  selectEmoji(item: any) {

    this.selectedEmoji = item.value;

  }



  // ===========================
  // Voice Recorder
  // ===========================

  async startRecording() {

    try {

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });

      this.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });

      this.chunks = [];

      this.mediaRecorder.ondataavailable = (event: any) => {

        if (event.data.size > 0) {

          this.chunks.push(event.data);

        }

      };

      this.mediaRecorder.onstop = () => {

        this.audioBlob = new Blob(this.chunks, {
          type: 'audio/webm'
        });

        this.audioUrl = URL.createObjectURL(this.audioBlob);

        this.convertToBase64();

      };

      this.mediaRecorder.start();

      this.isRecording = true;

      this.startTimer();

    }

    catch (err) {

      alert('Please allow microphone permission.');

      console.log(err);

    }

  }

  stopRecording() {

    this.mediaRecorder.stop();

    this.isRecording = false;

    clearInterval(this.timer);

  }

  startTimer() {

    this.seconds = 0;

    this.recordingTime = '00:00';

    this.timer = setInterval(() => {

      this.seconds++;

      const min = Math.floor(this.seconds / 60);

      const sec = this.seconds % 60;

      this.recordingTime =
        String(min).padStart(2, '0')
        + ':'
        + String(sec).padStart(2, '0');

    }, 1000);

  }

  convertToBase64() {

    const reader = new FileReader();

    reader.readAsDataURL(this.audioBlob);

    reader.onload = () => {

      const result = reader.result as string;

      this.audioBase64 = result.split(',')[1];

      console.log(this.audioBase64);

    };

  }

  deleteRecording() {

    this.audioBlob = undefined as any;

    this.audioUrl = null;

    this.audioBase64 = '';

    this.recordingTime = '00:00';

  }

  // ===========================
  // Submit
  // ===========================

  submitFeedback() {

  

  }

  // ===========================
  // Reset
  // ===========================

  resetForm() {

    this.selectedEmoji = 0;

    this.feedback = '';

    this.customer = {

      name: '',

      email: '',

      phone: ''

    };

    this.ratings = []

    this.deleteRecording();

  }

}
