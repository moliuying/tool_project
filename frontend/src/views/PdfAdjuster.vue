<template>
  <div class="pdf-adjuster">
    <el-card class="guide-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <InfoFilled />
          </el-icon>
          <span>使用说明</span>
        </div>
      </template>
      <el-steps :active="0" finish-status="wait" simple class="guide-steps">
        <el-step title="上传PDF" description="选择需要调整的PDF文件" />
        <el-step title="调整页面" description="拖拽排序、旋转、删除、提取页面" />
        <el-step title="导出文件" description="下载调整后的PDF文件" />
      </el-steps>
    </el-card>

    <el-card v-if="!pdfLoaded" class="upload-card">
      <template #header>
        <div class="card-header">
          <el-icon :size="20" color="#165DFF">
            <Upload />
          </el-icon>
          <span>上传PDF文件</span>
          <el-tag size="small" type="info" class="header-tag">支持 .pdf 格式</el-tag>
        </div>
      </template>
      <div class="upload-area">
        <el-upload
          ref="uploadRef"
          drag
          :auto-upload="false"
          :limit="1"
          accept=".pdf"
          :on-change="handleFileChange"
          :on-exceed="handleExceed"
          class="pdf-uploader"
        >
          <el-icon class="el-icon--upload"><UploadFilled /></el-icon>
          <div class="el-upload__text">
            将PDF文件拖到此处，或<em>点击上传</em>
          </div>
          <template #tip>
            <div class="el-upload__tip">
              仅支持 .pdf 格式文件，文件大小建议不超过 50MB
            </div>
          </template>
        </el-upload>
      </div>
      <el-divider />
      <div class="upload-preview-hint">
        <div class="hint-label">
          <el-icon :size="16" color="#165DFF"><View /></el-icon>
          <span>上传后界面预览</span>
        </div>
        <div class="hint-desc">上传PDF后，将立即显示所有页面的缩略图，你可以直接点击、拖拽、旋转每一页</div>
        <div class="mock-grid">
          <div class="mock-page selected">
            <div class="mock-thumb">
              <div class="mock-lines"></div>
              <div class="mock-check"><el-icon :size="12"><Check /></el-icon></div>
            </div>
            <span class="mock-num">1</span>
          </div>
          <div class="mock-page">
            <div class="mock-thumb">
              <div class="mock-lines"></div>
            </div>
            <span class="mock-num">2</span>
          </div>
          <div class="mock-page">
            <div class="mock-thumb">
              <div class="mock-lines"></div>
            </div>
            <span class="mock-num">3</span>
          </div>
          <div class="mock-page">
            <div class="mock-thumb">
              <div class="mock-lines"></div>
              <div class="mock-rotate-badge">90°</div>
            </div>
            <span class="mock-num">4</span>
          </div>
          <div class="mock-page">
            <div class="mock-thumb">
              <div class="mock-lines"></div>
            </div>
            <span class="mock-num">5</span>
          </div>
          <div class="mock-page deleted">
            <div class="mock-thumb">
              <div class="mock-lines"></div>
            </div>
            <span class="mock-num">6</span>
            <div class="mock-delete-line"></div>
          </div>
        </div>
        <div class="hint-annotations">
          <span class="annotation"><el-icon :size="12"><Check /></el-icon> 点击选中</span>
          <span class="annotation"><el-icon :size="12"><Rank /></el-icon> 拖拽排序</span>
          <span class="annotation"><el-icon :size="12"><RefreshRight /></el-icon> 旋转页面</span>
          <span class="annotation"><el-icon :size="12"><Delete /></el-icon> 删除页面</span>
        </div>
      </div>
      <el-divider />
      <div class="feature-preview-section">
        <div class="preview-header">
          <el-icon :size="18" color="#165DFF"><MagicStick /></el-icon>
          <span class="preview-title">功能预览</span>
          <span class="preview-subtitle">上传PDF后可进行以下页面调整操作</span>
        </div>
        <el-row :gutter="16" class="feature-grid">
          <el-col :span="8">
            <div class="feature-card">
              <div class="feature-icon-wrapper sort">
                <el-icon :size="24"><Rank /></el-icon>
              </div>
              <div class="feature-content">
                <div class="feature-title">拖拽排序</div>
                <div class="feature-desc">按住页面缩略图拖拽，快速调整页面顺序</div>
                <div class="feature-example">
                  <span class="badge before">第3页</span>
                  <el-icon class="arrow"><Right /></el-icon>
                  <span class="badge after">第1位</span>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="feature-card">
              <div class="feature-icon-wrapper rotate">
                <el-icon :size="24"><RefreshRight /></el-icon>
              </div>
              <div class="feature-content">
                <div class="feature-title">旋转页面</div>
                <div class="feature-desc">支持90°、180°、270°旋转，纠正扫描方向</div>
                <div class="feature-example">
                  <span class="badge before">↕ 倒置</span>
                  <el-icon class="arrow"><Right /></el-icon>
                  <span class="badge after">↔ 正放</span>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="feature-card">
              <div class="feature-icon-wrapper delete">
                <el-icon :size="24"><Delete /></el-icon>
              </div>
              <div class="feature-content">
                <div class="feature-title">删除页面</div>
                <div class="feature-desc">批量选中多余页面，一键移除空白或无用内容</div>
                <div class="feature-example">
                  <span class="badge before">共 10 页</span>
                  <el-icon class="arrow"><Right /></el-icon>
                  <span class="badge after">剩 6 页</span>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
        <el-row :gutter="16" class="feature-grid">
          <el-col :span="8">
            <div class="feature-card">
              <div class="feature-icon-wrapper extract">
                <el-icon :size="24"><Scissor /></el-icon>
              </div>
              <div class="feature-content">
                <div class="feature-title">提取页面</div>
                <div class="feature-desc">选中需要的页面单独导出，快速拆分工档</div>
                <div class="feature-example">
                  <span class="badge before">完整文档</span>
                  <el-icon class="arrow"><Right /></el-icon>
                  <span class="badge after">第 3-5 页</span>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="feature-card">
              <div class="feature-icon-wrapper select">
                <el-icon :size="24"><Select /></el-icon>
              </div>
              <div class="feature-content">
                <div class="feature-title">快捷多选</div>
                <div class="feature-desc">Ctrl点选、Shift连选、右键范围选，高效操作</div>
                <div class="feature-example">
                  <span class="badge before">单页</span>
                  <el-icon class="arrow"><Right /></el-icon>
                  <span class="badge after">批量</span>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="8">
            <div class="feature-card">
              <div class="feature-icon-wrapper undo">
                <el-icon :size="24"><RefreshLeft /></el-icon>
              </div>
              <div class="feature-content">
                <div class="feature-title">撤销重做</div>
                <div class="feature-desc">支持最多50步历史记录，误操作随时恢复</div>
                <div class="feature-example">
                  <span class="badge before">删除</span>
                  <el-icon class="arrow"><Right /></el-icon>
                  <span class="badge after">恢复</span>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
        <div class="privacy-note">
          <el-icon><Lock /></el-icon>
          <span>所有操作均在浏览器本地完成，文件不会上传到服务器，保障数据安全</span>
        </div>
      </div>
    </el-card>

    <template v-if="pdfLoaded">
      <el-card class="toolbar-card">
        <template #header>
          <div class="card-header">
            <el-icon :size="20" color="#165DFF">
              <Document />
            </el-icon>
            <span>PDF页面调整</span>
            <el-tag size="small" type="info" class="header-tag">
              {{ fileName }} · {{ pages.length }} 页
            </el-tag>
            <div class="header-actions">
              <el-button size="small" @click="handleReupload">
                <el-icon><Upload /></el-icon>
                重新上传
              </el-button>
            </div>
          </div>
        </template>

        <div class="toolbar-section">
          <div class="toolbar-row">
            <span class="toolbar-label">批量操作：</span>
            <el-button-group>
              <el-button size="small" @click="selectAll" :disabled="pages.length === 0">
                <el-icon><Check /></el-icon>
                全选
              </el-button>
              <el-button size="small" @click="deselectAll" :disabled="selectedPages.length === 0">
                <el-icon><Close /></el-icon>
                取消全选
              </el-button>
              <el-button size="small" @click="invertSelection" :disabled="pages.length === 0">
                <el-icon><Switch /></el-icon>
                反选
              </el-button>
            </el-button-group>

            <el-divider direction="vertical" />

            <el-button-group>
              <el-button
                size="small"
                type="danger"
                @click="deleteSelected"
                :disabled="selectedPages.length === 0"
              >
                <el-icon><Delete /></el-icon>
                删除选中 ({{ selectedPages.length }})
              </el-button>
              <el-button
                size="small"
                type="warning"
                @click="rotateSelected(90)"
                :disabled="selectedPages.length === 0"
              >
                <el-icon><RefreshRight /></el-icon>
                旋转90°
              </el-button>
              <el-button
                size="small"
                type="success"
                @click="extractSelected"
                :disabled="selectedPages.length === 0"
              >
                <el-icon><Download /></el-icon>
                提取选中
              </el-button>
            </el-button-group>

            <el-divider direction="vertical" />

            <el-button-group>
              <el-button
                size="small"
                @click="undo"
                :disabled="!canUndo"
              >
                <el-icon><RefreshLeft /></el-icon>
                撤销
              </el-button>
              <el-button
                size="small"
                @click="redo"
                :disabled="!canRedo"
              >
                <el-icon><RefreshRight /></el-icon>
                重做
              </el-button>
            </el-button-group>
          </div>
        </div>

        <div class="page-info-bar">
          <span class="info-item">
            <el-icon><Document /></el-icon>
            总页数：{{ pages.length }}
          </span>
          <span class="info-item">
            <el-icon><Check /></el-icon>
            已选中：{{ selectedPages.length }} 页
          </span>
          <span v-if="selectedPages.length > 0" class="info-item selected-info">
            选中页码：{{ selectedPages.map(i => i + 1).join(', ') }}
          </span>
        </div>
      </el-card>

      <el-card class="preview-card">
        <template #header>
          <div class="card-header">
            <el-icon :size="20" color="#165DFF">
              <View />
            </el-icon>
            <span>页面预览</span>
            <el-tag size="small" type="info" class="header-tag">
              拖拽排序 · 点击选中 · 右键操作
            </el-tag>
          </div>
        </template>

        <div class="pages-grid" v-if="pages.length > 0">
          <div
            v-for="(page, index) in pages"
            :key="page.id"
            class="page-item"
            :class="{
              'is-selected': isSelected(index),
              'is-dragging': dragIndex === index,
              'is-drag-over': dragOverIndex === index
            }"
            draggable="true"
            @dragstart="onDragStart(index, $event)"
            @dragover.prevent="onDragOver(index, $event)"
            @dragenter.prevent="onDragEnter(index)"
            @dragleave="onDragLeave(index)"
            @drop="onDrop(index)"
            @dragend="onDragEnd"
            @click="toggleSelect(index, $event)"
            @contextmenu.prevent="showContextMenu($event, index)"
          >
            <div class="page-thumb-wrapper">
              <canvas
                :ref="el => setCanvasRef(el, index)"
                class="page-thumb"
              />
              <div class="page-rotate-badge" v-if="page.rotation !== 0">
                <el-icon :size="12"><RefreshRight /></el-icon>
                {{ page.rotation }}°
              </div>
              <div class="page-select-check" v-if="isSelected(index)">
                <el-icon :size="16"><Check /></el-icon>
              </div>
            </div>
            <div class="page-number">
              {{ index + 1 }}
            </div>
            <div class="page-actions">
              <el-tooltip content="逆时针旋转90°" placement="top">
                <el-button
                  size="small"
                  circle
                  @click.stop="rotatePage(index, -90)"
                >
                  <el-icon><RefreshLeft /></el-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip content="顺时针旋转90°" placement="top">
                <el-button
                  size="small"
                  circle
                  @click.stop="rotatePage(index, 90)"
                >
                  <el-icon><RefreshRight /></el-icon>
                </el-button>
              </el-tooltip>
              <el-tooltip content="删除此页" placement="top">
                <el-button
                  size="small"
                  circle
                  type="danger"
                  @click.stop="deletePage(index)"
                >
                  <el-icon><Delete /></el-icon>
                </el-button>
              </el-tooltip>
            </div>
          </div>
        </div>

        <el-empty v-else description="所有页面已删除" />
      </el-card>

      <el-card class="export-card">
        <template #header>
          <div class="card-header">
            <el-icon :size="20" color="#165DFF">
              <Download />
            </el-icon>
            <span>导出文件</span>
          </div>
        </template>

        <div class="export-section">
          <div class="export-options">
            <el-button type="primary" size="large" @click="exportPdf" :loading="exporting" :disabled="pages.length === 0">
              <el-icon><Download /></el-icon>
              导出调整后的PDF
            </el-button>
            <el-button size="large" @click="exportSelectedPdf" :loading="exporting" :disabled="selectedPages.length === 0">
              <el-icon><Download /></el-icon>
              仅导出选中页面
            </el-button>
          </div>
          <div class="export-tips">
            <el-alert type="info" :closable="false">
              <template #title>
                <span>导出说明：页面顺序、旋转角度将应用到导出文件中。所有操作均在浏览器本地完成，文件不会上传到服务器。</span>
              </template>
            </el-alert>
          </div>
        </div>
      </el-card>
    </template>

    <el-dialog
      v-model="contextMenuVisible"
      :show-close="false"
      width="auto"
      class="context-menu-dialog"
      @close="contextMenuVisible = false"
      :modal="false"
      append-to-body
    >
    </el-dialog>

    <div
      v-if="contextMenuVisible"
      class="context-menu"
      :style="{ left: contextMenuPos.x + 'px', top: contextMenuPos.y + 'px' }"
    >
      <div class="context-menu-item" @click="contextMenuAction('rotate-cw')">
        <el-icon><RefreshRight /></el-icon>
        顺时针旋转90°
      </div>
      <div class="context-menu-item" @click="contextMenuAction('rotate-ccw')">
        <el-icon><RefreshLeft /></el-icon>
        逆时针旋转90°
      </div>
      <div class="context-menu-item" @click="contextMenuAction('rotate-180')">
        <el-icon><Refresh /></el-icon>
        旋转180°
      </div>
      <div class="context-menu-divider"></div>
      <div class="context-menu-item" @click="contextMenuAction('select-before')">
        <el-icon><Select /></el-icon>
        选中此页之前所有页
      </div>
      <div class="context-menu-item" @click="contextMenuAction('select-after')">
        <el-icon><Select /></el-icon>
        选中此页之后所有页
      </div>
      <div class="context-menu-divider"></div>
      <div class="context-menu-item danger" @click="contextMenuAction('delete')">
        <el-icon><Delete /></el-icon>
        删除此页
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, onUnmounted } from 'vue'
import {
  Document,
  InfoFilled,
  Upload,
  UploadFilled,
  Delete,
  Download,
  RefreshRight,
  RefreshLeft,
  Refresh,
  Check,
  Close,
  Switch,
  View,
  Select,
  MagicStick,
  Rank,
  Right,
  Scissor,
  Lock
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import type { UploadFile } from 'element-plus'
import { PDFDocument, degrees } from 'pdf-lib'
import * as pdfjsLib from 'pdfjs-dist'
import type { PDFDocumentProxy } from 'pdfjs-dist'

pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.js',
  import.meta.url
).toString()

interface PageItem {
  id: string
  sourceIndex: number
  rotation: number
}

interface HistoryState {
  pages: PageItem[]
}

const uploadRef = ref()
const pdfLoaded = ref(false)
const fileName = ref('')
const pdfBytes = ref<Uint8Array | null>(null)
const pages = ref<PageItem[]>([])
const selectedPages = ref<number[]>([])
const exporting = ref(false)
const canvasRefs = ref<Map<number, HTMLCanvasElement>>(new Map())

const dragIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

const historyStack = ref<HistoryState[]>([])
const historyIndex = ref(-1)

const contextMenuVisible = ref(false)
const contextMenuPos = ref({ x: 0, y: 0 })
const contextMenuPageIndex = ref(-1)

const canUndo = computed(() => historyIndex.value > 0)
const canRedo = computed(() => historyIndex.value < historyStack.value.length - 1)

let pdfDoc: PDFDocumentProxy | null = null

const setCanvasRef = (el: any, index: number) => {
  if (el) {
    canvasRefs.value.set(index, el as HTMLCanvasElement)
  }
}

const pushHistory = () => {
  historyStack.value = historyStack.value.slice(0, historyIndex.value + 1)
  historyStack.value.push({
    pages: pages.value.map(p => ({ ...p }))
  })
  historyIndex.value = historyStack.value.length - 1
  if (historyStack.value.length > 50) {
    historyStack.value = historyStack.value.slice(-50)
    historyIndex.value = historyStack.value.length - 1
  }
}

const undo = () => {
  if (!canUndo.value) return
  historyIndex.value--
  pages.value = historyStack.value[historyIndex.value].pages.map(p => ({ ...p }))
  selectedPages.value = []
  nextTick(() => renderAllThumbnails())
}

const redo = () => {
  if (!canRedo.value) return
  historyIndex.value++
  pages.value = historyStack.value[historyIndex.value].pages.map(p => ({ ...p }))
  selectedPages.value = []
  nextTick(() => renderAllThumbnails())
}

const isSelected = (index: number) => selectedPages.value.includes(index)

const toggleSelect = (index: number, event: MouseEvent) => {
  if (event.shiftKey && selectedPages.value.length > 0) {
    const lastSelected = selectedPages.value[selectedPages.value.length - 1]
    const start = Math.min(lastSelected, index)
    const end = Math.max(lastSelected, index)
    for (let i = start; i <= end; i++) {
      if (!selectedPages.value.includes(i)) {
        selectedPages.value.push(i)
      }
    }
  } else if (event.ctrlKey || event.metaKey) {
    const pos = selectedPages.value.indexOf(index)
    if (pos >= 0) {
      selectedPages.value.splice(pos, 1)
    } else {
      selectedPages.value.push(index)
    }
  } else {
    if (selectedPages.value.length === 1 && selectedPages.value[0] === index) {
      selectedPages.value = []
    } else {
      selectedPages.value = [index]
    }
  }
}

const selectAll = () => {
  selectedPages.value = pages.value.map((_, i) => i)
}

const deselectAll = () => {
  selectedPages.value = []
}

const invertSelection = () => {
  const all = pages.value.map((_, i) => i)
  selectedPages.value = all.filter(i => !selectedPages.value.includes(i))
}

const handleFileChange = async (file: UploadFile) => {
  if (!file.raw) return
  if (file.raw.type !== 'application/pdf') {
    ElMessage.error('请选择PDF文件')
    return
  }
  try {
    const arrayBuffer = await file.raw.arrayBuffer()
    pdfBytes.value = new Uint8Array(arrayBuffer)
    fileName.value = file.name
    await loadPdf()
  } catch (e) {
    console.error('Failed to load PDF:', e)
    ElMessage.error('PDF文件加载失败，请检查文件是否损坏')
  }
}

const handleExceed = () => {
  ElMessage.warning('请先删除已上传的文件再重新上传')
}

const loadPdf = async () => {
  if (!pdfBytes.value) return

  const loadingTask = pdfjsLib.getDocument({ data: pdfBytes.value.slice() })
  pdfDoc = await loadingTask.promise

  const numPages = pdfDoc.numPages
  pages.value = Array.from({ length: numPages }, (_, i) => ({
    id: `page-${i}-${Date.now()}`,
    sourceIndex: i + 1,
    rotation: 0
  }))

  historyStack.value = []
  historyIndex.value = -1
  pushHistory()

  pdfLoaded.value = true
  selectedPages.value = []

  await nextTick()
  await renderAllThumbnails()
  ElMessage.success(`已加载 ${numPages} 页PDF`)
}

const handleReupload = async () => {
  try {
    await ElMessageBox.confirm('重新上传将清除当前所有调整，确定继续？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
  } catch {
    return
  }
  pdfLoaded.value = false
  pdfBytes.value = null
  pdfDoc = null
  pages.value = []
  selectedPages.value = []
  historyStack.value = []
  historyIndex.value = -1
  fileName.value = ''
}

const renderThumbnail = async (index: number) => {
  if (!pdfDoc) return
  const canvas = canvasRefs.value.get(index)
  if (!canvas) return

  const pageItem = pages.value[index]
  if (!pageItem) return

  try {
    const page = await pdfDoc.getPage(pageItem.sourceIndex)
    const viewport = page.getViewport({ scale: 0.4 })

    const totalRotation = (page.rotate || 0) + pageItem.rotation
    const isRotated = totalRotation === 90 || totalRotation === 270

    const canvasWidth = isRotated ? viewport.height : viewport.width
    const canvasHeight = isRotated ? viewport.width : viewport.height

    canvas.width = canvasWidth
    canvas.height = canvasHeight

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    ctx.fillStyle = '#ffffff'
    ctx.fillRect(0, 0, canvasWidth, canvasHeight)

    ctx.save()
    ctx.translate(canvasWidth / 2, canvasHeight / 2)
    ctx.rotate((totalRotation * Math.PI) / 180)
    ctx.translate(-viewport.width / 2, -viewport.height / 2)

    await page.render({
      canvasContext: ctx,
      viewport
    }).promise

    ctx.restore()
  } catch (e) {
    console.error(`Failed to render page ${index}:`, e)
  }
}

const renderAllThumbnails = async () => {
  for (let i = 0; i < pages.value.length; i++) {
    await nextTick()
    await renderThumbnail(i)
  }
}

const rotatePage = (index: number, angle: number) => {
  const page = pages.value[index]
  page.rotation = (page.rotation + angle + 360) % 360
  pushHistory()
  nextTick(() => renderThumbnail(index))
}

const rotateSelected = (angle: number) => {
  selectedPages.value.forEach(i => {
    pages.value[i].rotation = (pages.value[i].rotation + angle + 360) % 360
  })
  pushHistory()
  nextTick(() => {
    selectedPages.value.forEach(i => renderThumbnail(i))
  })
}

const deletePage = async (index: number) => {
  pages.value.splice(index, 1)
  selectedPages.value = selectedPages.value.filter(i => i !== index).map(i => i > index ? i - 1 : i)
  pushHistory()
  canvasRefs.value.clear()
  await nextTick()
  await renderAllThumbnails()
}

const deleteSelected = async () => {
  if (selectedPages.value.length === 0) return
  const count = selectedPages.value.length
  try {
    await ElMessageBox.confirm(
      `确定删除选中的 ${count} 页？此操作可通过撤销恢复。`,
      '删除确认',
      {
        confirmButtonText: '确定删除',
        cancelButtonText: '取消',
        type: 'warning'
      }
    )
  } catch {
    return
  }

  const indicesToDelete = [...selectedPages.value].sort((a, b) => b - a)
  indicesToDelete.forEach(i => pages.value.splice(i, 1))
  selectedPages.value = []
  pushHistory()
  canvasRefs.value.clear()
  await nextTick()
  await renderAllThumbnails()
  ElMessage.success(`已删除 ${count} 页`)
}

const extractSelected = async () => {
  if (selectedPages.value.length === 0) return
  await exportPdfWithPages(selectedPages.value, `_提取_${selectedPages.value.length}页`)
}

const onDragStart = (index: number, event: DragEvent) => {
  dragIndex.value = index
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'move'
    event.dataTransfer.setData('text/plain', String(index))
  }
}

const onDragOver = (index: number, event: DragEvent) => {
  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move'
  }
}

const onDragEnter = (index: number) => {
  if (dragIndex.value !== null && dragIndex.value !== index) {
    dragOverIndex.value = index
  }
}

const onDragLeave = (index: number) => {
  if (dragOverIndex.value === index) {
    dragOverIndex.value = null
  }
}

const onDrop = async (fromIndex: number) => {
  const toIndex = dragIndex.value
  if (toIndex === null || toIndex === fromIndex) {
    dragIndex.value = null
    dragOverIndex.value = null
    return
  }

  const movedPage = pages.value.splice(toIndex, 1)[0]
  pages.value.splice(fromIndex, 0, movedPage)

  const movedSelected = selectedPages.value.includes(toIndex)
  selectedPages.value = selectedPages.value
    .filter(i => i !== toIndex)
    .map(i => {
      if (toIndex < fromIndex) {
        if (i >= toIndex && i < fromIndex) return i + 1
      } else {
        if (i > fromIndex && i <= toIndex) return i - 1
      }
      return i
    })
  if (movedSelected) {
    selectedPages.value.push(fromIndex)
  }

  pushHistory()
  canvasRefs.value.clear()
  dragIndex.value = null
  dragOverIndex.value = null
  await nextTick()
  await renderAllThumbnails()
}

const onDragEnd = () => {
  dragIndex.value = null
  dragOverIndex.value = null
}

const showContextMenu = (event: MouseEvent, index: number) => {
  contextMenuPageIndex.value = index
  contextMenuPos.value = { x: event.clientX, y: event.clientY }
  contextMenuVisible.value = true
}

const hideContextMenu = () => {
  contextMenuVisible.value = false
  contextMenuPageIndex.value = -1
}

const contextMenuAction = async (action: string) => {
  const idx = contextMenuPageIndex.value
  hideContextMenu()

  if (idx < 0 || idx >= pages.value.length) return

  switch (action) {
    case 'rotate-cw':
      rotatePage(idx, 90)
      break
    case 'rotate-ccw':
      rotatePage(idx, -90)
      break
    case 'rotate-180':
      rotatePage(idx, 180)
      break
    case 'select-before':
      selectedPages.value = Array.from({ length: idx }, (_, i) => i)
      break
    case 'select-after':
      selectedPages.value = Array.from(
        { length: pages.value.length - idx - 1 },
        (_, i) => idx + 1 + i
      )
      break
    case 'delete':
      await deletePage(idx)
      break
  }
}

const exportPdf = async () => {
  const allIndices = pages.value.map((_, i) => i)
  await exportPdfWithPages(allIndices, '_调整后')
}

const exportSelectedPdf = async () => {
  if (selectedPages.value.length === 0) return
  const sorted = [...selectedPages.value].sort((a, b) => a - b)
  await exportPdfWithPages(sorted, `_选中${sorted.length}页`)
}

const exportPdfWithPages = async (pageIndices: number[], suffix: string) => {
  if (!pdfBytes.value) return
  exporting.value = true

  try {
    const srcDoc = await PDFDocument.load(pdfBytes.value)
    const newDoc = await PDFDocument.create()

    for (const idx of pageIndices) {
      const pageItem = pages.value[idx]
      if (!pageItem) continue

      const [copiedPage] = await newDoc.copyPages(srcDoc, [pageItem.sourceIndex - 1])
      if (pageItem.rotation !== 0) {
        copiedPage.setRotation(degrees(pageItem.rotation))
      }
      newDoc.addPage(copiedPage)
    }

    const pdfBytesResult = await newDoc.save()
    const blob = new Blob([pdfBytesResult], { type: 'application/pdf' })
    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = url
    const baseName = fileName.value.replace(/\.pdf$/i, '')
    link.download = `${baseName}${suffix}.pdf`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    ElMessage.success('PDF导出成功')
  } catch (e) {
    console.error('Export failed:', e)
    ElMessage.error('PDF导出失败，请重试')
  } finally {
    exporting.value = false
  }
}

const handleClickOutside = () => {
  if (contextMenuVisible.value) {
    hideContextMenu()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  if (pdfDoc) {
    pdfDoc.destroy()
    pdfDoc = null
  }
})
</script>

<style scoped>
.pdf-adjuster {
  max-width: 1200px;
  margin: 0 auto;
}

.guide-card {
  margin-bottom: 24px;
}

.guide-steps {
  padding: 10px 0;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: bold;
}

.header-tag {
  margin-left: 12px;
  font-weight: normal;
}

.header-actions {
  margin-left: auto;
}

.upload-card {
  margin-bottom: 24px;
}

.upload-area {
  display: flex;
  justify-content: center;
  padding: 20px 0;
}

.pdf-uploader :deep(.el-upload-dragger) {
  width: 500px;
  padding: 60px 40px;
}

.pdf-uploader :deep(.el-upload) {
  width: 100%;
}

.upload-preview-hint {
  padding: 0 8px;
}

.hint-label {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 6px;
  font-size: 15px;
  font-weight: 600;
  color: #303133;
}

.hint-desc {
  font-size: 13px;
  color: #606266;
  margin-bottom: 16px;
  line-height: 1.5;
}

.mock-grid {
  display: flex;
  gap: 12px;
  justify-content: center;
  padding: 20px 16px;
  background: linear-gradient(135deg, #f8faff 0%, #f0f4ff 100%);
  border-radius: 12px;
  border: 1px dashed #c6d4f0;
  margin-bottom: 12px;
}

.mock-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  opacity: 0.85;
  transition: all 0.2s;
}

.mock-page.selected {
  opacity: 1;
}

.mock-page.deleted {
  opacity: 0.4;
  position: relative;
}

.mock-thumb {
  width: 56px;
  height: 72px;
  background: #fff;
  border-radius: 4px;
  border: 2px solid #dcdfe6;
  position: relative;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mock-page.selected .mock-thumb {
  border-color: #165DFF;
  background: #f0f5ff;
}

.mock-page.deleted .mock-thumb {
  border-color: #fbc4c4;
  background: #fff5f5;
}

.mock-lines {
  width: 36px;
  height: 48px;
  background: repeating-linear-gradient(
    180deg,
    #c0c4cc 0px,
    #c0c4cc 2px,
    transparent 2px,
    transparent 7px
  );
  border-radius: 2px;
  opacity: 0.5;
}

.mock-page.selected .mock-lines {
  opacity: 0.7;
}

.mock-check {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #165DFF;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.mock-rotate-badge {
  position: absolute;
  top: 2px;
  right: 2px;
  font-size: 8px;
  background: rgba(230, 162, 60, 0.9);
  color: #fff;
  padding: 1px 3px;
  border-radius: 2px;
  line-height: 1.2;
}

.mock-delete-line {
  position: absolute;
  top: 50%;
  left: -2px;
  right: -2px;
  height: 2px;
  background: #f56c6c;
  transform: rotate(-35deg);
}

.mock-num {
  font-size: 11px;
  color: #606266;
  font-weight: 500;
}

.hint-annotations {
  display: flex;
  justify-content: center;
  gap: 20px;
  flex-wrap: wrap;
}

.annotation {
  display: flex;
  align-items: center;
  gap: 3px;
  font-size: 12px;
  color: #909399;
}

.annotation .el-icon {
  color: #165DFF;
}

.feature-preview-section {
  margin-top: 16px;
}

.preview-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;
}

.preview-title {
  font-size: 16px;
  font-weight: 600;
  color: #303133;
}

.preview-subtitle {
  font-size: 13px;
  color: #909399;
  margin-left: 8px;
}

.feature-grid {
  margin-bottom: 16px;
}

.feature-card {
  display: flex;
  gap: 16px;
  padding: 16px;
  background: linear-gradient(135deg, #fafafa 0%, #f5f7fa 100%);
  border-radius: 12px;
  border: 1px solid #ebeef5;
  transition: all 0.3s ease;
  height: 100%;
}

.feature-card:hover {
  border-color: #165DFF;
  background: linear-gradient(135deg, #f0f5ff 0%, #e6f0ff 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(22, 93, 255, 0.1);
}

.feature-icon-wrapper {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #fff;
}

.feature-icon-wrapper.sort {
  background: linear-gradient(135deg, #409eff, #165DFF);
}

.feature-icon-wrapper.rotate {
  background: linear-gradient(135deg, #e6a23c, #cf9236);
}

.feature-icon-wrapper.delete {
  background: linear-gradient(135deg, #f56c6c, #dd6161);
}

.feature-icon-wrapper.extract {
  background: linear-gradient(135deg, #67c23a, #529e2e);
}

.feature-icon-wrapper.select {
  background: linear-gradient(135deg, #909399, #73767a);
}

.feature-icon-wrapper.undo {
  background: linear-gradient(135deg, #165DFF, #0e42b8);
}

.feature-content {
  flex: 1;
  min-width: 0;
}

.feature-title {
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-bottom: 4px;
}

.feature-desc {
  font-size: 12px;
  color: #606266;
  line-height: 1.5;
  margin-bottom: 8px;
}

.feature-example {
  display: flex;
  align-items: center;
  gap: 6px;
}

.feature-example .badge {
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 4px;
  white-space: nowrap;
}

.feature-example .badge.before {
  background: #f4f4f5;
  color: #909399;
}

.feature-example .badge.after {
  background: linear-gradient(135deg, #e0f2fe, #bae6fd);
  color: #0369a1;
  font-weight: 500;
}

.feature-example .arrow {
  font-size: 12px;
  color: #c0c4cc;
}

.privacy-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
  border-radius: 8px;
  font-size: 13px;
  color: #166534;
  margin-top: 8px;
}

.privacy-note .el-icon {
  color: #22c55e;
}

.toolbar-card {
  margin-bottom: 24px;
}

.toolbar-section {
  margin-bottom: 16px;
}

.toolbar-row {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.toolbar-label {
  font-size: 14px;
  font-weight: 500;
  color: #303133;
  white-space: nowrap;
}

.page-info-bar {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 12px 16px;
  background: linear-gradient(135deg, #f0f7ff 0%, #e6f4ff 100%);
  border-radius: 8px;
  margin-top: 16px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  color: #606266;
}

.selected-info {
  color: #165DFF;
  font-weight: 500;
}

.preview-card {
  margin-bottom: 24px;
}

.pages-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
  min-height: 200px;
}

.page-item {
  position: relative;
  border: 2px solid #e4e7ed;
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #fff;
  user-select: none;
}

.page-item:hover {
  border-color: #409eff;
  box-shadow: 0 2px 12px rgba(64, 158, 255, 0.2);
  transform: translateY(-2px);
}

.page-item.is-selected {
  border-color: #165DFF;
  background: #f0f5ff;
  box-shadow: 0 0 0 2px rgba(22, 93, 255, 0.25);
}

.page-item.is-dragging {
  opacity: 0.5;
  transform: scale(0.95);
}

.page-item.is-drag-over {
  border-color: #67c23a;
  background: #f0f9eb;
  transform: scale(1.02);
}

.page-thumb-wrapper {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  background: #f5f7fa;
  border-radius: 4px;
  overflow: hidden;
  min-height: 180px;
  align-items: center;
}

.page-thumb {
  max-width: 100%;
  max-height: 220px;
  display: block;
}

.page-rotate-badge {
  position: absolute;
  top: 4px;
  right: 4px;
  background: rgba(230, 162, 60, 0.9);
  color: #fff;
  font-size: 11px;
  padding: 2px 6px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 2px;
}

.page-select-check {
  position: absolute;
  top: 4px;
  left: 4px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: #165DFF;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
}

.page-number {
  text-align: center;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  margin-top: 8px;
  padding: 2px 0;
}

.page-actions {
  display: flex;
  justify-content: center;
  gap: 4px;
  margin-top: 6px;
  opacity: 0;
  transition: opacity 0.2s;
}

.page-item:hover .page-actions {
  opacity: 1;
}

.page-actions .el-button--small {
  padding: 4px;
  width: 28px;
  height: 28px;
}

.export-card {
  margin-bottom: 24px;
}

.export-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.export-options {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.context-menu {
  position: fixed;
  z-index: 9999;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
  padding: 4px 0;
  min-width: 200px;
}

.context-menu-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  font-size: 14px;
  color: #303133;
  cursor: pointer;
  transition: background 0.2s;
}

.context-menu-item:hover {
  background: #f0f5ff;
  color: #165DFF;
}

.context-menu-item.danger {
  color: #f56c6c;
}

.context-menu-item.danger:hover {
  background: #fef0f0;
  color: #f56c6c;
}

.context-menu-divider {
  height: 1px;
  background: #ebeef5;
  margin: 4px 0;
}

.context-menu-dialog {
  display: none;
}
</style>
