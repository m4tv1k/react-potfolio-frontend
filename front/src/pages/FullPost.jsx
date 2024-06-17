import React from "react";
import { useParams } from "react-router-dom";

import axios from "../axios";

import { Post } from "../components/Post";
// import { Index } from "../components/AddComment";
import { CommentsBlock } from "../components/CommentsBlock";
import styles from './Post.module.scss';
import ReactMarkdown from "react-markdown";
import { Grid } from "@mui/material";

export const FullPost = () => {
  const [data, setData] = React.useState();
  const [isLoading, setLoading] = React.useState(true);
  const {id} = useParams();

  React.useEffect(() =>{
    axios
    .get(`/posts/${id}`)
    .then((res) =>{
      setData(res.data);
      setLoading(false);
    })
    .catch((err) =>{
      console.warn(err);
      alert('Ошибка при получении статьи fullpost');
    });
  }, []);

  if (isLoading) {
    return <Post isLoading={isLoading} isFullPost/>;
  }

  return (
    <>
    <Grid>
      <Post
        id={data._id}
        title={data.title}
        imageUrl={data.imageUrl?`http://localhost:4444${data.imageUrl}` : ''}
        // imageUrl="https://res.cloudinary.com/practicaldev/image/fetch/s--UnAfrEG8--/c_imagga_scale,f_auto,fl_progressive,h_420,q_auto,w_1000/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/icohm5g0axh9wjmu4oc3.png"
        user={data.user}
        createdAt={data.createdAt}
        viewsCount={data.viewsCount}
        rateCount={5}
        tags={data.tags}
        isFullPost
      >
        <ReactMarkdown children={data.text} />
      </Post>
    </Grid>
    </>
  );
};
