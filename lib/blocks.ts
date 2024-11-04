export const blocks = [
  // Headers
  {
    id: 'patriotic-header-simple',
    label: '<b>Simple Header</b>',
    category: 'Headers',
    content: `
      <header class="bg-blue-900 text-white p-4 flex justify-between items-center">
        <h1 class="text-3xl font-bold">Financial Assistance</h1>
        <nav class="space-x-4">
          <a href="#" class="hover:text-red-400">Services</a>
          <a href="#" class="hover:text-red-400">About</a>
          <a href="#" class="hover:text-red-400">Contact</a>
        </nav>
      </header>`,
  },
  {
    id: 'patriotic-header-with-banner',
    label: '<b>Header with Banner</b>',
    category: 'Headers',
    content: `
      <div>
        <div class="bg-red-700 text-white text-center py-1">
          <p>Serving American families since 1776 🇺🇸</p>
        </div>
        <header class="bg-blue-900 text-white p-4 flex justify-between items-center">
          <h1 class="text-3xl font-bold">Financial Assistance</h1>
          <nav class="space-x-4">
            <a href="#" class="hover:text-red-400">Services</a>
            <a href="#" class="hover:text-red-400">About</a>
            <a href="#" class="hover:text-red-400">Contact</a>
          </nav>
        </header>
      </div>`,
  },

  // Heroes
  {
    id: 'patriotic-hero-centered',
    label: '<b>Centered Hero</b>',
    category: 'Heroes',
    content: `
      <section class="bg-gradient-to-r from-blue-900 via-blue-700 to-red-700 text-white text-center py-24">
        <h1 class="text-5xl font-bold mb-4">Supporting American Dreams</h1>
        <p class="text-xl mb-8">Financial assistance programs designed for hardworking Americans</p>
        <div class="space-x-4">
          <button class="bg-white text-blue-900 font-bold py-3 px-6 rounded-lg hover:bg-red-100">Get Started</button>
          <button class="border-2 border-white text-white font-bold py-3 px-6 rounded-lg hover:bg-white hover:text-blue-900">Learn More</button>
        </div>
      </section>`,
  },

  // Features
  {
    id: 'patriotic-form',
    label: '<b>Patriotic Form</b>',
    attributes: { class: 'gjs-block-form' },
    content: `
      <form class="bg-white p-6 rounded shadow-md">
        <h2 class="text-2xl font-bold mb-4">Get Help Now</h2>
        <input type="text" placeholder="First Name" class="border p-2 mb-2 w-full" />
        <input type="text" placeholder="Last Name" class="border p-2 mb-2 w-full" />
        <input type="email" placeholder="Email" class="border p-2 mb-2 w-full" />
        <button class="bg-green-500 text-white font-bold py-2 px-4 rounded mt-4">Submit</button>
      </form>`,
  },
  {
    id: 'patriotic-footer',
    label: '<b>Patriotic Footer</b>',
    attributes: { class: 'gjs-block-footer' },
    content: `
      <footer class="bg-gray-800 text-white p-4">
        <p class="text-center">© 2023 Your Company</p>
      </footer>`,
  },
  {
    id: 'patriotic-info-section',
    label: '<b>Patriotic Info Section</b>',
    attributes: { class: 'gjs-block-info' },
    content: `
      <section class="bg-white text-blue-900 p-8">
        <h2 class="text-2xl font-bold">Complete the Form</h2>
        <p class="mt-4">Be sure to enter your details as best you can. We search all the networks for assistance programs to match the information you provide.</p>
      </section>`,
  },
  // a block for AI generated content
  {
    id: 'ai-generated-content',
    label: '<b>AI Generated Content</b>',
    attributes: { class: 'gjs-block-ai' },
    content: `<div class="bg-white text-blue-900 p-8">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-500 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    </div>`,
  },

  // Modern Glass Hero
  {
    id: 'glass-hero',
    label: '<b>Glass Hero</b>',
    category: 'Heroes',
    content: `
      <section class="relative min-h-[80vh] overflow-hidden">
        <div class="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1501426026826-31c667bdf23d')] bg-cover bg-center"></div>
        <div class="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-red-900/90 backdrop-blur-sm"></div>
        <div class="relative flex items-center justify-center min-h-[80vh] px-4">
          <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 md:p-12 border border-white/20 max-w-3xl mx-auto text-center">
            <h1 class="text-5xl md:text-7xl font-bold bg-gradient-to-r from-blue-200 via-red-200 to-white text-transparent bg-clip-text mb-6">
              Serving America's Future
            </h1>
            <p class="text-xl text-blue-50 mb-8">Building stronger communities through financial empowerment 🇺🇸</p>
            <div class="flex flex-wrap justify-center gap-4">
              <button class="group relative px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-800 text-white font-bold overflow-hidden">
                <div class="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-600 to-blue-800 transition-all group-hover:scale-[1.35] group-hover:rotate-[-10deg]"></div>
                <span class="relative">Get Started</span>
              </button>
              <button class="px-8 py-3 rounded-xl bg-white/10 backdrop-blur text-white font-bold border border-white/20 hover:bg-white/20 transition-all">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </section>`,
  },

  // Rainbow Stats
  {
    id: 'rainbow-stats',
    label: '<b>Rainbow Stats</b>',
    category: 'Stats',
    content: `
      <section class="bg-gray-900 py-20 px-4">
        <div class="max-w-6xl mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="group relative">
              <div class="absolute -inset-1 rounded-lg bg-gradient-to-r from-red-600 via-blue-600 to-red-600 opacity-75 group-hover:opacity-100 blur transition duration-1000 group-hover:duration-200"></div>
              <div class="relative bg-black rounded-lg p-6 text-center">
                <h3 class="text-5xl font-bold text-white mb-2">50K+</h3>
                <p class="text-blue-200">Families Helped</p>
              </div>
            </div>
            <div class="group relative">
              <div class="absolute -inset-1 rounded-lg bg-gradient-to-r from-blue-600 via-red-600 to-blue-600 opacity-75 group-hover:opacity-100 blur transition duration-1000 group-hover:duration-200"></div>
              <div class="relative bg-black rounded-lg p-6 text-center">
                <h3 class="text-5xl font-bold text-white mb-2">$100M</h3>
                <p class="text-blue-200">Aid Distributed</p>
              </div>
            </div>
            <div class="group relative">
              <div class="absolute -inset-1 rounded-lg bg-gradient-to-r from-red-600 via-blue-600 to-red-600 opacity-75 group-hover:opacity-100 blur transition duration-1000 group-hover:duration-200"></div>
              <div class="relative bg-black rounded-lg p-6 text-center">
                <h3 class="text-5xl font-bold text-white mb-2">100%</h3>
                <p class="text-blue-200">Satisfaction</p>
              </div>
            </div>
          </div>
        </div>
      </section>`,
  },

  // Web3 Features
  {
    id: 'web3-features',
    label: '<b>Web3 Features</b>',
    category: 'Features',
    content: `
      <section class="bg-[#0c0c1d] py-24 px-4">
        <div class="max-w-6xl mx-auto">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="relative group">
              <div class="absolute inset-0.5 bg-gradient-to-r from-pink-600 to-purple-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
              <div class="relative bg-black rounded-lg p-8 border border-white/10">
                <div class="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center mb-6">
                  <span class="text-2xl">🔒</span>
                </div>
                <h3 class="text-xl font-bold text-white mb-4">Secure Processing</h3>
                <p class="text-gray-400">Advanced encryption and blockchain technology protecting your data</p>
              </div>
            </div>
            <div class="relative group">
              <div class="absolute inset-0.5 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
              <div class="relative bg-black rounded-lg p-8 border border-white/10">
                <div class="w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center mb-6">
                  <span class="text-2xl">⚡</span>
                </div>
                <h3 class="text-xl font-bold text-white mb-4">Instant Approval</h3>
                <p class="text-gray-400">AI-powered verification system for quick results</p>
              </div>
            </div>
            <div class="relative group">
              <div class="absolute inset-0.5 bg-gradient-to-r from-red-600 to-orange-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000"></div>
              <div class="relative bg-black rounded-lg p-8 border border-white/10">
                <div class="w-14 h-14 rounded-full bg-gradient-to-r from-red-500 to-orange-500 flex items-center justify-center mb-6">
                  <span class="text-2xl">🌟</span>
                </div>
                <h3 class="text-xl font-bold text-white mb-4">Smart Benefits</h3>
                <p class="text-gray-400">Personalized recommendations based on your profile</p>
              </div>
            </div>
          </div>
        </div>
      </section>`,
  },

  // Glassmorphism Form
  {
    id: 'glass-form',
    label: '<b>Glass Form</b>',
    category: 'Forms',
    content: `
      <section class="min-h-screen bg-gradient-to-br from-blue-900 via-gray-900 to-red-900 py-20 px-4">
        <div class="max-w-md mx-auto relative">
          <div class="absolute inset-0 bg-gradient-to-r from-blue-500 to-red-500 rounded-2xl blur-xl opacity-50"></div>
          <form class="relative bg-white/10 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-white/20">
            <h2 class="text-3xl font-bold text-white mb-8 text-center">Quick Application</h2>
            <div class="space-y-6">
              <div class="relative">
                <input type="text" class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Full Name" />
              </div>
              <div class="relative">
                <input type="email" class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Email Address" />
              </div>
              <div class="relative">
                <select class="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                  <option value="" class="bg-gray-900">Select Program</option>
                  <option value="housing" class="bg-gray-900">Housing Assistance</option>
                  <option value="education" class="bg-gray-900">Education Support</option>
                  <option value="financial" class="bg-gray-900">Financial Aid</option>
                </select>
              </div>
              <button class="w-full relative group">
                <div class="absolute -inset-0.5 bg-gradient-to-r from-red-600 to-blue-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                <div class="relative px-6 py-3 bg-black rounded-lg leading-none flex items-center justify-center">
                  <span class="text-white font-bold">Submit Application</span>
                </div>
              </button>
            </div>
          </form>
        </div>
      </section>`,
  },

  // Dark Mode Timeline
  {
    id: 'dark-timeline',
    label: '<b>Dark Timeline</b>',
    category: 'Content',
    content: `
      <section class="bg-gray-900 py-20 px-4">
        <div class="max-w-4xl mx-auto">
          <h2 class="text-4xl font-bold text-center text-white mb-16">Application Process</h2>
          <div class="relative">
            <div class="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-red-500"></div>
            <div class="space-y-16">
              <div class="relative">
                <div class="absolute left-1/2 transform -translate-x-1/2 -translate-y-4 w-8 h-8 rounded-full border-4 border-gray-900 bg-blue-500"></div>
                <div class="ml-auto mr-8 md:mr-auto md:ml-[53%] w-full md:w-[45%] bg-gray-800/50 backdrop-blur rounded-2xl p-6 border border-blue-500/20">
                  <h3 class="text-xl font-bold text-white mb-2">1. Submit Application</h3>
                  <p class="text-gray-400">Complete our secure online application with your basic information</p>
                </div>
              </div>
              <div class="relative">
                <div class="absolute left-1/2 transform -translate-x-1/2 -translate-y-4 w-8 h-8 rounded-full border-4 border-gray-900 bg-purple-500"></div>
                <div class="mr-auto ml-8 md:ml-auto md:mr-[53%] w-full md:w-[45%] bg-gray-800/50 backdrop-blur rounded-2xl p-6 border border-purple-500/20">
                  <h3 class="text-xl font-bold text-white mb-2">2. Verification</h3>
                  <p class="text-gray-400">Our AI system verifies your eligibility within minutes</p>
                </div>
              </div>
              <div class="relative">
                <div class="absolute left-1/2 transform -translate-x-1/2 -translate-y-4 w-8 h-8 rounded-full border-4 border-gray-900 bg-red-500"></div>
                <div class="ml-auto mr-8 md:mr-auto md:ml-[53%] w-full md:w-[45%] bg-gray-800/50 backdrop-blur rounded-2xl p-6 border border-red-500/20">
                  <h3 class="text-xl font-bold text-white mb-2">3. Receive Benefits</h3>
                  <p class="text-gray-400">Get approved and receive your benefits quickly and securely</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>`,
  },

  // Basic Elements
  {
    id: 'raw-div',
    label: '<b>Div Container</b>',
    category: 'Basic',
    content: `<div class="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 transition-colors"></div>`,
  },
  {
    id: 'raw-html',
    label: '<b>HTML Container</b>',
    category: 'Basic',
    content: `<!-- Add your custom HTML here -->`,
  },

  // Form Elements
  {
    id: 'modern-input',
    label: '<b>Modern Input</b>',
    category: 'Forms',
    content: `
      <div class="relative">
        <input type="text" 
          class="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all peer"
          placeholder=" " />
        <label class="absolute text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:-translate-y-4 left-1 peer-focus:text-blue-600">
          Label Text
        </label>
      </div>`,
  },
  {
    id: 'modern-select',
    label: '<b>Modern Select</b>',
    category: 'Forms',
    content: `
      <div class="relative">
        <select class="w-full px-4 py-3 bg-white appearance-none border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
          <option value="">Select an option</option>
          <option value="1">Option 1</option>
          <option value="2">Option 2</option>
          <option value="3">Option 3</option>
        </select>
        <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>`,
  },
  {
    id: 'modern-radio-group',
    label: '<b>Radio Group</b>',
    category: 'Forms',
    content: `
      <div class="space-y-4">
        <label class="flex items-center space-x-3 cursor-pointer group">
          <div class="relative">
            <input type="radio" name="radio" class="peer sr-only" />
            <div class="w-6 h-6 border-2 border-gray-300 rounded-full peer-checked:border-blue-500 peer-checked:border-8 transition-all"></div>
          </div>
          <span class="text-gray-700 group-hover:text-blue-500">Option 1</span>
        </label>
        <label class="flex items-center space-x-3 cursor-pointer group">
          <div class="relative">
            <input type="radio" name="radio" class="peer sr-only" />
            <div class="w-6 h-6 border-2 border-gray-300 rounded-full peer-checked:border-blue-500 peer-checked:border-8 transition-all"></div>
          </div>
          <span class="text-gray-700 group-hover:text-blue-500">Option 2</span>
        </label>
      </div>`,
  },
  {
    id: 'modern-switch',
    label: '<b>Toggle Switch</b>',
    category: 'Forms',
    content: `
      <label class="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" class="sr-only peer">
        <div class="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
        <span class="ml-3 text-gray-700">Toggle Switch</span>
      </label>`,
  },
  {
    id: 'modern-calendar',
    label: '<b>Date Picker</b>',
    category: 'Forms',
    content: `
      <div class="relative max-w-sm">
        <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
        <input type="date" class="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5" />
      </div>`,
  },
  {
    id: 'modern-accordion',
    label: '<b>Accordion</b>',
    category: 'Content',
    content: `
      <div class="space-y-2">
        <div class="border border-gray-200 rounded-lg">
          <button class="flex items-center justify-between w-full p-4 text-left bg-white hover:bg-gray-50">
            <span class="font-medium">Accordion Item 1</span>
            <svg class="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div class="p-4 border-t border-gray-200">
            <p class="text-gray-700">Content for accordion item 1 goes here. You can add any content you want inside this panel.</p>
          </div>
        </div>
        <div class="border border-gray-200 rounded-lg">
          <button class="flex items-center justify-between w-full p-4 text-left bg-white hover:bg-gray-50">
            <span class="font-medium">Accordion Item 2</span>
            <svg class="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div class="hidden p-4 border-t border-gray-200">
            <p class="text-gray-700">Content for accordion item 2 goes here. You can add any content you want inside this panel.</p>
          </div>
        </div>
      </div>`,
  },
  {
    id: 'modern-checkbox',
    label: '<b>Checkbox</b>',
    category: 'Forms',
    content: `
      <label class="flex items-center space-x-3 cursor-pointer group">
        <div class="relative">
          <input type="checkbox" class="peer sr-only" />
          <div class="w-6 h-6 border-2 border-gray-300 rounded peer-checked:bg-blue-500 peer-checked:border-blue-500 transition-all">
            <svg class="w-4 h-4 text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 hidden peer-checked:block" 
              fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
        <span class="text-gray-700 group-hover:text-blue-500">Checkbox Label</span>
      </label>`,
  },
  {
    id: 'modern-textarea',
    label: '<b>Textarea</b>',
    category: 'Forms',
    content: `
      <div class="relative">
        <textarea 
          class="w-full px-4 py-3 bg-white/5 backdrop-blur-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none min-h-[100px]"
          placeholder="Enter your message..."></textarea>
      </div>`,
  },
  {
    id: 'modern-file-upload',
    label: '<b>File Upload</b>',
    category: 'Forms',
    content: `
      <div class="flex items-center justify-center w-full">
        <label class="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
          <div class="flex flex-col items-center justify-center pt-5 pb-6">
            <svg class="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            <p class="mb-2 text-sm text-gray-500"><span class="font-semibold">Click to upload</span> or drag and drop</p>
            <p class="text-xs text-gray-500">SVG, PNG, JPG or GIF (MAX. 800x400px)</p>
          </div>
          <input type="file" class="hidden" />
        </label>
      </div>`,
  },
  {
    id: 'modern-search',
    label: '<b>Search Input</b>',
    category: 'Forms',
    content: `
      <div class="relative">
        <input type="search" 
          class="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
          placeholder="Search..." />
        <div class="absolute inset-y-0 left-0 flex items-center pl-3">
          <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>`,
  },
  {
    id: 'modern-tabs',
    label: '<b>Tabs</b>',
    category: 'Navigation',
    content: `
      <div class="border-b border-gray-200">
        <nav class="-mb-px flex space-x-8">
          <a href="#" class="border-blue-500 text-blue-600 whitespace-nowrap py-4 px-1 border-b-2 font-medium">
            Tab 1
          </a>
          <a href="#" class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium">
            Tab 2
          </a>
          <a href="#" class="border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 whitespace-nowrap py-4 px-1 border-b-2 font-medium">
            Tab 3
          </a>
        </nav>
      </div>`,
  },

  // Tracking Script Block
  {
    id: 'tracking-script',
    label: '<b>Tracking Script</b>',
    category: 'Analytics',
    content: `
      <script>
        (function() {
          const BASE_URL = '${process.env.NEXT_PUBLIC_API_URL}';
          const VISIT_ID = new URLSearchParams(window.location.search).get('visit_id') || sessionStorage.getItem('visit_id');

          function sendView(visitId) {
            navigator.sendBeacon(\`\${BASE_URL}/view\`, JSON.stringify({
              url: window.location.href,
              title: document.title,
              referrer: document.referrer,
              visitId
            }));
          }

          // If we have a visit ID, just track the view
          if (VISIT_ID) {
            sessionStorage.setItem('visit_id', VISIT_ID);
            sendView(VISIT_ID);
          } else {
            // Create visit and track view in parallel
            navigator.sendBeacon(\`\${BASE_URL}/visit\`, JSON.stringify({
              url: window.location.href,
              referrer: document.referrer
            }));
          }

          // Track SPA page changes
          let lastUrl = window.location.href;
          new MutationObserver(() => {
            if (lastUrl !== window.location.href) {
              lastUrl = window.location.href;
              sendView(VISIT_ID || sessionStorage.getItem('visit_id'));
            }
          }).observe(document, { subtree: true, childList: true });

          // Update time on site when leaving
          window.addEventListener('beforeunload', () => {
            const timeOnSite = Math.floor((Date.now() - startTime) / 1000);
            navigator.sendBeacon(\`\${BASE_URL}/visit/\${VISIT_ID}/duration\`, JSON.stringify({ timeOnSite }));
          });
        })();
      </script>`,
  },

  // Google Tag Manager Block
  {
    id: 'gtm-script',
    label: '<b>Google Tag Manager</b>',
    category: 'Analytics',
    content: `
      <!-- Google Tag Manager -->
      <script>
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${process.env.NEXT_PUBLIC_GTM_ID}');
      </script>
      <!-- End Google Tag Manager -->
      
      <!-- Google Tag Manager (noscript) -->
      <noscript>
        <iframe src="https://www.googletagmanager.com/ns.html?id=${process.env.NEXT_PUBLIC_GTM_ID}"
        height="0" width="0" style="display:none;visibility:hidden"></iframe>
      </noscript>
      <!-- End Google Tag Manager (noscript) -->`,
  },
];
