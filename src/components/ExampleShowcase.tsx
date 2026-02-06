import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'

/**
 * ExampleShowcase - A component demonstrating the modern design system
 * 
 * This component can be imported into any page to showcase the available
 * UI components and their variants with the new vibrant color scheme.
 */
export function ExampleShowcase() {
  return (
    <div className="container mx-auto px-4 py-16 space-y-12">
      {/* Buttons Section */}
      <section className="space-y-4">
        <h2 className="text-3xl font-bold">Buttons</h2>
        <div className="flex flex-wrap gap-3">
          <Button>Primary Button</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link</Button>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button size="sm">Small</Button>
          <Button size="default">Default</Button>
          <Button size="lg">Large</Button>
        </div>
      </section>

      {/* Badges Section */}
      <section className="space-y-4">
        <h2 className="text-3xl font-bold">Badges</h2>
        <div className="flex flex-wrap gap-2">
          <Badge>Default</Badge>
          <Badge variant="secondary">Secondary</Badge>
          <Badge variant="outline">Outline</Badge>
          <Badge variant="destructive">Destructive</Badge>
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="info">Info</Badge>
        </div>
      </section>

      {/* Cards Section */}
      <section className="space-y-4">
        <h2 className="text-3xl font-bold">Cards</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>This is a beautiful card with modern styling</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Cards come with hover effects and smooth transitions out of the box.
              </p>
            </CardContent>
          </Card>
          <Card className="border-primary/50 bg-gradient-to-br from-primary/5 to-accent/5">
            <CardHeader>
              <CardTitle className="gradient-text">Gradient Card</CardTitle>
              <CardDescription>Cards can have gradient backgrounds</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Use utility classes to create stunning visual effects.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Form Inputs Section */}
      <section className="space-y-4">
        <h2 className="text-3xl font-bold">Form Inputs</h2>
        <Card className="max-w-2xl">
          <CardHeader>
            <CardTitle>Modern Form Fields</CardTitle>
            <CardDescription>Inputs with enhanced focus states and hover effects</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input type="email" placeholder="Enter your email" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Message</label>
              <Textarea placeholder="Type your message here..." />
            </div>
            <Button className="w-full">Submit</Button>
          </CardContent>
        </Card>
      </section>

      {/* Color Palette Section */}
      <section className="space-y-4">
        <h2 className="text-3xl font-bold">Color Palette</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-2">
            <div className="h-24 rounded-lg bg-gradient-primary"></div>
            <p className="text-sm font-medium">Primary Gradient</p>
          </div>
          <div className="space-y-2">
            <div className="h-24 rounded-lg bg-gradient-secondary"></div>
            <p className="text-sm font-medium">Secondary Gradient</p>
          </div>
          <div className="space-y-2">
            <div className="h-24 rounded-lg bg-gradient-success"></div>
            <p className="text-sm font-medium">Success Gradient</p>
          </div>
          <div className="space-y-2">
            <div className="h-24 rounded-lg bg-primary"></div>
            <p className="text-sm font-medium">Primary</p>
          </div>
          <div className="space-y-2">
            <div className="h-24 rounded-lg bg-accent"></div>
            <p className="text-sm font-medium">Accent</p>
          </div>
          <div className="space-y-2">
            <div className="h-24 rounded-lg bg-success"></div>
            <p className="text-sm font-medium">Success</p>
          </div>
          <div className="space-y-2">
            <div className="h-24 rounded-lg bg-warning"></div>
            <p className="text-sm font-medium">Warning</p>
          </div>
          <div className="space-y-2">
            <div className="h-24 rounded-lg bg-info"></div>
            <p className="text-sm font-medium">Info</p>
          </div>
        </div>
      </section>
    </div>
  )
}
