import React from 'react';
import { AnimatedText } from '@/components/ocean/AnimatedText';
import { Button as OceanButton } from '@/components/ocean/Button';
import { Card as OceanCard } from '@/components/ocean/Card';
import { Footer } from '@/components/ocean/Footer';
import { GlassmorphicCard } from '@/components/ocean/GlassmorphicCard';
import { Navbar } from '@/components/ocean/Navbar';
import { Alert } from '@/registry/new-york/ui/alert';
import { Button as UiButton } from '@/registry/new-york/ui/button';
import { Card as UiCard } from '@/registry/new-york/ui/card';
import { ModeToggle } from '@/components/ui/dark';
import { Dialog } from '@/registry/new-york/ui/dialog';
import { Drawer } from '@/registry/new-york/ui/drawer';
import { DropdownMenu } from '@/registry/new-york/ui/dropdown-menu';
import { Input } from '@/registry/new-york/ui/input';
import { Label } from '@/registry/new-york/ui/label';
import { Popover } from '@/registry/new-york/ui/popover';
import { Textarea } from '@/registry/new-york/ui/textarea';

interface ComponentPreviewProps {
  componentName: string;
}

const ComponentPreview: React.FC<ComponentPreviewProps> = ({ componentName }) => {
  switch (componentName) {
    case 'animated-text':
      return <AnimatedText text="Hello world!"/>;
    case 'button':
      return (
        <div className="flex gap-4">
          <OceanButton>Ocean Button</OceanButton>
          <UiButton>UI Button</UiButton>
        </div>
      );
    case 'card':
      return (
        <div className="flex gap-4">
          <OceanCard>Ocean Card</OceanCard>
          <UiCard>UI Card</UiCard>
        </div>
      );
    case 'footer':
      return <Footer />;
    case 'glassmorphic-card':
      return <GlassmorphicCard><p></p></GlassmorphicCard>;
    case 'navbar':
      return <Navbar />;
    case 'alert':
      return <Alert />;
    case 'dark':
        return <ModeToggle />;
    case 'dialog':
      return <Dialog />;
    case 'drawer':
      return <Drawer />;
    case 'dropdown-menu':
      return <DropdownMenu />;
    case 'input':
      return <Input />;
    case 'label':
      return <Label>Label</Label>;
    case 'popover':
      return <Popover />;
    case 'textarea':
      return <Textarea />;
    default:
      return <div>Component preview not available</div>;
  }
};

export default ComponentPreview;
