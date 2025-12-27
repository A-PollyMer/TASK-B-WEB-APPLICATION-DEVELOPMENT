package backend.Repository;


import backend.Model.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

/**
 * PostRepository
 *
 * Purpose: Database access layer for Post entity
 *
 * JpaRepository provides built-in methods:
 * - count() → counts total posts
 * - findAll() → gets all posts
 * - save() → creates/updates post
 * - deleteById() → deletes post
 * - findById() → gets one post
 *
 * Analogy: Library catalog for blog posts
 */
@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    // Spring Boot auto-implements all methods
    // No need to write any code here!
}