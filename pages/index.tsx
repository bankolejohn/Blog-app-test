import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import Button from "../components/ui/button"
import Card from "../components/ui/card/card"
import CardContent from "../components/ui/card/card-content"
import CardFooter from "../components/ui/card/card-footer"
import CardHeader from "../components/ui/card/card-header"
import CardTitle from "../components/ui/card/card-title"
import ChatWidget from "../components/ChatWidget"
import { ArrowLeft, Calendar, Clock, User, Search, Menu, X, LogOut, Plus } from 'lucide-react'

// Sample blog post data with full content
const blogPosts = [
  {
    id: 1,
    title: "Getting Started with Next.js",
    excerpt: "Learn how to build modern web applications with Next.js and unlock the power of React",
    date: "2024-01-15",
    readTime: "5 min read",
    author: "Sarah Chen",
    category: "Development",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
    content: "Next.js is a powerful React framework that makes it easy to build fast, SEO-friendly web applications. Here are some key features of Next.js:\n\n1. Server-Side Rendering (SSR): Next.js can render React components on the server, which improves initial load time and SEO.\n2. Static Site Generation (SSG): You can generate static HTML files at build time for even faster loading.\n3. API Routes: Next.js allows you to create API endpoints as part of your application.\n4. File-based Routing: Simply create files in the 'pages' directory to define routes.\n5. Built-in CSS Support: Next.js supports CSS Modules, Sass, and other styling options out of the box.\n\nTo get started with Next.js, you can use the following command: `npx create-next-app@latest my-next-app`"
  },
  {
    id: 2,
    title: "The Power of Tailwind CSS",
    excerpt: "Discover how Tailwind CSS can streamline your styling workflow and boost productivity",
    date: "2024-01-10",
    readTime: "4 min read",
    author: "Alex Rodriguez",
    category: "Design",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop",
    content: "Tailwind CSS is a utility-first CSS framework that can significantly speed up your development process. Instead of writing custom CSS, you apply pre-existing classes directly in your HTML.\n\nKey benefits of Tailwind CSS include:\n\n1. Rapid Development: With utility classes, you can quickly style elements without switching between HTML and CSS files.\n2. Consistency: Tailwind provides a set of pre-defined design tokens, ensuring consistency across your project.\n3. Customization: You can easily customize the default configuration to match your design system.\n4. Responsive Design: Tailwind includes responsive utility variants, making it simple to create responsive layouts.\n5. Smaller File Sizes: When properly configured, Tailwind can eliminate unused CSS, resulting in smaller file sizes.\n\nTo start using Tailwind CSS in your project, you can install it with npm: `npm install tailwindcss`\n\nThen, add the Tailwind directives to your CSS file and start using the utility classes in your HTML. Enjoy the power of Tailwind!"
  },
  {
    id: 3,
    title: "React Hooks Explained",
    excerpt: "Dive deep into React Hooks and how they can simplify your components architecture",
    date: "2024-01-05",
    readTime: "6 min read",
    author: "Emma Thompson",
    category: "React",
    image: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
    content: "React Hooks are functions that allow you to use state and other React features in functional components. They were introduced in React 16.8 and have revolutionized how we write React components.\n\nSome of the most commonly used hooks are:\n\n1. useState: Allows you to add state to functional components.\n2. useEffect: Lets you perform side effects in functional components.\n3. useContext: Provides a way to pass data through the component tree without manually passing props.\n4. useReducer: An alternative to useState for managing complex state logic.\n5. useCallback and useMemo: Help optimize performance by memoizing functions and values.\n\nHere's a simple example using useState and useEffect:\n\n```jsx\nimport { useState, useEffect } from 'react'\n\nfunction ExampleComponent() {\n  const [count, setCount] = useState(0)\n\n  useEffect(() => {\n    document.title = `You clicked ${count} times`\n  }, [count])\n\n  return (\n    <div>\n      <p>You clicked {count} times</p>\n      <button onClick={() => setCount(count + 1)}>Click me</button>\n    </div>\n  )\n}\n```\n\nHooks simplify your components and make it easier to reuse stateful logic."
  },
  {
    id: 4,
    title: "Building Accessible Web Apps",
    excerpt: "Learn best practices for creating inclusive and accessible web applications for everyone",
    date: "2023-12-28",
    readTime: "7 min read",
    author: "David Kim",
    category: "Accessibility",
    image: "https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&h=400&fit=crop",
    content: "Creating accessible web applications is crucial for ensuring that all users, including those with disabilities, can use your website effectively. Here are some key principles to follow:\n\n1. Semantic HTML: Use appropriate HTML elements for their intended purpose. For example, use `<button>` for buttons and `<a>` for links.\n2. ARIA attributes: When necessary, use ARIA (Accessible Rich Internet Applications) attributes to provide additional context to screen readers.\n3. Keyboard Navigation: Ensure that all interactive elements can be accessed and operated using only a keyboard.\n4. Color Contrast: Make sure there's sufficient color contrast between text and background for readability.\n5. Alternative Text: Provide alt text for images to describe their content to users who can't see them.\n6. Focus Management: Properly manage focus, especially in single-page applications and dynamic content.\n7. Responsive Design: Create layouts that adapt to different screen sizes and orientations.\n\nRemember, accessibility is not just about complying with guidelines—it's about creating a better user experience for everyone."
  }
]

export default function BlogApp() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [selectedPost, setSelectedPost] = useState<number | null>(null)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  const handlePostClick = (postId: number) => {
    setSelectedPost(postId)
  }

  const handleBackClick = () => {
    setSelectedPost(null)
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  const handleSignOut = () => {
    signOut({ callbackUrl: '/' })
  }

  const handleCreatePost = () => {
    if (!session) {
      router.push('/auth/signin')
    } else {
      router.push('/create-post')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-gray-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">B</span>
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">BlogSpace</h1>
            </div>
            
            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Home</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Categories</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">About</a>
              <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</a>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input 
                  type="text" 
                  placeholder="Search posts..." 
                  className="pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              {session ? (
                <div className="flex items-center space-x-4">
                  <Button onClick={handleCreatePost} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2">
                    <Plus className="w-4 h-4 mr-2" />
                    Write
                  </Button>
                  <div className="relative">
                    <button
                      onClick={() => setShowUserMenu(!showUserMenu)}
                      className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <img
                        src={session.user?.image || '/default-avatar.png'}
                        alt={session.user?.name || 'User'}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-sm font-medium">{session.user?.name}</span>
                    </button>
                    
                    {showUserMenu && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">My Posts</a>
                        <a href="#" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
                        <hr className="my-2" />
                        <button
                          onClick={handleSignOut}
                          className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Sign Out
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="flex items-center space-x-4">
                  <a href="/auth/signin" className="text-gray-600 hover:text-gray-900 transition-colors">Sign In</a>
                  <Button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2">
                    <a href="/auth/signup">Get Started</a>
                  </Button>
                </div>
              )}
            </nav>
            
            {/* Mobile Menu Button */}
            <button 
              onClick={toggleMenu}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
          
          {/* Mobile Navigation */}
          {isMenuOpen && (
            <nav className="md:hidden mt-4 pb-4 border-t border-gray-200 pt-4">
              <div className="flex flex-col space-y-3">
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Home</a>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Categories</a>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">About</a>
                <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">Contact</a>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input 
                    type="text" 
                    placeholder="Search posts..." 
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </nav>
          )}
        </div>
      </header>

      {/* Hero Section */}
      {selectedPost === null && (
        <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 text-white py-20">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Welcome to <span className="text-yellow-300">BlogSpace</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Discover amazing stories, insights, and tutorials from our community of passionate writers
            </p>
            {session ? (
              <Button onClick={handleCreatePost} className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                <Plus className="w-5 h-5 mr-2" />
                Write Your Story
              </Button>
            ) : (
              <Button className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
                <a href="/auth/signup">Join BlogSpace</a>
              </Button>
            )}
          </div>
        </section>
      )}

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        {selectedPost !== null ? (
          <article className="max-w-4xl mx-auto">
            <Button
              variant="outline"
              onClick={handleBackClick}
              className="mb-8 hover:bg-gray-50"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to all posts
            </Button>
            
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <img 
                src={blogPosts[selectedPost - 1].image} 
                alt={blogPosts[selectedPost - 1].title}
                className="w-full h-64 md:h-96 object-cover"
              />
              
              <div className="p-8 md:p-12">
                <div className="flex items-center gap-4 mb-6">
                  <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {blogPosts[selectedPost - 1].category}
                  </span>
                  <div className="flex items-center text-gray-500 text-sm">
                    <User className="w-4 h-4 mr-1" />
                    {blogPosts[selectedPost - 1].author}
                  </div>
                </div>
                
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 leading-tight">
                  {blogPosts[selectedPost - 1].title}
                </h1>
                
                <div className="flex items-center gap-6 mb-8 text-gray-500">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-2" />
                    {new Date(blogPosts[selectedPost - 1].date).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    {blogPosts[selectedPost - 1].readTime}
                  </div>
                </div>
                
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  {blogPosts[selectedPost - 1].content.split('\n').map((paragraph, index) => (
                    <p key={index} className="mb-6">{paragraph}</p>
                  ))}
                </div>
              </div>
            </div>
          </article>
        ) : (
          <>
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Latest Articles</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Explore our collection of insightful articles, tutorials, and stories
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {blogPosts.map((post) => (
                <Card 
                  key={post.id} 
                  className="group cursor-pointer bg-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border-0 shadow-lg" 
                  onClick={() => handlePostClick(post.id)}
                >
                  <div className="relative overflow-hidden">
                    <img 
                      src={post.image} 
                      alt={post.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 backdrop-blur-sm text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                        {post.category}
                      </span>
                    </div>
                  </div>
                  
                  <CardHeader className="pb-3">
                    <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="pb-4">
                    <p className="text-gray-600 line-clamp-3 mb-4">{post.excerpt}</p>
                    <div className="flex items-center text-sm text-gray-500">
                      <User className="w-4 h-4 mr-1" />
                      <span className="mr-4">{post.author}</span>
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{new Date(post.date).toLocaleDateString()}</span>
                    </div>
                  </CardContent>
                  
                  <CardFooter className="pt-0">
                    <div className="flex justify-between items-center w-full">
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {post.readTime}
                      </div>
                      <Button variant="outline" className="group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-600 transition-colors">
                        Read More
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-20">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">B</span>
                </div>
                <h3 className="text-2xl font-bold">BlogSpace</h3>
              </div>
              <p className="text-gray-400 mb-4 max-w-md">
                Your go-to destination for insightful articles, tutorials, and stories from passionate writers around the world.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Categories</a></li>
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Development</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Design</a></li>
                <li><a href="#" className="hover:text-white transition-colors">React</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Accessibility</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm">
              &copy; 2024 BlogSpace. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Terms of Service</a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors text-sm">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>
      
      {/* Chat Widget */}
      <ChatWidget />
    </div>
  )
}