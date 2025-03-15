"use client"

import { useState, useEffect, useRef,  useCallback } from "react"

interface PreviewProps {
  templateCode: string
  cssCode: string
  data: string
}

export default function Preview({ templateCode, cssCode, data }: PreviewProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)
  const [error, setError] = useState<string | null>(null)

  const replaceVariables = useCallback((code: string, data: any, regex: RegExp) => code.replace(regex, (_, key) => (key in data ? data[key] : "")), [])
  const renderEJS = useCallback((code: string, data: object) => replaceVariables(code, data, /<%=\s*(\w+)\s*%>/g), [replaceVariables])
  const renderHandlebars = useCallback((code: string, data: object)=> replaceVariables(code, data, /{{\s*(\w+)\s*}}/g), [replaceVariables])
  const renderNunjucks = useCallback((code: string, data: object) => replaceVariables(code, data, /{{\s*(\w+)\s*}}/g), [replaceVariables])

  useEffect(() => {
    try {
      const dataObj = JSON.parse(data)
      let html = ""
      const engine = detectTemplateEngine(templateCode)

      switch (engine) {
        case "ejs":
          html = renderEJS(templateCode, dataObj)
          break
        case "handlebars":
          html = renderHandlebars(templateCode, dataObj)
          break
        case "nunjucks":
          html = renderNunjucks(templateCode, dataObj)
          break
        default:
          throw new Error("Engine não suportada")
      }

      injectIntoIframe(html, cssCode)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao processar template")
    }
  }, [templateCode, data, cssCode, renderEJS, renderHandlebars, renderNunjucks])

  function detectTemplateEngine(code: string): string {
    if (/<%=\s*\w+\s*%>/.test(code) || /<%\s*\w+\s*%>/.test(code)) return "ejs"
    if (/{{\s*\w+\s*}}/.test(code)) return "handlebars" // Handlebars e Nunjucks compartilham a mesma sintaxe
    if (/^\s*\w+/.test(code) && !/<|{{|%/.test(code)) return "pug" // Sem tags HTML, parece Pug
    return "nunjucks" // Se usa `{{ }}` e não for identificado como Handlebars, assumimos Nunjucks
  }

  function injectIntoIframe(html: string, css: string) {
    const iframe = iframeRef.current
    if (iframe) {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
      if (iframeDoc) {
        iframeDoc.open()
        iframeDoc.write(`
          <html>
            <head>
              <style>${css}</style>
            </head>
            <body>
              ${html}
            </body>
          </html>
        `)
        iframeDoc.close()
      }
    }
  }

  return (
    <div className="h-[400px]">
      {error ? (
        <div className="text-red-500 p-4 border border-red-300 rounded bg-red-50">
          <p className="font-bold">Error:</p>
          <p>{error}</p>
        </div>
      ) : (
        <div className="preview-container h-full">
          <iframe ref={iframeRef} className="w-full h-full" title="Preview" />
        </div>
      )}
    </div>
  )
}
