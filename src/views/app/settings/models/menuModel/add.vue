<template>
  <div>
    <action-form
      :model="form"
      :formOptions="formOptions"
      label-width="100px"
      ref="actionFormRef"
      :span="24"
    >
      <template slot="icon">
        <el-input v-model="form.icon">
          <el-button slot="append" icon="el-icon-search" @click="$refs.fontAwesomeSelectorRef.open()"></el-button>
        </el-input>
        <font-awesome-selector ref="fontAwesomeSelectorRef" v-model="form.icon"></font-awesome-selector>
      </template>
    </action-form>
  </div>
</template>
<script>
import { listDashboardMenu } from "@/api/ims/menu";
import FontAwesomeSelector from '@/components/FontAwesomeSelector/index.vue'
const getDefaultFrom = () => {
  return {
    pid: 0,
    type: 'M',
    icon: '',
    name: '',
    sort: 0,
    path: '',
    permission: '',
    description: ''
  }
}
export default {
  components: {
    FontAwesomeSelector
  },
  data () {
    return {
      form: getDefaultFrom(),
      formOptions: [
        {
          label: '上级菜单',
          prop: 'pid',
          type: 'treeSelect',
          options: [],
          optionsProps: {
            value: 'id',
            label: 'name',
            children: 'children'
          },
          rules: [
            { required: true, message: "上级菜单不能为空", trigger: "change" },
          ]
        },
        {
          label: '菜单类型',
          prop: 'type',
          type: 'radio',
          options: [
            { value: 'M', label: '菜单' },
            { value: 'B', label: '按钮' }
          ],
          rules: [
            { required: true }
          ]
        },
        {
          label: '菜单图标',
          prop: 'icon',
          type: 'slot',
          slotName: 'icon',
          showCondition (model) {
            return model.type === 'M'
          }
        },
        {
          label: '路由地址',
          prop: 'path',
          rules: [
            { required: true, message: "路由地址不能为空", trigger: "change" },
          ],
          showCondition (model) {
            return model.type === 'M'
          }
        },
        {
          label: '菜单名称',
          prop: 'name',
          rules: [
            { required: true, message: "菜单名称不能为空", trigger: "change" },
          ]
        },
        {
          label: '显示排序',
          prop: 'sort',
          type: 'inputNumber',
          rules: [
            { required: true, message: "显示顺序不能为空", trigger: "change" },
          ]
        },
        {
          label: '权限标识',
          prop: 'permission',
        },
        {
          label: '菜单说明',
          prop: 'description',
        }
      ]
    }
  },
  created () {
    listDashboardMenu().then(res => {
      const options = [
        {
          name: '根节点',
          id: 0,
          children: res.data
        }
      ]
      const index = this.formOptions.findIndex(item => item.prop === 'pid')
      this.formOptions[index].options = options
    })
  },
  methods: {
    submit () {
      let data = null
      const form = this.$refs.actionFormRef.getRef()
      form.validate(valid => {
        if (valid) {
          data = this.form
        }
      })
      return data
    },
    reset () {
      this.$refs.actionFormRef.reset()
      this.form = getDefaultFrom()
    }
  }
}
</script>