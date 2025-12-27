import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Card, Spinner, Alert, Badge } from 'react-bootstrap';
import CommentSection from './CommentSection';

function Homepage() {

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    /*
        📊 Fetch all posts (public - no auth needed)
    */
    useEffect(() => {
        console.log('📡 Fetching posts for homepage...');
        
        axios.get("http://localhost:8080/api/posts")
            .then((response) => {
                setPosts(response.data);
                setLoading(false);
                console.log('✅ Posts loaded:', response.data);
            })
            .catch((error) => {
                console.error("❌ Error fetching posts:", error);
                setError("Failed to load posts");
                setLoading(false);
            });
    }, []);

    return (
        <Container className="mt-4">
            {/* Page Header */}
            <div className="text-center mb-5">
                <h1 className="display-4">Welcome to BlogSite</h1>
                <p className="lead text-muted">
                    A simple blog platform where users can register, post, and comment.
                </p>
            </div>

            <hr className="mb-4" />

            {/* Blog Posts Section */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2>📝 Recent Posts</h2>
                <Badge bg="primary" pill>{posts.length} Posts</Badge>
            </div>

            {/* Loading State */}
            {loading && (
                <div className="text-center my-5">
                    <Spinner animation="border" role="status">
                        <span className="visually-hidden">Loading posts...</span>
                    </Spinner>
                </div>
            )}

            {/* Error State */}
            {error && (
                <Alert variant="danger">{error}</Alert>
            )}

            {/* No Posts State */}
            {!loading && !error && posts.length === 0 && (
                <Alert variant="info">
                    <Alert.Heading>No posts yet!</Alert.Heading>
                    <p>Be the first to create a post. Register or login to get started.</p>
                </Alert>
            )}

            {/* Posts List */}
            {!loading && posts.length > 0 && (
                <div>
                    {posts.map((post) => (
                        <Card key={post.id} className="mb-4 shadow-sm">
                            <Card.Body>
                                <Card.Title className="h3">{post.title}</Card.Title>
                                {/* ... (Your existing post metadata and content) ... */}
                                <Card.Text style={{ whiteSpace: 'pre-wrap' }}>
                                    {post.content}
                                </Card.Text>

                                <hr />
                                
                                {/* 👇 REPLACE THE PLACEHOLDER WITH THIS 👇 */}
                                <CommentSection postId={post.id} />
                                
                            </Card.Body>
                        </Card>
                    ))}
                </div>
            )}
        </Container>
    );
}

export default Homepage;