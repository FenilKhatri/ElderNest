import { asyncHandler } from "../../common/middlewares/async.helper.js";
import { successResponse } from "../../common/utils/responseHandler.utils.js";
import Blog from "./blog.model.js";

export const createBlog = asyncHandler(async (req, res) => {
    // Auto-generate slug if title is provided but slug is not
    if (req.body.title && !req.body.slug) {
        req.body.slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const blog = await Blog.create({
        ...req.body,
        author: req.user.id,
    });
    return successResponse(res, 201, "Blog created successfully", { blog });
});

export const getAllBlogs = asyncHandler(async (req, res) => {
    // Only return published blogs to the public by default
    const query = {};
    if (req.query.all !== "true") {
        query.status = "published";
    }
    const blogs = await Blog.find(query).populate("author", "name").sort({ createdAt: -1 });
    return successResponse(res, 200, "Blogs fetched successfully", { blogs });
});

export const getBlogBySlug = asyncHandler(async (req, res) => {
    const blog = await Blog.findOne({ slug: req.params.slug, status: "published" }).populate("author", "name");
    if (!blog) {
        throw new Error("Blog not found");
    }
    return successResponse(res, 200, "Blog fetched successfully", { blog });
});

export const getRelatedBlogs = asyncHandler(async (req, res) => {
    const { category, currentId } = req.query;
    if (!category) {
        return successResponse(res, 200, "No category provided", { blogs: [] });
    }
    const query = { status: "published", category };
    if (currentId) {
        query._id = { $ne: currentId };
    }
    
    // Fetch 3 blogs from exact same category
    const blogs = await Blog.find(query).populate("author", "name").limit(3).sort({ createdAt: -1 });
    return successResponse(res, 200, "Related blogs fetched successfully", { blogs });
});

// Add a comment to a blog
export const addComment = asyncHandler(async (req, res) => {
    const { name, email, text } = req.body;
    if (!name || !email || !text) {
        res.status(400);
        throw new Error("Name, email and text are required for a comment");
    }

    const blog = await Blog.findById(req.params.id);
    if (!blog || blog.status !== "published") {
        res.status(404);
        throw new Error("Blog not found");
    }

    blog.comments.push({ name, email, text });
    await blog.save();

    return successResponse(res, 201, "Comment added successfully", { blog });
});

export const getBlogById = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id).populate("author", "name");
    if (!blog) {
        throw new Error("Blog not found");
    }
    return successResponse(res, 200, "Blog fetched successfully", { blog });
});

export const updateBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    
    // Auto-generate slug if title is updated but slug is not provided
    if (req.body.title && !req.body.slug) {
        req.body.slug = req.body.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }

    const blog = await Blog.findByIdAndUpdate(id, req.body, { returnDocument: 'after', runValidators: true });
    if (!blog) {
        throw new Error("Blog not found");
    }
    return successResponse(res, 200, "Blog updated successfully", { blog });
});

export const deleteBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
        throw new Error("Blog not found");
    }
    return successResponse(res, 200, "Blog deleted successfully");
});
