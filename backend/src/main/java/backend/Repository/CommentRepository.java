package backend.Repository;

import backend.Model.Comment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional; // Imported Optional just in case

@Repository
public interface CommentRepository extends JpaRepository<Comment, Long> {

    // 1. Fixes "cannot find symbol findByUserId"
    // We return a List because one user can have MANY comments.
    List<Comment> findByUserId(Long userId);

    // 2. Needed for your Blog Posts to show specific comments
    List<Comment> findByPostId(Long postId);
}