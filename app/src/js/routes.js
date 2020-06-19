import PostsPage from '../pages/posts.jsx';
import PostPage from '../pages/post.jsx';
import NotFoundPage from '../pages/404.jsx';

var routes = [
  {
    path: '/',
    component: PostsPage,
  },
  {
    path: '/reviews/',
    component: PostsPage,
  },
  {
    path: '/news/',
    component: PostsPage,
  },
  {
    path: '/post/:id/',
    component: PostPage,
  },
  {
    path: '(.*)',
    component: NotFoundPage,
  },
];

export default routes;
