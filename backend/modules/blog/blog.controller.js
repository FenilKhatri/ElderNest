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
    const { page = 1, limit = 50, all } = req.query;
    const query = {};
    if (all !== "true") {
        query.status = "published";
    }

    const parsedPage = Math.max(1, parseInt(page, 10));
    const parsedLimit = parseInt(limit, 10);
    const skip = (parsedPage - 1) * parsedLimit;

    const [blogs, total] = await Promise.all([
        Blog.find(query).populate("author", "name").sort({ createdAt: -1 }).skip(skip).limit(parsedLimit),
        Blog.countDocuments(query)
    ]);

    const hasMore = total > skip + blogs.length;

    return successResponse(res, 200, "Blogs fetched successfully", { 
        blogs,
        pagination: { total, page: parsedPage, limit: parsedLimit, hasMore }
    });
});

export const getBlogBySlug = asyncHandler(async (req, res) => {
    const blog = await Blog.findOne({ slug: req.params.slug, status: "published" }).populate("author", "name");
    if (!blog) {
        throw new Error("Blog not found");
    }
    return successResponse(res, 200, "Blog fetched successfully", { blog });
});

export const getRelatedBlogs = asyncHandler(async (req, res) => {
    const { slug } = req.params;
    const current = await Blog.findOne({ slug });
    if (!current) {
        return errorResponse(res, 404, "Blog not found");
    }

    const query = { status: "published", category: current.category, _id: { $ne: current._id } };
    
    // Fetch 4 blogs from exact same category
    let blogs = await Blog.find(query).populate("author", "name").limit(4).sort({ createdAt: -1 });

    // Fallback if not enough
    if (blogs.length < 3) {
        const others = await Blog.find({
            status: "published",
            _id: { $ne: current._id, $nin: blogs.map(b => b._id) }
        }).populate("author", "name").limit(4 - blogs.length).sort({ createdAt: -1 });
        blogs = [...blogs, ...others];
    }

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
