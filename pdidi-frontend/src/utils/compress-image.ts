export async function compressImage(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()
        
        reader.onload = (e) => {
            const img = new Image()
            
            img.onload = () => {
                const canvas = document.createElement('canvas')
                const maxWidth = 100
                const maxHeight = 100
                
                let width = img.width
                let height = img.height
                
                if (width > height) {
                    if (width > maxWidth) {
                        height = Math.round((height * maxWidth) / width)
                        width = maxWidth
                    }
                } else {
                    if (height > maxHeight) {
                        width = Math.round((width * maxHeight) / height)
                        height = maxHeight
                    }
                }
                
                canvas.width = width
                canvas.height = height
                
                const ctx = canvas.getContext('2d')
                ctx?.drawImage(img, 0, 0, width, height)
                
                const compressedBase64 = canvas.toDataURL('image/jpeg', 0.3)
                resolve(compressedBase64)
            }
            
            img.onerror = () => {
                reject(new Error('Failed to load image'))
            }
            
            img.src = e.target?.result as string
        }
        
        reader.onerror = () => {
            reject(new Error('Failed to read file'))
        }
        
        reader.readAsDataURL(file)
    })
}