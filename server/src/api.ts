import axios from "axios";
import { FACEBOOK_ACCESS_TOKEN } from "./../config/secret";

// Go to https://developers.facebook.com/tools/explorer to get access token
// with pages_read_engagement and pages_read_user_content permission
const cache: Record<string, any> = {};

interface Post {
  id: string;
  message: string;
  create_time: number;
}

interface Image {
  height: number;
  width: number;
  url: string;
  is_silhouette: boolean;
}

export const getAvatar = async (id: string): Promise<string> => {
  const cacheKey = `${id}_avatar`;
  if (cache[cacheKey]) return cache[cacheKey];

  const url = `https://graph.facebook.com/${id}/picture`;
  const result = await axios.get<{ data: Image }>(url, {
    params: {
      redirect: false,
      type: "normal",
      access_token: FACEBOOK_ACCESS_TOKEN,
    },
  });

  const imgUrl = result.data.data.url;
  cache[cacheKey] = imgUrl;

  return imgUrl;
};

export const getPost = async (id: string): Promise<Post> => {
  const cacheKey = `${id}_post`;
  if (cache[cacheKey]) return cache[cacheKey];

  const url = `https://graph.facebook.com/${id}`;
  const result = await axios.get<Post>(url, {
    params: {
      access_token: FACEBOOK_ACCESS_TOKEN,
    },
  });

  const post = result.data;
  cache[cacheKey] = post;
  console.log({ post });

  return post;
};
