import Head from 'next/head'
import { useRouter } from 'next/router'
import { MyMetaTags } from '../pages-cms-gui/pager'
import { Editor, Frame, Element } from "@craftjs/core"
import { Pages, usePage } from '../pages-cms-gui/api'
import { useEffect } from 'react'
import * as RE from '../your-builder/user'
import { decompress } from 'shrink-string'
import axios from 'axios'
import ReactDOMServer from 'react-dom/server'

// This gets called on every request
export async function getServerSideProps (context) {
  let { req, params, query } = context
  let domain = req.headers.host || 'test.com'
  let url = `http://${domain}${req.url}`
  let matcher = new URL(url)

  let srv = {
    params,
    query,
    urlL: req.url,
    href: matcher.href,
    origin: matcher.origin,
    host: matcher.host,
    hostname: matcher.hostname,
    port: matcher.port,
    pathname: matcher.pathname,
    search: matcher.search,
    hash: matcher.hash
  }

  let endpoint = '/api/cms/pages'
  let action = 'find-one-public'
  let baseURL = `http://localhost:3000`

  if (process.env.NODE_ENV === 'production') {
    baseURL = `https://86deck.withloklok.com`
  }

  let page = await axios({
    url: `${endpoint}?action=${action}`,
    baseURL: baseURL,
    method: 'POST',
    data: {
      data: {
        query: {
          slug: query.slug
        }
      }
    }
  }).then(res => {
    return res.data
  }, (err) => {
    return false
  })

  srv.page = page

  return { props: { srv } }
}

export const Page = ({ page }) => {
  return (
    <div>
      {page && <Editor enabled={false} resolver={{ ...RE }}>
        <Frame data={page.data}>
          <Element is={RE.Page} canvas></Element>
        </Frame>
      </Editor>}
    </div>
  )
}

export function NotFound () {
  return <div className="h-screen w-screen flex items-center justify-center">
    <div className="text-center">
      <p className="text-lg">Home Page not Setup.</p>
      <p className="text-sm text-gray-500">Please create a page called home.</p>
    </div>
  </div>
}

export default function Home ({ srv }) {
  const router = useRouter()

  return (
    <div>
      <Head>
        <MyMetaTags
          title={'My Title'}
          desc={'Descrition'}
          url={srv.url}
          image={false}
          largerImage={false}
        ></MyMetaTags>
      </Head>

      {!srv.page && <NotFound></NotFound>}
      {srv.page && <Page page={srv.page}></Page>}
      {/* <div>
        <pre>{JSON.stringify(srv, null, '\t')}</pre>
      </div> */}
    </div>
  )
}

// export default function Home ({ srv }) {
//   const router = useRouter()

//   return (
//     <div>
//       <Head>
//         <MyMetaTags
//           title={'My Title'}
//           desc={'Descrition'}
//           url={srv.url}
//           image={false}
//           largerImage={false}
//         ></MyMetaTags>
//       </Head>

//     </div>
//   )
// }
