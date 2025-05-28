import Link from 'next/link';
import { BrainCircuit } from 'lucide-react'; // Example icon

export default function Header() {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-foreground hover:text-primary-accent transition-colors">
          <BrainCircuit size={28} className="text-primary-accent" />
          Leaked System Prompts
        </Link>
        {/* Future navigation items can go here */}
      </div>
    </header>
  );
}