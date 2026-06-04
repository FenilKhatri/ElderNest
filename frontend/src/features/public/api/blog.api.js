import http from "../../../lib/axios";

export const getAllBlogs = async (params) => {
  return await http.get("/blogs", { params });
};

export const getBlogBySlug = async (slug) => {
  return await http.get(`/blogs/slug/${slug}`);
};

export const getRelatedBlogs = async (slug) => {
  return await http.get(`/blogs/${slug}/related`);
};

export const addComment = async (blogId, commentData) => {
  return await http.post(`/blogs/${blogId}/comments`, commentData);
};
