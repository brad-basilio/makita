import React from "react"




const PostDetailSimple = React.lazy(() => import('./PostDetails/PostDetailSimple'))

const PostDetail = ({ data, which, items, generals = [], cart, setCart, pages }) => {
  const getPostDetail = () => {
    switch (which) {

      case 'PostDetailSimple':
        return <PostDetailSimple data={data} />
      default:
        return <div className="w-full px-[5%] replace-max-w-here p-4 mx-auto">- No Hay componente <b>{which}</b> -</div>
    }
  }
  return getPostDetail()
}

export default PostDetail;