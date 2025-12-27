import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { Form, Button, ListGroup, Alert } from 'react-bootstrap';
import { AuthContext } from '../context/Authentication';

// 👇 Accept 'postId' as a prop
function CommentSection({ postId }) { 
    
    const { user } = useContext(AuthContext);
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState("");

    // Fetch comments SPECIFIC to this post
    useEffect(() => {
        if(postId) {
            axios.get(`http://localhost:8080/api/comments/post/${postId}`)
                .then(res => setComments(res.data.reverse()))
                .catch(err => console.error("Error fetching comments:", err));
        }
    }, [postId]); // 👈 Re-run if postId changes

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!user || !newComment.trim()) return;

        const payload = {
            userId: user.id,
            postId: postId, // 👈 Send the postId to backend
            content: newComment
        };

        axios.post("http://localhost:8080/api/comments", payload)
            .then(res => {
                setComments([res.data, ...comments]);
                setNewComment("");
            })
            .catch(err => console.error("Error posting comment:", err));
    };

    // ... (Render Return is the same, just ensure imports match) ...
    // (I'll keep the render brief to save space, rely on your existing JSX)
    return (
        <div className="mt-4">
             {/* ... Your existing UI code ... */}
             {/* Just make sure the form uses handleSubmit defined above */}
             <h5>💬 Comments ({comments.length})</h5>
             
             {user && (
                 <Form onSubmit={handleSubmit} className="mb-3">
                     <Form.Control 
                        value={newComment} 
                        onChange={(e) => setNewComment(e.target.value)} 
                        placeholder="Write a comment..."
                     />
                     <Button type="submit" className="mt-2" size="sm">Post</Button>
                 </Form>
             )}

             <ListGroup variant="flush">
                {comments.map((c) => (
                    <ListGroup.Item key={c.id}>
                        <strong>User #{c.userId}:</strong> {c.content}
                    </ListGroup.Item>
                ))}
             </ListGroup>
        </div>
    );
}

export default CommentSection;