import React, { useEffect, useState } from 'react';
import {
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Typography,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Tooltip,
  Skeleton,
  Box,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FileCopyIcon from '@mui/icons-material/FileCopy';
import { motion, AnimatePresence } from 'framer-motion';

import { getFilesList, renameFile, cloneFile, removeFile } from '../api/fileluApi';
import { SnackbarMessage } from './SnackbarMessage';

interface File {
  name: string;
  file_code: string;
  downloads?: number;
  thumbnail?: string;
  size?: number;
}

export const FileList = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Rename dialog states
  const [renameOpen, setRenameOpen] = useState(false);
  const [renamingFile, setRenamingFile] = useState<File | null>(null);
  const [newName, setNewName] = useState('');

  // Delete confirmation dialog states
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [fileToDelete, setFileToDelete] = useState<File | null>(null);

  // Snackbar message state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'success'>('success');

  useEffect(() => {
    fetchFiles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchFiles = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getFilesList();
      if (res.data.msg !== 'OK') throw new Error('Failed to fetch files');
      setFiles(res.data.result.files);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  // Rename handlers
  const openRenameDialog = (file: File) => {
    setRenamingFile(file);
    setNewName(file.name);
    setRenameOpen(true);
    clearSnackbar();
  };

  const handleRename = async () => {
    if (!renamingFile) return;
    if (!newName.trim()) {
      showSnackbar('New name cannot be empty', 'error');
      return;
    }
    try {
      const res = await renameFile(renamingFile.file_code, newName.trim());
      if (res.data.status === 200) {
        showSnackbar('File renamed successfully', 'success');
        setRenameOpen(false);
        fetchFiles();
      } else {
        showSnackbar('Rename failed', 'error');
      }
    } catch (err) {
      showSnackbar(`Rename error: ${(err as Error).message}`, 'error');
    }
  };

  // Clone handler
  const handleClone = async (file_code: string) => {
    clearSnackbar();
    try {
      const res = await cloneFile(file_code);
      if (res.data.status === 200) {
        showSnackbar(`File cloned! New file code: ${res.data.result.filecode}`, 'success');
        fetchFiles();
      } else {
        showSnackbar('Clone failed', 'error');
      }
    } catch (err) {
      showSnackbar(`Clone error: ${(err as Error).message}`, 'error');
    }
  };

  // Delete handlers with confirmation dialog
  const openDeleteConfirmDialog = (file: File) => {
    setFileToDelete(file);
    setDeleteConfirmOpen(true);
    clearSnackbar();
  };

  const closeDeleteConfirmDialog = () => {
    setDeleteConfirmOpen(false);
    setFileToDelete(null);
  };

  const confirmDeleteFile = async () => {
    if (!fileToDelete) return;
    try {
      const res = await removeFile(fileToDelete.file_code);
      if (res.data.status === 200) {
        showSnackbar('File deleted', 'success');
        closeDeleteConfirmDialog();
        fetchFiles();
      } else {
        showSnackbar('Delete failed', 'error');
      }
    } catch (err) {
      showSnackbar(`Delete error: ${(err as Error).message}`, 'error');
    }
  };

  // Snackbar helpers
  const showSnackbar = (msg: string, severity: 'error' | 'success') => {
    setSnackbarMessage(msg);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const clearSnackbar = () => {
    setSnackbarOpen(false);
    setSnackbarMessage(null);
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes || bytes === 0) return '-';
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    const value = bytes / Math.pow(1024, i);
    return `${value.toFixed(2)} ${sizes[i]}`;
  };


  if (loading)
    return (
      <>
        <Typography variant="h6" gutterBottom>
          Files List
        </Typography>
        {[...Array(5)].map((_, i) => (
          <Skeleton key={i} variant="rectangular" height={70} sx={{ mb: 1, borderRadius: 2 }} />
        ))}
      </>
    );

  if (error)
    return (
      <Typography color="error" variant="body1">
        Error loading files - {error}
      </Typography>
    );

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Files List
      </Typography>

      <List component="ul" sx={{ p: 0 }}>
        <AnimatePresence>
          {files.map((file) => (
            <motion.li
              key={file.file_code}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              style={{ listStyle: 'none' }}
            >
              <ListItem
                secondaryAction={
                  <>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Tooltip title="Rename">
                        <IconButton edge="end" aria-label="rename" onClick={() => openRenameDialog(file)}>
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Clone">
                        <IconButton edge="end" aria-label="clone" onClick={() => handleClone(file.file_code)}>
                          <FileCopyIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton edge="end" aria-label="delete" color="error" onClick={() => openDeleteConfirmDialog(file)}>
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </>
                }
                sx={{
                  bgcolor: 'background.paper',
                  mb: 1,
                  borderRadius: 2,
                  boxShadow: 1,
                  '&:hover': {
                    boxShadow: 4,
                    bgcolor: 'action.hover',
                  },
                  transition: 'all 0.3s ease',
                }}
              >
                <ListItemAvatar>
                  <Avatar src={file.thumbnail || undefined} alt={file.name} />
                </ListItemAvatar>
                <ListItemText
                  primary={file.name}
                  secondary={`Size: ${formatFileSize(file.size)}${typeof file.downloads === 'number' ? ` | Downloads: ${file.downloads}` : ''}`}
                />
              </ListItem>
            </motion.li>
          ))}
        </AnimatePresence>
      </List>

      {/* Rename Dialog */}
      <Dialog open={renameOpen} onClose={() => setRenameOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Rename File</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New File Name"
            type="text"
            fullWidth
            variant="standard"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenameOpen(false)}>Cancel</Button>
          <Button onClick={handleRename} disabled={!newName.trim()}>
            Rename
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={closeDeleteConfirmDialog}>
        <DialogTitle>Delete File</DialogTitle>
        <DialogContent>Are you sure you want to delete this file?</DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteConfirmDialog}>Cancel</Button>
          <Button color="error" onClick={confirmDeleteFile}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

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
