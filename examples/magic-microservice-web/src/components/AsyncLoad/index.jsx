import React from 'react'
import Loading from '@/components/Loading'

export default lazyImport => {
  const Component = React.lazy(lazyImport)
  return props => (
    <React.Suspense fallback={<Loading />}>
      <Component {...props} />
    </React.Suspense>
  )
}
