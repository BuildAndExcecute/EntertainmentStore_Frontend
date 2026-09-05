import * as React from "react"

type ResourceState<T> = {
  data: T | null
  loading: boolean
  error: Error | null
}

export function useApiResource<T>(
  loader: () => Promise<T>,
  dependencies: React.DependencyList = []
) {
  const [state, setState] = React.useState<ResourceState<T>>({
    data: null,
    loading: true,
    error: null,
  })

  const execute = React.useCallback(() => {
    let mounted = true

    setState((current) => ({
      ...current,
      loading: true,
      error: null,
    }))

    loader()
      .then((data) => {
        if (mounted) {
          setState({
            data,
            loading: false,
            error: null,
          })
        }
      })
      .catch((error) => {
        if (mounted) {
          setState({
            data: null,
            loading: false,
            error,
          })
        }
      })

    return () => {
      mounted = false
    }
  }, dependencies)

  React.useEffect(() => {
    const cleanup = execute()
    return cleanup
  }, [execute])

  return {
    ...state,
    refetch: execute,
  }
}