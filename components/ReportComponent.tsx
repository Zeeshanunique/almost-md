import React, { ChangeEvent, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import SocialMediaLinks from '@/components/SocialMediaLinks'
// import { toast } from 'sonner'
import { useToast } from "@/components/ui/use-toast"

type Props = {
    onReportConfirmation: (data: string) => void
}
const ReportComponent = ({ onReportConfirmation }: Props) => {
    const { toast } = useToast()

    const [isLoading, setIsLoading] = useState(false)
    const [reportData, setReportData] = useState("")
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    function handleReportSelection(event: ChangeEvent<HTMLInputElement>): void {
        const file = event.target.files?.[0]
        if (file) {
            setSelectedFile(file)
            compressImage(file, (compressedFile) => {
                setSelectedFile(compressedFile)
            })
        }
    }

    function compressImage(file: File, callback: (compressedFile: File) => void) {
        const reader = new FileReader()
        reader.readAsDataURL(file)
        reader.onload = (event) => {
            const img = new Image()
            img.src = event.target?.result as string
            img.onload = () => {
                const canvas = document.createElement('canvas')
                const ctx = canvas.getContext('2d')
                if (!ctx) return

                // Calculate new dimensions while maintaining aspect ratio
                let width = img.width
                let height = img.height
                const maxDimension = 800

                if (width > height) {
                    if (width > maxDimension) {
                        height = height * (maxDimension / width)
                        width = maxDimension
                    }
                } else {
                    if (height > maxDimension) {
                        width = width * (maxDimension / height)
                        height = maxDimension
                    }
                }

                canvas.width = width
                canvas.height = height
                ctx.drawImage(img, 0, 0, width, height)

                canvas.toBlob((blob) => {
                    if (blob) {
                        const compressedFile = new File([blob], file.name, {
                            type: 'image/jpeg',
                            lastModified: Date.now(),
                        })
                        callback(compressedFile)
                    }
                }, 'image/jpeg', 0.7)
            }
        }
    }

    async function extractDetails(): Promise<void> {
        if (!selectedFile) {
            toast({
                variant: 'destructive',
                description: "Please select a file first!",
            })
            return
        }

        setIsLoading(true)
        const formData = new FormData()
        formData.append('file', selectedFile)

        try {
            const response = await fetch('/api/extract', {
                method: 'POST',
                body: formData,
            })

            if (!response.ok) {
                throw new Error('Failed to extract details')
            }

            const data = await response.json()
            setReportData(data.text)
        } catch (error) {
            console.error('Error:', error)
            toast({
                variant: 'destructive',
                description: "Failed to extract details. Please try again.",
            })
        } finally {
            setIsLoading(false)
        }
    }

    function viewUpdatedDocument() {
        if (selectedFile) {
            const url = URL.createObjectURL(selectedFile)
            window.open(url, '_blank')
        } else {
            toast({
                variant: 'destructive',
                description: "No document available to view!",
            })
        }
    }

    return (
        <div className="grid w-full items-start gap-6 overflow-auto p-4 pt-0">
            <fieldset className='relative grid gap-6 rounded-lg border p-4'>
                <legend className="text-sm font-medium">Report</legend>
                {isLoading && (
                    <div className="absolute z-10 h-full w-full bg-card/90 rounded-lg flex flex-row items-center justify-center">
                        extracting...
                    </div>
                )}
                <Input 
                    type='file'
                    onChange={handleReportSelection} 
                />
                <Button onClick={extractDetails}>1. Upload File</Button>
                <Button
                    variant="outline"
                    className="text-sm"
                    onClick={viewUpdatedDocument}
                >
                    View File
                </Button>
                <Label>Report Summary</Label>
                <Textarea
                    value={reportData}
                    onChange={(e) => {
                        setReportData(e.target.value)
                    }}
                    placeholder="Extracted data from the report will appear here. Get better recommendations by providing additional patient history and symptoms..."
                    className="min-h-72 resize-none border-0 p-3 shadow-none focus-visible:ring-0" 
                />
                <Button
                    variant="destructive"
                    className="bg-[#0074d976]"
                    onClick={() => {
                        onReportConfirmation(reportData)
                    }}
                >
                    2. Confirm Report
                </Button>
                <div className='flex flex-row items-center justify-center gap-2 p-4'>
                    <Label>Share your thoughts </Label>
                    <SocialMediaLinks />
                </div>
            </fieldset>
        </div>
    )
}

export default ReportComponent