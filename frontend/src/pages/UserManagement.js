import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Container, Table, Button, Modal, Form, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/Authentication';

function UserManagement() {

    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [currentUser, setCurrentUser] = useState({
        id: null,
        username: '',
        email: '',
        password: '',
        role: 'USER'
    });
    const [error, setError] = useState('');

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    /*
        PROTECTION: Check authentication
    */
    useEffect(() => {
        if (!user) {
            alert("Please login first!");
            navigate("/", { replace: true });
        }
    }, [user, navigate]);

    /*
        📊 Fetch all users
    */
    const fetchUsers = () => {
        setLoading(true);
        axios.get("http://localhost:8080/api/users")
            .then((response) => {
                setUsers(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
                setError("Failed to load users");
                setLoading(false);
            });
    };

    useEffect(() => {
        if (user) {
            fetchUsers();
        }
    }, [user]);

    /*
     OPEN ADD MODAL
    */
    const handleAddClick = () => {
        setModalMode('add');
        setCurrentUser({
            id: null,
            username: '',
            email: '',
            password: '',
            role: 'USER'
        });
        setError('');
        setShowModal(true);
    };

    /*
         OPEN EDIT MODAL
    */
    const handleEditClick = (user) => {
        setModalMode('edit');
        setCurrentUser({
            id: user.id,
            username: user.username,
            email: user.email,
            password: '', // Don't show existing password
            role: user.role || 'USER'
        });
        setError('');
        setShowModal(true);
    };

    /*
        SAVE USER (Add or Edit)
    */
    const handleSave = () => {
        // Validation
        if (!currentUser.username || !currentUser.email) {
            setError('Username and email are required');
            return;
        }

        if (modalMode === 'add' && !currentUser.password) {
            setError('Password is required for new users');
            return;
        }

        if (modalMode === 'add') {
            //  CREATE NEW USER
            axios.post("http://localhost:8080/api/users", currentUser)
                .then(() => {
                    alert('User created successfully!');
                    setShowModal(false);
                    fetchUsers(); // Refresh list
                })
                .catch((error) => {
                    console.error("Error creating user:", error);
                    setError('Failed to create user');
                });
        } else {
            //  UPDATE EXISTING USER
            axios.put(`http://localhost:8080/api/users/${currentUser.id}`, currentUser)
                .then(() => {
                    alert('User updated successfully!');
                    setShowModal(false);
                    fetchUsers(); // Refresh list
                })
                .catch((error) => {
                    console.error("Error updating user:", error);
                    setError('Failed to update user');
                });
        }
    };

    /*
         DELETE USER
    */
    const handleDelete = (userId, username) => {
        if (window.confirm(`Are you sure you want to delete user "${username}"?`)) {
            axios.delete(`http://localhost:8080/api/users/${userId}`)
                .then(() => {
                    alert('User deleted successfully!');
                    fetchUsers(); // Refresh list
                })
                .catch((error) => {
                    console.error("Error deleting user:", error);
                    alert('Failed to delete user');
                });
        }
    };

    if (!user) {
        return (
            <Container className="mt-5 text-center">
                <Spinner animation="border" />
            </Container>
        );
    }

    return (
        <Container className="mt-4">
            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1>👥 User Management</h1>
                <Button variant="secondary" onClick={() => navigate('/admin')}>
                    ← Back to Dashboard
                </Button>
            </div>

            {/* Action Buttons */}
            <div className="mb-3">
                <Button variant="success" onClick={handleAddClick}>
                    ➕ Add New User
                </Button>
            </div>

            {/* Error Alert */}
            {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

            {/* Users Table */}
            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" />
                </div>
            ) : (
                <Table striped bordered hover responsive>
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Username</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length === 0 ? (
                            <tr>
                                <td colSpan="5" className="text-center">
                                    No users found
                                </td>
                            </tr>
                        ) : (
                            users.map((u) => (
                                <tr key={u.id}>
                                    <td>{u.id}</td>
                                    <td>{u.username}</td>
                                    <td>{u.email}</td>
                                    <td>
                                        <span className={`badge ${u.role === 'ADMIN' ? 'bg-danger' : 'bg-primary'}`}>
                                            {u.role || 'USER'}
                                        </span>
                                    </td>
                                    <td>
                                        <Button 
                                            variant="warning" 
                                            size="sm" 
                                            className="me-2"
                                            onClick={() => handleEditClick(u)}
                                        >
                                            ✏️ Edit
                                        </Button>
                                        <Button 
                                            variant="danger" 
                                            size="sm"
                                            onClick={() => handleDelete(u.id, u.username)}
                                        >
                                            🗑️ Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </Table>
            )}

            {/* Add/Edit Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {modalMode === 'add' ? '➕ Add New User' : '✏️ Edit User'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Username *</Form.Label>
                            <Form.Control
                                type="text"
                                value={currentUser.username}
                                onChange={(e) => setCurrentUser({...currentUser, username: e.target.value})}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Email *</Form.Label>
                            <Form.Control
                                type="email"
                                value={currentUser.email}
                                onChange={(e) => setCurrentUser({...currentUser, email: e.target.value})}
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>
                                Password {modalMode === 'add' ? '*' : '(leave empty to keep current)'}
                            </Form.Label>
                            <Form.Control
                                type="password"
                                value={currentUser.password}
                                onChange={(e) => setCurrentUser({...currentUser, password: e.target.value})}
                                placeholder={modalMode === 'edit' ? 'Leave empty to keep current password' : 'Enter password'}
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Role</Form.Label>
                            <Form.Select
                                value={currentUser.role}
                                onChange={(e) => setCurrentUser({...currentUser, role: e.target.value})}
                            >
                                <option value="USER">USER</option>
                                <option value="ADMIN">ADMIN</option>
                            </Form.Select>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        {modalMode === 'add' ? '➕ Create' : '💾 Save Changes'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default UserManagement;