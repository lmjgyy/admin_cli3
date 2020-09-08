const express = require('express')
const app = express()
var file_DB = []
var fs = require('fs')
var multer  = require('multer');
var path = require('path');
var upload = multer({dest: 'upload_tmp/'});

app.get('/api/plugin_manager/uploader', (req, res) => {
    let { query } = req;
    let existFile = file_DB.filter(v => query.identifier == v.identifier)
    let skipUpload = query.totalChunks == '1'
    let extension = query.filename.substring(0, query.filename.lastIndexOf('.'))

    if (skipUpload) {
      res.json({
        extension: extension,
        message: null,
        needMerge: false,
        skipUpload: true,
        result: true,
        status: 2,
        timestamp: Date.now(),
        totalChunks: query.totalChunks,
        identifier: query.identifier
      })
    } else {
      if (existFile.length && existFile[0].files.length == existFile[0].totalChunks) {
        console.log(existFile, '********************************')
        res.json({
          message: 'File already exist',
          result: false,
          data: null
        })
      } else if (existFile.length && existFile[0].files.length != existFile[0].totalChunks) {
        console.log(existFile, '---------------------------------------')
        res.json({
          message: null,
          needMerge: false,
          result: true,
          timestamp: Date.now(),
          uploaded: existFile[0].files.map(v => v.chunkNumber),
          totalChunks: query.totalChunks,
          identifier: query.identifier
        })
      } else {
        res.json({
          totalChunks: query.totalChunks,
          identifier: query.identifier
        })
      }
    }
})

app.post('/api/plugin_manager/uploader', upload.any(), function(req, res, next) {
  let { body, files } = req;
  let isExistFile = file_DB.some((v) => v.identifier == body.identifier)
  let data = {
    filename: body.filename,
    chunkSize: body.chunkSize,
    id: body.id,
    identifier: body.identifier,
    relativePath: body.relativePath,
    totalChunks: body.totalChunks,
    totalSize: body.totalSize,
    skipUpload: false
  }
  if (isExistFile) {
    file_DB.forEach((val, idx) => {
      if (val.identifier == body.identifier) {
        if (val.totalChunks == val.files.length) {
          res.json({
            result: null,
            data: 'error',
            message: '该文件已上传过，请勿重复上传',
          })
          return
        }
        let flag = val.files.some((v, k) => v.chunkNumber == files[0].chunkNumber && v.filename == files[0].filename)
        if (flag) {
          res.json({
            result: null,
            data: 'error',
            message: '该文件已上传过，请勿重复上传',
          })
        } else {
          val.files.push(files[0])
          if (val.totalChunks == val.files.length) val.skipUpload = true
          res.json({
            result: file_DB,
            needMerge: val.totalChunks> 1,
            data: 'success',
            message: '上传成功',
          })
        }
      } else {

      }
    })
  } else {
    files[0].chunkNumber = body.chunkNumber
    files[0].currentChunkSize = body.currentChunkSize
    let filesList = []
    filesList.push(files[0])
    data.files = filesList
    file_DB.push(data)
    res.json({
      result: file_DB,
      data: 'success',
      message: '上传成功',
    })
  }
});


app.listen('9090')