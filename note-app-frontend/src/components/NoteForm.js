import React, { useState } from 'react';
import { Save, X } from 'lucide-react';

const NoteForm = ({ note, onSubmit, onCancel, isEditing = false }) => {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim() && !content.trim()) {
      alert('Please enter a title or content');
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        title: title.trim(),
        content: content.trim()
      });
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="note-form-container">
      <div className="form-header">
        <h2>{isEditing ? 'Edit Note' : 'Create New Note'}</h2>
        <button className="btn btn-secondary" onClick={onCancel}>
          <X size={16} /> Cancel
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="note-form">
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter note title..."
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <label htmlFor="content">Content</label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write your note content here..."
            className="form-textarea"
            rows="10"
          />
        </div>
        
        <button 
          type="submit" 
          className="btn btn-primary"
          disabled={loading}
        >
          <Save size={16} />
          {loading ? 'Saving...' : (isEditing ? 'Update Note' : 'Save Note')}
        </button>
      </form>
    </div>
  );
};

export default NoteForm;
