import React, { useEffect, useState } from 'react';
import {
  getFolderList,
  createFolder,
  renameFolder,
  deleteFolder,
} from '../api/fileluApi';
import {
  Typography,
  TextField,
  Button,
  Box,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Card,
  CardContent,
  CardActions,
  IconButton,
  Skeleton,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { SnackbarMessage } from './SnackbarMessage';
import { motion, AnimatePresence } from 'framer-motion';

interface Folder {
  fld_id: number;
  name: string;
}

const FolderManagementTab = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

  // Rename dialog state
  const [folderRenameOpen, setFolderRenameOpen] = useState(false);
  const [renameFolderId, setRenameFolderId] = useState<number | null>(null);
  const [renameFolderName, setRenameFolderName] = useState('');

  // Delete confirmation dialog state
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState<number | null>(null);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState<string | null>(null);
  const [snackbarSeverity, setSnackbarSeverity] = useState<'error' | 'success'>('success');

  const fetchFolders = async () => {
    setLoading(true);
    try {
      const res = await getFolderList();
      if (res.data.msg === 'OK') {
        setFolders(res.data.result.folders || []);
      } else {
        showSnackbar('Failed to load folders', 'error');
      }
    } catch {
      showSnackbar('Failed to load folders', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFolders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) return;
    try {
      await createFolder(0, newFolderName.trim());
      showSnackbar('Folder created', 'success');
      setNewFolderName('');
      await fetchFolders();
    } catch {
      showSnackbar('Failed to create folder', 'error');
    }
  };

  const startRenameFolder = (folderId: number, currentName: string) => {
    setRenameFolderId(folderId);
    setRenameFolderName(currentName);
    setFolderRenameOpen(true);
    clearSnackbar();
  };

  const handleRenameFolder = async () => {
    if (!renameFolderId || !renameFolderName.trim()) return;
    try {
      await renameFolder(renameFolderId, renameFolderName.trim());
      showSnackbar('Folder renamed', 'success');
      setFolderRenameOpen(false);
      setRenameFolderId(null);
      setRenameFolderName('');
      await fetchFolders();
    } catch {
      showSnackbar('Failed to rename folder', 'error');
    }
  };

  const openDeleteConfirm = (folderId: number) => {
    setFolderToDelete(folderId);
    setDeleteConfirmOpen(true);
    clearSnackbar();
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirmOpen(false);
    setFolderToDelete(null);
  };

  const confirmDeleteFolder = async () => {
    if (folderToDelete === null) return;
    try {
      await deleteFolder(folderToDelete);
      showSnackbar('Folder deleted', 'success');
      closeDeleteConfirm();
      await fetchFolders();
    } catch {
      showSnackbar('Failed to delete folder', 'error');
    }
  };

  const showSnackbar = (msg: string, severity: 'error' | 'success') => {
    setSnackbarMessage(msg);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const clearSnackbar = () => {
    setSnackbarOpen(false);
    setSnackbarMessage(null);
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Folder Management
      </Typography>

      {/* Create Folder */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <TextField
          label="New Folder Name"
          value={newFolderName}
          onChange={(e) => setNewFolderName(e.target.value)}
          size="small"
          sx={{ mr: 1 }}
        />
        <Button variant="contained" onClick={handleCreateFolder}>
          Create Folder
        </Button>
      </Box>

      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={60} sx={{ borderRadius: 2 }} />
          ))}
        </Box>
      ) : folders.length === 0 ? (
        <Typography>No folders found.</Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <AnimatePresence>
            {folders.map((folder) => (
              <motion.div
                key={folder.fld_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                style={{ width: '100%' }}
              >
              <Card key={folder.fld_id} elevation={3} sx={{ width: '100%', display: 'flex', alignItems: 'center', borderRadius: 2 }}>
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography>{folder.name}</Typography>
                </CardContent>
                <CardActions sx={{ justifyContent: 'flex-end' }}>
                  <IconButton
                    aria-label="rename folder"
                    onClick={() => startRenameFolder(folder.fld_id, folder.name)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    aria-label="delete folder"
                    color="error"
                    onClick={() => openDeleteConfirm(folder.fld_id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardActions>
              </Card>
            </motion.div>
            ))}
          </AnimatePresence>
        </Box>
      )}

      {/* Rename Folder Dialog */}
      <Dialog open={folderRenameOpen} onClose={() => setFolderRenameOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Rename Folder</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="New Folder Name"
            type="text"
            fullWidth
            variant="standard"
            value={renameFolderName}
            onChange={(e) => setRenameFolderName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setFolderRenameOpen(false)}>Cancel</Button>
          <Button onClick={handleRenameFolder} disabled={!renameFolderName.trim()}>
            Rename
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onClose={closeDeleteConfirm}>
        <DialogTitle>Delete Folder</DialogTitle>
        <DialogContent>Are you sure you want to delete this folder?</DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteConfirm}>Cancel</Button>
          <Button color="error" onClick={confirmDeleteFolder}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar Message */}
      {snackbarMessage && (
        <SnackbarMessage
          open={snackbarOpen}
          message={snackbarMessage}
          severity={snackbarSeverity}
          onClose={() => setSnackbarOpen(false)}
        />
      )}
    </>
  );
};

export default FolderManagementTab;
