import React, { useState } from 'react'
import axios from 'axios'

export const Contact = () => {
  const [status, setStatus] = useState({
    submitted: false,
    submitting: false,
    info: { error: false, msg: null },
  })

  const [inputs, setInputs] = useState({
    email: '',
    message: '',
  })

  const handleServerResponse = (ok, msg) => {
    if (ok) {
      setStatus({
        submitted: true,
        submitting: false,
        info: { error: false, msg: msg },
      })
      setInputs({
        email: '',
        message: '',
      })
    } else {
      setStatus({
        info: { error: true, msg: msg },
      })
    }
  }

  const handleOnChange = (e) => {
    e.persist()
    setInputs((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }))
    setStatus({
      submitted: false,
      submitting: false,
      info: { error: false, msg: null },
    })
  }

  const handleOnSubmit = (e) => {
    e.preventDefault()
    setStatus((prevStatus) => ({ ...prevStatus, submitting: true }))

    axios({
      method: 'POST',
      url: '/api/cms/contactus',
      data: {
        ...inputs,
        date: new Date()
      }
    }).then(console.log, console.log)
    axios({
      method: 'POST',
      url: 'https://formspree.io/f/mwkwwzgr',
      data: inputs,
    })
      .then((response) => {
        handleServerResponse(
          true,
          'Thank you, your message has been submitted.'
        )
      })
      .catch((error) => {
        handleServerResponse(false, error.response.data.error)
      })
  }

  return (
    <main>
      <div className="p-3 border m-1" >Email Contact Us Template</div>
      <form className="p-3 border m-1"  onSubmit={handleOnSubmit}>
        <label htmlFor="email">Email</label>
        <input
          className="p-3 border m-1"
          id="email"
          type="email"
          name="_replyto"
          onChange={handleOnChange}
          required
          value={inputs.email}
        />
        <br />

        <label htmlFor="message">Message</label>
        <textarea
          className="p-3 border m-1"
          id="message"
          name="message"
          onChange={handleOnChange}
          required
          value={inputs.message}
        />

        <br />

        <button type="submit" className="p-3 border m-1" disabled={status.submitting}>
          {!status.submitting
            ? !status.submitted
              ? 'Submit'
              : 'Submitted'
            : 'Submitting...'}
        </button>
      </form>
      {status.info.error && (
        <div className="error">Error: {status.info.msg}</div>
      )}
      {!status.info.error && status.info.msg && <p>{status.info.msg}</p>}
    </main>
  )
}