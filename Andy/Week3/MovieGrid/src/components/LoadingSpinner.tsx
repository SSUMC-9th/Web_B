export const LoadingSpinner = () => {
  return (
    <div
      className='size-16 animate-spin rounded-full border-8 border-t-transparent border-red-500'
      role='status'
    >
      <span className='sr-only'>로딩 중...</span>
    </div>
  )
}