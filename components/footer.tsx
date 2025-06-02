import { Heart } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-slate-900 to-purple-900 border-t border-purple-500/20 py-12 px-4 mt-16">
      <div className="container mx-auto">
        <div
          className="text-center animate-fade-in"
          style={{ animationDelay: "400ms" }}
        >
          <p className="text-gray-400 flex items-center justify-center gap-2">
            Made with <Heart className="h-4 w-4 text-red-400 animate-pulse" /> by{" "}
            <a
              href="https://github.com/ayomide"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 transition-colors"
            >
              Ayomide
            </a>
          </p>
          <p className="text-xs text-gray-500 mt-2">Contents are subject to copyright</p>
        </div>
      </div>
    </footer>
  )
}
