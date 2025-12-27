import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Container, Table, Button, Modal, Form, Spinner, Alert, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/Authentication';

function PostManagement() {

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState('add'); // 'add' or 'edit'
    const [currentPost, setCurrentPost] = useState({
        id: null,
        title: '',
        content: '',
        author: ''
    });
    const [error, setError] = useState('');

    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    /*
        🔒 PROTECTION: Check authentication
    */
    useEffect(() => {
        if (!user) {
            alert("Please login first!");
            navigate("/", { replace: true });
        }
    }, [user, navigate]);

    /*
        📊 Fetch all posts
    */
    const fetchPosts = () => {
        setLoading(true);
        axios.get("http://localhost:8080/api/posts")
            .then((response) => {
                setPosts(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching posts:", error);
                setError("Failed to load posts");
                setLoading(false);
            });
    };

    useEffect(() => {
        if (user) {
            fetchPosts();
        }
    }, [user]);

    /*
        ➕ OPEN ADD MODAL
    */
    const handleAddClick = () => {
        setModalMode('add');
        setCurrentPost({
            id: null,
            title: '',
            content: '',
            author: user.username // Auto-fill with logged-in user
        });
        setError('');
        setShowModal(true);
    };

    /*
        ✏️ OPEN EDIT MODAL
    */
    const handleEditClick = (post) => {
        setModalMode('edit');
        setCurrentPost({
            id: post.id,
            title: post.title,
            content: post.content,
            author: post.author
        });
        setError('');
        setShowModal(true);
    };

    /*
        💾 SAVE POST (Add or Edit)
    */
    const handleSave = () => {
        // Validation
        if (!currentPost.title || !currentPost.content) {
            setError('Title and content are required');
            return;
        }

        if (modalMode === 'add') {
            // ➕ CREATE NEW POST
            axios.post("http://localhost:8080/api/posts", currentPost)
                .then(() => {
                    alert('Post created successfully!');
                    setShowModal(false);
                    fetchPosts(); // Refresh list
                })
                .catch((error) => {
                    console.error("Error creating post:", error);
                    setError('Failed to create post');
                });
        } else {
            // ✏️ UPDATE EXISTING POST
            axios.put(`http://localhost:8080/api/posts/${currentPost.id}`, currentPost)
                .then(() => {
                    alert('Post updated successfully!');
                    setShowModal(false);
                    fetchPosts(); // Refresh list
                })
                .catch((error) => {
                    console.error("Error updating post:", error);
                    setError('Failed to update post');
                });
        }
    };

    /*
        🗑️ DELETE POST
    */
    const handleDelete = (postId, postTitle) => {
        if (window.confirm(`Are you sure you want to delete "${postTitle}"?`)) {
            axios.delete(`http://localhost:8080/api/posts/${postId}`)
                .then(() => {
                    alert('Post deleted successfully!');
                    fetchPosts(); // Refresh list
                })
                .catch((error) => {
                    console.error("Error deleting post:", error);
                    alert('Failed to delete post');
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
                <h1>📝 Post Management</h1>
                <Button variant="secondary" onClick={() => navigate('/admin')}>
                    ← Back to Dashboard
                </Button>
            </div>

            {/* Action Buttons */}
            <div className="mb-3">
                <Button variant="success" onClick={handleAddClick}>
                    ➕ Create New Post
                </Button>
            </div>

            {/* Error Alert */}
            {error && <Alert variant="danger" onClose={() => setError('')} dismissible>{error}</Alert>}

            {/* Posts Table */}
            {loading ? (
                <div className="text-center">
                    <Spinner animation="border" />
                </div>
            ) : (
                <Card>
                    <Card.Header className="bg-primary text-white">
                        <h5 className="mb-0">All Posts ({posts.length})</h5>
                    </Card.Header>
                    <Card.Body>
                        {posts.length === 0 ? (
                            <Alert variant="info">
                                No posts yet. Click "Create New Post" to get started!
                            </Alert>
                        ) : (
                            <Table striped bordered hover responsive>
                                <thead className="table-dark">
                                    <tr>
                                        <th>ID</th>
                                        <th>Title</th>
                                        <th>Author</th>
                                        <th>Created</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {posts.map((post) => (
                                        <tr key={post.id}>
                                            <td>{post.id}</td>
                                            <td>{post.title}</td>
                                            <td>{post.author}</td>
                                            <td>{new Date(post.createdAt).toLocaleDateString()}</td>
                                            <td>
                                                <Button 
                                                    variant="warning" 
                                                    size="sm" 
                                                    className="me-2"
                                                    onClick={() => handleEditClick(post)}
                                                >
                                                    ✏️ Edit
                                                </Button>
                                                <Button 
                                                    variant="danger" 
                                                    size="sm"
                                                    onClick={() => handleDelete(post.id, post.title)}
                                                >
                                                    🗑️ Delete
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                    </Card.Body>
                </Card>
            )}

            {/* Add/Edit Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        {modalMode === 'add' ? '➕ Create New Post' : '✏️ Edit Post'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Title *</Form.Label>
                            <Form.Control
                                type="text"
                                value={currentPost.title}
                                onChange={(e) => setCurrentPost({...currentPost, title: e.target.value})}
                                placeholder="Enter post title"
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Content *</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={10}
                                value={currentPost.content}
                                onChange={(e) => setCurrentPost({...currentPost, content: e.target.value})}
                                placeholder="Write your post content here..."
                                required
                            />
                        </Form.Group>

                        <Form.Group className="mb-3">
                            <Form.Label>Author</Form.Label>
                            <Form.Control
                                type="text"
                                value={currentPost.author}
                                disabled
                            />
                            <Form.Text className="text-muted">
                                Author is set to your username
                            </Form.Text>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        {modalMode === 'add' ? '➕ Create Post' : '💾 Save Changes'}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}

export default PostManagement;