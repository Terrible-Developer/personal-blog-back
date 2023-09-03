// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { HttpContext } from "@adonisjs/http-server/build/standalone";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import Post from "App/Models/Post";
import User from "App/Models/User";
import PostLike from "App/Models/PostLike";
import { getQueryStrings, convertToSlug } from "../../../utils";
import PostsValidator from "App/Validators/PostsValidator";
import PostComment from "App/Models/PostComment";
import { subDays, format } from "date-fns";

export default class PostsController {
  public async showAll(request: HttpContext) {
    const params = getQueryStrings(request.response.request.url);

    // Counts all the posts to set the total pages
    const postCount = (await Post.all()).length;
    try {
      const posts = await Database.from("posts")
        .orderBy("created_at", "desc")
        .paginate(params["page"], params["per_page"]);

      return { posts, totalPages: Math.ceil(postCount / params["per_page"]) };
    }catch(e){
      console.log(e);
    }
    return { posts: {}, totaPages: 0 };
  }

  public async showAllByUserId(request: HttpContext) {
    const params = getQueryStrings(request.response.request.url);

    const { search } = params;

    const postsQuery = Database.from("posts").where(
      "userid",
      request.params.userId
    );

    // Apply the search filter
    if (search) {
      postsQuery.where("title", "ILIKE", `%${search}%`);
    }

    // Query to count the posts (without ordering)
    let postCountQuery = Database.from("posts").where(
      "userid",
      request.params.userId
    );

    // Apply the search filter to the count query
    if (search) {
      postCountQuery.where("title", "ILIKE", `%${search}%`);
    }

    const userPosts = await postsQuery
      .orderBy("created_at", "desc")
      .paginate(
        params["page"],
        params["per_page"]
    );

    const postCountResult = await postCountQuery.count("posts");

    return {
      userPosts,
      totalPages: Math.ceil(postCountResult[0]["count"] / params["per_page"]),
    };
  }

  public async show(request: HttpContext) {
    const post = await Post.find(request.params.id);
    return post;
  }

  public async showBySlug({ params }: HttpContextContract) {
    const post = await Post.findBy("slug", params.slug);
    return post;
  }

  public async create({ request }: HttpContextContract) {
    const params = request.body();

    await request.validate(PostsValidator);

    const postId = await Database.table("posts")
      .insert({
        title: params.title,
        slug: convertToSlug(params.slug),
        content: params.content,
        userid: params.userid,
        likes_quantity: 0,
      })
      .returning("id");
    return postId;
  }

  public async edit({ request, auth }: HttpContextContract) {
    const body = request.body();
    const params = request.params();

    const post = await Post.findOrFail(params.postId);

    // Update the post info
    post.title = body.title;

    post.content = body.content;

    await post?.save().then(() => {
      return { Success: "Post " + body.title + "successfully updated!" };
    });
  }

  public async delete({ params, auth }: HttpContextContract) {
    await auth.use("api").authenticate();
    const post = await Post.find(params.id);
    await post
      ?.delete()
      .then(() => {
        return "Post " + post.id + "successefuly deleted!";
      })
      .catch((e) => {
        return e;
      });
  }

  public async likePost({ params, auth }) {
    await auth.use("api").authenticate();
    const user: User = await auth.use("api").user!;

    let returnValue: boolean;
    let existsLikes = await this.hasUserLikedPost({ params, auth });

    if (!existsLikes) {
      this.addLike(user.id.toString(), params.id);
      this.updateLikes(params.id, "like");
      returnValue = true;
    } else {
      this.removeLike(user.id.toString(), params.id);
      this.updateLikes(params.id, "dislike");
      returnValue = false;
    }

    return returnValue;
  }

  public async hasUserLikedPost({ params, auth }) {
    await auth.use("api").authenticate();
    const user: User = await auth.use("api").user!;
    const postId = params.id;

    const hasLiked = await Database.query()
      .from("posts_like_users")
      .where("userid", "=", user.id)
      .andWhere("postid", "=", postId);
    const count = Object.keys(hasLiked).length;
    if (count > 0) {
      return true;
    }
    return false;
  }

  private async addLike(userId: string, postId: string) {
    await PostLike.create({
      postId: postId as unknown as number,
      userId: userId as unknown as number,
    });
    return "success";
  }

  private async removeLike(userId: string, postId: string) {
    const dbResponse = await Database.query()
      .delete()
      .from("posts_like_users")
      .where("userid", userId)
      .andWhere("postid", postId);
    return dbResponse;
  }

  private async updateLikes(postId: string, type: string) {
    const post = await Post.findOrFail(postId);

    // Process the like or dislike
    if (type === "like") {
      post.likes_quantity++;
    } else {
      if (post.likes_quantity > 0) post.likes_quantity--;
    }

    post.save();
  }

  /**
   * List all comments for the posts
   * @param HttpContextContract request
   */
  public async listPostComments({ request }: HttpContextContract) {
    const params = request.params();

    const oneDayAgo = subDays(new Date(), 1); // Calculate the date 1 day ago

    const formattedOneDayAgo = format(oneDayAgo, "yyyy-MM-dd HH:mm:ss"); // Format the date as a string in the same format as your "created_at" column

    const postComments = await Database.from("post_comments")
      .select("*") // Select all columns
      .where("postId", params.postId)
      .where("created_at", ">", formattedOneDayAgo)
      .orderBy("created_at", "desc");

    return { postComments, length: postComments.length };
  }

  /**
   * Comments the post
   * @param HttpContextContract request
   */
  public async commentPost({ request, response, auth }: HttpContextContract) {
    const params = request.body();
    const { content, userId, postId } = params;

    await auth.use("api").authenticate();

    const post = await Post.findOrFail(postId);

    if (post) {
      await PostComment.create({
        content: content,
        postId: postId,
        userid: userId,
      });

      return response
        .status(200)
        .json({ comment: content, success: "Comment successfully made!" });
    }
  }

  /**
   * Comments the post
   * @param HttpContextContract request
   */
  public async deleteCommentPost({ request, response, auth }: HttpContextContract) {
    const { commentId } = request.params();

    await auth.use("api").authenticate();

    //if (post) {
    const postComment = await PostComment.findOrFail(commentId);

    if (postComment) {
      await postComment
        .delete()
        .then(() => {
          return response.status(200).json({
            commentId: commentId,
            success: "Comment successfully deleted!",
          });
        })
        .catch((e) => {
          return e;
        });
    } else {
      return response
        .status(400)
        .json({ commentId: commentId, error: "Not found" });
    }
    //}
  }
}
