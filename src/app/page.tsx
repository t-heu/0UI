"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import CodeEditor from "@/components/ui/code-editor"
import Preview from "@/components/ui/preview"
import ChatInterface from "@/components/ui/chat-interface";
import { Download, Copy, MessageSquare } from "lucide-react"

export default function Home() {
  const [ejsCode, setEjsCode] = useState("<h1><%= title %></h1>\n<p><%= content %></p>")
  const [cssCode, setCssCode] = useState(
    "h1 {\n  color: #333;\n  font-size: 24px;\n}\n\np {\n  color: #666;\n  line-height: 1.6;\n}",
  )
  const [data, setData] = useState(
    '{\n  "title": "Hello World",\n  "content": "This is an EJS template with dynamic content."\n}',
  )
  const [showChat, setShowChat] = useState(false)

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const downloadFile = (content: string, filename: string) => {
    const element = document.createElement("a")
    const file = new Blob([content], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = filename
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  const handleCodeGenerated = (ejs: string, css: string) => {
    setEjsCode(ejs)
    setCssCode(css)
    setShowChat(false)
  }

  return (
    <main className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">{'</z3r07$>'}</h1>

      <div className="flex justify-end mb-4">
        <Button
          variant={showChat ? "default" : "outline"}
          onClick={() => setShowChat(!showChat)}
          className="bg-black text-white hover:bg-gray-800 flex items-center gap-2"
        >
          <MessageSquare className="h-4 w-4" />
          AI Chat
        </Button>
      </div>

      {showChat ? (
        <Card className="mb-6">
          <CardContent className="p-4">
            <ChatInterface onCodeGenerated={handleCodeGenerated} />
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-6">
            <Tabs defaultValue="ejs">
              <TabsList className="bg-[#ececec] grid w-full grid-cols-3 mb-2">
                <TabsTrigger value="ejs">EJS Template</TabsTrigger>
                <TabsTrigger value="css">CSS</TabsTrigger>
                <TabsTrigger value="data">Data</TabsTrigger>
              </TabsList>

              <TabsContent value="ejs" className="space-y-2">
                <Card>
                  <CardContent className="p-0">
                    <CodeEditor value={ejsCode} onChange={setEjsCode} language="html" height="300px" />
                  </CardContent>
                </Card>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(ejsCode)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button className="bg-black text-white hover:bg-gray-800" size="sm" onClick={() => downloadFile(ejsCode, "template.ejs")}>
                    <Download className="h-4 w-4 mr-2" />
                    Download EJS
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="css" className="space-y-2">
                <Card>
                  <CardContent className="p-0">
                    <CodeEditor value={cssCode} onChange={setCssCode} language="css" height="300px" />
                  </CardContent>
                </Card>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" onClick={() => copyToClipboard(cssCode)}>
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                  <Button className="bg-black text-white hover:bg-gray-800" size="sm" onClick={() => downloadFile(cssCode, "styles.css")}>
                    <Download className="h-4 w-4 mr-2" />
                    Download CSS
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="data" className="space-y-2">
                <Card>
                  <CardContent className="p-0">
                    <CodeEditor value={data} onChange={setData} language="json" height="300px" />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Preview</h2>
            <Card className="min-h-[400px]">
              <CardContent className="p-4">
                <Preview ejsCode={ejsCode} cssCode={cssCode} data={data} />
              </CardContent>
            </Card>
            <div className="flex justify-end gap-2">
              <Button
                className="bg-black text-white hover:bg-gray-800"
                onClick={() => downloadFile(`${ejsCode}\n\n<style>\n${cssCode}\n</style>`, "template-with-styles.ejs")}
              >
                <Download className="h-4 w-4 mr-2" />
                Download Complete Template
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
