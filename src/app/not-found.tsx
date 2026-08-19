import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main id="main-content" className="page-main page-shell not-found" tabIndex={-1}>
      <p className="caps">404 / Not Found</p>
      <h1 className="display-latin">Page Not Found.</h1>
      <p>当前访问的页面不存在或已被移动，请返回首页继续浏览。</p>
      <Button asChild>
        <Link href="/">返回首页</Link>
      </Button>
    </main>
  );
}
