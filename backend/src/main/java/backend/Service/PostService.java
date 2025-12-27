package backend.Service;

import backend.Model.Post;
import backend.Repository.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PostService {

    private final PostRepository postRepository;

    @Autowired
    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    // 1. Get all posts (Sorted by newest first)
    public List<Post> getAllPosts() {
        List<Post> posts = postRepository.findAll();
        // Business logic: Sorting happens here, not in the controller
        posts.sort((p1, p2) -> p2.getCreatedAt().compareTo(p1.getCreatedAt()));
        return posts;
    }

    // 2. Get single post
    public Optional<Post> getPostById(Long id) {
        return postRepository.findById(id);
    }

    // 3. Create post
    public Post createPost(Post post) {
        return postRepository.save(post);
    }

    // 4. Update post
    public Optional<Post> updatePost(Long id, Post postDetails) {
        return postRepository.findById(id).map(existingPost -> {
            // Update logic moves here
            existingPost.setTitle(postDetails.getTitle());
            existingPost.setContent(postDetails.getContent());
            return postRepository.save(existingPost);
        });
    }

    // 5. Delete post
    public boolean deletePost(Long id) {
        if (postRepository.existsById(id)) {
            postRepository.deleteById(id);
            return true;
        }
        return false;
    }
}