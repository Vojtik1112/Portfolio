# Vojta Novak - Portfolio

A high-performance 3D portfolio website built with Next.js 14.

## Features

- **3D Background**: Immersive "Smoked Glass" aesthetic with deferred Spline 3D integration.
- **Performance**: Optimized for 90+ Lighthouse score (LCP < 2.5s, TBT ~0ms).
- **Tech Stack**:
  - Next.js 14
  - TypeScript
  - Tailwind CSS
  - Framer Motion
  - Spline (3D Embed)

## Getting Started

1.  Install dependencies:

    ```bash
    npm install
    ```

2.  Run the development server:

    ```bash
    npm run dev
    ```

3.  Build for production:
    ```bash
    npm run build
    ```

## Performance Optimizations

- **Deferred Loading**: The heavy 3D background waits 1.5s after page load to initialize, preventing main thread blocking.
- **Asset Optimization**: Unused 3D libraries (`three`, `@react-three/fiber`) were removed to minimize bundle size.
- **Lazy Loading**: Iframes and heavy assets use `loading="lazy"`.

## License

This project is open source and available under the [MIT License](LICENSE).
