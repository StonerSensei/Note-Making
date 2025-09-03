package com.noteapp.NoteApp.repo;

import com.noteapp.NoteApp.model.Notes;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface NoteRepository extends MongoRepository<Notes, String> {

    Optional<Notes> findByShareId(String shareId);
}
