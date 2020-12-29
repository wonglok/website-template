import axios from 'axios'
export async function getServerSideProps (context) {
  let baseURL = 'https://website-template-tau.vercel.app'
  if (process.env.NODE_ENV === 'development') {
    baseURL = 'http://localhost:3000'
  }

  try {
    let res = await axios({
      url: '/api/cms/posts?action=' + 'get-by-slug',
      baseURL: baseURL,
      method: 'POST',
      headers: {
        'content-type': 'application/json'
      },
      data: {
        data: {
          slug: context.req.url.replace('/posts/', '')
        }
      }
    })

    let data = res.data

    return {
      props: {
        data
      }
    }

  } catch (e) {
    console.log(e)
    return {
      props: {
        error: {
          msg: e.response.data.msg,
          isError: true
        }
      }
    }
  }
}

export default function MyPosts ({ error, data }) {
  if (error && error.isError) {
    return <div className="full">
      <style>{/* css */`
        html, body, .full, #__next{
          width: 100%;
          height: 100%;
        }
      `}</style>
      <div className="flex items-center justify-center h-full">Item Not Found</div>
    </div>
  }
  return <pre className=" whitespace-pre">{JSON.stringify(data, null, '\t')}</pre>
}
