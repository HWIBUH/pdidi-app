import { useState } from 'react'
import { validateAdmin } from '@/service/auth.service'

interface AdminPasswordModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function AdminPasswordModal({ isOpen, onClose, onSuccess }: AdminPasswordModalProps) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!password) {
      setError('Password required')
      return
    }

    setLoading(true)
    setError('')

    try {
      await validateAdmin(password)
      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.response?.data?.error || 'Invalid password')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-sm mx-4 shadow-lg">
        <h2 className="text-sm font-semibold text-ink mb-4">Admin password</h2>
        <div className="mb-4">
          <label className="block text-sm font-medium text-muted mb-1.5">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value)
              setError('')
            }}
            disabled={loading}
            className="w-full h-10 px-3 rounded-lg border border-hairline text-ink text-sm placeholder:text-muted-soft focus:outline-none focus:border-primary transition-colors"
            onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
          />
          {error && <p className="text-error text-sm mt-1.5">{error}</p>}
        </div>
        <div className="flex gap-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="flex-1 h-9 rounded-lg border border-hairline text-ink text-sm font-medium transition-colors hover:bg-surface-card"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex-1 h-9 rounded-lg bg-primary text-on-primary text-sm font-medium transition-colors hover:bg-primary-active disabled:opacity-50"
          >
            {loading ? 'Validating...' : 'Validate'}
          </button>
        </div>
      </div>
    </div>
  )
}
