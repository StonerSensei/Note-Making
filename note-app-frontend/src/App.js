import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import NoteList from './components/NoteList';
import NoteForm from './components/NoteForm';
import SharedNote from './components/SharedNote';
import './App.css';

const API_BASE_URL = 'https://noteapp-nmlw.onrender.com/api';


function App() {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('list');
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/notes`);
      setNotes(response.data);
    } catch (error) {
      console.error('Error fetching notes:', error);
      alert('Failed to fetch notes');
    } finally {
      setLoading(false);
    }
  };

  const createNote = async (noteData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/notes`, noteData);
      setNotes([...notes, response.data]);
      setCurrentView('list');
      return response.data;
    } catch (error) {
      console.error('Error creating note:', error);
      alert('Failed to create note');
      throw error;
    }
  };

  const updateNote = async (id, noteData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/notes/${id}`, noteData);
      setNotes(notes.map(note => note.id === id ? response.data : note));
      setCurrentView('list');
      setEditingNote(null);
      return response.data;
    } catch (error) {
      console.error('Error updating note:', error);
      alert('Failed to update note');
      throw error;
    }
  };

  const deleteNote = async (id) => {
    try {
      await axios.delete(`${API_BASE_URL}/notes/${id}`);
      setNotes(notes.filter(note => note.id !== id));
    } catch (error) {
      console.error('Error deleting note:', error);
      alert('Failed to delete note');
    }
  };

  const shareNote = async (id) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/notes/${id}/share`);
      const shareUrl = `${window.location.origin}/shared/${response.data.shareId}`;
      
      await fetchNotes();
      
      navigator.clipboard.writeText(shareUrl);
      alert(`Note shared! Link copied to clipboard: ${shareUrl}`);
      
      return response.data.shareId;
    } catch (error) {
      console.error('Error sharing note:', error);
      alert('Failed to share note');
    }
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/shared/:shareId" element={<SharedNote />} />
          <Route path="/*" element={
            <div className="container">
              <header className="header">
                <h1>My Notes</h1>
                <button 
                  className="btn btn-primary"
                  onClick={() => setCurrentView('create')}
                >
                  + New Note
                </button>
              </header>

              {currentView === 'list' && (
                <NoteList
                  notes={notes}
                  loading={loading}
                  onEdit={(note) => {
                    setEditingNote(note);
                    setCurrentView('edit');
                  }}
                  onDelete={deleteNote}
                  onShare={shareNote}
                />
              )}

              {currentView === 'create' && (
                <NoteForm
                  onSubmit={createNote}
                  onCancel={() => setCurrentView('list')}
                />
              )}

              {currentView === 'edit' && editingNote && (
                <NoteForm
                  note={editingNote}
                  onSubmit={(data) => updateNote(editingNote.id, data)}
                  onCancel={() => {
                    setCurrentView('list');
                    setEditingNote(null);
                  }}
                  isEditing={true}
                />
              )}
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
