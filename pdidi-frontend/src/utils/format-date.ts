export const formatDateLocal = (minutes: number) => {
    const date = new Date(Date.now() + minutes * 60000)
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    const hours = String(date.getHours()).padStart(2, '0')
    const mins = String(date.getMinutes()).padStart(2, '0')
    return `${year}-${month}-${day}T${hours}:${mins}`
}

export function getTimeRemaining(expiryDate: string | Date): string {
    const expiry = new Date(expiryDate);
    const now = new Date();
    const diffMs = expiry.getTime() - now.getTime();
    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
        const remainingHours = diffHours % 24;
        return `${diffDays}d ${remainingHours}h left`;
    }
    if (diffHours > 0) {
        const remainingMinutes = diffMinutes % 60;
        return `${diffHours}h ${remainingMinutes}m left`;
    }
    if (diffMinutes > 0) {
        const remainingSeconds = diffSeconds % 60;
        return `${diffMinutes}m ${remainingSeconds}s left`;
    }
    if (diffSeconds > 0) {
        return `${diffSeconds}s left`;
    }
    return 'expires soon';
}