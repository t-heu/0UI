"use client"

import { useState, useEffect, useRef } from "react"

interface PreviewProps {
  ejsCode: string
  cssCode: string
  data: string
}

export default function Preview({ ejsCode, cssCode, data }: PreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      // Parse the data JSON
      const dataObj = JSON.parse(data)

      // Simple EJS-like template rendering
      let html = ejsCode

      // Replace <%= variable %> patterns
      Object.keys(dataObj).forEach((key) => {
        const regex = new RegExp(`<%=\\s*${key}\\s*%>`, "g")
        html = html.replace(regex, dataObj[key])
      })

      // Inject the generated HTML and CSS into the iframe
      const iframe = iframeRef.current
      if (iframe) {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
        if (iframeDoc) {
          iframeDoc.open()
          iframeDoc.write(`
            <html>
              <head>
                <style>${cssCode}</style>
              </head>
              <body>
                ${html}
              </body>
            </html>
          `)
          iframeDoc.close()
        }
      }

      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    }
  }, [ejsCode, data, cssCode])

  return (
    <div className="h-full">
      {error ? (
        <div className="text-red-500 p-4 border border-red-300 rounded bg-red-50">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      ) : (
        <div className="preview-container">
          {/* Isolated iframe for the rendered HTML and CSS */}
          <iframe ref={iframeRef} className="w-full h-full" title="Preview" />
        </div>
      )}
    </div>
  )
}

/*
export default function Preview({ ejsCode, cssCode, data }: PreviewProps) {
  const [renderedHtml, setRenderedHtml] = useState("")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      // Parse the data JSON
      const dataObj = JSON.parse(data)

      // Simple EJS-like template rendering
      let html = ejsCode

      // Replace <%= variable %> patterns
      Object.keys(dataObj).forEach((key) => {
        const regex = new RegExp(`<%=\\s*${key}\\s*%>`, "g")
        html = html.replace(regex, dataObj[key])
      })

      setRenderedHtml(html)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    }
  }, [ejsCode, data])

  return (
    <div className="h-full">
      {error ? (
        <div className="text-red-500 p-4 border border-red-300 rounded bg-red-50">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      ) : (
        <div className="preview-container">
          <style dangerouslySetInnerHTML={{ __html: cssCode }} />
          <div dangerouslySetInnerHTML={{ __html: renderedHtml }} />
        </div>
      )}
    </div>
  )
}*/
