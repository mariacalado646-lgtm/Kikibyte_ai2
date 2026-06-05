import { useState, useRef } from 'react'
import { submitContactForm } from '../services/contactService'

const INITIAL_FORM = { nome: '', email: '', telefone: '', empresa: '', mensagem: '' }

const fileToBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload  = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
})

export function useContact() {
    const [formData, setFormData]           = useState(INITIAL_FORM)
    const [uploadedFiles, setUploadedFiles] = useState([])
    const [isSubmitted, setIsSubmitted]     = useState(false)
    const [isLoading, setIsLoading]         = useState(false)
    const [error, setError]                 = useState(null)
    const fileInputRef                      = useRef(null)

    const handleChange = (e) => {
        setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    const handleFileSelect = (e) => {
        const files = Array.from(e.target.files || [])
        const valid = files.filter(file => {
            const ext = file.name.split('.').pop()?.toLowerCase()
            return ['pdf', 'doc', 'docx', 'xls', 'xlsx'].includes(ext || '')
        })
        if (valid.length > 0) setUploadedFiles(prev => [...prev, ...valid])
    }

    const removeFile = (index) => {
        setUploadedFiles(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setIsLoading(true)
        setError(null)

        try {
            const base64Files = await Promise.all(uploadedFiles.map(async (file) => ({
                name: file.name,
                size: file.size,
                type: file.type,
                data: await fileToBase64(file)
            })))

            await submitContactForm({
                nome:      formData.nome,
                email:     formData.email,
                telefone:  formData.telefone,
                empresa:   formData.empresa,
                mensagem:  formData.mensagem,
                doc_base64: base64Files.length > 0 ? JSON.stringify(base64Files) : null
            })

            setIsSubmitted(true)
            setTimeout(() => {
                setIsSubmitted(false)
                setFormData(INITIAL_FORM)
                setUploadedFiles([])
            }, 3000)
        } catch (err) {
            setError(err.response?.data?.error || 'Erro ao enviar mensagem. Tente novamente.')
        } finally {
            setIsLoading(false)
        }
    }

    const formatFileSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B'
            if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB'
                return (bytes / (1024 * 1024)).toFixed(1) + ' MB'
    }

    return {
        formData, uploadedFiles, isSubmitted, isLoading, error,
            fileInputRef, handleChange, handleFileSelect, removeFile,
            handleSubmit, formatFileSize
    }
}
