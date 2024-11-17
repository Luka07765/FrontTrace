'use client';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_FOLDERS,
  CREATE_FOLDER,
  DELETE_FOLDER,
  UPDATE_FOLDER,
} from '../quieries'; // Ensure the path is correct
import { useState } from 'react';

export default function FolderList() {
  const { data, loading, error, refetch } = useQuery(GET_FOLDERS, {
    pollInterval: 5000, // Automatically refetches data every 5 seconds
  });
  const [createFolder] = useMutation(CREATE_FOLDER);
  const [deleteFolder] = useMutation(DELETE_FOLDER);
  const [updateFolder] = useMutation(UPDATE_FOLDER);

  const [folderName, setFolderName] = useState('');
  const [parentFolderId, setParentFolderId] = useState(null);
  const [editFolderId, setEditFolderId] = useState(null);
  const [editFolderName, setEditFolderName] = useState('');

  const handleCreateFolder = async () => {
    try {
      await createFolder({
        variables: { input: { title: folderName, parentFolderId } },
      });
      refetch();
      setFolderName('');
      setParentFolderId(null);
    } catch (err) {
      console.error('Error creating folder:', err);
      alert('Failed to create folder. Please try again.');
    }
  };

  const handleDeleteFolder = async (id) => {
    try {
      await deleteFolder({ variables: { id } });
      refetch();
    } catch (err) {
      console.error('Error deleting folder:', err);
      alert('Failed to delete folder. Please try again.');
    }
  };

  const handleUpdateFolder = async () => {
    try {
      await updateFolder({
        variables: { id: editFolderId, input: { title: editFolderName } },
      });
      refetch();
      setEditFolderId(null);
      setEditFolderName('');
    } catch (err) {
      console.error('Error updating folder:', err);
      alert('Failed to update folder. Please try again.');
    }
  };

  if (loading) return <p>Loading folders...</p>;
  if (error) return <p>Error loading folders: {error.message}</p>;

  return (
    <div>
      <ul>
        {data.getFolders.map((folder) => (
          <li key={folder.id}>
            <strong>{folder.title}</strong> (Parent ID:{' '}
            {folder.parentFolderId ?? 'None'})
            <button onClick={() => handleDeleteFolder(folder.id)}>
              Delete
            </button>
            <button
              onClick={() => {
                setEditFolderId(folder.id);
                setEditFolderName(folder.title);
              }}
            >
              Edit
            </button>
          </li>
        ))}
      </ul>
      {editFolderId && (
        <div>
          <h3>Edit Folder</h3>
          <input
            type="text"
            placeholder="Folder Title"
            value={editFolderName}
            onChange={(e) => setEditFolderName(e.target.value)}
          />
          <button onClick={handleUpdateFolder}>Save Changes</button>
          <button
            onClick={() => {
              setEditFolderId(null);
              setEditFolderName('');
            }}
          >
            Cancel
          </button>
        </div>
      )}
      <h3>Create Folder</h3>
      <input
        type="text"
        placeholder="Folder Title"
        value={folderName}
        onChange={(e) => setFolderName(e.target.value)}
      />
      <input
        type="number"
        placeholder="Parent Folder ID"
        value={parentFolderId || ''}
        onChange={(e) => setParentFolderId(Number(e.target.value))}
      />
      <button onClick={handleCreateFolder}>Create Folder</button>
    </div>
  );
}
