import React, { useState } from 'react';
import { uploadRemoteUrl } from '../api/fileluApi';
import { TextField, Button, Typography } from '@mui/material';
import { SnackbarMessage } from './SnackbarMessage';

const RemoteUpload = () => {
  const [remoteUrl, setRemoteUrl] = useState('');
  const [loading, setLoading] = useState(false);

 // Snackbar state
const [snackbarOpen, setSnackbarOpen] = useState(false);
const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'success'>('success');

const showSnackbar = (msg:string,severity:'error'|'success')=>{
setSnackbarMessage(msg); 
setSnackbarSeverity(severity); 
setSnackbarOpen(true); 
};

const clearSnackbar=()=>{setSnackbarOpen(false);setSnackbarMessage(null);};

const handleSubmit = async () => {
  clearSnackbar();
  if (!remoteUrl.trim()) {
    showSnackbar('Please enter a URL', 'error');
    return;
  }

  // Validate URL format
  try {
    new URL(remoteUrl.trim());
  } catch {
    showSnackbar('Please enter a valid URL', 'error');
    return;
  }

  setLoading(true);
  try {
    const res = await uploadRemoteUrl(remoteUrl.trim());

    if (res.data.status === 200 && res.data.result?.filecode) {
      showSnackbar(`Remote upload started! File code: ${res.data.result.filecode}`, 'success');
    } else {
      showSnackbar(`Upload failed: ${res.data.msg || 'Unknown error'}`, 'error');
    }
  } catch (err) {
    showSnackbar(`Error: ${(err as Error).message}`, 'error');
  } finally {
    setLoading(false);
  }
};

return(
<div>
<Typography variant="h6" gutterBottom>Remote URL Upload</Typography>

<TextField 
label="File URL"
fullWidth
value={remoteUrl}
onChange={(e)=>setRemoteUrl(e.target.value)}
disabled={loading}
sx={{mb:2}}
placeholder="https://example.com/file.mp4"
/>

<Button variant="contained" onClick={handleSubmit} disabled={loading}>
Start Remote Upload
</Button>

{/* Snackbar */}
<SnackbarMessage 
open={snackbarOpen}
message={snackbarMessage}
severity={snackbarSeverity}
onClose={()=>setSnackbarOpen(false)}
/>

</div>);
};

export default RemoteUpload;
