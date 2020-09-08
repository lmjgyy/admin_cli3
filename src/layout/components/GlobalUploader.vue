<template>
  <div id="global-uploader">
    <!-- 上传 -->
    <uploader
      ref="uploader"
      :options="options"
      :autoStart="false"
      @file-added="onFileAdded"
      @file-success="onFileSuccess"
      @file-progress="onFileProgress"
      @file-error="onFileError"
      :file-status-text="fileStatusText"
      class="uploader-app"
    >
      <uploader-unsupport></uploader-unsupport>

      <uploader-btn id="global-uploader-btn" :attrs="attrs" :directory="false" ref="uploadBtn">选择文件</uploader-btn>

      <uploader-list v-show="panelShow">
        <div class="file-panel" slot-scope="props" :class="{'collapse': collapse}">
          <div class="file-title">
            <h3 style="margin:8px">文件列表{{count}}</h3>
            <div class="operate">
              <el-button @click="fileListShow" type="text" :title="collapse ? '展开':'折叠' ">
                <i class="iconfont" :class="collapse ? 'el-icon-full-screen': 'el-icon-minus'"></i>
              </el-button>
              <el-button @click="close" type="text" title="关闭">
                <i class="el-icon-close"></i>
              </el-button>
            </div>
          </div>

          <ul class="file-list">
            <li v-for="file in props.fileList" :key="file.id">
              <uploader-file :class="'file_' + file.id" ref="files" :file="file" :list="true"></uploader-file>
              <!-- <template v-if="currentId == file.uniqueIdentifier">
                <el-progress
                  :text-inside="true"
                  :stroke-width="26"
                  :percentage="getP(index)"
                  v-for="(item,index) in currentUpload.progress"
                ></el-progress>
              </template>-->
            </li>
            <div class="no-file" v-if="!props.fileList.length">
              <i class="iconfont icon-empty-file"></i> 暂无待上传文件
            </div>
          </ul>
        </div>
      </uploader-list>
    </uploader>
  </div>
</template>

<script>
/**
 *   全局上传插件
 *   调用方法：Bus.$emit('openUploader', {}) 打开文件选择框，参数为需要传递的额外参数
 *   监听函数：Bus.$on('fileAdded', fn); 文件选择后的回调
 *            Bus.$on('fileSuccess', fn); 文件上传成功的回调
 */

import { ACCEPT_CONFIG } from "@/utils/config";
import SparkMD5 from "spark-md5";
import jquery from "jquery";
// 这两个是我自己项目中用的，请忽略
// import { Ticket } from "@/assets/js/utils";
import Axios from "axios";
import { Alert } from "element-ui";

export default {
  data() {
    var $ = jquery;
    window.$ = $;
    const vm = this;
    return {
      currentId: "",
      currentTime: 0,
      costTime: 0,
      currentUpload: {
        totalChunks: 0,
        progress: [],
      },
      count: 0,
      options: {
        target: "api/plugin_manager/uploader",
        chunkSize: "2048000",
        fileParameterName: "upfile",
        maxChunkRetries: 3,
        testChunks: true, //是否开启服务器分片校验
        // 服务器分片校验函数，秒传及断点续传基础
        checkChunkUploadedByResponse: (chunk, message) => {
          let objMessage = JSON.parse(message);
          if (objMessage.skipUpload || message.result == "failed") {
            return true;
          }
          if (vm.currentId != objMessage.identifier) {
            vm.currentId = objMessage.identifier;
            vm.currentUpload.totalChunks = parseInt(objMessage.totalChunks);
            vm.currentUpload.progress = [];

            vm.currentUpload.progress = Array.apply(null, {
              length: objMessage.totalChunks,
            }).map((v) => (v = 0));
            vm.count = 0;
          } else {
            vm.$set(vm.currentUpload.progress, vm.count, 100);
            vm.count++;
            if (vm.count == objMessage.totalChunks) {
              vm.$set(vm.currentUpload.progress, vm.count, 100);
            }
          }
          vm.prevTime = Date.now();
          return (objMessage.uploaded || []).indexOf(chunk.offset + 1) >= 0;
        },
        headers: {
          // Authorization: Ticket.get() && "Bearer " + Ticket.get().access_token,
        },
        query() {},
        /*
         *   timeRemaining{Number}, 剩余时间，秒为单位
         *   parsedTimeRemaining{String}, 默认展示的剩余时间内容
         */
        parseTimeRemaining: function (timeRemaining, parsedTimeRemaining) {
          return parsedTimeRemaining
            .replace(/\syears?/, "年")
            .replace(/\days?/, "天")
            .replace(/\shours?/, "小时")
            .replace(/\sminutes?/, "分钟")
            .replace(/\sseconds?/, "秒");
        },
      },
      attrs: {
        accept: ACCEPT_CONFIG.getAll(),
      },
      panelShow: false, //选择文件后，展示上传panel
      collapse: false,
      fileStatusText: function (status, response) {
        const statusTextMap = {
          success: "文件类型不符, 请重新上传",
          error: "上传出错,请检查网络后重试",
          uploading: "上传中",
          typeError: "暂不支持上传您添加的文件格式",
          emptyError: "不能上传空文件",
          paused: "暂停中",
          waiting: "等待中",
          cmd5: "计算md5",
          merging: "正在转码",
        };
        if (status === "success" || status === "error") {
          // 只有status为success或者error的时候可以使用 response

          // eg:
          // return response data ?
          return response.data;
        } else {
          return statusTextMap[status];
        }
      },
    };
  },
  mounted() {
    this.$bus.$on("openUploader", (query) => {
      this.params = query || {};

      if (this.$refs.uploadBtn) {
        $("#global-uploader-btn").click();
      }
    });
  },
  computed: {
    //Uploader实例
    uploader() {
      return this.$refs.uploader.uploader;
    },
  },
  methods: {
    getP(idx) {
      return this.currentUpload.progress[idx];
    },
    onFileAdded(file) {
      this.panelShow = true;
      this.computeMD5(file);

      this.$bus.$emit("fileAdded");
    },
    onFileProgress(rootFile, file, chunk) {
      // this.costTime = new Date(Date.now() - this.currentTime).getSeconds();
      // let val = this.currentUpload.progress[count];
      // while (val < 100) {
      //   this.addVal = Math.ceil(100 / this.costTime);
      //   val = val + this.addVal;
      //   if (val > 100) val = 100;
      //   this.$set(this.currentUpload.progress, count, val);
      // }
      console.log(
        `上传中 ${file.name}，chunk：${chunk.startByte / 1024 / 1024} ~ ${
          chunk.endByte / 1024 / 1024
        }`
      );
    },
    onFileSuccess(rootFile, file, response, chunk) {
      let res = JSON.parse(response);
      console.log(res);
      // 服务器自定义的错误（即虽返回200，但是是错误的情况），这种错误是Uploader无法拦截的
      if (!res.result) {
        this.$message({ message: res.message, type: "error" });
        // 文件状态设为“失败”
        this.statusSet(file.id, "failed");
        return;
      }

      // 如果服务端返回需要合并
      if (res.needMerge) {
        // 文件状态设为“合并中”
        this.statusSet(file.id, "merging");

        Axios.mergeSimpleUpload({
          tempName: res.tempName,
          fileName: file.name,
          ...this.params,
        })
          .then((res) => {
            // 文件合并成功
            this.$bus.$emit("fileSuccess");

            this.statusRemove(file.id);
          })
          .catch((e) => {});

        // 不需要合并
      } else {
        this.$bus.$emit("fileSuccess");
        console.log("上传成功");
      }
    },
    onFileError(rootFile, file, response, chunk) {
      this.$message({
        message: response,
        type: "error",
      });
    },

    /**
     * 计算md5，实现断点续传及秒传
     * @param file
     */
    computeMD5(file) {
      let fileReader = new FileReader();
      let time = new Date().getTime();
      let blobSlice =
        File.prototype.slice ||
        File.prototype.mozSlice ||
        File.prototype.webkitSlice;
      let currentChunk = 0;
      const chunkSize = 10 * 1024 * 1000;
      let chunks = Math.ceil(file.size / chunkSize);
      let spark = new SparkMD5.ArrayBuffer();

      // 文件状态设为"计算MD5"
      this.statusSet(file.id, "md5");
      file.pause();

      loadNext();

      fileReader.onload = (e) => {
        spark.append(e.target.result);
        currentChunk++;
        if (currentChunk < chunks) {
          console.log(
            `第${currentChunk}分片解析完成, 开始第${
              currentChunk + 1
            } / ${chunks}分片解析`
          );
          loadNext();

          // 实时展示MD5的计算进度
          this.$nextTick(() => {
            $(`.myStatus_${file.id}`).text(
              "校验MD5 " + ((currentChunk / chunks) * 100).toFixed(0) + "%"
            );
          });
        } else {
          let md5 = spark.end();
          this.computeMD5Success(md5, file);
          console.log(
            `MD5计算完毕：${file.name} \nMD5：${md5} \n分片：${chunks} 大小:${
              file.size
            } 用时：${new Date().getTime() - time} ms`
          );
        }
      };

      fileReader.onerror = function () {
        this.error(`文件${file.name}读取出错，请检查该文件`);
        file.cancel();
      };

      function loadNext() {
        let start = currentChunk * chunkSize;
        let end =
          start + chunkSize >= file.size ? file.size : start + chunkSize;

        fileReader.readAsArrayBuffer(blobSlice.call(file.file, start, end));
      }
    },

    computeMD5Success(md5, file) {
      // 将自定义参数直接加载uploader实例的opts上
      Object.assign(this.uploader.opts, {
        query: {
          ...this.params,
        },
      });

      file.uniqueIdentifier = md5;
      file.resume();
      this.statusRemove(file.id);
    },

    fileListShow() {
      let $list = $("#global-uploader .file-list");

      if ($list.is(":visible")) {
        $list.slideUp();
        this.collapse = true;
      } else {
        $list.slideDown();
        this.collapse = false;
      }
    },
    close() {
      this.uploader.cancel();

      this.panelShow = false;
    },

    /**
     * 新增的自定义的状态: 'md5'、'transcoding'、'failed'
     * @param id
     * @param status
     */
    statusSet(id, status) {
      let statusMap = {
        md5: {
          text: "校验MD5",
          bgc: "#fff",
        },
        merging: {
          text: "合并中",
          bgc: "#e2eeff",
        },
        transcoding: {
          text: "转码中",
          bgc: "#e2eeff",
        },
        failed: {
          text: "上传失败",
          bgc: "#e2eeff",
        },
      };

      this.$nextTick(() => {
        $(`<p class="myStatus_${id}"></p>`)
          .appendTo(`.file_${id} .uploader-file-status`)
          .css({
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            zIndex: "1",
            backgroundColor: statusMap[status].bgc,
          })
          .text(statusMap[status].text);
      });
    },
    statusRemove(id) {
      this.$nextTick(() => {
        $(`.myStatus_${id}`).remove();
      });
    },

    error(msg) {
      this.$notify({
        title: "错误",
        message: msg,
        type: "error",
        duration: 2000,
      });
    },
  },
  watch: {},
  destroyed() {
    this.$bus.$off("openUploader");
  },
  components: {},
};
</script>
<style lang="scss">
.uploader-file-icon {
  &:before {
    content: "" !important;
  }

  &[icon="image"] {
    background: url("../../assets/component/image-icon.png");
  }
  &[icon="video"] {
    background: url("../../assets/component/video-icon.png");
  }
  &[icon="document"] {
    background: url("../../assets/component/text-icon.png");
  }
  &[icon="rar"] {
    background: url("../../assets/component/rar-icon.png");
  }
  &[icon="zip"] {
    background: url("../../assets/component/zip-icon.png");
  }
  &[icon="unknown"] {
    background: url("../../assets/component/other-icon.png");
  }
}
p[class^="myStatus_"] {
  line-height: 100%;
}
</style>
<style scoped lang="scss">
#global-uploader {
  position: fixed;
  z-index: 20;
  bottom: 15px;

  .uploader-app {
    width: 800px;
  }

  .file-panel {
    background-color: #fff;
    border: 1px solid #e2e2e2;
    border-radius: 7px 7px 0 0;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);

    .file-title {
      display: flex;
      padding: 0 15px;
      border-bottom: 1px solid #ddd;

      .operate {
        flex: 1;
        text-align: right;
      }
    }

    .file-list {
      position: relative;
      height: 240px;
      overflow-x: hidden;
      overflow-y: auto;
      background-color: #fff;
      margin: 0;
      padding: 0;

      > li {
        background-color: #fff;
      }
    }

    &.collapse {
      .file-title {
        background-color: #e7ecf2;
      }
    }
  }

  .no-file {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 16px;
  }

  .uploader-file-actions > span {
    margin-right: 6px;
  }
}

/* 隐藏上传按钮 */
#global-uploader-btn {
  position: absolute;
  clip: rect(0, 0, 0, 0);
}
</style>