package com.Pirk.Pirk.services;

import com.Pirk.Pirk.models.Post;
import com.Pirk.Pirk.repositories.PostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PostService {

    @Autowired
    private PostRepository postRepository;

    // Fetch all posts
    public List<Post> getAllPosts() {
        return postRepository.findAll();
    }

    // Create a new post
    public Post createPost(Post post) {
        return postRepository.save(post);
    }
}
