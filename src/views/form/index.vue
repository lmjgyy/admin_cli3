<template>
  <div class="app-container">
    <el-form ref="form" :model="form" label-width="120px">
      <el-form-item label="Activity name">
        <el-input v-model="form.name" maxlength="500" show-word-limit />
      </el-form-item>
      <el-form-item label="Activity zone">
        <el-select
          v-model="form.region"
          multiple
          @change="change"
          placeholder="please select your zone"
        >
          <el-option label="Zone 1" value="shanghai" />
          <el-option label="Zone 2" value="beijing" />
          <el-option label="Zone 3" value="tianjin" />
          <el-option label="Zone 4" value="chongqing" />
          <el-option label="Zone 5" value="chengdu" />
          <el-option label="Zone 6" value="wuhan" />
          <el-option label="Zone 7" value="shenzhen" />
        </el-select>
      </el-form-item>
      <el-form-item label="Activity time">
        <el-col :span="11">
          <el-date-picker
            v-model="form.date1"
            type="date"
            placeholder="Pick a date"
            style="width: 100%;"
          />
        </el-col>
        <el-col :span="2" class="line">-</el-col>
        <el-col :span="11">
          <el-time-picker
            v-model="form.date2"
            type="fixed-time"
            placeholder="Pick a time"
            style="width: 100%;"
          />
        </el-col>
      </el-form-item>
      <el-form-item label="Instant delivery">
        <el-switch v-model="form.delivery" />
      </el-form-item>
      <el-form-item label="Activity type">
        <el-checkbox-group v-model="form.type">
          <el-checkbox label="Online activities" name="type" />
          <el-checkbox label="Promotion activities" name="type" />
          <el-checkbox label="Offline activities" name="type" />
          <el-checkbox label="Simple brand exposure" name="type" />
        </el-checkbox-group>
      </el-form-item>
      <el-form-item label="Resources">
        <el-radio-group v-model="form.resource">
          <el-radio label="Sponsor" />
          <el-radio label="Venue" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="Activity form">
        <el-input v-model="form.desc" type="textarea" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="onSubmit">Create</el-button>
        <el-button @click="onCancel">Cancel</el-button>
      </el-form-item>
    </el-form>
    <!-- <aaa>
      <template v-slot="{list=[4,5,6]}">
        <div>{{list}}</div>
      </template>
    </aaa>-->
  </div>
</template>

<script>
import { debounce, wait_for } from "@/utils";
import { getList } from "@/api/table";
export default {
  data() {
    return {
      form: {
        name: "",
        region: "",
        date1: "",
        date2: "",
        delivery: false,
        type: [],
        resource: "",
        desc: "",
        wait: 0,
      },
    };
  },
  components: {
    // aaa
  },
  mounted() {
    var that = this;
  },
  created() {},
  methods: {
    onSubmit() {
      this.$message("submit!");
    },
    onCancel() {
      this.$message({
        message: "cancel!",
        type: "warning",
      });
    },
    change(e) {
      this.aaa("nnnn");
      this.wait = e.length ? 1500 : 0;
    },
    aaa: debounce(function (e) {
      this.fetchData();
    }),
    fetchData() {
      getList().then((res) => {});
    },
  },
};
</script>

<style scoped>
.line {
  text-align: center;
}
</style>

