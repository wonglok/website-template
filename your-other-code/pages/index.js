import Head from 'next/head'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { SDK, Pages } from '../../../pages-cms-gui/api'
import { CMSLayout } from '../../../pages-cms-gui/CMSLayout'
import useSWR from 'swr'

function PageActions ({ row, reload }) {
  const router = useRouter()
  return <div className="flex items-center">
    <button
      className={`bg-${'green'}-500 text-white active:bg-pink-600 font-bold uppercase text-sm px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1`}
      type="button"
      style={{ transition: "all .15s ease" }}
      onClick={() => { router.push('/cms/pages/' + row._id) }}
    >
      {'Edit'}
    </button>
    <button
      className={`bg-${'red'}-500 text-white active:bg-pink-600 font-bold uppercase text-sm px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1`}
      type="button"
      style={{ transition: "all .15s ease" }}
      onClick={() => { Pages.deleteMine({ doc: row }).then(reload) }}
    >
      {'Delete'}
    </button>
  </div>
}

function PageRow ({ row, reload }) {
  return <tr>
    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <div className="flex items-center">
            <div>{row.displayName}</div>
        </div>
    </td>
    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
      <div className="flex items-center">
              <div>{row.slug}</div>
      </div>
    </td>
    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
        <span
            className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
            <span aria-hidden
                className="absolute inset-0 bg-green-200 opacity-50 rounded-full"></span>
            <span className="relative">Active</span>
        </span>
    </td>
    <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
      <PageActions reload={reload} row={row}></PageActions>
    </td>

  </tr>
}

function PageDataRows ({ data, reload }) {
  return data.map(row => <PageRow reload={reload} key={row._id} row={row}></PageRow>)
}

function DataTablePost ({  }) {
  let { revalidate, data, err } = useSWR('listMine', key => Pages[key]({  }))
  data = data || []
  data = data.map(e => {
    return {
      id: e._id,
      ...e
    }
  })

  if (data.length === 0) {
    return <div>
      <PageCreator reload={revalidate}></PageCreator>
      <div className="text-sm text-gray-700">
        You dont have pages yet, let's Create a new Page.
      </div>
    </div>
  }
  return <>
    <PageCreator reload={revalidate}></PageCreator>
    <div className="antialiased font-sans">
        <div className=" max-w-6xl">
            <div className="py-8">
                {/* <div>
                    <h2 className="text-2xl font-semibold leading-tight">Page</h2>
                </div>
                <div className="my-2 flex sm:flex-row flex-col">
                    <div className="flex flex-row mb-1 sm:mb-0">
                        <div className="relative">
                            <select
                                className="h-full rounded-l border block appearance-none w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:bg-white focus:border-gray-500">
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
                                className="h-full rounded-r border-t sm:rounded-r-none sm:border-r-0 border-r border-b block appearance-none w-full bg-white border-gray-400 text-gray-700 py-2 px-4 pr-8 leading-tight focus:outline-none focus:border-l focus:border-r focus:bg-white focus:border-gray-500">
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
                                <tr>


                                <th
                                    className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Display Name
                                </th>
                                <th
                                    className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                    Slug
                                </th>
                                <th
                                  className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                  Status
                                </th>
                                <th
                                      className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                                      Actions
                                  </th>

                                </tr>
                            </thead>
                            <tbody>
                                <PageDataRows reload={revalidate} data={data}></PageDataRows>
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
  </>
}

function PageCreator ({ reload }) {
  let [displayName, setDisplayName] = useState('')
  let onCreatePage = async () => {
    let doc = {
      displayName
    }
    await Pages.create({ doc })
    reload()
  }
  return <>
  <input type="text" value={displayName} onInput={e => setDisplayName(e.target.value)} className="p-1 px-2 m-1 bg-white"></input>
  <button
    className={`bg-${'blue'}-500 text-white active:bg-pink-600 font-bold uppercase text-sm px-4 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1`}
    type="button"
    style={{ transition: "all .15s ease" }}
    onClick={onCreatePage}
  >
    {'Create a New Page'}
  </button>
  </>
}

export function CMSApp () {
  const router = useRouter()
  return (
    <div>
      <CMSLayout>
        <h2 className="my-4 mt-6 text-4xl font-semibold dark:text-gray-400">
          Pages
        </h2>
        <div>
          <DataTablePost></DataTablePost>
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
        <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
      </Head>
      {
        canShow ? <CMSApp></CMSApp> : <div className="h-screen w-full flex items-center justify-center">Checking Login</div>
      }
    </div>
  )
}
