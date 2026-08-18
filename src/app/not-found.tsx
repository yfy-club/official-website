import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function NotFound() {
  return <main id="main-content" className="page-main page-shell not-found" tabIndex={-1}><p className="caps">404 / Off course</p><h1 className="display-latin">Lost track.</h1><p>这条航迹不存在，回到起点重新出发。</p><Button asChild><Link href="/">返回首页</Link></Button></main>;
}
