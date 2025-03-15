"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import CodeEditor from "@/components/code-editor"
import Preview from "@/components/preview"
import { Download, Copy, MessageSquare } from "lucide-react"

import ChatInterface from "@/components/chat-interface";
import Header from "@/components/header"

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

  const handleCodeGenerated = (contentCode: string, css: string) => {
    setEjsCode(contentCode)
    setCssCode(css)
    setShowChat(false)
  }

  return (
    <>
      <Header isLogged={false} />

      <main className="container mx-auto p-4">
        <div className="flex justify-end mb-4">
          <Button
            variant={showChat ? "default" : "outline"}
            onClick={() => setShowChat(!showChat)}
            className="bg-black text-white hover:bg-gray-800 flex items-center gap-2"
          >
            <MessageSquare className="h-4 w-4" />
            Ask 0UI to build...
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
                <TabsList className="bg-[#18181b] grid w-full grid-cols-3 mb-2 justify-center">
                  <TabsTrigger value="ejs">Template</TabsTrigger>
                  <TabsTrigger value="css">CSS</TabsTrigger>
                  <TabsTrigger value="data">Data</TabsTrigger>
                </TabsList>

                <TabsContent value="ejs" className="space-y-2">
                  <Card>
                    <CardContent className="p-0">
                      <CodeEditor value={ejsCode} onChange={setEjsCode} height="300px" />
                    </CardContent>
                  </Card>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(ejsCode)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button size="sm" onClick={() => downloadFile(ejsCode, "template.ejs")}>
                      <Download className="h-4 w-4 mr-2" />
                      Download content
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="css" className="space-y-2">
                  <Card>
                    <CardContent className="p-0">
                      <CodeEditor value={cssCode} onChange={setCssCode} height="300px" />
                    </CardContent>
                  </Card>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => copyToClipboard(cssCode)}>
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                    <Button size="sm" onClick={() => downloadFile(cssCode, "styles.css")}>
                      <Download className="h-4 w-4 mr-2" />
                      Download CSS
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="data" className="space-y-2">
                  <Card>
                    <CardContent className="p-0">
                      <CodeEditor value={data} onChange={setData} height="300px" />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div className="space-y-4">
              <h2 className="text-xl font-semibold">Preview</h2>
              <Card className="py-2 min-h-[400px]">
                <CardContent className="p-2 h-full">
                  <Preview templateCode={ejsCode} cssCode={cssCode} data={data} />
                </CardContent>
              </Card>
              <div className="flex justify-end gap-2">
                <Button
                  onClick={() => downloadFile(`${ejsCode}\n\n<style>\n${cssCode}\n</style>`, "template-with-styles.ejs")}
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download Complete Template
                </Button>
              </div>
            </div>
          </div>
        )}
        <footer className="text-center p-4 mt-8">
          <p className="text-sm">&copy; {new Date().getFullYear()} All rights reserved. Developed by t-heu</p>
        </footer>
      </main>
    </>
  )
}
