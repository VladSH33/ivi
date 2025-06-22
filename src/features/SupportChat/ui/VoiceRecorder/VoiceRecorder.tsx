import React, { useState, useRef } from "react";
import classes from "./VoiceRecorder.module.scss";
import Micro from "@/shared/assets/icons/micro.svg";

interface VoiceRecorderProps {
  onVoiceRecord: (audioBlob: Blob, duration: number) => void;
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onVoiceRecord }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number>(0);

  const startRecording = async () => {
    try {
      console.log('Starting recording...');
      
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Ваш браузер не поддерживает запись аудио');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        } 
      });
      
      streamRef.current = stream;

      let mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'audio/webm';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'audio/mp4';
          if (!MediaRecorder.isTypeSupported(mimeType)) {
            mimeType = '';
          }
        }
      }

      const mediaRecorder = new MediaRecorder(stream, mimeType ? { mimeType } : {});
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType || 'audio/webm' });
        const actualRecordingTime = Date.now() - startTimeRef.current;
        const duration = Math.max(1, Math.round(actualRecordingTime / 1000));
        
        console.log('Recording stopped. Actual time:', actualRecordingTime, 'ms, Duration:', duration, 'seconds');
        
        if (audioChunksRef.current.length > 0) {
          onVoiceRecord(audioBlob, duration);
        }
        
        cleanup();
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);
      
      startTimeRef.current = Date.now();
      timerRef.current = setInterval(() => {
        const newTime = Date.now() - startTimeRef.current;
        setRecordingTime(newTime);
      }, 100);
      
    } catch (error) {
      console.error('Ошибка записи:', error);
      
      if (error instanceof Error) {
        switch (error.name) {
          case 'NotAllowedError':
            alert('Доступ к микрофону запрещен. Разрешите использование микрофона.');
            break;
          case 'NotFoundError':
            alert('Микрофон не найден. Подключите микрофон и попробуйте снова.');
            break;
          case 'NotSupportedError':
            alert('Запись не поддерживается. Убедитесь что сайт открыт по HTTPS.');
            break;
          default:
            alert(`Ошибка записи: ${error.message}`);
        }
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const cancelRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      audioChunksRef.current = [];
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const cleanup = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    setRecordingTime(0);
  };



  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (isRecording) {
    return (
      <div className={classes.voiceRecorder}>
        <div className={classes.recordingInterface}>          
          <div className={classes.recordingInfo}>
            <span className={classes.recordingTime}>
              {formatTime(recordingTime)}
            </span>
            <span className={classes.recordingStatus}>
              Запись...
            </span>
          </div>

          <div className={classes.recordingControls}>
            <button
              onClick={stopRecording}
              className={classes.stopButton}
              title="Отправить"
            >
              ✓
            </button>
            
            <button
              onClick={cancelRecording}
              className={classes.cancelButton}
              title="Отменить"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.voiceRecorder}>
      <button
        onClick={startRecording}
        className={classes.recordButton}
        title="Записать голосовое сообщение"
      >
        <Micro />
      </button>
      <span className={classes.recordLabel}>Голос</span>
    </div>
  );
}; 