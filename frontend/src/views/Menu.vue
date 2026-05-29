<template>
  <div class="menu-page">
    <el-card>
      <template #header>
        <div class="card-header">
          <span>菜单管理</span>
          <el-button type="primary" @click="handleAdd">
            <el-icon><Plus /></el-icon>
            新增菜单
          </el-button>
        </div>
      </template>
      
      <el-table
        :data="tableData"
        style="width: 100%"
        row-key="id"
        border
        default-expand-all
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        v-loading="loading"
      >
        <el-table-column prop="name" label="菜单名称" width="200" />
        <el-table-column prop="path" label="路由路径" width="200" />
        <el-table-column prop="icon" label="图标" width="100">
          <template #default="{ row }">
            <el-icon><component :is="row.icon" /></el-icon>
          </template>
        </el-table-column>
        <el-table-column prop="component" label="组件路径" />
        <el-table-column prop="sort" label="排序" width="80" />
        <el-table-column label="操作" width="200" fixed="right">
          <template #default="{ row }">
            <el-button type="primary" size="small" @click="handleEdit(row)">
              编辑
            </el-button>
            <el-button type="danger" size="small" @click="handleDelete(row)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-dialog
      v-model="dialogVisible"
      :title="dialogTitle"
      width="600px"
      @close="handleDialogClose"
    >
      <el-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        label-width="100px"
      >
        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="formData.name" placeholder="请输入菜单名称" />
        </el-form-item>
        <el-form-item label="路由路径" prop="path">
          <el-input v-model="formData.path" placeholder="请输入路由路径，如 /menu" />
        </el-form-item>
        <el-form-item label="图标" prop="icon">
          <el-select v-model="formData.icon" placeholder="请选择图标">
            <el-option
              v-for="icon in iconList"
              :key="icon"
              :label="icon"
              :value="icon"
            >
              <el-icon><component :is="icon" /></el-icon>
              <span style="margin-left: 10px">{{ icon }}</span>
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="父级菜单" prop="parentId">
          <el-tree-select
            v-model="formData.parentId"
            :data="menuTreeData"
            :props="{ label: 'name', value: 'id' }"
            placeholder="请选择父级菜单（不选则为顶级菜单）"
            clearable
            check-strictly
          />
        </el-form-item>
        <el-form-item label="组件路径" prop="component">
          <el-input v-model="formData.component" placeholder="请输入组件路径，如 views/Menu.vue" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="formData.sort" :min="0" />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSubmit" :loading="submitting">
          确定
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
import { menuApi, type Menu, type CreateMenuDto } from '@/api/menu'

const loading = ref(false)
const tableData = ref<Menu[]>([])
const dialogVisible = ref(false)
const dialogTitle = computed(() => (formData.value.id ? '编辑菜单' : '新增菜单'))
const submitting = ref(false)
const formRef = ref<FormInstance>()

const iconList = [
  'Home', 'HomeFilled', 'Menu', 'Setting', 'User', 'Document',
  'Folder', 'Files', 'DataLine', 'PieChart', 'Grid', 'List'
]

const formData = ref<Partial<Menu>>({
  name: '',
  path: '',
  icon: '',
  parentId: null,
  component: '',
  sort: 0
})

const formRules: FormRules = {
  name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }],
  path: [{ required: true, message: '请输入路由路径', trigger: 'blur' }],
  icon: [{ required: true, message: '请选择图标', trigger: 'change' }],
  component: [{ required: true, message: '请输入组件路径', trigger: 'blur' }]
}

const menuTreeData = computed(() => {
  const filterMenu = (menu: Menu): any => {
    if (formData.value.id && menu.id === formData.value.id) {
      return null
    }
    const node: any = {
      id: menu.id,
      name: menu.name,
      children: []
    }
    if (menu.children) {
      node.children = menu.children
        .map(filterMenu)
        .filter((item: any) => item !== null)
    }
    return node
  }
  return tableData.value.map(filterMenu).filter(item => item !== null)
})

const fetchMenuList = async () => {
  loading.value = true
  try {
    const { data } = await menuApi.getMenuList()
    tableData.value = data
  } catch (error) {
    ElMessage.error('获取菜单列表失败')
  } finally {
    loading.value = false
  }
}

const handleAdd = () => {
  formData.value = {
    name: '',
    path: '',
    icon: 'Menu',
    parentId: null,
    component: '',
    sort: 0
  }
  dialogVisible.value = true
}

const handleEdit = (row: Menu) => {
  formData.value = { ...row }
  dialogVisible.value = true
}

const handleDelete = async (row: Menu) => {
  try {
    await ElMessageBox.confirm(
      `确定要删除菜单"${row.name}"吗？`,
      '提示',
      {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
    await menuApi.deleteMenu(row.id)
    ElMessage.success('删除成功')
    await fetchMenuList()
  } catch (error: any) {
    if (error !== 'cancel') {
      ElMessage.error('删除失败')
    }
  }
}

const handleSubmit = async () => {
  if (!formRef.value) return
  
  await formRef.value.validate(async (valid) => {
    if (!valid) return
    
    submitting.value = true
    try {
      const data: CreateMenuDto = {
        name: formData.value.name!,
        path: formData.value.path!,
        icon: formData.value.icon!,
        parentId: formData.value.parentId || null,
        component: formData.value.component!,
        sort: formData.value.sort || 0
      }
      
      if (formData.value.id) {
        await menuApi.updateMenu(formData.value.id, data)
        ElMessage.success('更新成功')
      } else {
        await menuApi.createMenu(data)
        ElMessage.success('创建成功')
      }
      
      dialogVisible.value = false
      await fetchMenuList()
    } catch (error) {
      ElMessage.error(formData.value.id ? '更新失败' : '创建失败')
    } finally {
      submitting.value = false
    }
  })
}

const handleDialogClose = () => {
  formRef.value?.resetFields()
}

onMounted(() => {
  fetchMenuList()
})
</script>

<style scoped>
.menu-page {
  height: 100%;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
