import { ProjectCard } from "@/components/ProjectCard";
import { SmokedGlass } from "@/components/ui/SmokedGlass";
import { Github, Linkedin, Mail } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen">
      {/* Hero - Full Height */}
      <section
        id="hero"
        className="h-screen flex flex-col justify-center items-center text-center px-4 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80 pointer-events-none" />

        <h1 className="text-6xl md:text-9xl font-bold tracking-tighter bg-clip-text text-transparent bg-gradient-to-b from-white via-white to-white/10 mb-8 animate-in fade-in slide-in-from-bottom-10 duration-1000">
          VOJTIK
        </h1>
        <p className="text-lg md:text-xl text-white/60 max-w-lg mb-10 tracking-widest uppercase text-[10px] animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-200">
          Creative Developer &bull; 3D Specialist
        </p>
      </section>

      {/* Work Section */}
      <section
        id="work"
        className="min-h-screen py-32 px-4 md:px-8 max-w-7xl mx-auto relative z-10"
      >
        <div className="flex items-center gap-4 mb-16">
          <div className="h-px bg-white/10 flex-1" />
          <h2 className="text-2xl font-light tracking-widest text-white/80">
            SELECTED OPERATIONS
          </h2>
          <div className="h-px bg-white/10 flex-1" />
        </div>

        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <ProjectCard
            title="Quantum E-Commerce"
            description="High-frequency trading interface for digital assets. Optimized for <10ms latency."
            tags={["Next.js", "WebGL", "Socket.io"]}
            code={`// Use WebSocket for live price updates
const subscribeToTicker = (symbol) => {
    return socket.subscribe(\`ticker.\${symbol}\`, (data) => {
         updatePrice(data.price);
         // Trigger particle event
         scene.emit('pulse', { color: data.trend });
    });
}`}
          />

          <ProjectCard
            title="Neural Network Viz"
            description="Interactive 3D visualization of LLM attention heads using instanced mesh rendering."
            tags={["Three.js", "Python", "WebGPU"]}
            code={`class AttentionHead extends nn.Module {
    public function forward($x) {
        $B = $x->shape[0]; 
        // Compute query, key, values
        $q = $this->query($x); 
        $k = $this->key($x);
        
        return scaled_dot_product($q, $k);
    }
}`}
          />

          <ProjectCard
            title="Cyberpunk API"
            description="Robust backend infrastructure for a dystopian city management game."
            tags={["Laravel", "PostgreSQL", "Redis"]}
            code={`Route::middleware(['auth:api', 'security.level:5'])
    ->group(function () {
        Route::post('/grid/power', [PowerGridController::class, 'reroute']);
        Route::get('/citizens/{id}/scan', [SurveillanceController::class, 'scan']);
});`}
          />
        </div>
      </section>

      {/* About/Contact */}
      <section
        id="about"
        className="min-h-[80vh] flex flex-col justify-center items-center py-32 px-4 relative z-10"
      >
        <SmokedGlass className="max-w-2xl w-full text-center py-16 px-8 hover:bg-black/60 transition-colors">
          <h2 className="text-3xl font-bold mb-8 text-white">
            Initialize Contact Protocol
          </h2>
          <p className="text-white/60 mb-12 leading-relaxed">
            Currently available for freelance contracts and collaborative
            research. Specializing in high-performance WebGL interfaces and
            robust backend architecture.
          </p>

          <div className="flex justify-center gap-8">
            <a
              href="#"
              className="p-4 rounded-full bg-white/5 hover:bg-white/10 hover:text-white text-white/60 transition-all hover:scale-110"
            >
              <Github className="w-6 h-6" />
            </a>
            <a
              href="#"
              className="p-4 rounded-full bg-white/5 hover:bg-white/10 hover:text-white text-white/60 transition-all hover:scale-110"
            >
              <Mail className="w-6 h-6" />
            </a>
            <a
              href="#"
              className="p-4 rounded-full bg-white/5 hover:bg-white/10 hover:text-white text-white/60 transition-all hover:scale-110"
            >
              <Linkedin className="w-6 h-6" />
            </a>
          </div>
        </SmokedGlass>

        <footer className="absolute bottom-8 text-[10px] text-white/20 tracking-widest">
          SYSTEM VERSION 2.0.4 &bull; END OF LINE
        </footer>
      </section>
    </main>
  );
}
