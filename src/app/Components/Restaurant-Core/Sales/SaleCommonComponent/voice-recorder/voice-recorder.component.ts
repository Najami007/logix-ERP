import { Component } from '@angular/core';

@Component({
  selector: 'app-voice-recorder',
  templateUrl: './voice-recorder.component.html',
  styleUrls: ['./voice-recorder.component.scss']
})
export class VoiceRecorderComponent {


  showRecorder = false;

  mediaRecorder!: MediaRecorder;

  chunks: Blob[] = [];

  audioBlob!: Blob;

  audioUrl: any;

  audioBase64 = '';

  isRecording = false;

  timer: any;

  seconds = 0;

  recordingTime = "00:00";



  async startRecording() {

    try {

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true
      });

      // this.mediaRecorder = new MediaRecorder(stream);
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

      alert("Microphone permission denied.");

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

    this.recordingTime = "00:00";

    this.timer = setInterval(() => {

      this.seconds++;

      const mins = Math.floor(this.seconds / 60);

      const secs = this.seconds % 60;

      this.recordingTime =
        String(mins).padStart(2, '0')
        + ":" +
        String(secs).padStart(2, '0');

    }, 1000);

  }



  convertToBase64() {

    const reader = new FileReader();

    reader.readAsDataURL(this.audioBlob);

    reader.onloadend = () => {

      this.audioBase64 = reader.result as string;

      console.log("Base64 Audio");

      console.log(this.audioBase64);

    };

  }



  downloadAudio() {

    const a = document.createElement('a');

    a.href = this.audioUrl;

    a.download = 'recording.webm';

    a.click();

  }



}
