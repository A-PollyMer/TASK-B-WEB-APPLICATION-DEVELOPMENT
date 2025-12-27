package backend.Service;

import backend.Model.User;
import backend.Repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/*
    🧠 SERVICE LAYER
    - Handles business logic
    - Keeps Controller clean
    - Central place for authentication & encryption
*/
@Service
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder;

    /*
        Dependency Injection
        Spring gives us:
        - UserRepository (database access)
        - BCryptPasswordEncoder (password hashing)
    */
    public UserService(UserRepository userRepository,
                       BCryptPasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // ==================================================
    // 🔐 AUTHENTICATION
    // ==================================================

    /*
        Authenticate user during login

        Steps:
        1. Find user by username
        2. Compare raw password vs hashed password
        3. Return user if valid
    */
    public Optional<User> authenticateUser(String username, String rawPassword) {

        Optional<User> userOpt = userRepository.findByUsername(username);

        if (userOpt.isPresent()) {
            User user = userOpt.get();

            boolean passwordMatches = passwordEncoder.matches(
                    rawPassword,
                    user.getPassword()
            );

            if (passwordMatches) {
                return Optional.of(user);
            }
        }

        return Optional.empty();
    }

    // ==================================================
    // 🧾 CREATE USER (REGISTER)
    // ==================================================

    /*
        Create new user account
        - Hash password before saving
        - Default role can be USER
    */
    public User createUser(User user) {

        String hashedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(hashedPassword);

        // Safety: default role
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("USER");
        }

        return userRepository.save(user);
    }

    // ==================================================
    // 📖 READ
    // ==================================================

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    // ==================================================
    // ✏️ UPDATE
    // ==================================================

    /*
        Update user information
        - Password only updated if provided
        - Old password preserved if empty
    */
    public Optional<User> updateUser(Long id, User updatedUser) {

        Optional<User> userOpt = userRepository.findById(id);

        if (userOpt.isPresent()) {
            User existingUser = userOpt.get();

            existingUser.setUsername(updatedUser.getUsername());
            existingUser.setEmail(updatedUser.getEmail());
            existingUser.setRole(updatedUser.getRole());

            // 🔐 Password logic
            if (updatedUser.getPassword() != null &&
                    !updatedUser.getPassword().isEmpty()) {

                String hashedPassword =
                        passwordEncoder.encode(updatedUser.getPassword());

                existingUser.setPassword(hashedPassword);
            }

            return Optional.of(userRepository.save(existingUser));
        }

        return Optional.empty();
    }

    // ==================================================
    // 🗑️ DELETE
    // ==================================================

    public boolean deleteUser(Long id) {

        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return true;
        }

        return false;
    }

    // ==================================================
    // 📊 DASHBOARD SUPPORT
    // ==================================================

    public long getUserCount() {
        return userRepository.count();
    }
}
