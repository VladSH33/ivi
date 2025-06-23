import React, { useState, useRef, useEffect } from "react";
import classes from "./AudioPlayer.module.scss";

interface AudioPlayerProps {
  audioUrl: string;
  duration: number;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ audioUrl, duration }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(duration || 0);
  const [isDragging, setIsDragging] = useState(false);
  
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      const audioDuration = audio.duration;
      
      if (audioDuration && !isNaN(audioDuration) && isFinite(audioDuration) && audioDuration > 0) {
        setTotalDuration(audioDuration);
      } else if (duration > 0) {
        setTotalDuration(duration);
      } else {
        setTotalDuration(1);
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
      }
    };

    const handleError = (e: Event) => {
      console.error('Ошибка воспроизведения аудио:', e);
      setIsPlaying(false);
    };

    const handleCanPlay = () => {
      if (audio.duration && !isNaN(audio.duration) && isFinite(audio.duration) && audio.duration > 0) {
        setTotalDuration(audio.duration);
      }
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [audioUrl, duration]);

  useEffect(() => {
    if (duration !== undefined) {
      setTotalDuration(duration);
    }
  }, [duration]);

  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play()
        .then(() => setIsPlaying(true))
        .catch((error) => {
          console.error('Ошибка воспроизведения:', error);
          setIsPlaying(false);
        });
    }
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) return;
    
    const audio = audioRef.current;
    const progressBar = progressRef.current;
    if (!audio || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const progressWidth = rect.width;
    const clickRatio = Math.max(0, Math.min(1, clickX / progressWidth));

    let targetTime;
    if (totalDuration > 0) {
      targetTime = clickRatio * totalDuration;
    } else {

      const estimatedDuration = audio.duration || duration || 1;
      targetTime = clickRatio * estimatedDuration;
    }
    


    try {
      if (targetTime >= 0) {
        audio.currentTime = targetTime;
        setCurrentTime(targetTime);
      }
    } catch (error) {
      console.warn('Не удалось установить время воспроизведения:', error);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    handleProgressClick(e);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    
    const audio = audioRef.current;
    const progressBar = progressRef.current;
    if (!audio || !progressBar) return;

    const rect = progressBar.getBoundingClientRect();
    const moveX = e.clientX - rect.left;
    const progressWidth = rect.width;
    const moveRatio = Math.max(0, Math.min(1, moveX / progressWidth));
    
    let targetTime;
    if (totalDuration > 0) {
      targetTime = moveRatio * totalDuration;
    } else {
      const estimatedDuration = audio.duration || duration || 1;
      targetTime = moveRatio * estimatedDuration;
    }
    
    try {
      if (targetTime >= 0) {
        audio.currentTime = targetTime;
        setCurrentTime(targetTime);
      }
    } catch (error) {
      console.warn('Не удалось установить время воспроизведения:', error);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, totalDuration, duration]);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = totalDuration > 0 ? (currentTime / totalDuration) * 100 : 0;

  return (
    <div className={classes.audioPlayer}>
      <audio ref={audioRef} src={audioUrl} preload="metadata" />
      
      <div className={classes.controls}>
        <button
          onClick={togglePlayPause}
          className={classes.playButton}
          title={isPlaying ? "Пауза" : "Воспроизвести"}
        >
          {isPlaying ? "⏸️" : "▶️"}
        </button>
      </div>

      <div className={classes.progressContainer}>
        <div 
          ref={progressRef}
          className={classes.progressBar} 
          onClick={handleProgressClick}
          onMouseDown={handleMouseDown}
        >
          <div 
            className={classes.progressFill}
            style={{ width: `${progressPercentage}%` }}
          />
          <div 
            className={classes.progressHandle}
            style={{ left: `${progressPercentage}%` }}
          />
        </div>
      </div>

      <div className={classes.timeInfo}>
        <span className={classes.currentTime}>
          {formatTime(currentTime)}
        </span>
        <span className={classes.separator}>/</span>
        <span className={classes.totalTime}>
          {formatTime(totalDuration)}
        </span>
      </div>
    </div>
  );
}; 