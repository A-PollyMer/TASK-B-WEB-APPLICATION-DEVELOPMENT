package backend.Model; // Check your package name (backend.Model or backend.model)

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "tblComments")
public class Comment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    // 👇 NEW FIELD
    @Column(name = "post_id", nullable = false)
    private Long postId;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    public Comment() {
        this.createdAt = LocalDateTime.now();
    }

    // Updated Constructor
    public Comment(Long userId, Long postId, String content) {
        this.userId = userId;
        this.postId = postId; // 👈 Save the post ID
        this.content = content;
        this.createdAt = LocalDateTime.now();
    }

    // --- Getters and Setters ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    // 👇 NEW GETTER/SETTER
    public Long getPostId() { return postId; }
    public void setPostId(Long postId) { this.postId = postId; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}