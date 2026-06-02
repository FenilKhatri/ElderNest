import { asyncHandler } from "../../common/middlewares/async.helper.js";
import { successResponse } from "../../common/utils/responseHandler.utils.js";
import Blog from "./blog.model.js";

// Create a blog
export const createBlog = asyncHandler(async (req, res) => {
    const blog = await Blog.create({
        ...req.body,
        author: req.user.id,
    });
    return successResponse(res, 201, "Blog created successfully", { blog });
});

// Get all blogs
export const getAllBlogs = asyncHandler(async (req, res) => {
    // Only return published blogs to the public. If admin, they might need all, 
    // but the route doesn't differentiate. Usually admin has a separate route or passes a query.
    const query = { isActive: true };
    if (req.query.all !== "true") {
        query.status = "published";
    }
    const blogs = await Blog.find(query).populate("author", "name").sort({ createdAt: -1 });
    return successResponse(res, 200, "Blogs fetched successfully", { blogs });
});

// Get blog by ID
export const getBlogById = asyncHandler(async (req, res) => {
    const blog = await Blog.findById(req.params.id).populate("author", "name");
    if (!blog) {
        throw new Error("Blog not found");
    }
    return successResponse(res, 200, "Blog fetched successfully", { blog });
});

// Update blog
export const updateBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const blog = await Blog.findByIdAndUpdate(id, req.body, { returnDocument: 'after', runValidators: true });
    if (!blog) {
        throw new Error("Blog not found");
    }
    return successResponse(res, 200, "Blog updated successfully", { blog });
});

// Delete blog
export const deleteBlog = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete(id);
    if (!blog) {
        throw new Error("Blog not found");
    }
    return successResponse(res, 200, "Blog deleted successfully");
});
