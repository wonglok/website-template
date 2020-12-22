import React, { useEffect, useState } from "react"
import { SDK } from '../your-cms/api'
import { useRouter } from 'next/router'
import Link from 'next/link'
export function useUserInfo () {
  let [user, setUser] = useState({
    username: SDK.username,
    email: SDK.userID
  })

  useEffect(() => {
    setUser({
      username: SDK.username,
      userID: SDK.userID
    })
  }, [SDK.isLoggedIn])

  return [user]
}

export function MyLink ({ children, href }) {
  const router = useRouter()

  let className = children.props.className || ''
  if (router.pathname === href) {
    className = `${className} selected`
  }

  return <Link href={href}>{React.cloneElement(children, { className })}</Link>
}

export function CMSLayout ({ children, onClickCTA = () => {}, cta }) {
  const [user] = useUserInfo()
  const router = useRouter()
  const logout = () => SDK.logout()

  return (
    <>
      <style>{`
      @keyframes fadeIn {
        0% {opacity:0;}
        100% {opacity:1;}
      }
      .fade-in {
        animation: fadeIn ease 630ms;
        animation-fill-mode: both;
      }
      @keyframes fadeOut {
        0% {opacity:1;}
        100% {opacity:0;}
      }
      .fade-out {
        animation: fadeOut ease 630ms;
        animation-fill-mode: both;
      }
      `}</style>
    <div className={`h-screen w-full flex overflow-hidden fade-in`}>

      <nav className="flex flex-col bg-gray-200 dark:bg-gray-900 w-64 px-12 pt-4 pb-6">
        {/* <!-- SideNavBar --> */}

        <div className="mt-4 text-center">
          {/* <!-- User info --> */}
          <Link href="/cms">
            <div className="h-24 flex items-center" >
            <img
              className=" cursor-pointer w-full inline-block rounded-3xl bg-white p-3 object-contain"
              src="/brand/logo.png"
              alt="brand profile" />
            </div>
          </Link>
          <h2
            className="mt-4 text-xl dark:text-gray-300 font-extrabold capitalize">
            CMS Panel
          </h2>
          <span className="text-sm dark:text-gray-300">
            <span className="font-semibold text-green-600 dark:text-green-300">
              @{user.username}
            </span><br/>
            <span className="text-xs">{user.email}</span>
          </span>
        </div>

        <button
          onClick={(onClickCTA)}
          className="mt-8 flex items-center justify-between py-3 px-4 text-white
          dark:text-gray-200 bg-green-400 dark:bg-green-500 rounded-lg shadow">
          <span>{cta}</span>
          <svg className="h-5 w-5 fill-current" viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>
          </svg>
        </button>

        <ul className="mt-2 text-gray-600">
          {/* <!-- Links --> */}

          <MyLink href="/cms/posts">
            <li
              className="mt-8 shadow py-2 bg-white dark:bg-gray-200 rounded-lg">
              <span href="#home" className="flex pl-4">
                <svg
                  className="fill-current h-5 w-5 dark:text-gray-300"
                  viewBox="0 0 24 24">
                  <path
                    d="M16 20h4v-4h-4m0-2h4v-4h-4m-6-2h4V4h-4m6
                    4h4V4h-4m-6 10h4v-4h-4m-6 4h4v-4H4m0 10h4v-4H4m6
                    4h4v-4h-4M4 8h4V4H4v4z"></path>
                </svg>

                <span className="ml-2 capitalize font-medium">Posts</span>
              </span>
            </li>
          </MyLink>

          {/* <li className="mt-8">
            <a href="#home" className="flex">
              <svg
                className="fill-current h-5 w-5 dark:text-gray-300"
                viewBox="0 0 24 24">
                <path
                  d="M19 19H5V8h14m-3-7v2H8V1H6v2H5c-1.11 0-2 .89-2
                  2v14a2 2 0 002 2h14a2 2 0 002-2V5a2 2 0
                  00-2-2h-1V1m-1 11h-5v5h5v-5z"></path>
              </svg>

              <span
                className="ml-2 capitalize font-medium text-black
                dark:text-gray-300">
                calendar
              </span>
            </a>
          </li> */}

        <Link href="/cms/users">
            <li
              className="mt-8 shadow py-2 bg-white dark:bg-gray-200 rounded-lg
             ">
              <span href="#home" className="flex pl-4">
                <svg className="fill-current h-5 w-5" viewBox="0 0 24 24">
                  <path
                    d="M12 4a4 4 0 014 4 4 4 0 01-4 4 4 4 0 01-4-4 4 4 0
                    014-4m0 10c4.42 0 8 1.79 8 4v2H4v-2c0-2.21 3.58-4
                    8-4z"></path>
                </svg>
                <span className="ml-2 capitalize font-medium">users</span>
              </span>
            </li>
          </Link>

          {/* <li className="mt-8">
            <a href="#home" className="flex">
              <svg
                className="fill-current h-5 w-5 dark:text-gray-300"
                viewBox="0 0 24 24">
                <path
                  d="M12 13H7v5h5v2H5V10h2v1h5v2M8
                  4v2H4V4h4m2-2H2v6h8V2m10 9v2h-4v-2h4m2-2h-8v6h8V9m-2
                  9v2h-4v-2h4m2-2h-8v6h8v-6z"></path>
              </svg>
              <span
                className="ml-2 capitalize font-medium text-black
                dark:text-gray-300">
                tasks
              </span>
            </a>
          </li> */}

        </ul>

        <div className="mt-auto flex items-center text-red-700 dark:text-red-400">
          {/* <!-- important action --> */}
          <span onClick={() => { logout(); router.push('/'); }} className="flex cursor-pointer items-center">
            <svg className="fill-current h-5 w-5" viewBox="0 0 24 24">
              <path
                d="M16 17v-3H9v-4h7V7l5 5-5 5M14 2a2 2 0 012
                2v2h-2V4H5v16h9v-2h2v2a2 2 0 01-2 2H5a2 2 0 01-2-2V4a2 2
                0 012-2h9z"></path>
            </svg>
            <span className="ml-2 capitalize font-medium">Log Out</span>
          </span>

        </div>
      </nav>
      <main
        className="flex-1 flex flex-col bg-gray-100 dark:bg-gray-700 transition
        duration-500 ease-in-out overflow-y-auto">
        <div className="mx-10 my-2">
          {children || null}
        </div>

      </main>

    </div>
    </>
  )
}