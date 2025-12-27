package backend.Controller;

import backend.Model.Comment;
import backend.Repository.CommentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/comments")
@CrossOrigin(origins = "http://localhost:3000") // Ensure Port matches React
public class CommentController {

    @Autowired
    private CommentRepository commentRepository;

    // 👇 CHANGED: Get comments for a SPECIFIC post
    // URL Example: /api/comments/post/5
    @GetMapping("/post/{postId}")
    public List<Comment> getCommentsByPost(@PathVariable Long postId) {
        return commentRepository.findByPostId(postId);
    }

    // ADD Comment (Now includes postId)
    @PostMapping
    public Comment addComment(@RequestBody Comment comment) {
        return commentRepository.save(comment);
    }
}