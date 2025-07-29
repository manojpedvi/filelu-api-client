import React, { useEffect, useState } from 'react';
import { listDeletedFiles, restoreFile } from '../api/fileluApi';
import {
  Typography,
  Card,
  CardContent,
  CardActions,
  Box,
  Skeleton,
  IconButton,
  Tooltip
} from '@mui/material';
import RestoreIcon from '@mui/icons-material/Restore'; // Use this icon for restore button
import { SnackbarMessage } from './SnackbarMessage';
import { motion, AnimatePresence } from 'framer-motion';

const DeleteRestoreTab = () => {
  const [deletedFiles, setDeletedFiles] = useState<any[]>([]);
  const [loadingDeleted, setLoadingDeleted] = useState(false);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'success'>('success');

  const fetchDeletedFiles = async () => {
    setLoadingDeleted(true);
    try {
      const res = await listDeletedFiles();
      if (res.data.msg === 'OK') setDeletedFiles(res.data.result || []);
    } catch {
      showSnackbar('Failed to load deleted files', 'error');
    } finally {
      setLoadingDeleted(false);
    }
  };

  useEffect(() => {
    fetchDeletedFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRestore = async (file_code: string) => {
    try {
      await restoreFile(file_code);
      showSnackbar('File restored', 'success');
      await fetchDeletedFiles();
    } catch (err) {
      showSnackbar(`Restore error: ${(err as Error).message}`, 'error');
    }
  };

  const showSnackbar = (msg: string, severity: 'error' | 'success') => {
    setSnackbarMessage(msg);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Deleted Files
      </Typography>

      {loadingDeleted ? (
        <>
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={60} sx={{ mb: 2, borderRadius: 2 }} />
          ))}
        </>
      ) : deletedFiles.length === 0 ? (
        <Typography>No deleted files found.</Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <AnimatePresence>
            {deletedFiles.map((file) => (
              <motion.div
                key={file.file_code}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                style={{ width: '100%' }}
              >
            <Card key={file.file_code} elevation={3} sx={{ width: '100%', display: 'flex', alignItems: 'center', borderRadius: 2 }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography>{file.name}</Typography>
              </CardContent>
              <CardActions sx={{ justifyContent: 'flex-end' }}>
                <Tooltip title="Restore">
                  <IconButton
                    aria-label="restore file"
                    color="primary"
                    onClick={() => handleRestore(file.file_code)}
                    title="Restore"
                  >
                    <RestoreIcon />
                  </IconButton>
                </Tooltip>
                {/* 
                // If you prefer a button with text instead of icon, replace above with:
                <Button size="small" variant="contained" onClick={() => handleRestore(file.file_code)}>
                  Restore
                </Button>
                */}
              </CardActions>
            </Card>
          </motion.div>
      ))}
    </AnimatePresence>
        </Box>
      )}

      <SnackbarMessage
        open={snackbarOpen}
        message={snackbarMessage}
        severity={snackbarSeverity}
        onClose={() => setSnackbarOpen(false)}
      />
    </>
  );
};

export default DeleteRestoreTab;
