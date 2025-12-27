import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { Container, Table, Button, Spinner, Card, Row, Col, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/Authentication';

function AdminDashboard() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // 📊 NEW: State for dashboard statistics
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalPosts: 0
    });
    
    const { user, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    /*
        🔒 PROTECTION: Check authentication
    */
    useEffect(() => {
        if (!user) {
            console.log("User not logged in, redirecting to login");
            alert("Please log in to access the admin dashboard.");
            navigate("/", { replace: true });
            return;
        }
        console.log('✅ User authenticated:', user);
    }, [user, navigate]);

    /*
        📊 Fetch Dashboard Statistics
    */
    useEffect(() => {
        if (!user) return;

        console.log('📊 Fetching dashboard stats...');
        
        axios.get("http://localhost:8080/api/users/dashboard/stats")
            .then((response) => {
                setStats(response.data);
                console.log('✅ Stats loaded:', response.data);
            })
            .catch((error) => {
                console.error("❌ Error fetching stats:", error);
            });
    }, [user]);

    /*
        📊 Fetch all users
    */
    useEffect(() => {
        if (!user) return;

        const fetchUsers = () => {
            console.log('📡 Fetching users...');
            
            axios.get("http://localhost:8080/api/users")
                .then((response) => {
                    setUsers(response.data);
                    setLoading(false);
                    console.log('✅ Fetched users:', response.data);
                })
                .catch((error) => {
                    console.error("❌ Error fetching users:", error);
                    alert("There was an error fetching the users!");
                    setLoading(false);
                });
        };

        fetchUsers();
    }, [user]);

    /*
        🚪 LOGOUT HANDLER
    */
    const handleLogout = () => {
        console.log('🚪 Logging out...');
        logout();
        alert("Logged out successfully!");
        navigate("/", { replace: true });
    };

    if (!user) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" role="status">
                    <span className="visually-hidden">Checking authentication...</span>
                </Spinner>
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            {/* Header with Logout */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>Admin Dashboard</h1>
                <Button variant="danger" onClick={handleLogout}>
                    Logout
                </Button>
            </div>

            {/* Welcome Banner */}
            <Alert variant="success" className="mb-4">
                <h4>Welcome, {user.username}! 🎉</h4>
                <p className="mb-0">
                    <strong>Role:</strong> {user.role || "User"} | 
                    <strong> Email:</strong> {user.email}
                </p>
            </Alert>

            {/* 📊 SUMMARY CARDS */}
            <Row className="mb-4">
                {/* Total Users Card */}
                <Col md={6} className="mb-3">
                    <Card className="text-center shadow-sm">
                        <Card.Body>
                            <Card.Title className="text-muted">
                                👥 Total Users
                            </Card.Title>
                            <h1 className="display-3 text-primary">
                                {stats.totalUsers}
                            </h1>
                            <Card.Text className="text-muted">
                                Registered accounts
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Total Posts Card */}
                <Col md={6} className="mb-3">
                    <Card className="text-center shadow-sm">
                        <Card.Body>
                            <Card.Title className="text-muted">
                                📝 Total Posts
                            </Card.Title>
                            <h1 className="display-3 text-success">
                                {stats.totalPosts}
                            </h1>
                            <Card.Text className="text-muted">
                                Blog posts created
                            </Card.Text>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* 🎯 QUICK ACTIONS / NAVIGATION - THIS IS THE KEY PART! */}
            <Card className="mb-4 shadow-sm">
                <Card.Header className="bg-primary text-white">
                    <h5 className="mb-0">Quick Actions</h5>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col md={6} className="mb-2">
                            <Button 
                                variant="outline-primary" 
                                size="lg" 
                                className="w-100"
                                onClick={() => navigate("/admin/users")}
                            >
                                👥 Manage Users
                            </Button>
                        </Col>
                        <Col md={6} className="mb-2">
                            <Button 
                                variant="outline-success" 
                                size="lg" 
                                className="w-100"
                                onClick={() => navigate("/admin/posts")}
                            >
                                📝 Manage Posts
                            </Button>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>

            {/* 📋 USERS TABLE */}
            <Card className="shadow-sm">
                <Card.Header className="bg-secondary text-white">
                    <h5 className="mb-0">All Users ({users.length})</h5>
                </Card.Header>
                <Card.Body>
                    {loading ? (
                        <div className="text-center">
                            <Spinner animation="border" role="status">
                                <span className="visually-hidden">Loading users...</span>
                            </Spinner>
                        </div>
                    ) : (
                        <Table striped bordered hover responsive>
                            <thead className="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.length === 0 ? (
                                    <tr>
                                        <td colSpan="4" className="text-center">
                                            No users found
                                        </td>
                                    </tr>
                                ) : (
                                    users.map(u => (
                                        <tr key={u.id}>
                                            <td>{u.id}</td>
                                            <td>{u.username}</td>
                                            <td>{u.email}</td>
                                            <td>
                                                <span className={`badge ${u.role === 'ADMIN' ? 'bg-danger' : 'bg-primary'}`}>
                                                    {u.role || 'USER'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </Table>
                    )}
                </Card.Body>
            </Card>
        </Container>
    );
}

export default AdminDashboard;