import React, { useEffect, useState } from 'react';
import { getFolderList } from '../api/fileluApi';
import { FormControl, InputLabel, Select, MenuItem } from '@mui/material';

interface FolderSelectProps{
 value:number;
 onChange:(value:number)=>void;
}

export const FolderSelect=({value,onChange}:FolderSelectProps)=>{

const [folders,setFolders]=useState<{fld_id:number;name:string;}[]>([]);

useEffect(()=>{
 (async()=>{
   try{
     const res=await getFolderList();
     if(res.data.msg==='OK'){
       setFolders(res.data.result.folders||[]);
     }
   }catch{}
 })();
},[]);

return(
<FormControl fullWidth size='small' sx={{mb:2}}>
<InputLabel>Choose Folder</InputLabel>
<Select 
label='Choose Folder'
value={value}
onChange={(e)=>onChange(Number(e.target.value))}
>
<MenuItem value={0}>No folder</MenuItem>
{folders.map(f=>(
<MenuItem key={f.fld_id} value={f.fld_id}>{f.name}</MenuItem>))}
</Select>
</FormControl>);
};
