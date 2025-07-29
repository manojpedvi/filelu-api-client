import axios from 'axios';

const API_KEY = process.env.REACT_APP_FILELU_API_KEY!;
const BASE_URL = 'https://filelu.com/api';

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
});

// Upload APIs
export const getUploadServer = () =>
  api.get('/upload/server', { params: { key: API_KEY } });

export const uploadFileToServer = (uploadUrl: string, formData: FormData) =>
  axios.post(uploadUrl, formData);

export const uploadRemoteUrl = (url: string, fld_id = 0) =>
  api.get('/upload/url', {
    params: {
      key: API_KEY,
      url,          // Pass raw URL; axios handles encoding automatically
      fld_id,
    },
  });

// Check remote upload status
export const checkRemoteUploadStatus = () =>
  api.get('/file/status', { params: { key: API_KEY } });

// Download APIs
export const getDirectDownloadLink = (file_code: string) =>
  api.post(
    '/file/direct_link',
    new URLSearchParams({ file_code, key: API_KEY })
  );

// File Management APIs
export const getFileInfo = (file_code: string) =>
  api.get('/file/info', { params: { file_code, key: API_KEY } });

export const getFilesList = (
  page = 1,
  per_page = 25,
  fld_id = 0
) =>
  api.get('/file/list', {
    params: { page, per_page, fld_id, key: API_KEY },
  });

export const renameFile = (file_code: string, name: string) =>
  api.get('/file/rename', {
    params: { file_code, name, key: API_KEY },
  });

export const cloneFile = (file_code: string) =>
  api.get('/file/clone', {
    params: { file_code, key: API_KEY },
  });

export const setFileFolder = (file_code: string, fld_id: number) =>
  api.get('/file/set_folder', {
    params: { file_code, fld_id, key: API_KEY },
  });

export const setFileSharingOnlyMe = (file_code: string, only_me: 0 | 1) =>
  api.get('/file/only_me', {
    params: { file_code, only_me, key: API_KEY },
  });

export const setFilePassword = (file_code: string, file_password: string) =>
  api.get('/file/set_password', {
    params: { file_code, file_password, key: API_KEY },
  });

export const removeFile = (file_code: string) =>
  api.get('/file/remove', {
    params: { file_code, remove: 1, key: API_KEY },
  });

export const restoreFile = (file_code: string) =>
  api.get('/file/restore', {
    params: { file_code, restore: 1, key: API_KEY },
  });

export const listDeletedFiles = () =>
  api.get('/files/deleted', { params: { key: API_KEY } });

// Folder Management APIs
export const getFolderList = (
  page = 1,
  per_page = 25,
  fld_id = 0
) =>
  api.get('/folder/list', {
    params: { page, per_page, fld_id, key: API_KEY },
  });

export const createFolder = (parent_id = 0, name: string) =>
  api.get('/folder/create', {
    params: { parent_id, name, key: API_KEY },
  });

export const moveFolder = (fld_id: number, dest_fld_id: number) =>
  api.get('/folder/move', {
    params: { fld_id, dest_fld_id, key: API_KEY },
  });

export const copyFolder = (fld_id: number) =>
  api.get('/folder/copy', {
    params: { fld_id, key: API_KEY },
  });

export const deleteFolder = (fld_id: number) =>
  api.get('/folder/delete', {
    params: { fld_id, key: API_KEY },
  });

export const restoreFolder = (fld_id: number) =>
  api.get('/folder/restore', {
    params: { fld_id, key: API_KEY },
  });

export const renameFolder = (fld_id: number, name: string) =>
  api.get('/folder/rename', {
    params: { fld_id, name, key: API_KEY },
  });

export const setFolderPassword = (
  fld_token: string,
  fld_password: string
) =>
  api.get('/folder/set_password', {
    params: { fld_token, fld_password, key: API_KEY },
  });

export const setFolderSetting = (
  fld_id: number,
  filedrop: 0 | 1,
  fld_public: 0 | 1
) =>
  api.get('/folder/setting', {
    params: { fld_id, filedrop, fld_public, key: API_KEY },
  });
