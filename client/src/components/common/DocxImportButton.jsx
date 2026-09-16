import { useRef, useState } from 'react'
import { Upload, Download } from 'lucide-react'
import toast from 'react-hot-toast'

/**
 * Props:
 *  - onDownloadTemplate: () => Promise<AxiosResponse<Blob>>
 *  - templateFilename:   string  e.g. "listings_template.docx"
 *  - onUpload:           (File) => Promise<void>
 *  - label:              string
 */
export default function DocxImportButton({ onDownloadTemplate, templateFilename, onUpload, label = 'Import from Word' }) {
  const inputRef = useRef(null)
  const [uploading, setUploading]     = useState(false)
  const [downloading, setDownloading] = useState(false)

  async function handleDownload() {
    setDownloading(true)
    try {
      const res = await onDownloadTemplate()
      const url = URL.createObjectURL(new Blob([res.data]))
      const a   = document.createElement('a')
      a.href     = url
      a.download = templateFilename ?? 'template.docx'
      a.click()
      URL.revokeObjectURL(url)
    } catch {
      toast.error('Failed to download template')
    } finally {
      setDownloading(false)
    }
  }

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.name.endsWith('.docx')) {
      toast.error('Please upload a .docx file')
      e.target.value = ''
      return
    }
    setUploading(true)
    try {
      await onUpload(file)
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        disabled={downloading}
        onClick={handleDownload}
        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:text-gray-900 disabled:opacity-60 transition-colors"
      >
        {downloading
          ? <span className="w-3.5 h-3.5 border-2 border-gray-400/40 border-t-gray-500 rounded-full animate-spin" />
          : <Download size={15} />}
        Template
      </button>

      <button
        type="button"
        disabled={uploading}
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-white bg-orange-500 rounded-lg hover:bg-orange-600 disabled:opacity-60 transition-colors"
      >
        {uploading
          ? <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          : <Upload size={15} />}
        {uploading ? 'Importing…' : label}
      </button>

      <input
        ref={inputRef}
        type="file"
        accept=".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        className="hidden"
        onChange={handleFile}
      />
    </div>
  )
}
