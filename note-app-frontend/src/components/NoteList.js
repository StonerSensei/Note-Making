import React from 'react';
import { Edit, Trash2, Share, Globe } from 'lucide-react';

const NoteList = ({ notes, loading, onEdit, onDelete, onShare }) => {
  if (loading) {
    return <div className="loading">Loading notes...</div>;
  }

  if (notes.length === 0) {
    return (
      <div className="empty-state">
        <h3>No notes yet</h3>
        <p>Create your first note to get started!</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="notes-grid">
      {notes.map((note) => (
        <div key={note.id} className="note-card">
          <div className="note-header">
            <h3 className="note-title">{note.title || 'Untitled'}</h3>
            {note.isPublic && (
              <Globe className="public-icon" size={16} title="Public Note" />
            )}
          </div>
          
          <div className="note-content">
            {note.content?.substring(0, 150)}
            {note.content?.length > 150 && '...'}
          </div>
          
          <div className="note-meta">
            <small>
                Created: {formatDate(note.createdAt)}
                {note.updatedAt !== note.createdAt && (
                    <>
                    <br />
                    Updated: {formatDate(note.updatedAt)}
                    </>
                )}
            </small>

          </div>
          
          <div className="note-actions">
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => onEdit(note)}
            >
              <Edit size={14} /> Edit
            </button>
            
            <button
              className="btn btn-sm btn-success"
              onClick={() => onShare(note.id)}
            >
              <Share size={14} /> Share
            </button>
            
            <button
              className="btn btn-sm btn-danger"
              onClick={() => {
                if (window.confirm('Are you sure you want to delete this note?')) {
                  onDelete(note.id);
                }
              }}
            >
              <Trash2 size={14} /> Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default NoteList;
