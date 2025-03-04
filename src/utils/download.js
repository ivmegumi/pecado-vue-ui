import axios from 'axios'
import { getToken } from '@/utils/auth'
import { Message } from 'element-ui'

const mimeMap = {
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8',
  zip: 'application/zip'
}

const baseUrl = process.env.VUE_APP_BASE_API
export function downLoadZip(str) {
  var url = baseUrl + str
  axios({
    method: 'post',
    url: url,
    responseType: 'blob',
    headers: { 'Authorization': 'Bearer ' + getToken() }
  }).then(res => {
    resolveBlob(res, mimeMap.zip)
  }).catch(() => {
    Message({
      type: 'error',
      message: '下载失败'
    })
  })
}
export function downLoadExcel(str, queryParams) {
  var url = baseUrl + str
  axios({
    method: 'post',
    url: url,
    params: queryParams,
    responseType: 'blob',
    headers: { 'Authorization': 'Bearer ' + getToken() }
  }).then(res => {
    resolveBlob(res, mimeMap.xlsx)
  }).catch(() => {
    Message({
      type: 'error',
      message: '下载失败'
    })
  })
}
/**
 * 解析blob响应内容并下载
 * @param {*} res blob响应内容
 * @param {String} mimeType MIME类型
 */
export function resolveBlob(res, mimeType) {
  const aLink = document.createElement('a')
  var blob = new Blob([res.data], { type: mimeType })
  // //从response的headers中获取filename, 后端response.setHeader("Content-disposition", "attachment; filename=xxxx.docx") 设置的文件名;
  var patt = new RegExp('filename=([^;]+\\.[^\\.;]+);*')
  var contentDisposition = decodeURI(res.headers['content-disposition'])
  var result = patt.exec(contentDisposition)
  var fileName = result[1]
  fileName = fileName.replace(/\"/g, '')
  aLink.href = URL.createObjectURL(blob)
  aLink.setAttribute('download', fileName) // 设置下载文件名称
  document.body.appendChild(aLink)
  aLink.click()
  document.body.appendChild(aLink)
}
