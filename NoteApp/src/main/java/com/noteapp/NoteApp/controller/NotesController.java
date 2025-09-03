package com.noteapp.NoteApp.controller;

import com.noteapp.NoteApp.model.Notes;
import com.noteapp.NoteApp.service.NoteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class NotesController {

    @Autowired
    private NoteService noteService;

    @GetMapping("/notes")
    public List<Notes> getAllNotes() {
        return noteService.getAllNotes();
    }

    @GetMapping("/notes/{id}")
    public ResponseEntity<Notes> getNoteById(@PathVariable String id) {
        return noteService.getNoteById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/notes")
    public Notes createNote(@RequestBody Notes note) {
        return noteService.createNote(note);
    }

    @PutMapping("/notes/{id}")
    public ResponseEntity<Notes> updateNote(@PathVariable String id, @RequestBody Notes noteDetails) {
        return noteService.updateNote(id, noteDetails)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/notes/{id}")
    public ResponseEntity<Void> deleteNote(@PathVariable String id) {
        if (noteService.deleteNote(id)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }

    @PostMapping("/notes/{id}/share")
    public ResponseEntity<Map<String, String>> shareNote(@PathVariable String id) {
        return noteService.shareNote(id)
                .map(shareId -> ResponseEntity.ok(Map.of("shareId", shareId)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/public/{shareId}")
    public ResponseEntity<Notes> getSharedNote(@PathVariable String shareId) {
        return noteService.getSharedNote(shareId)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
}
