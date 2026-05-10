import Link from 'next/link';
import { BrainCircuit, ExternalLink} from 'lucide-react'; // Example icon
import { Button } from './ui/button';

export default function Header() {
  return (
    <header className="bg-card border-b border-border sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold text-foreground hover:text-primary-accent transition-colors">
          <BrainCircuit size={28} className="text-primary-accent" />
          Leaked System Prompts
        </Link>
        {/* Future navigation items can go here */}
        

        <Link href="https://github.com/YeeKal/leaked-system-prompts" target='_blank' className='text-2xl'>
            <Button variant="default">GitHub
              <ExternalLink/>
            </Button>
            
             {/* <img alt="GitHub stars" src="https://img.shields.io/github/stars/YeeKal/leaked-system-prompts?style=social"></img> */}
          </Link>
      </div>
    </header>
  );
}