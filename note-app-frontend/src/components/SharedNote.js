import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft } from 'lucide-react';

const API_BASE_URL = 'https://noteapp-nmlw.onrender.com/api';

const SharedNote = () => {
  const { shareId } = useParams();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchSharedNote();
  }, [shareId]);

  const fetchSharedNote = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/public/${shareId}`);
      setNote(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching shared note:', error);
      setError('Note not found or no longer available');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">Loading shared note...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="error-state">
          <h2>Note Not Found</h2>
          <p>{error}</p>
          <Link to="/" className="btn btn-primary">
            <ArrowLeft size={16} /> Go Back
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="shared-note-header">
        <Link to="/" className="btn btn-secondary">
          <ArrowLeft size={16} /> Back to My Notes
        </Link>
        <span className="shared-badge">Shared Note</span>
      </div>
      
      <div className="shared-note">
        <h1 className="shared-note-title">
          {note.title || 'Untitled Note'}
        </h1>
        
        <div className="shared-note-meta">
          <p>Created: {formatDate(note.createdAt)}</p>
          {note.updatedAt !== note.createdAt && (
            <p>Last updated: {formatDate(note.updatedAt)}</p>
          )}
        </div>
        
        <div className="shared-note-content">
          {note.content ? (
            <pre>{note.content}</pre>
          ) : (
            <p className="no-content">This note is empty.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SharedNote;
