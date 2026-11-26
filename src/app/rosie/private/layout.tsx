export default function RosiePrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        header.fixed.top-0:not([class*="advisory"]) { display: none !important; }
        footer:not([class*="advisory"]) { display: none !important; }
        .fixed.right-6.bottom-\\[90px\\] { display: none !important; }
        .fixed.bottom-4, .fixed.bottom-6 { display: none !important; }
        [class*="cookie"] { display: none !important; }
        main { padding-top: 0 !important; }
      `}} />
      {children}
    </>
  )
}
