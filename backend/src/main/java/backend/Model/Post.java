package backend.Model;



import jakarta.persistence.*;
import java.time.LocalDateTime;

/**
 * Post Entity
 *
 * Represents a blog post in the database
 * Maps to table: tblPosts
 *
 * Fields:
 * - id: unique identifier (auto-generated)
 * - title: post title
 * - content: post body (can be long text)
 * - author: username of creator
 * - createdAt: timestamp when post was created
 */
@Entity
@Table(name = "tblPosts")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT") // Allows long text
    private String content;

    @Column(nullable = false)
    private String author; // Username of the post creator

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // Default constructor
    public Post() {
        this.createdAt = LocalDateTime.now();
    }

    // Constructor with fields
    public Post(String title, String content, String author) {
        this.title = title;
        this.content = content;
        this.author = author;
        this.createdAt = LocalDateTime.now();
    }

    // ========================================
    // Getters and Setters
    // ========================================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public String getAuthor() {
        return author;
    }

    public void setAuthor(String author) {
        this.author = author;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    // Optional: toString for debugging
    @Override
    public String toString() {
        return "Post{" +
                "id=" + id +
                ", title='" + title + '\'' +
                ", author='" + author + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}
