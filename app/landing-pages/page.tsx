"use client";

import React, { useEffect, useState } from 'react';
import grapesjs from 'grapesjs';
import 'grapesjs/dist/css/grapes.min.css';
import { blocks } from '@/lib/blocks';
import { Undo, Redo } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { selectors } from '@/lib/selectors';

const GrapesJSBuilder = () => {
  const [input, setInput] = useState('');
  const [editor, setEditor] = useState<any>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [pastedImages, setPastedImages] = useState<string[]>([]);

  const escapeName = (name: string) => `${name}`.trim().replace(/([^a-z0-9\w-:/]+)/gi, '-');

  useEffect(() => {

    const editorInstance = grapesjs.init({
      container: '#gjs',
      height: '100vh',
      width: 'auto',
      fromElement: true,
      storageManager: {
        type: 'local', // Type of the storage, available: 'local' | 'remote'
        autosave: true, // Store data automatically
        autoload: true, // Autoload stored data on init
        stepsBeforeSave: 1, // If autosave enabled, indicates how many changes are necessary before store method is triggered
        options: {
          local: {
            // Options for the `local` type
            key: 'gjsProject', // The key for the local storage
          },
        },
      },
      blockManager: {
        appendTo: '#panel-blocks',
        blocks: blocks,
      },
      styleManager: {
        appendTo: '.styles-container',
        sectors: selectors,
      },
      fromElement: true,
      storageManager: false,
      selectorManager: { escapeName },
      blockManager: {
        appendTo: '#blocks',
        blocks: blocks,
      },
    });

    // Set the initial component to the HTML block
    editorInstance.on('load', () => {
      const iframe = editorInstance.Canvas.getFrameEl();
      const head = iframe.contentDocument.head;
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css';
      head.appendChild(link);

      
    });

      // Update save command with toast
      editorInstance.Commands.add('save-db', {
        run: (editor) => {
          editor.store();
          toast.success('Project saved successfully', {
            icon: '💾',
          });
        }
      });

      editorInstance.Keymaps.add('save-db', 'ctrl+s');
      setEditor(editorInstance);

    return () => {
      editorInstance.destroy();
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handlePaste = async (e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      
      if (item.type.indexOf('image') !== -1) {
        e.preventDefault();
        
        const file = item.getAsFile();
        if (!file) continue;

        try {
          const base64 = await new Promise<string>((resolve) => {
            const reader = new FileReader();
            reader.onload = () => {
              // Ensure the base64 string includes the data URL prefix
              const result = reader.result as string;
              if (!result.startsWith('data:image')) {
                resolve(`data:${file.type};base64,${result.split(',')[1]}`);
              } else {
                resolve(result);
              }
            };
            reader.readAsDataURL(file);
          });

          setPastedImages(prev => [...prev, base64]);
          
          const cursorPosition = (e.target as HTMLInputElement).selectionStart || input.length;
          const newInput = input.slice(0, cursorPosition) + 
                          ` [Image ${pastedImages.length + 1}] ` + 
                          input.slice(cursorPosition);
          setInput(newInput);
        } catch (error) {
          console.error('Error processing pasted image:', error);
          toast.error('Failed to process pasted image');
        }
      }
    }
  };

  const loadingMessages = [
    "Crafting your design with care...",
    "Pixel-perfect precision takes time...",
    "Weaving HTML magic...",
    "Adding that special touch...",
    "This is quite the masterpiece we're building...",
    "Rome wasn't built in a day, but your page will be ready soon...",
    "Polishing every detail...",
    "Making sure everything is just right...",
    "Your ambitious design is coming to life...",
    "Still working our creative magic...",
    "This is a big one! But we've got this...",
    "Channeling our inner artist...",
    "Adding sprinkles of excellence...",
    "Almost there, and it'll be worth the wait...",
    "Creating something extraordinary takes time...",
  ];

  const handleSubmit = async () => {
    if (!input || !editor) {
      toast.error('Editor not initialized or input is empty');
      return;
    }

    const selectedComponent = editor.getSelected();
    if (!selectedComponent) {
      toast.error('Please select a component first');
      return;
    }

    let loadingToast: string;
    let messageIndex = 0;
    let loadingInterval: NodeJS.Timeout;

    loadingToast = toast.loading(loadingMessages[0], { duration: Infinity });

    loadingInterval = setInterval(() => {
      messageIndex = (messageIndex + 1) % loadingMessages.length;
      toast.loading(loadingMessages[messageIndex], {
        id: loadingToast,
        duration: Infinity,
      });
    }, 3000);

    try {
      const componentContent = selectedComponent.toHTML();
      
      const promptWithImages = {
        text: `Current component content:\n${componentContent}\n\nUser request: ${input}`,
        images: pastedImages
      };

      const response = await fetch('/api/llama', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          prompt: promptWithImages,
          sessionId: 'default'
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      clearInterval(loadingInterval);

      if (data.blocks && data.blocks.length > 0) {
        try {
          const parent = selectedComponent.parent();
          
          if (!parent) {
            selectedComponent.components().reset();
            data.blocks.forEach(block => {
              selectedComponent.append(block.content);
            });
          } else {
            const combinedContent = data.blocks.map(block => block.content).join('\n');
            const components = parent.components();
            const index = components.indexOf(selectedComponent);
            selectedComponent.remove();
            components.add(combinedContent, { at: index });
          }

          toast.success(`Successfully generated ${data.blocks.length} sections!`, {
            id: loadingToast,
            duration: 3000,
            icon: '✨',
          });
        } catch (componentError) {
          console.error('Component manipulation error:', componentError);
          toast.error(`Failed to update component: ${componentError.message}`, {
            id: loadingToast,
          });
        }
      } else {
        toast.error('No content generated', {
          id: loadingToast,
          duration: 3000,
        });
      }
    } catch (error) {
      clearInterval(loadingInterval);
      console.error('Generation error:', error);
      toast.error(`Failed to generate content: ${error.message}`, {
        id: loadingToast,
        duration: 3000,
      });
    }

    setPastedImages([]);
    setInput('');
  };

  const handleUndo = () => {
    editor?.runCommand('core:undo');
  };

  const handleRedo = () => {
    editor?.runCommand('core:redo');
  };

  const handleSave = () => {
    if (editor) {
      try {
        editor.store();
        toast.success('Project saved successfully', {
          icon: '💾',
        });
      } catch (error) {
        toast.error('Failed to save project');
        console.error('Save error:', error);
      }
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      <div style={{ flex: 1, display: 'flex' }}>
        <div id="blocks" style={{ width: '200px', borderRight: '1px solid #ddd' }}></div>
        <div id="gjs" style={{ flex: 1 }}></div>
        <div className="styles-container" style={{ width: '250px', borderLeft: '1px solid #ddd' }}></div>
      </div>
      <div
        className="fixed bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center bg-white bg-opacity-90 backdrop-blur-md p-4 rounded-lg shadow-lg max-w-2xl w-full space-y-3 z-50"
      >
        {pastedImages.length > 0 && (
          <div className="flex gap-2 w-full overflow-x-auto pb-2">
            {pastedImages.map((img, index) => (
              <div key={index} className="relative">
                <img 
                  src={img} 
                  alt={`Pasted ${index + 1}`} 
                  className="h-16 w-16 object-cover rounded"
                />
                <button
                  onClick={() => {
                    setPastedImages(prev => prev.filter((_, i) => i !== index));
                    setInput(prev => prev.replace(`[Image ${index + 1}]`, ''));
                  }}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
        
        <div className="flex w-full space-x-3">
          <input
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder="What would you like to generate... (Paste images with Ctrl+V)"
            className="flex-1 p-2 border border-gray-300 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition"
          >
            Generate
          </button>
          <button
            onClick={handleUndo}
            className="p-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition flex items-center justify-center"
          >
            <Undo size={16} />
          </button>
          <button
            onClick={handleRedo}
            className="p-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition flex items-center justify-center"
          >
            <Redo size={16} />
          </button>
          <button
            onClick={handleSave}
            disabled={true}
            className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center justify-center"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default GrapesJSBuilder;
