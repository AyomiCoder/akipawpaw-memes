import { Github, Twitter, Instagram, Heart } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-slate-900 to-purple-900 border-t border-purple-500/20 py-12 px-4 mt-16">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left animate-fade-in">
            <h3 className="text-2xl font-black text-transparent bg-gradient-to-r from-yellow-400 to-pink-400 bg-clip-text mb-2">
              AkiPawPaw
            </h3>
            <p className="text-gray-400">Where memes come to life 🔥</p>
          </div>

          <div className="flex gap-6 animate-fade-in" style={{ animationDelay: "200ms" }}>
            <a
              href="#"
              className="text-gray-400 hover:text-cyan-400 transition-all duration-300 hover:scale-110 transform"
            >
              <Twitter className="h-6 w-6" />
              <span className="sr-only">Twitter</span>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-pink-400 transition-all duration-300 hover:scale-110 transform"
            >
              <Instagram className="h-6 w-6" />
              <span className="sr-only">Instagram</span>
            </a>
            <a
              href="#"
              className="text-gray-400 hover:text-purple-400 transition-all duration-300 hover:scale-110 transform"
            >
              <Github className="h-6 w-6" />
              <span className="sr-only">Github</span>
            </a>
          </div>
        </div>

        <div
          className="border-t border-purple-500/20 mt-8 pt-8 text-center animate-fade-in"
          style={{ animationDelay: "400ms" }}
        >
          <p className="text-gray-400 flex items-center justify-center gap-2">
            Made with <Heart className="h-4 w-4 text-red-400 animate-pulse" /> by Nollywood&apos;s Number One Fan
          </p>
          <p className="text-xs text-gray-500 mt-2">© {new Date().getFullYear()} AkiPawPaw. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
