// import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { HttpContext } from "@adonisjs/http-server/build/standalone";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Database from "@ioc:Adonis/Lucid/Database";
import News from "App/Models/News";
import { getQueryStrings } from "../../../utils/index";
import NewsValidator from "../../Validators/NewsValidator";

export default class NewsController {
  public async showAll(request: HttpContext) {
    const params = getQueryStrings(request.response.request.url);

    const { search } = params;

    const newsQuery = Database.from("news");

    // Apply the search filter
    if (search) {
      newsQuery.where("content", "ILIKE", `%${search}%`);
    }

    // Query to count the posts (without ordering)
    let newsCountQuery = Database.from("news");

    // Apply the search filter to the count query
    if (search) {
      newsCountQuery.where("content", "ILIKE", `%${search}%`);
    }

    const news = await newsQuery
      .orderBy("created_at", "desc")
      .paginate(params["page"], params["per_page"]);

    const newsCountResult = await newsCountQuery.count("news");

    return {
      news,
      totalPages: Math.ceil(newsCountResult[0]["count"] / params["per_page"]),
    };
  }

  public async show(request: HttpContext) {
    const news = await News.find(request.params.id);
    return news;
  }

  public async showLastNewsLetter() {
    const lastPost = await News.query()
      .orderBy("created_at", "desc")
      .first();
    return lastPost;
  }

  public async create({ request, auth }: HttpContextContract) {
    const params = request.body();

    await auth.use("api").authenticate();

    await request.validate(NewsValidator);

    const newsId = await Database.table("news")
      .insert({
        title: params.title,
        content: params.content,
      })
      .returning("id");
    return newsId;
  }

  public async edit({ request, params, auth }: HttpContextContract) {
    const body = request.body();

    await auth.use("api").authenticate();

    const news = await News.findOrFail(params.newsId);

    const updatedData = request.only(["title", "content"]);
    news.merge(updatedData);

    await news?.save().then(() => {
      return { Success: "News " + body.title + "successfully updated!" };
    });
  }

  public async delete({ params, auth }: HttpContextContract) {
    await auth.use("api").authenticate();
    const news = await News.find(params.id);
    await news
      ?.delete()
      .then(() => {
        return "News " + news.id + "successefuly deleted!";
      })
      .catch((e) => {
        return e;
      });
  }
}
