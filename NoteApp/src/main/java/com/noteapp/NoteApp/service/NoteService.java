package com.noteapp.NoteApp.service;

import com.noteapp.NoteApp.model.Notes;
import com.noteapp.NoteApp.repo.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class NoteService {

    @Autowired
    private NoteRepository noteRepository;

    public List<Notes> getAllNotes() {
        return noteRepository.findAll();
    }

    public Optional<Notes> getNoteById(String id) {
        return noteRepository.findById(id);
    }

    public Notes createNote(Notes note) {
        LocalDateTime now = LocalDateTime.now();
        note.setCreatedAt(now);
        note.setUpdatedAt(now);
        return noteRepository.save(note);
    }

    public Optional<Notes> updateNote(String id, Notes noteDetails) {
        return noteRepository.findById(id).map(note -> {
            note.setTitle(noteDetails.getTitle());
            note.setContent(noteDetails.getContent());
            note.setUpdatedAt(LocalDateTime.now());
            return noteRepository.save(note);
        });
    }

    public boolean deleteNote(String id) {
        if (noteRepository.existsById(id)) {
            noteRepository.deleteById(id);
            return true;
        }
        return false;
    }

    public Optional<String> shareNote(String id) {
        return noteRepository.findById(id).map(note -> {
            if (note.getShareId() == null) {
                note.setShareId(UUID.randomUUID().toString());
            }
            note.setIsPublic(true);
            noteRepository.save(note);
            return note.getShareId();
        });
    }

    public Optional<Notes> getSharedNote(String shareId) {
        return noteRepository.findByShareId(shareId)
                .filter(note -> note.getIsPublic());
    }
}
