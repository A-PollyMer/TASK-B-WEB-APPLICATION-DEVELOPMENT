package backend.DTO;

/*
    DTO = Data Transfer Object

    Purpose: Package multiple values into one object
    Analogy: A takeout bag containing multiple items

    Why use it?
    - Clean way to send multiple statistics
    - Separates database structure from API response
*/

public class DashboardStatsDTO {

    private long totalUsers;
    private long totalPosts;

    // Constructor
    public DashboardStatsDTO(long totalUsers, long totalPosts) {
        this.totalUsers = totalUsers;
        this.totalPosts = totalPosts;
    }

    // Getters and Setters
    public long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public long getTotalPosts() {
        return totalPosts;
    }

    public void setTotalPosts(long totalPosts) {
        this.totalPosts = totalPosts;
    }
}