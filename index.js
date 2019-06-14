require('dotenv').config()
require('isomorphic-fetch')
const Dropbox = require('dropbox').Dropbox

const dbx = new Dropbox({ 
  accessToken: process.env.ACCESS_TOKEN, 
  fetch 
})

const state = {
  files: []
}

const init = () => {
  dbx.filesListFolder({ path: '' })
    .then((res) => {
      //console.log(res)
      updateFiles(res.entries)
    })
    .catch((err) => {
      console.log(err)
    })
}

const updateFiles = (files) => {
  state.files = [...state.files, ...files]
  renderFiles()
}

const renderFiles = () => {
  state.files.sort((a, b) => {
    if ((a['.tag'] === 'folder' || b['.tag'] === 'folder')
      && !(a['.tag'] === b['.tag'])) {
        return a['.tag'] === 'folder' ? -1 : 1
      } else {
        return a.name.toLowerCase() < b.name.toLowerCase() ? -1 : 1
      }
  }).map((file) => {
    const type = file['.tag'].toUpperCase()
    let thumbnail

    if (type === 'FILE') {
      thumbnail = file.thumbnail
      ? `data:image/jpeg;base64, $[file.thumbnail}`
      : `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmc
      vMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI
      0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2t
      lLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjbGFzcz0iZmV
      hdGhlciBmZWF0aGVyLWZpbGUiPjxwYXRoIGQ9Ik0xMyAySDZhMiAyIDAgMCAwLTIgMnY
      xNmEyIDIgMCAwIDAgMiAyaDEyYTIgMiAwIDAgMCAyLTJWOXoiPjwvcGF0aD48cG9seWx
      pbmUgcG9pbnRzPSIxMyAyIDEzIDkgMjAgOSI+PC9wb2x5bGluZT48L3N2Zz4=`
    } else {
      thumbnail = `data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3d
      y53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iM
      CAwIDI0IDI0IiBmaWxsPSJub25lIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iM
      iIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBjb
      GFzcz0iZmVhdGhlciBmZWF0aGVyLWZvbGRlciI+PHBhdGggZD0iTTIyIDE5YTIgMiAwI
      DAgMS0yIDJINGEyIDIgMCAwIDEtMi0yVjVhMiAyIDAgMCAxIDItMmg1bDIgM2g5YTIgM
      iAwIDAgMSAyIDJ6Ij48L3BhdGg+PC9zdmc+`
    }

    console.log(`[${type}] - ${file.name}`)
  })
}

init()