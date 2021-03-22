<template>
  <div>
    <el-form
      ref="ruleForm"
      label-position="left"
      label-width="80px"
      :model="ruleForm"
      :rules="rules"
      style="padding:50px 0 0 50px"
    >
      <el-row :gutter="68">
        <el-col :xs="24" :sm="24" :md="16" :lg="16">
          <el-form-item label="招采方式">
            <el-col :xs="24" :sm="24" :md="8" :lg="8" style="padding-right:8px!important;padding-left:0!important">
              <el-select
                v-model="ruleForm.selectFirstColumnObj"
                :style="'width:100%;'"
                value-key="id"
                placeholder="请选择"
                @change="firstColumnChangeAction($event)"
              >

                <el-option
                  v-for="item in firstColumnList"
                  :key="item.id"
                  :label="item.text"
                  :value="item"
                />
              </el-select>
            </el-col>

            <el-col :xs="24" :sm="24" :md="8" :lg="8" style="padding-right:8px!important;padding-left:0!important">
              <el-select
                v-model="ruleForm.selectSecondColumnObj"
                :style="'width:100%'"
                value-key="id"
                placeholder="请选择"
                @change="secondColumnChangeAction($event)"
              >

                <el-option
                  v-for="item in secondColumnList"
                  :key="item.id"
                  :label="item.text"
                  :value="item"
                />
              </el-select>
            </el-col>

            <el-col :xs="24" :sm="24" :md="8" :lg="8" style="padding-right:0!important;padding-left:0!important">
              <el-select
                v-model="ruleForm.selectThreeColumnObj"
                :style="'width:100%'"
                value-key="id"
                placeholder="请选择"
              >

                <el-option
                  v-for="item in threeColumnList"
                  :key="item.id"
                  :label="item.text"
                  :value="item"
                />
              </el-select>
            </el-col>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>

  </div>

</template>

<script>

export default {

  data() {
    return {
      // 一级栏目数据
      firstColumnList: [
        {
          'id': '480',
          'text': '招标方式',
          'children': [
            {
              'id': '481',
              'text': '公开招标',
              'children': [
                {
                  'id': '499',
                  'text': '无',
                  'children': []
                }
              ]
            },
            {
              'id': '482',
              'text': '邀请招标',
              'children': [
                {
                  'id': '483',
                  'text': '公开邀请',
                  'children': []
                },
                {
                  'id': '484',
                  'text': '直接邀请',
                  'children': []
                }
              ]
            }
          ]
        },
        {
          'id': '485',
          'text': '非招标方式',
          'children': [
            {
              'id': '486',
              'text': '谈判采购',
              'children': [
                {
                  'id': '491',
                  'text': '公开邀请',
                  'children': []
                },
                {
                  'id': '495',
                  'text': '直接邀请',
                  'children': []
                }
              ]
            },
            {
              'id': '487',
              'text': '询比采购',
              'children': [
                {
                  'id': '492',
                  'text': '公开邀请',
                  'children': []
                },
                {
                  'id': '496',
                  'text': '直接邀请',
                  'children': []
                }
              ]
            },
            {
              'id': '488',
              'text': '竞价采购',
              'children': [
                {
                  'id': '493',
                  'text': '公开邀请',
                  'children': []
                },
                {
                  'id': '497',
                  'text': '直接邀请',
                  'children': []
                }
              ]
            },
            {
              'id': '489',
              'text': '直接采购',
              'children': [
                {
                  'id': '494',
                  'text': '公开邀请',
                  'children': []
                },
                {
                  'id': '498',
                  'text': '直接邀请',
                  'children': []
                }
              ]
            },
            {
              'id': '490',
              'text': '收费类',
              'children': [
                {
                  'id': '500',
                  'text': '无',
                  'children': []
                }
              ]
            }
          ]
        }
      ],
      // 二级栏目数据
      secondColumnList: [],
      // 三级栏目数据
      threeColumnList: [],

      ruleForm: {
        selectFirstColumnObj: {}, // 选中的一级对象
        selectSecondColumnObj: {}, // 选中的二级对象
        selectThreeColumnObj: {} // 选中的三级对象
      },

      rules: {}
    }
  },

  computed: {},

  mounted() {},

  methods: {

    // 一级改动
    firstColumnChangeAction(e) {
      // 给一级model赋值
      this.ruleForm.selectFirstColumnObj = e
      // 初始化二级的列表
      this.ruleForm.selectSecondColumnObj = {}
      this.secondColumnList = e.children
      // 清空二三级对象
      this.ruleForm.selectThreeColumnObj = {}
      this.threeColumnList = []
    },

    // 二级改动
    secondColumnChangeAction(e) {
      // 给二级model赋值
      this.ruleForm.selectSecondColumnObj = e
      // 给三级列表赋值
      this.threeColumnList = e.children
      // 清空三级的ID
      this.ruleForm.selectThreeColumnObj = {}
    }

  }
}

</script>

<style scoped>
</style>
