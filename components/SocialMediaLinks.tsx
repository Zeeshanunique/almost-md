import { Button } from "@/components/ui/button"
import { Github, Twitter } from "lucide-react"

const SocialMediaLinks = () => {
  return (
    <div className="flex gap-2">
      <a
        href="https://twitter.com/share"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button variant="ghost" size="icon">
          <Twitter className="h-4 w-4" />
          <span className="sr-only">Twitter</span>
        </Button>
      </a>
      <a
        href="https://github.com/yourusername/kanoonn"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Button variant="ghost" size="icon">
          <Github className="h-4 w-4" />
          <span className="sr-only">GitHub</span>
        </Button>
      </a>
    </div>
  )
}

export default SocialMediaLinks 