export function Footer() {
  return (
    <footer className="border-t border-th-border bg-th-surface py-6">
      <div className="mx-auto max-w-6xl px-4 text-center text-sm text-th-muted">
        &copy; {new Date().getFullYear()} MSP Plus. All rights reserved.
      </div>
    </footer>
  );
}
