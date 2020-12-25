import Head from 'next/head'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import { SDK } from '../../your-cms/api'
import { CMSLayout } from '../../your-cms/CMSLayout'
import { Modal } from '../../your-cms/Modal'
import useSWR from 'swr'

let HeaderRow = () => {
  return <tr>
      <th
          className="px-5 py-3 border-b-2 border-t-1 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
          Username
      </th>
      <th
          className="px-5 py-3 border-b-2 border-t-1 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
          Password
      </th>
      <th
          className="px-5 py-3 border-b-2 border-t-1 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
          is Admin
      </th>
      <th
          className="px-5 py-3 border-b-2 border-t-1 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
          Activated
      </th>
  </tr>
}

let UserCreator = ({ row }) => {
  let [username, setUsername] = useState('')
  let [email, setEmail] = useState('')
  let [password, setPassword] = useState('')
  let [msg, setMsg] = useState('')

  let onOK = async () => {
    try {
      await SDK.adminRegister({ email, username, password })
      setPassword('')
      setUsername('')
      setEmail('')
      window.dispatchEvent(new CustomEvent('reload-user-list'))
    } catch (e) {
      setMsg(e)
    }
  }

  //admin-register
  let onCancel = async () => {
    setPassword('')
    setUsername('')
    setEmail('')
  }

  return <Modal color={'blue'} btn={'Create User'} title={'Create User'} onOK={onOK} onCancel={onCancel}>
    <div className="mb-3 pt-0">
      <input autoFocus type="text" value={username} onInput={(e) => { setUsername(e.target.value) }} placeholder="Username" className="px-3 py-2 placeholder-gray-500 text-gray-700 relative bg-gray-100 rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"/>
    </div>
    <div className="mb-3 pt-0">
      <input type="text" value={email} onInput={(e) => { setEmail(e.target.value) }} placeholder="Email" className="px-3 py-2 placeholder-gray-500 text-gray-700 relative bg-gray-100 rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"/>
    </div>
    <div className="mb-3 pt-0">
      <input type="password" value={password} onInput={(e) => { setPassword(e.target.value) }} placeholder="New Password" className="px-3 py-2 placeholder-gray-500 text-gray-700 relative bg-gray-100 rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"/>
    </div>
    <div className="mb-3 pt-0">
      {msg}
    </div>

  </Modal>
}

let PasswordUpdater = ({ row }) => {
  let [password, setPassword] = useState('')
  let onOK = async () => {
    let newPassword = password
    setPassword('')
    await SDK.adminChangePassword({ _id: row._id, password: newPassword })
  }
  let onCancel = async () => {
    setPassword('')
  }

  return <Modal btn={'Change Password'} title={'Change Password'} onOK={onOK} onCancel={onCancel}>
    <div className="mb-3 pt-0">
      @{row.username}
    </div>
    <div className="mb-3 pt-0">
      <input autoFocus type="password" value={password} onInput={(e) => { setPassword(e.target.value) }} placeholder="New Password" className="px-3 py-2 placeholder-gray-500 text-gray-700 relative bg-gray-100 rounded text-sm shadow outline-none focus:outline-none focus:shadow-outline w-full"/>
    </div>
  </Modal>
}

function ToggleCanLogin ({ row }) {
  let [canShow, setCanShow]  = useState(SDK.username !== row.username)
  let [canLogin, setCanLogin] = useState(row.canLogin)
  let toggleCanLogin = async () => {
    setCanLogin(!canLogin)
    await SDK.toggleCanLogin({ _id: row._id })
  }

  return canShow ? <div onClick={toggleCanLogin} className={canShow ? 'block' : 'hidden'}>
    {
    canLogin ? <span
      className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
      <span aria-hidden
          className="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
      <span className="relative">Activated</span>
    </span>
      :
    <span
      className="relative inline-block px-3 py-1 font-semibold text-red-900 leading-tight">
      <span aria-hidden
          className="absolute inset-0 bg-red-200 opacity-50 rounded-full"></span>
      <span className="relative">Disabled</span>
    </span>
    }
  </div> :
  <span
    className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight opacity-50">
    <span aria-hidden
        className="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
    <span className="relative">Activated</span>
  </span>
}

function ToggleIsAdmin ({ row }) {
  let [canShow, setCanShow]  = useState(SDK.username !== row.username)
  let [isAdmin, setIsAdmin] = useState(row.isAdmin)
  let toggleIsAdmin = async () => {
    setIsAdmin(!isAdmin)
    await SDK.toggleIsAdmin({ _id: row._id })
  }

  return (
    canShow ? <div onClick={toggleIsAdmin} className={canShow ? 'block' : 'hidden'}>
    {isAdmin ? <span
      className="relative inline-block px-3 py-1 font-semibold text-blue-900 leading-tight">
      <span aria-hidden
          className="absolute inset-0 bg-blue-200 opacity-50 rounded-full"></span>
      <span className="relative">Admin</span>
    </span>
      :
    <span
      className="relative inline-block px-3 py-1 font-semibold text-gray-900 leading-tight">
      <span aria-hidden
          className="absolute inset-0 bg-gray-200 opacity-50 rounded-full"></span>
      <span className="relative">User</span>
    </span>
    }
  </div> : <span
      className="relative inline-block px-3 py-1 font-semibold text-blue-900 leading-tight opacity-50">
      <span aria-hidden
          className="absolute inset-0 bg-blue-200 opacity-50 rounded-full"></span>
      <span className="relative">Admin</span>
    </span>
  )
}

function UserInfoRow ({ row }) {
  return <tr key={row._id}>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
          <div className="flex items-center">
              <div className="flex-shrink-0 w-10 h-10">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm7.753 18.305c-.261-.586-.789-.991-1.871-1.241-2.293-.529-4.428-.993-3.393-2.945 3.145-5.942.833-9.119-2.489-9.119-3.388 0-5.644 3.299-2.489 9.119 1.066 1.964-1.148 2.427-3.393 2.945-1.084.25-1.608.658-1.867 1.246-1.405-1.723-2.251-3.919-2.251-6.31 0-5.514 4.486-10 10-10s10 4.486 10 10c0 2.389-.845 4.583-2.247 6.305z"/></svg>
                {/* <div className="bg-green-500 w-full h-full rounded-full"></div> */}
                  {/* <img className="w-full h-full rounded-full"
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
                      alt="" /> */}
              </div>
              <div className="ml-3">
                  <p className="text-gray-900 whitespace-no-wrap">
                      @{row.username}
                  </p>
              </div>
          </div>
      </td>

      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <PasswordUpdater row={row}></PasswordUpdater>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <ToggleIsAdmin row={row}></ToggleIsAdmin>
      </td>
      <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <ToggleCanLogin row={row}></ToggleCanLogin>
      </td>
  </tr>
}

function UserInfoRows ({ rows }) {
  return rows.map(row => {
    return <UserInfoRow key={row._id} row={row}></UserInfoRow>
  })
}

function UserTable () {
  let users = useSWR('getUsers', key => SDK[key]({  }))
  let rows = users.data || []

  return (
    <div className="antialiased font-sans">

      <div className="max-w-5xl">
          <div className="py-0">

              {/* <div className="my-2 flex sm:flex-row flex-col">
                  <div className="flex flex-row mb-1 sm:mb-0">
                      <div className="relative">
                          <select
                              className="appearance-none h-full rounded-l border block w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
                              <option>5</option>
                              <option>10</option>
                              <option>20</option>
                          </select>
                          <div
                              className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                              </svg>
                          </div>
                      </div>
                      <div className="relative">
                          <select
                              className="appearance-none h-full rounded-r border-t sm:rounded-r-none sm:border-r-0 border-r border-b block w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:border-l focus:border-r focus:bg-white focus:border-gray-500">
                              <option>All</option>
                              <option>Active</option>
                              <option>Inactive</option>
                          </select>
                          <div
                              className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                              </svg>
                          </div>
                      </div>
                  </div>
                  <div className="block relative">
                      <span className="h-full absolute inset-y-0 left-0 flex items-center pl-2">
                          <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current text-gray-500">
                              <path
                                  d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z">
                              </path>
                          </svg>
                      </span>
                      <input placeholder="Search"
                          className="appearance-none rounded-r rounded-l sm:rounded-l-none border border-gray-400 border-b block pl-8 pr-6 py-2 w-full bg-white text-sm placeholder-gray-400 text-gray-700 focus:bg-white focus:placeholder-gray-600 focus:text-gray-700 focus:outline-none" />
                  </div>
              </div> */}


              <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
                  <div className="inline-block min-w-full shadow rounded-lg overflow-hidden">
                      <table className="min-w-full leading-normal">
                          <thead>
                            <HeaderRow></HeaderRow>
                          </thead>
                          <tbody>
                              <UserInfoRows rows={rows}></UserInfoRows>
                          </tbody>
                      </table>

                      {/* <div
                          className="px-5 py-5 bg-white border-t flex flex-col xs:flex-row items-center xs:justify-between          ">
                          <span className="text-xs xs:text-sm text-gray-900">
                              Showing 1 to 4 of 50 Entries
                          </span>
                          <div className="inline-flex mt-2 xs:mt-0">
                              <button
                                  className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-l">
                                  Prev
                              </button>
                              <button
                                  className="text-sm bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 px-4 rounded-r">
                                  Next
                              </button>
                          </div>
                      </div> */}

                  </div>
              </div>
          </div>
      </div>
  </div>
  )
}

export function AdminArea ({ children }) {
  const [canShow, setCanShow] = useState('wait')
  useMemo(async () => {
    try {
      let me = await SDK.getMe()
      if (me && me.isAdmin) {
        setCanShow('ok')
      } else {
        setCanShow('no')
      }
    } catch (e) {
      setCanShow('no')
      console.log(e)
    }

    return () => {
    }
  }, [])

  let result = () => {
    if (canShow === 'wait') {
      return <div>Checking Security</div>
    } else if (canShow === 'ok') {
      return children
    } else if (canShow === 'no') {
      return <div>You dont have access right.</div>
    }
  }
  return result()
}

export function CMSApp () {
  const router = useRouter()
  // UserCreator
  return (
    <div>
      <CMSLayout>
        <h2 className="my-4 mt-6 text-4xl font-semibold dark:text-gray-400">
          Users
        </h2>
        <div>
          <AdminArea>
            <UserCreator></UserCreator>
            <UserTable></UserTable>
          </AdminArea>
        </div>
      </CMSLayout>
    </div>
  )
}

export default function CMSLandingPage () {
  const router = useRouter()
  const [canShow, setCanShow] = useState(false)
  useEffect(() => {
    if (!SDK.isLoggedIn) {
      setCanShow(false)
      router.push('/cms/login')
    } else {
      setCanShow(true)
    }
  })

  return (
    <div>
      <Head>
        <title>86deck</title>
        <link rel="apple-touch-icon" sizes="180x180" href="/fav/apple-touch-icon.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/fav/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/fav/favicon-16x16.png" />
        <link rel="icon" href="/fav/favicon.ico" />
      </Head>
      {
        canShow ? <CMSApp></CMSApp> : <div className="h-screen w-full flex items-center justify-center">Checking Login</div>
      }
    </div>
  )
}
