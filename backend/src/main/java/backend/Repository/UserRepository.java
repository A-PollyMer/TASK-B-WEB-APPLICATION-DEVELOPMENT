package backend.Repository;

import backend.Model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    // Custom method to find a user by username and password
    Optional<User> findByUsername(String username);
}
