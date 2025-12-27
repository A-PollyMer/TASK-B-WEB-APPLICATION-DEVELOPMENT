package backend.Controller;

import backend.Model.Post;
import backend.Service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/posts")
@CrossOrigin(origins = "http://localhost:3000") // Changed to 5173 for Vite/React default
public class PostController {

    private final PostService postService;

    @Autowired
    public PostController(PostService postService) {
        this.postService = postService;
    }

    /**
     * 📋 GET ALL POSTS
     */
    @GetMapping
    public List<Post> getAllPosts() {
        return postService.getAllPosts();
    }

    /**
     * 📖 GET SINGLE POST
     */
    @GetMapping("/{id}")
    public ResponseEntity<Post> getPostById(@PathVariable Long id) {
        return postService.getPostById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * ➕ CREATE POST
     */
    @PostMapping
    public ResponseEntity<Post> createPost(@RequestBody Post post) {
        // Validation stays in Controller (it's about "Bad Requests")
        if (post.getTitle() == null || post.getTitle().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        if (post.getContent() == null || post.getContent().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }
        if (post.getAuthor() == null || post.getAuthor().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        Post savedPost = postService.createPost(post);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPost);
    }

    /**
     * ✏️ UPDATE POST
     */
    @PutMapping("/{id}")
    public ResponseEntity<Post> updatePost(@PathVariable Long id, @RequestBody Post postDetails) {
        return postService.updatePost(id, postDetails)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    /**
     * 🗑️ DELETE POST
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deletePost(@PathVariable Long id) {
        if (postService.deletePost(id)) {
            return ResponseEntity.ok().body("Post Deleted");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}