export default async function Page({ params }: { params: { slug: string } }) {
    const { slug } = params;
  
    let html = "";
  
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/pages/${slug}.html`, {
        cache: "no-cache",
      });
      html = await res.text();
    } catch (error) {
      console.error("Failed to load HTML", error);
    }
  
    if (!html) {
      return <div className="flex items-center justify-center h-screen">Page not found.</div>;
    }
  
    return (
      <div dangerouslySetInnerHTML={{ __html: html }} />
    );
  }
  