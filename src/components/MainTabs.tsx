import React, { useState } from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { UploadFile } from './UploadFile';
import { FileList } from './FileList';
import DeleteRestoreTab from './DeleteRestoreTab';
import FolderManagementTab from './FolderManagementTab';
import RemoteUpload from './RemoteUpload';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel = ({ children, value, index }: TabPanelProps) => {
  return (
    <div hidden={value !== index} role="tabpanel" id={`tabpanel-${index}`} aria-labelledby={`tab-${index}`}>
      {value === index && <Box sx={{ p: 2 }}>{children}</Box>}
    </div>
  );
};

const MainTabs = () => {
  const [tabIndex, setTabIndex] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  return (
    <>
      <Tabs
        value={tabIndex}
        onChange={handleChange}
        aria-label="filelu api tabs"
        variant="scrollable"
        scrollButtons="auto"
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="Upload File" />
        <Tab label="Files List" />
        <Tab label="Restore" />
        <Tab label="Folder Management" />
        <Tab label="Remote Upload" />
      </Tabs>

      <TabPanel value={tabIndex} index={0}>
        <UploadFile />
      </TabPanel>

      <TabPanel value={tabIndex} index={1}>
        <FileList />
      </TabPanel>

      <TabPanel value={tabIndex} index={2}>
        <DeleteRestoreTab />
      </TabPanel>

      <TabPanel value={tabIndex} index={3}>
        <FolderManagementTab />
      </TabPanel>

      <TabPanel value={tabIndex} index={4}>
        <RemoteUpload />
      </TabPanel>
    </>
  );
};

export default MainTabs;
