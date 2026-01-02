"use client"

import { useState, useRef, useEffect } from "react"
import { ContentBlock } from "@/components/article"
import { Type, List, ListOrdered, Quote, Image as ImageIcon, Minus, Heading1, Heading2, Heading3, Info, AlertTriangle, XCircle, CheckCircle, Undo, Redo } from "lucide-react"

interface SimpleEditorProps {
  blocks: ContentBlock[]
  onChange: (blocks: ContentBlock[]) => void
}

export default function SimpleEditor({ blocks, onChange }: SimpleEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null)
  const [history, setHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)

  // Convert blocks to HTML
  const blocksToHtml = (blocks: ContentBlock[]): string => {
    if (!blocks || blocks.length === 0) return '<p data-block-type="text" class="my-2 text-foreground"><br></p>'
    
    return blocks.map((block, index) => {
      const id = `block-${index}`
      
      // Safety check
      if (!block || !block.data) {
        return `<p data-block-type="text" data-block-id="${id}" class="my-2 text-foreground"><br></p>`
      }
      
      switch (block.type) {
        case 'heading':
          const level = block.data.level || 2
          const headingClass = level === 1 ? 'text-3xl' : level === 2 ? 'text-2xl' : 'text-xl'
          return `<h${level} data-block-type="heading" data-block-level="${level}" data-block-id="${id}" class="font-bold ${headingClass} my-4 text-foreground">${block.data.text || '<br>'}</h${level}>`
        
        case 'text':
          return `<p data-block-type="text" data-block-id="${id}" class="my-2 text-foreground leading-relaxed">${block.data.text || '<br>'}</p>`
        
        case 'list':
          const tag = block.data.style === 'numbered' ? 'ol' : 'ul'
          const listClass = block.data.style === 'numbered' ? 'list-decimal' : 'list-disc'
          const items = (block.data.items || []).map(item => `<li class="ml-4">${item}</li>`).join('')
          return `<${tag} data-block-type="list" data-block-style="${block.data.style}" data-block-id="${id}" class="my-2 ml-6 ${listClass} text-foreground">${items}</${tag}>`
        
        case 'quote':
          return `<blockquote data-block-type="quote" data-block-id="${id}" class="border-l-4 border-blue-500 pl-4 italic my-4 text-foreground">${block.data.text || '<br>'}<br/><span class="text-sm text-muted-foreground not-italic">— ${block.data.author || 'Author'}</span></blockquote>`
        
        case 'callout':
          const bgColor = block.data.variant === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-500' : 
                         block.data.variant === 'error' ? 'bg-red-100 dark:bg-red-900/30 border-red-500' :
                         block.data.variant === 'success' ? 'bg-green-100 dark:bg-green-900/30 border-green-500' :
                         'bg-blue-100 dark:bg-blue-900/30 border-blue-500'
          return `<div data-block-type="callout" data-block-variant="${block.data.variant || 'info'}" data-block-id="${id}" class="border-l-4 ${bgColor} p-3 my-4 rounded text-foreground">${block.data.text || '<br>'}</div>`
        
        case 'image':
          return `<div data-block-type="image" data-block-id="${id}" class="my-4" contenteditable="false">
                    <img src="${block.data.url || ''}" alt="${block.data.alt || ''}" class="max-w-full rounded" />
                    <p class="text-sm text-muted-foreground text-center mt-2">${block.data.caption || ''}</p>
                  </div>`
        
        case 'divider':
          return `<hr data-block-type="divider" data-block-id="${id}" class="my-6 border-border" contenteditable="false" />`
        
        default:
          return `<p data-block-type="text" data-block-id="${id}" class="my-2 text-foreground leading-relaxed">${block.data.text || '<br>'}</p>`
      }
    }).join('')
  }

  // Convert HTML back to blocks
  const htmlToBlocks = (html: string): ContentBlock[] => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, 'text/html')
    const elements = Array.from(doc.body.children)
    
    const blocks = elements.map(el => {
      const blockType = el.getAttribute('data-block-type') || 'text'
      
      switch (blockType) {
        case 'heading':
          return {
            type: 'heading' as const,
            data: {
              text: el.textContent?.replace(/\n/g, ' ').trim() || '',
              level: parseInt(el.getAttribute('data-block-level') || '2')
            }
          }
        
        case 'text':
          return {
            type: 'text' as const,
            data: { text: el.textContent?.trim() || '' }
          }
        
        case 'list':
          const items = Array.from(el.querySelectorAll('li')).map(li => li.textContent?.trim() || '')
          return {
            type: 'list' as const,
            data: {
              style: el.getAttribute('data-block-style') as 'bullet' | 'numbered',
              items: items.filter(Boolean)
            }
          }
        
        case 'quote':
          const fullText = el.textContent || ''
          const parts = fullText.split('—')
          const quoteText = parts[0]?.trim() || ''
          const author = parts[1]?.trim() || ''
          return {
            type: 'quote' as const,
            data: { text: quoteText, author }
          }
        
        case 'callout':
          return {
            type: 'callout' as const,
            data: {
              text: el.textContent?.trim() || '',
              variant: (el.getAttribute('data-block-variant') as 'info' | 'warning' | 'error' | 'success') || 'info'
            }
          }
        
        case 'image':
          const img = el.querySelector('img')
          const caption = el.querySelector('p')
          return {
            type: 'image' as const,
            data: {
              url: img?.getAttribute('src') || '',
              alt: img?.getAttribute('alt') || '',
              caption: caption?.textContent || ''
            }
          }
        
        case 'divider':
          return {
            type: 'divider' as const,
            data: {}
          }
        
        default:
          return {
            type: 'text' as const,
            data: { text: el.textContent?.trim() || '' }
          }
      }
    }).filter(block => 
      block.type === 'divider' || 
      block.type === 'image' || 
      (block.data.text && block.data.text !== '') ||
      (block.type === 'list' && block.data.items && block.data.items.length > 0)
    )

    return blocks.length > 0 ? blocks : [{ type: 'text', data: { text: '' } }]
  }

  // Initialize editor only once
  const [isInitialized, setIsInitialized] = useState(false)
  
  useEffect(() => {
    if (editorRef.current && blocks && blocks.length > 0 && !isInitialized) {
      const html = blocksToHtml(blocks)
      editorRef.current.innerHTML = html
      saveToHistory(html)
      setIsInitialized(true)
    }
  }, [blocks, isInitialized])

  // Save to history
  const saveToHistory = (html: string) => {
    const newHistory = history.slice(0, historyIndex + 1)
    newHistory.push(html)
    setHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
  }

  // Handle content change
  const handleInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML
      const newBlocks = htmlToBlocks(html)
      onChange(newBlocks)
      saveToHistory(html)
    }
  }

  // Undo
  const undo = () => {
    if (historyIndex > 0 && editorRef.current) {
      const newIndex = historyIndex - 1
      editorRef.current.innerHTML = history[newIndex]
      setHistoryIndex(newIndex)
      const newBlocks = htmlToBlocks(history[newIndex])
      onChange(newBlocks)
    }
  }

  // Redo
  const redo = () => {
    if (historyIndex < history.length - 1 && editorRef.current) {
      const newIndex = historyIndex + 1
      editorRef.current.innerHTML = history[newIndex]
      setHistoryIndex(newIndex)
      const newBlocks = htmlToBlocks(history[newIndex])
      onChange(newBlocks)
    }
  }

  // Handle keyboard shortcuts
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.ctrlKey || e.metaKey) {
      if (e.key === 'z') {
        e.preventDefault()
        undo()
      } else if (e.key === 'y' || (e.shiftKey && e.key === 'z')) {
        e.preventDefault()
        redo()
      }
    }
  }

  // Handle paste - auto-detect headings, lists, and paragraphs
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault()
    
    const pastedText = e.clipboardData.getData('text/plain')
    if (!pastedText) return
    
    // Split by double newlines (paragraphs/sections)
    const sections = pastedText.split(/\n\n+/).filter(Boolean)
    
    const newBlocks: ContentBlock[] = []
    
    sections.forEach(section => {
      const lines = section.split('\n').filter(Boolean)
      
      // Check if this section is a list
      const listItems: string[] = []
      let isNumberedList = false
      let isBulletList = false
      
      lines.forEach((line, index) => {
        const trimmed = line.trim()
        if (!trimmed) return
        
        // Check for list patterns
        const numberedPattern = /^\d+[\.\)]\s+(.+)$/  // 1. or 1)
        const bulletPattern = /^[•\-\*]\s+(.+)$/       // • or - or *
        
        const numberedMatch = trimmed.match(numberedPattern)
        const bulletMatch = trimmed.match(bulletPattern)
        
        if (numberedMatch) {
          listItems.push(numberedMatch[1])
          isNumberedList = true
        } else if (bulletMatch) {
          listItems.push(bulletMatch[1])
          isBulletList = true
        } else if (listItems.length > 0) {
          // Continue list if previous lines were list items
          listItems.push(trimmed)
        } else {
          // Not a list item, process as heading or paragraph
          const isShortLine = trimmed.length < 100
          const hasNoEndPunctuation = !trimmed.match(/[.!?]$/)
          const nextLineExists = lines[index + 1]
          const isLikelyHeading = isShortLine && hasNoEndPunctuation && (nextLineExists || index === 0)
          
          if (isLikelyHeading) {
            newBlocks.push({
              type: 'heading',
              data: { text: trimmed, level: 2 }
            })
          } else {
            newBlocks.push({
              type: 'text',
              data: { text: trimmed }
            })
          }
        }
      })
      
      // Add list block if we collected list items
      if (listItems.length > 0) {
        newBlocks.push({
          type: 'list',
          data: {
            style: isNumberedList ? 'numbered' : 'bullet',
            items: listItems
          }
        })
      }
    })
    
    if (newBlocks.length > 0) {
      onChange([...blocks, ...newBlocks])
      
      // Update editor
      if (editorRef.current) {
        const html = blocksToHtml([...blocks, ...newBlocks])
        editorRef.current.innerHTML = html
        saveToHistory(html)
      }
    }
  }

  // Format text (for toolbar)
  const formatText = (format: string) => {
    if (!editorRef.current) return

    const selection = window.getSelection()
    if (!selection || selection.rangeCount === 0) return

    const range = selection.getRangeAt(0)
    const selectedText = range.toString()

    // If no text selected, just insert at cursor
    if (!selectedText) {
      insertBlock(format)
      return
    }

    // Check if we're inside a block element
    let parentBlock = range.commonAncestorContainer
    if (parentBlock.nodeType === Node.TEXT_NODE) {
      parentBlock = parentBlock.parentElement!
    }

    // Find the actual block element (h1, h2, h3, p, blockquote, div)
    while (parentBlock && parentBlock !== editorRef.current) {
      const tagName = (parentBlock as HTMLElement).tagName?.toLowerCase()
      if (['h1', 'h2', 'h3', 'p', 'blockquote', 'div'].includes(tagName)) {
        break
      }
      parentBlock = parentBlock.parentElement!
    }

    // Create new element
    let newElement: HTMLElement

    switch (format) {
      case 'h1':
        newElement = document.createElement('h1')
        newElement.setAttribute('data-block-type', 'heading')
        newElement.setAttribute('data-block-level', '1')
        newElement.className = 'font-bold text-3xl my-4 text-foreground'
        newElement.textContent = selectedText
        break

      case 'h2':
        newElement = document.createElement('h2')
        newElement.setAttribute('data-block-type', 'heading')
        newElement.setAttribute('data-block-level', '2')
        newElement.className = 'font-bold text-2xl my-4 text-foreground'
        newElement.textContent = selectedText
        break

      case 'h3':
        newElement = document.createElement('h3')
        newElement.setAttribute('data-block-type', 'heading')
        newElement.setAttribute('data-block-level', '3')
        newElement.className = 'font-bold text-xl my-4 text-foreground'
        newElement.textContent = selectedText
        break

      case 'p':
        newElement = document.createElement('p')
        newElement.setAttribute('data-block-type', 'text')
        newElement.className = 'my-2 text-foreground leading-relaxed'
        newElement.textContent = selectedText
        break

      case 'quote':
        newElement = document.createElement('blockquote')
        newElement.setAttribute('data-block-type', 'quote')
        newElement.className = 'border-l-4 border-blue-500 pl-4 italic my-4 text-foreground'
        newElement.innerHTML = `${selectedText}<br/><span class="text-sm text-muted-foreground not-italic">— Author</span>`
        break

      case 'ul':
      case 'ol':
        // Convert selected text to list
        const lines = selectedText.split('\n').filter(line => line.trim())
        const tag = format === 'ol' ? 'ol' : 'ul'
        const listClass = format === 'ol' ? 'list-decimal' : 'list-disc'
        
        newElement = document.createElement(tag)
        newElement.setAttribute('data-block-type', 'list')
        newElement.setAttribute('data-block-style', format === 'ol' ? 'numbered' : 'bullet')
        newElement.className = `my-2 ml-6 ${listClass} text-foreground`
        
        lines.forEach(line => {
          const li = document.createElement('li')
          li.className = 'ml-4'
          li.textContent = line.trim()
          newElement.appendChild(li)
        })
        break

      default:
        return
    }

    // If parent block exists and we selected all its text, replace the whole block
    if (parentBlock && parentBlock !== editorRef.current) {
      const parentText = (parentBlock as HTMLElement).textContent || ''
      const isFullSelection = parentText.trim() === selectedText.trim()
      
      if (isFullSelection) {
        // Replace entire parent block
        parentBlock.parentElement?.replaceChild(newElement, parentBlock)
      } else {
        // Just replace selected portion
        range.deleteContents()
        range.insertNode(newElement)
      }
    } else {
      // No parent block, just insert
      range.deleteContents()
      range.insertNode(newElement)
    }
    
    // Move cursor after element
    const newRange = document.createRange()
    newRange.setStartAfter(newElement)
    newRange.collapse(true)
    selection.removeAllRanges()
    selection.addRange(newRange)

    handleInput()
  }

  // Insert new block
  const insertBlock = (type: string) => {
    if (!editorRef.current) return

    // Save scroll position
    const scrollTop = editorRef.current.scrollTop

    let newElement: HTMLElement

    switch (type) {
      case 'h1':
        newElement = document.createElement('h1')
        newElement.setAttribute('data-block-type', 'heading')
        newElement.setAttribute('data-block-level', '1')
        newElement.className = 'font-bold text-3xl my-4 text-foreground'
        newElement.innerHTML = '<br>'
        break

      case 'h2':
        newElement = document.createElement('h2')
        newElement.setAttribute('data-block-type', 'heading')
        newElement.setAttribute('data-block-level', '2')
        newElement.className = 'font-bold text-2xl my-4 text-foreground'
        newElement.innerHTML = '<br>'
        break

      case 'h3':
        newElement = document.createElement('h3')
        newElement.setAttribute('data-block-type', 'heading')
        newElement.setAttribute('data-block-level', '3')
        newElement.className = 'font-bold text-xl my-4 text-foreground'
        newElement.innerHTML = '<br>'
        break

      case 'p':
        newElement = document.createElement('p')
        newElement.setAttribute('data-block-type', 'text')
        newElement.className = 'my-2 text-foreground leading-relaxed'
        newElement.innerHTML = '<br>'
        break

      case 'ul':
        newElement = document.createElement('ul')
        newElement.setAttribute('data-block-type', 'list')
        newElement.setAttribute('data-block-style', 'bullet')
        newElement.className = 'my-2 ml-6 list-disc text-foreground'
        newElement.innerHTML = '<li class="ml-4"><br></li><li class="ml-4"><br></li><li class="ml-4"><br></li>'
        break

      case 'ol':
        newElement = document.createElement('ol')
        newElement.setAttribute('data-block-type', 'list')
        newElement.setAttribute('data-block-style', 'numbered')
        newElement.className = 'my-2 ml-6 list-decimal text-foreground'
        newElement.innerHTML = '<li class="ml-4"><br></li><li class="ml-4"><br></li><li class="ml-4"><br></li>'
        break

      case 'quote':
        newElement = document.createElement('blockquote')
        newElement.setAttribute('data-block-type', 'quote')
        newElement.className = 'border-l-4 border-blue-500 pl-4 italic my-4 text-foreground'
        newElement.innerHTML = '<br><span class="text-sm text-muted-foreground not-italic">— Author</span>'
        break

      case 'callout-info':
      case 'callout-warning':
      case 'callout-error':
      case 'callout-success':
        const variant = type.split('-')[1]
        const bgColor = variant === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/30 border-yellow-500' : 
                       variant === 'error' ? 'bg-red-100 dark:bg-red-900/30 border-red-500' :
                       variant === 'success' ? 'bg-green-100 dark:bg-green-900/30 border-green-500' :
                       'bg-blue-100 dark:bg-blue-900/30 border-blue-500'
        newElement = document.createElement('div')
        newElement.setAttribute('data-block-type', 'callout')
        newElement.setAttribute('data-block-variant', variant)
        newElement.className = `border-l-4 ${bgColor} p-3 my-4 rounded text-foreground`
        newElement.innerHTML = '<br>'
        break

      case 'image':
        const url = prompt('Enter image URL:')
        if (!url) return
        newElement = document.createElement('div')
        newElement.setAttribute('data-block-type', 'image')
        newElement.setAttribute('contenteditable', 'false')
        newElement.className = 'my-4'
        newElement.innerHTML = `<img src="${url}" alt="Image" class="max-w-full rounded" /><p class="text-sm text-muted-foreground text-center mt-2">Caption</p>`
        break

      case 'hr':
        newElement = document.createElement('hr')
        newElement.setAttribute('data-block-type', 'divider')
        newElement.setAttribute('contenteditable', 'false')
        newElement.className = 'my-6 border-border'
        break

      default:
        return
    }

    const selection = window.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      range.insertNode(newElement)
      
      // Move cursor into new element
      const newRange = document.createRange()
      if (type === 'ul' || type === 'ol') {
        // For lists, focus on first li
        const firstLi = newElement.querySelector('li')
        if (firstLi) {
          newRange.setStart(firstLi, 0)
          newRange.collapse(true)
        }
      } else {
        newRange.selectNodeContents(newElement)
        newRange.collapse(false)
      }
      selection.removeAllRanges()
      selection.addRange(newRange)
    } else {
      editorRef.current.appendChild(newElement)
    }

    // Restore scroll position
    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.scrollTop = scrollTop
      }
    }, 0)

    handleInput()
  }

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <div className="bg-card border-2 border-border rounded-lg p-3 sticky top-20 z-10">
        <div className="flex flex-wrap gap-2">
          {/* Undo/Redo */}
          <div className="flex gap-1 border-r border-border pr-2">
            <button
              onClick={undo}
              disabled={historyIndex <= 0}
              className="p-2 hover:bg-muted rounded transition-colors disabled:opacity-30"
              title="Undo (Ctrl+Z)"
              type="button"
            >
              <Undo className="w-4 h-4" />
            </button>
            <button
              onClick={redo}
              disabled={historyIndex >= history.length - 1}
              className="p-2 hover:bg-muted rounded transition-colors disabled:opacity-30"
              title="Redo (Ctrl+Y)"
              type="button"
            >
              <Redo className="w-4 h-4" />
            </button>
          </div>

          {/* Headings */}
          <div className="flex gap-1 border-r border-border pr-2">
            <button
              onClick={() => formatText('h1')}
              className="p-2 hover:bg-muted rounded transition-colors"
              title="Heading 1"
              type="button"
            >
              <Heading1 className="w-4 h-4" />
            </button>
            <button
              onClick={() => formatText('h2')}
              className="p-2 hover:bg-muted rounded transition-colors"
              title="Heading 2"
              type="button"
            >
              <Heading2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => formatText('h3')}
              className="p-2 hover:bg-muted rounded transition-colors"
              title="Heading 3"
              type="button"
            >
              <Heading3 className="w-4 h-4" />
            </button>
          </div>

          {/* Text */}
          <div className="flex gap-1 border-r border-border pr-2">
            <button
              onClick={() => formatText('p')}
              className="p-2 hover:bg-muted rounded transition-colors"
              title="Normal Text"
              type="button"
            >
              <Type className="w-4 h-4" />
            </button>
          </div>

          {/* Lists */}
          <div className="flex gap-1 border-r border-border pr-2">
            <button
              onClick={() => formatText('ul')}
              className="p-2 hover:bg-muted rounded transition-colors"
              title="Bullet List"
              type="button"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => formatText('ol')}
              className="p-2 hover:bg-muted rounded transition-colors"
              title="Numbered List"
              type="button"
            >
              <ListOrdered className="w-4 h-4" />
            </button>
          </div>

          {/* Quote */}
          <div className="flex gap-1 border-r border-border pr-2">
            <button
              onClick={() => formatText('quote')}
              className="p-2 hover:bg-muted rounded transition-colors"
              title="Quote"
              type="button"
            >
              <Quote className="w-4 h-4" />
            </button>
          </div>

          {/* Callouts */}
          <div className="flex gap-1 border-r border-border pr-2">
            <button
              onClick={() => insertBlock('callout-info')}
              className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded transition-colors"
              title="Info"
              type="button"
            >
              <Info className="w-4 h-4 text-blue-600" />
            </button>
            <button
              onClick={() => insertBlock('callout-warning')}
              className="p-2 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 rounded transition-colors"
              title="Warning"
              type="button"
            >
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
            </button>
            <button
              onClick={() => insertBlock('callout-error')}
              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 rounded transition-colors"
              title="Error"
              type="button"
            >
              <XCircle className="w-4 h-4 text-red-600" />
            </button>
            <button
              onClick={() => insertBlock('callout-success')}
              className="p-2 hover:bg-green-100 dark:hover:bg-green-900/30 rounded transition-colors"
              title="Success"
              type="button"
            >
              <CheckCircle className="w-4 h-4 text-green-600" />
            </button>
          </div>

          {/* Media */}
          <div className="flex gap-1 border-r border-border pr-2">
            <button
              onClick={() => insertBlock('image')}
              className="p-2 hover:bg-muted rounded transition-colors"
              title="Image"
              type="button"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
          </div>

          {/* Divider */}
          <div className="flex gap-1">
            <button
              onClick={() => insertBlock('hr')}
              className="p-2 hover:bg-muted rounded transition-colors"
              title="Divider"
              type="button"
            >
              <Minus className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Editor */}
      <div className="bg-card border-2 border-border rounded-lg overflow-hidden">
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onKeyDown={handleKeyDown}
          onPaste={handlePaste}
          className="min-h-[600px] p-8 bg-background focus:outline-none"
          suppressContentEditableWarning
        />
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-sm text-muted-foreground">
        <span>{blocks.length} blocks</span>
      </div>
    </div>
  )
}
