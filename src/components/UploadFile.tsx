import React, { useState, useRef } from 'react';
import { getUploadServer, uploadFileToServer, setFileFolder } from '../api/fileluApi';
import { Button, LinearProgress, Typography } from '@mui/material';
import { FolderSelect } from './FolderSelect';
import { SnackbarMessage } from './SnackbarMessage';

export const UploadFile = () => {
  const [uploading, setUploading] = useState(false);
  const [folderId, setFolderId] = useState<number>(0);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'success'>('success');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const showSnackbar = (msg: string, severity: 'error' | 'success') => {
    setSnackbarMessage(msg);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const clearSnackbar = () => {
    setSnackbarOpen(false);
    setSnackbarMessage(null);
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    setUploading(true);
    clearSnackbar();

    try {
      const resServer = await getUploadServer();
      if (resServer.data.status !== 200) throw new Error('Failed to get upload server');

      const uploadUrl = resServer.data.result;
      const sess_id = resServer.data.sess_id;

      const formData = new FormData();
      formData.append('sess_id', sess_id);
      formData.append('utype', 'prem'); // or as applicable
      formData.append('file_0', e.target.files[0]);

      const resUpload = await uploadFileToServer(uploadUrl, formData);

      const uploadedFileCode = resUpload.data?.[0]?.file_code;
      if (!uploadedFileCode) throw new Error('Upload failed: no file code returned');

      if (folderId > 0) {
        await setFileFolder(uploadedFileCode, folderId);
      }

      showSnackbar(`File uploaded successfully! File code: ${uploadedFileCode}`, 'success');
    } catch (err) {
      showSnackbar(`Upload failed: ${(err as Error).message}`, 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <Typography variant="h6" gutterBottom sx={{mb:2}}>
        Upload File to Folder
      </Typography>

      <FolderSelect value={folderId} onChange={setFolderId} />

      <input
        type="file"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: 'none' }}
        disabled={uploading}
      />

      <Button variant="contained" onClick={onButtonClick} disabled={uploading}>
        Choose File
      </Button>

      {uploading && <LinearProgress sx={{ mt: 2 }} />}

      {/* Snackbar for messages */}
      <SnackbarMessage
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={() => setSnackbarOpen(false)}
      />
    </>
  );
};
