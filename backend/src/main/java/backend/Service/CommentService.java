package backend.Service;

import backend.Model.Comment;
import backend.Repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CommentService {

    @Autowired
    private CommentRepository commentRepository;

    // 1. Get all comments (Global list)
    public List<Comment> getAllComments() {
        return commentRepository.findAll();
    }

    // 2. Get comments by specific user
    public List<Comment> getCommentsByUser(Long userId) {
        return commentRepository.findByUserId(userId);
    }

    // 3. Add a new comment
    public Comment addComment(Comment comment) {
        return commentRepository.save(comment);
    }

    // 4. Delete a comment
    public void deleteComment(Long id) {
        commentRepository.deleteById(id);
    }
}