"use client"

import { useState, useEffect, useCallback } from "react"
import {
  Download,
  Copy,
  Code,
  Database,
  Palette,
  Loader2,
  Send
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import Header from "@/components/header";
import Footer from "@/components/footer";
import { useTranslation } from 'react-i18next';

import generateCode from "./utils/generateCode";
import { useUser } from "./context/userContext"
import { ref, database, update } from "../app/api/firebase";

export default function Home() {
  const { points, user, setPoints, loading } = useUser();
  const { t } = useTranslation();

  const [htmlCode, setHtmlCode] = useState(`<h1><%= title %></h1>\n<p><%= content %></p>`)
  const [cssCode, setCssCode] = useState(`h1 {\n  color: #333;\n  font-size: 24px;\n}\n\np {\n  color: #666;\n  line-height: 1.6;\n}`)
  const [dataCode, setDataCode] = useState(`{\n  "title": "Hello World",\n  "content": "This is an EJS template with dynamic content."\n}`)
  const [codePreview, setCodePreview] = useState('')
  const [engine, setEngine] = useState('ejs')

  const [error, setError] = useState<string | null>(null)
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false);

  const mostSearched = ['Clone a google', 'Landing Page', 'Sign Up Form', 'Page Calculate Factorial', 'Crie um título com variável title em handlebars'];

  const combinedCode = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>My Project</title>
      <style>
        ${cssCode}
      </style>
    </head>
    <body>
      ${codePreview}
    </body>
    </html>
  `;

  const replaceVariables = useCallback((code: string, data: any, regex: RegExp) => {
    const dataCodeHtml = code.replace(regex, (_, key) => (key in data ? data[key] : ""))

    setCodePreview(dataCodeHtml)
  }, [])

  const renderTemplate = useCallback((code: string, data: object, engineP: string) => {
    const regexMap: any = {
      ejs: /<%=\s*(\w+)\s*%>/g,
      handlebars: /{{\s*(\w+)\s*}}/g,
      nunjucks: /{{\s*(\w+)\s*}}/g
    };
  
    const regex = regexMap[engineP];
    replaceVariables(code, data, regex);
  }, [replaceVariables]);

  const codeGenerated = useCallback((contentCode: string, css: string, dataObj: any) => {
    renderTemplate(contentCode, dataObj, engine);
    setHtmlCode(contentCode);
    setCssCode(css);
  }, [renderTemplate, engine]);

  useEffect(() => {
    const dataObj = JSON.parse(dataCode);
    codeGenerated(htmlCode, cssCode, dataObj);
  }, [htmlCode, cssCode, dataCode, codeGenerated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (!user) {
      alert(t("errors.login_required"));
      return;
    }

    if (points < 30) {
      alert(t("errors.insufficient_points"))
      return;
    }
  
    setInput("");
    setIsLoading(true);
  
    try {
      setPoints((prev) => prev - 30);
      const userRef = ref(database, `0UI/users/${user.uid}`);
      await update(userRef, { credits: points - 30, updateAt: new Date().toISOString() });

      const generatedCode = await generateCode(input);
      const { ejs, html, nunjucks, handlebars, pug, css } = JSON.parse(generatedCode);

      const codeMapping = { ejs, html, nunjucks, handlebars, pug };
      const [source, code] = Object.entries(codeMapping).find(([_, value]) => typeof value === "string") || ["none", "<h1>404</h1>"];

      setEngine(source)
      codeGenerated(code, css || "", JSON.parse(dataCode));
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errors.error_processing_template"));
    } finally {
      setIsLoading(false);
    }
  };

  const downloadFile = (content: string, filename: string) => {
    const element = document.createElement("a")
    const file = new Blob([content], { type: "text/plain" })
    element.href = URL.createObjectURL(file)
    element.download = filename
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <section className="container py-24 text-center pb-0">
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">{t("interface.create_edit_live_title")}</h1>
          <div className="mx-auto mt-12 max-w-3xl">
            <form onSubmit={handleSubmit} className="relative">
              <Input disabled={isLoading} value={input} onChange={(e: any) => setInput(e.target.value)} className="h-30 pl-4 pr-12 text-base" placeholder={t("interface.ask_0ui_placeholder")} />
              <div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-2">
                {!isLoading ? (
                  <Button type="submit" variant="ghost" size="icon" className="h-10 w-10">
                    <Send size={10} />
                  </Button>
                ) : (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <p>{t("interface.generating_code")}</p>
                  </div>
                )}
              </div>
            </form>
            <p className="mt-4 text-[#333]">{t("interface.most_searched_topics")}</p>
            <div className="mt-5 flex flex-wrap items-center justify-center gap-4">
              {mostSearched.map((text: string, i: number) => (
                <Button onClick={() => setInput(text)} key={i} variant="outline" className="h-10 gap-2 rounded-md px-4 py-2">
                  {text}
                </Button>
              ))}
            </div>
          </div>
        </section>

        <section className="container py-12">
          <div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
            <div className="space-y-3">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-2xl font-bold">{t("interface.code_editor")}</h2>
                <div className="flex items-center gap-2">
                  <Button onClick={() => downloadFile(`${htmlCode}\n\n<style>\n${cssCode}\n</style>`, "template-with-styles.ejs")} variant="outline">
                    <Download className="mr-2 h-4 w-4" />
                    {t("interface.download_button")}
                  </Button>
                </div>
              </div>
              <Tabs defaultValue="html" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="html" className="flex items-center gap-2">
                    <Code className="h-4 w-4" />
                    HTML
                  </TabsTrigger>
                  <TabsTrigger value="css" className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    CSS
                  </TabsTrigger>
                  <TabsTrigger value="data" className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    Data
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="html">
                  <Card>
                    <CardContent className="p-0">
                      <div className="relative">
                        <Textarea
                          value={htmlCode}
                          onChange={(e) => setHtmlCode(e.target.value)}
                          className="border-none min-h-[400px] font-mono text-sm"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          title="copy"
                          className="absolute right-2 top-2"
                          onClick={() => navigator.clipboard.writeText(htmlCode)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="css">
                  <Card>
                    <CardContent className="p-0">
                      <div className="relative">
                        <Textarea
                          value={cssCode}
                          onChange={(e) => setCssCode(e.target.value)}
                          className="min-h-[400px] font-mono text-sm"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          title="copy"
                          className="absolute right-2 top-2"
                          onClick={() => navigator.clipboard.writeText(cssCode)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="data">
                  <Card>
                    <CardContent className="p-0">
                      <div className="relative">
                        <Textarea
                          value={dataCode}
                          onChange={(e) => setDataCode(e.target.value)}
                          className="min-h-[400px] font-mono text-sm"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          title="copy"
                          className="absolute right-2 top-2"
                          onClick={() => navigator.clipboard.writeText(dataCode)}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <h2 className="text-2xl font-bold">{t("interface.preview_title")}</h2>
                <Button title="copy" variant="outline" size="sm">
                  <Copy className="mr-2 h-4 w-4" />
                  {t("interface.copy_code_button")}
                </Button>
              </div>
              <div className="rounded-lg border bg-background">
                <div className="border-b p-2">
                  <div className="flex items-center gap-1">
                    <div className="h-3 w-3 rounded-full bg-red-500"></div>
                    <div className="h-3 w-3 rounded-full bg-yellow-500"></div>
                    <div className="h-3 w-3 rounded-full bg-green-500"></div>
                    <div className="ml-2 text-xs text-muted-foreground">{t("interface.preview_title")}</div>
                  </div>
                </div>
                {error ? (
                  <div className="text-red-500 mt-4">Error: {error}</div>
                ) : (
                  <iframe
                    srcDoc={combinedCode}
                    title="Preview"
                    className="h-[500px] w-full"
                    sandbox="allow-scripts allow-downloads"
                    referrerPolicy="no-referrer"
                    loading="lazy"
                  />
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
