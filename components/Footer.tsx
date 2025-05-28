export default function Footer() {
    const currentYear = new Date().getFullYear();
    return (
      <footer className="bg-muted text-muted-foreground py-8 text-center text-sm border-t border-border">
        <div className="container mx-auto px-4">
          <p>© {currentYear} Leaked System Prompts.</p>
          <p className="mt-1">This is a fan-curated archive. Not affiliated with any AI company.</p>
          <p className="mt-1">
            Source & Contribute on{' '}
            <a
              href="https://github.com/YeeKal/leaked-system-prompts"
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold underline"
            >
              GitHub
            </a>
            .
          </p>
        </div>
      </footer>
    );
  }