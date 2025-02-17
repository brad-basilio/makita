import React, { useEffect, useState } from "react"



const BlogSimple = React.lazy(() => import('./Blogs/BlogSimple'))

const Blog = ({ data, which, headerPosts, filteredData, postsLatest }) => {

  const getBlog = () => {
    switch (which) {
      case 'BlogSimple':
        return (
          <BlogSimple
            data={data}
            headerPosts={headerPosts}
            postsLatest={postsLatest}
            filteredData={filteredData}
          />
        );

      default:
        return <div>No hay componente {which}</div>;
    }
  };

  return getBlog();
}

export default Blog;