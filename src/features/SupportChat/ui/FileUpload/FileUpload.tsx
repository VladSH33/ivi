import React, { useRef, useState } from "react";
import classes from "./FileUpload.module.scss";
import UploadIcon from "@/shared/assets/icons/upload.svg";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert("Размер файла не должен превышать 10MB");
      return;
    }

    const allowedTypes = [
      'image/jpeg',
      'image/png', 
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ];

    if (!allowedTypes.includes(file.type)) {
      alert("Поддерживаются только изображения, PDF и текстовые документы");
      return;
    }

    setIsUploading(true);
    
    try {
      await onFileSelect(file);
    } catch (error) {
      console.error('Ошибка загрузки файла:', error);
      alert("Ошибка при загрузке файла");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className={classes.fileUpload}>
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileChange}
        accept="image/*,.pdf,.txt,.doc,.docx"
        style={{ display: 'none' }}
      />
      <button
        onClick={handleFileClick}
        disabled={isUploading}
        className={classes.uploadButton}
        title="Прикрепить файл"
      >
        {isUploading ? (
          <div className={classes.spinner} />
        ) : (
          <UploadIcon />
        )}
      </button>
      <span className={classes.uploadLabel}>
        {isUploading ? "Загрузка..." : "Файл"}
      </span>
    </div>
  );
}; 