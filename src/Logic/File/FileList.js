'use client';
import { useQuery, useMutation } from '@apollo/client';
import {
  GET_FILES,
  CREATE_FILE,
  DELETE_FILE,
  UPDATE_FILE,
} from '../Apollo/Queries'; // Ensure the correct path to your queries
import { useState } from 'react';

export default function FileList() {
  const { data, loading, error, refetch } = useQuery(GET_FILES, {
    pollInterval: 5000, // Automatically refetches data every 5 seconds
  });
  const [createFile] = useMutation(CREATE_FILE);
  const [deleteFile] = useMutation(DELETE_FILE);
  const [updateFile] = useMutation(UPDATE_FILE);

  const [fileName, setFileName] = useState('');
  const [fileContent, setFileContent] = useState('');
  const [folderId, setFolderId] = useState(null);
  const [editFileId, setEditFileId] = useState(null);
  const [editFileName, setEditFileName] = useState('');
  const [editFileContent, setEditFileContent] = useState('');

  const handleCreateFile = async () => {
    if (!folderId) {
      alert('Folder ID is required.');
      return;
    }
    try {
      await createFile({
        variables: {
          input: {
            title: fileName,
            content: fileContent,
            folderId,
          },
        },
      });
      refetch();
      setFileName('');
      setFileContent('');
      setFolderId(null);
    } catch (err) {
      console.error('Error creating file:', err);
      alert('Failed to create file. Please try again.');
    }
  };

  const handleDeleteFile = async (id) => {
    try {
      await deleteFile({ variables: { id } });
      refetch();
    } catch (err) {
      console.error('Error deleting file:', err);
      alert('Failed to delete file. Please try again.');
    }
  };

  const handleUpdateFile = async () => {
    try {
      await updateFile({
        variables: {
          id: editFileId,
          input: {
            title: editFileName,
            content: editFileContent,
          },
        },
      });
      refetch();
      setEditFileId(null);
      setEditFileName('');
      setEditFileContent('');
    } catch (err) {
      console.error('Error updating file:', err);
      alert('Failed to update file. Please try again.');
    }
  };

  if (loading) return <p>Loading files...</p>;
  if (error) return <p>Error loading files: {error.message}</p>;

  return (
    <div>
      <ul>
        {data.getFiles.map((file) => (
          <li key={file.id}>
            <strong>{file.title}</strong> - {file.content}
            <button onClick={() => handleDeleteFile(file.id)}>Delete</button>
            <button
              onClick={() => {
                setEditFileId(file.id);
                setEditFileName(file.title);
                setEditFileContent(file.content);
              }}
            >
              Edit
            </button>
          </li>
        ))}
      </ul>
      {editFileId && (
        <div>
          <h3>Edit File</h3>
          <input
            type="text"
            placeholder="File Title"
            value={editFileName}
            onChange={(e) => setEditFileName(e.target.value)}
          />
          <textarea
            placeholder="File Content"
            value={editFileContent}
            onChange={(e) => setEditFileContent(e.target.value)}
          />
          <button onClick={handleUpdateFile}>Save Changes</button>
          <button
            onClick={() => {
              setEditFileId(null);
              setEditFileName('');
              setEditFileContent('');
            }}
          >
            Cancel
          </button>
        </div>
      )}
      <h3>Create File</h3>
      <input
        type="text"
        placeholder="File Title"
        value={fileName}
        onChange={(e) => setFileName(e.target.value)}
      />
      <textarea
        placeholder="File Content"
        value={fileContent}
        onChange={(e) => setFileContent(e.target.value)}
      />
      <input
        type="number"
        placeholder="Folder ID"
        value={folderId || ''}
        onChange={(e) => setFolderId(Number(e.target.value))}
      />
      <button onClick={handleCreateFile}>Create File</button>
    </div>
  );
}
