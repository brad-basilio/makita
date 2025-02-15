import React from "react"





const BlogHeader = React.lazy(() => import('./Blogs/BlogHeader'))
const BlogList = React.lazy(() => import('./Blogs/BlogList'))

const Blog = ({ data, which, items, generals = [], cart, setCart, pages, posts, headerPosts }) => {
  const getBlog = () => {
    switch (which) {

      case 'BlogHeader':
        return <BlogHeader data={data} headerPosts={headerPosts} />
      case 'BlogList':
        return <BlogList data={data} posts={posts} />
      default:
        return <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">- No Hay componente <b>{which}</b> -</div>
    }
  }
  return getBlog()
}

export default Blog;