package com.networkpro.post_service.service;

import com.networkpro.post_service.dto.PostDTO;
import com.networkpro.post_service.model.Post;
import java.util.List;

public interface PostService {
    Post createPost(PostDTO postDTO);

    List<Post> getAllPosts();

    Post getPostById(Long id);

    Post updatePost(Long id, PostDTO postDTO);

    void deletePost(Long id);
}