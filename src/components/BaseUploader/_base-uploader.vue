<template>
  <div class="base-uploader">
    <uploader
      :options="options"
      @file-added="onFileAdded"
      @file-success="onFileSuccess"
      @file-progress="onFileProgress"
      @file-error="onFileError"
      :autoStart="false"
      class="uploader"
      >
      <uploader-unsupport></uploader-unsupport>
      <uploader-drop>
        <p>Drop files here to upload or</p>
        <uploader-btn>select files</uploader-btn>
        <uploader-btn :attrs="attrs">select images</uploader-btn>
        <uploader-btn :directory="true" :single="true">select folder</uploader-btn>
      </uploader-drop>
      <uploader-list v-show="panelShow">
        <div class="file-panel" slot-scope="props" :class="{'collapse': collapse}">
            <div class="file-title">
                <h2>文件列表</h2>
                <div class="operate">
                    <el-button @click="collapse=!collapse" type="text" :title="collapse ? '展开':'折叠' ">
                        <i class="iconfont" :class="collapse ? 'inuc-fullscreen': 'inuc-minus-round'"></i>
                    </el-button>
                    <el-button @click="close" type="text" title="关闭">
                        <i class="iconfont icon-close"></i>
                    </el-button>
                </div>
            </div>

            <ul class="file-list">
                <li v-for="file in props.fileList" :key="file.id">
                    <uploader-file :class="'file_' + file.id" ref="files" :file="file" :list="true"></uploader-file>
                </li>
                <div class="no-file" v-if="!props.fileList.length"><i class="iconfont icon-empty-file"></i> 暂无待上传文件</div>
            </ul>
        </div>
      </uploader-list>
    </uploader>
  </div>
</template>

<script>
import { ACCEPT_CONFIG } from './config.js'
import { getToken } from '@/utils/auth'
export default {
  data () {
    return {
      options: {
        // https://github.com/simple-uploader/Uploader/blob/develop/README_zh-CN.md#%E9%85%8D%E7%BD%AE
        target: '//localhost:3000/upload',
        singleFile: true, // 单文件上传。覆盖式，如果选择了多个会把之前的取消掉。默认 false
        chunkSize: 1024*1024, // 分块时按照该值来分。最后一个上传块的大小是可能是大于等于1倍的这个值但是小于两倍的这个值大小
        forceChunkSize: false, // 是否强制所有的块都是小于等于 chunkSize 的值。默认是 false。
        simultaneousUploads: 3,  // 并发上传数，默认3,
        fileParameterName: 'file', // 上传文件时文件的参数名，默认file
        withCredentials: true, // 标准的 CORS 请求是不会带上 cookie 的, 默认false
        testChunks: false, // 是否测试每个块是否在服务端已经上传了，主要用来实现秒传、跨浏览器上传等，默认 true
        progressCallbacksInterval: 500, // 进度回调间隔
        successStatuses: [ 200, 201, 202 ], // 认为响应式成功的响应码
        permanentErrors: [ 404, 415, 500, 501], // 认为是出错的响应码
        maxChunkRetries: 1000, // 最大自动失败重试上传次数，值可以是任意正整数，如果是 undefined 则代表无限次，默认 0
        chunkRetryInterval: 500, //  重试间隔，值可以是任意正整数，如果是 null 则代表立即重试，默认 null
        checkChunkUploadedByResponse: function (chunk, message) { // 可选的函数用于根据 XHR 响应内容检测每个块是否上传成功了，传入的参数是：Uploader.Chunk 实例以及请求响应信息
          let objMessage = JSON.parse(message); // 服务器分片校验函数，秒传及断点续传基础
          if (objMessage.skipUpload) {
             return true;
          }
          return (objMessage.uploaded || []).indexOf(chunk.offset + 1) >= 0
        },
        parseTimeRemaining: function (timeRemaining, parsedTimeRemaining) {
          // timeRemaining{Number}, 剩余时间，秒为单位
          // parsedTimeRemaining{String}, 默认展示的剩余时间内容，你也可以这样做替换使用
          return parsedTimeRemaining
            .replace(/\syears?/, '年')
            .replace(/\days?/, '天')
            .replace(/\shours?/, '小时')
            .replace(/\sminutes?/, '分钟')
            .replace(/\sseconds?/, '秒')
        },
        query:{ // 其他传参
          fileType: 2
        },
        headers: { // 设置header
          token: getToken()
        },
      },
      attrs: {
        accept: ACCEPT_CONFIG.getAll()
      },
      panelShow: false,
      collapse: false
    }
  },
  computed: {
    //Uploader实例
    uploader() {
        return this.$refs.uploader.uploader;
    }
  },
  methods: {
    /* 用于转换文件上传状态文本映射对象。fileStatusText 可以设置为一个函数，参数为 (status, response = null)， 第一个 status 为状态，第二个为响应内容
    {
      success: 'success',
      error: 'error',
      uploading: 'uploading',
      paused: 'paused',
      waiting: 'waiting'
    } */
    fileStatusText(status, response) {
      const statusTextMap = {
        uploading: 'uploading',
        paused: 'paused',
        waiting: 'waiting'
      }
      if (status === 'success' || status === 'error') {
        // 只有status为success或者error的时候可以使用 response

        // eg:
        // return response data ?
        return response.data
      } else {
        return statusTextMap[status]
      }
    },
    onFileAdded(file) {
      this.panelShow = true;
      this.computeMD5(file);
      console.log('fileAdded');
    },
    onFileProgress(rootFile, file, chunk) {
        console.log(`上传中 ${file.name}，chunk：${chunk.startByte / 1024 / 1024} ~ ${chunk.endByte / 1024 / 1024}`)
    },
    onFileSuccess(rootFile, file, response, chunk) {
      let res = JSON.parse(response);

      // 服务器自定义的错误（即虽返回200，但是是错误的情况），这种错误是Uploader无法拦截的
      if (!res.result) {
          this.$message({ message: res.message, type: 'error' });
          // 文件状态设为“失败”
          this.statusSet(file.id, 'failed');
          return
      }

      // 如果服务端返回需要合并
      if (res.needMerge) {
          // 文件状态设为“合并中”
          this.statusSet(file.id, 'merging');

          api.mergeSimpleUpload({
              tempName: res.tempName,
              fileName: file.name,
              ...this.params,
          }).then(res => {
              // 文件合并成功
               console.log('fileSuccess');

              this.statusRemove(file.id);
          }).catch(e => {});

      // 不需要合并
      } else {
          console.log('上传成功');
      }
    },
    onFileError(rootFile, file, response, chunk) {
      this.$message({
          message: response,
          type: 'error'
      })
    },
    /**
     * 新增的自定义的状态: 'md5'、'transcoding'、'failed'
     * @param id
     * @param status
     */
    statusSet(id, status) {
        let statusMap = {
            md5: {
                text: '校验MD5',
                bgc: '#fff'
            },
            merging: {
                text: '合并中',
                bgc: '#e2eeff'
            },
            transcoding: {
                text: '转码中',
                bgc: '#e2eeff'
            },
            failed: {
                text: '上传失败',
                bgc: '#e2eeff'
            }
        }

        this.$nextTick(() => {
            $(`<p class="myStatus_${id}"></p>`).appendTo(`.file_${id} .uploader-file-status`).css({
                'position': 'absolute',
                'top': '0',
                'left': '0',
                'right': '0',
                'bottom': '0',
                'zIndex': '1',
                'backgroundColor': statusMap[status].bgc
            }).text(statusMap[status].text);
        })
    },
    error(msg) {
        this.$notify({
            title: '错误',
            message: msg,
            type: 'error',
            duration: 2000
        })
    },
    statusRemove(id) {
        this.$nextTick(() => {
            $(`.myStatus_${id}`).remove();
        })
    },
    close() {
        this.uploader.cancel();
        this.panelShow = false;
    },
    /**
     * 计算md5，实现断点续传及秒传
     * @param file
     */
    computeMD5(file) {
        let fileReader = new FileReader();
        let time = new Date().getTime();
        let blobSlice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice;
        let currentChunk = 0;
        const chunkSize = 10 * 1024 * 1000;
        let chunks = Math.ceil(file.size / chunkSize);
        let spark = new SparkMD5.ArrayBuffer();

        // 文件状态设为"计算MD5"
        this.statusSet(file.id, 'md5');
        file.pause();

        loadNext();

        fileReader.onload = (e => {
            spark.append(e.target.result);

            if (currentChunk < chunks) {
                currentChunk++;
                loadNext();

                // 实时展示MD5的计算进度
                this.$nextTick(() => {
                    $(`.myStatus_${file.id}`).text('校验MD5 '+ ((currentChunk/chunks)*100).toFixed(0)+'%')
                })
            } else {
                let md5 = spark.end();
                this.computeMD5Success(md5, file);
                console.log(`MD5计算完毕：${file.name} \nMD5：${md5} \n分片：${chunks} 大小:${file.size} 用时：${new Date().getTime() - time} ms`);
            }
        });

        fileReader.onerror = function () {
            this.error(`文件${file.name}读取出错，请检查该文件`)
            file.cancel();
        };

        function loadNext() {
            let start = currentChunk * chunkSize;
            let end = ((start + chunkSize) >= file.size) ? file.size : start + chunkSize;

            fileReader.readAsArrayBuffer(blobSlice.call(file.file, start, end));
        }
    },
  }
}
</script>

<style>
  .uploader-example {
    width: 880px;
    padding: 15px;
    margin: 40px auto 0;
    font-size: 12px;
    box-shadow: 0 0 10px rgba(0, 0, 0, .4);
  }
  .uploader-example .uploader-btn {
    margin-right: 4px;
  }
  .uploader-example .uploader-list {
    max-height: 440px;
    overflow: auto;
    overflow-x: hidden;
    overflow-y: auto;
  }
</style>
