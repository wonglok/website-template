import Head from 'next/head'
import { useRouter } from 'next/router'
import { MyMetaTags } from '../your-cms/pager'

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

  return { props: { srv } }
}

export default function Home ({ srv }) {
  const router = useRouter()
  console.log(srv)

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
      <div>
        <pre>{JSON.stringify(srv, null, '\t')}</pre>
      </div>
    </div>
  )
}
