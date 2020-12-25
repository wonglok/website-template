import Head from 'next/head'
import { useRouter } from 'next/router'
import { MyMetaTags } from '../your-cms/pager'
// This gets called on every request
export async function getServerSideProps (context) {
  let { req } = context

  let srv = {
    params: {
      slug: ['/']
    },
    query: {},
    url: req.url
  }

  return { props: { srv } }
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

      <div>
        <pre>{JSON.stringify(srv, null, '\t')}</pre>
      </div>
    </div>
  )
}
