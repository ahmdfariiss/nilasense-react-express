import { ImageWithFallback } from '../elements/ImageWithFallback';

export function AuthLayout({ children, title, description, imageSrc }) {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-accent to-info relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <ImageWithFallback
          src={imageSrc}
          alt="NilaSense"
          className="absolute inset-0 w-full h-full object-cover opacity-40"
        />
        <div className="relative z-10 flex flex-col justify-center items-center text-white p-12">
          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center mb-6">
            <span className="text-5xl">🐟</span>
          </div>
          <h1 className="text-white mb-4" style={{ fontSize: '2.5rem', fontWeight: 700 }}>NilaSense</h1>
          <p className="text-white/90 text-center max-w-md" style={{ fontSize: '1.125rem' }}>
            {description}
          </p>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md">
          {/* Logo for mobile */}
          <div className="lg:hidden text-center mb-8">
            <div className="inline-flex w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-xl items-center justify-center mb-4">
              <span className="text-3xl">🐟</span>
            </div>
            <h1 className="text-primary" style={{ fontSize: '2rem', fontWeight: 700 }}>NilaSense</h1>
          </div>

          <div className="mb-8">
            <h2 className="text-foreground mb-2">{title}</h2>
            <p className="text-muted-foreground">{description}</p>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
}
