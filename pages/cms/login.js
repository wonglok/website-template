import { useRouter } from 'next/router'
import { useState } from 'react'
import { SDK } from '../../your-cms/api'
import { Cloudinary } from '../../your-cms/Cloudinary'
import Head from 'next/head'
import Link from 'next/link'

function LoginSection () {
  const router = useRouter()
  const [identity, setIdentity] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')

  const onSubmit = (evt) => {
    evt.preventDefault()
    SDK.login({ identity, password })
      .then(() => {
        router.push(`/cms`)
      }, (err) => {
        setMessage(err.msg)
      })
  }
  const onKeyInfo = setValue => e => setValue(e.target.value)

  return (
    <>
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css?family=Karla:400,700&display=swap');
        .font-family-karla {
            font-family: karla;
        }
      `}</style>

        <div className="bg-white font-family-karla h-screen">
          <div className="w-full flex flex-wrap">
            <div className="w-full md:w-1/2 flex flex-col">
              <div className="flex justify-center md:justify-start pt-12 md:pl-12 md:-mb-24">
                <a href="/" className="bg-black text-white font-bold text-xl p-4">Home</a>
              </div>

              <div className="flex flex-col justify-center md:justify-start my-auto pt-8 md:pt-0 px-8 md:px-24 lg:px-32">
                  <p className="text-center text-3xl">Welcome.</p>
                  <form onSubmit={onSubmit} className="flex flex-col pt-3 md:pt-8">
                      <div className="flex flex-col pt-4">
                          <label htmlFor="email" className="text-lg">Username / Email</label>
                          <input type="text" value={identity} id="email" onInput={onKeyInfo(setIdentity)} placeholder="your@email.com" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mt-1 leading-tight focus:outline-none focus:shadow-outline" />
                      </div>

                      <div className="flex flex-col pt-4">
                          <label htmlFor="password" className="text-lg">Password</label>
                          <input type="password" value={password} onInput={onKeyInfo(setPassword)} id="password" placeholder="Password" className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mt-1 leading-tight focus:outline-none focus:shadow-outline" />
                      </div>

                      <div>{message}</div>

                      <input type="submit" value="Log In" className="bg-black text-white font-bold text-lg hover:bg-gray-700 p-2 mt-8" />
                  </form>
                  <div className="text-center pt-12 pb-12">
                    <p>Don't have an account? <Link href="/cms/register"><span  className="underline font-semibold">Register here.</span></Link></p>
                  </div>
              </div>
            </div>
            <div className="w-1/2 shadow-2xl">
              <iframe className="object-cover w-full h-screen hidden md:block" frameBorder="0" src="/86deck-main-art.html"></iframe>
                {/* <Cloudinary src="/v1608679671/86deck-portfolio/hello.png" className="object-cover w-full h-screen hidden md:block"></Cloudinary> */}
                {/* <img className="object-cover w-full h-screen hidden md:block" src="https://source.unsplash.com/IXUM4cJynP0" /> */}
            </div>
          </div>
        </div>
    </>
  )
}

export default function CMSLandingPage () {
  return (
    <div>
      <Head>
        <title>86deck</title>
        <link rel="apple-touch-icon" sizes="180x180" href="/fav/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/fav/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/fav/favicon-16x16.png" />
        <link rel="icon" href="/fav/favicon.ico" />
      </Head>
      <LoginSection></LoginSection>
    </div>
  )
}
