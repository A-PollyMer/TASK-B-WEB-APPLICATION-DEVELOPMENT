package backend.Controller;


import backend.DTO.DashboardStatsDTO;
import org.springframework.web.bind.annotation.*;
import java.util.List;

//add this to for the  log in
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import java.util.Optional;

import backend.Model.User;
import backend.Repository.PostRepository;
import backend.Service.UserService;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000") //Allows requests from the React frontend running on localhost:3000
public class UserController {

    private final UserService userService;
    private final PostRepository postRepository;

    //Gives the class a service (Dependency Injection)
    public UserController(UserService userService, PostRepository postRepository) {
        this.userService = userService;
        this.postRepository = postRepository;
    }


    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User loginRequest){

        // Try to find user with matching username AND password
        Optional<User> userOpt = userService.authenticateUser(
                loginRequest.getUsername(),
                loginRequest.getPassword()
        );

        if (userOpt.isPresent()) {
            return ResponseEntity.ok(userOpt.get());
        }

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body("Invalid username or password");
    }
    // handles creating new user accounts.
    /**
     * Creates a new user in the system.
     * 
     * Handles HTTP POST requests to the /api/users endpoint. This method receives
     * user data from the request body, persists it to the database, and returns
     * the saved user entity with an auto-generated ID.
     * 
     * @param user the User object to be created, deserialized from the JSON request body
     * @return the created User entity with the auto-generated ID assigned by the database
     */

    @PostMapping //Tells Spring to listen for HTTP POST requests to /api/users. POST is like "creating" or "submitting" data (vs. GET for "fetching").
    public User createUser(@RequestBody User user){ //Analogy: Like a form submission. The @RequestBody is like a "decoder" that turns the incoming JSON (e.g., {"username": "alice", "email": "alice@blog.com"}) into a User object, just as a librarian scans your ID card to create your profile.
        return userService.createUser(user);
    }

    /**
     * Gets a user by ID.
     * 
     * Handles HTTP GET requests to the /api/users/{id} endpoint. This method retrieves
     * a user from the database by their unique ID and returns the user entity.
     * 
     *  the User object to be retrieved, deserialized from the JSON request body
     * @return the  User entity from ID assigned by the database
     */

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id){
        Optional<User> user = userService.getUserById(id);
        
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

     /**
     * UPDATE USER
     * 
     * Updates user information by ID
     * 
     * Endpoint: PUT /api/users/{id}
     * Example: PUT /api/users/1
     * 
     * Password Handling:
     * - If new password provided → hash and update
     * - If password is null/empty → keep existing password
     * 
     * Returns:
     * - 200 OK with updated user if successful
     * - 404 NOT FOUND if user doesn't exist
     */
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User updatedUser){
        Optional<User> result = userService.updateUser(id, updatedUser);
        
        if (result.isPresent()) {
            return ResponseEntity.ok(result.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    /**
     * DELETE USER
     * 
     * Removes user from database by ID
     * 
     * Endpoint: DELETE /api/users/{id}
     * Example: DELETE /api/users/1
     * 
     * Returns:
     * - 200 OK with success message if deleted
     * - 404 NOT FOUND if user doesn't exist
     */

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id){
        boolean deleted = userService.deleteUser(id);
        
        if (deleted) {
            return ResponseEntity.ok("User deleted successfully.");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    

    /**
     * Retrieves all users from the repository.
     *
     * @return a list of all users in the system
     */
    @GetMapping
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    /**
     *  DASHBOARD STATISTICS
     *
     * Returns total count of users and posts
     * Used by Admin Dashboard for summary cards
     *
     * Endpoint: GET /api/users/dashboard/stats
     */

    @GetMapping("/dashboard/stats")
    public ResponseEntity<DashboardStatsDTO> getDashboardStats(){
        //total count
        long totalUsers = userService.getUserCount();

        //count total post
        long totalPosts = postRepository.count();

        // Package into DTO
        DashboardStatsDTO stats = new DashboardStatsDTO(totalUsers, totalPosts);

        return ResponseEntity.ok(stats);
    }
}
