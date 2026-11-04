import Link from "next/link";

// 없는 주소는 검색엔진에 올라가지 않게 하고, 레이아웃의 홈 canonical·og:url도 물려받지 않아요
export const metadata = {
  title: "페이지를 찾을 수 없어요",
  robots: { index: false, follow: false },
  alternates: { canonical: null },
  openGraph: null,
};

export default function NotFound() {
  return (
    <div className="hero">
      <p className="empty">
        찾는 페이지가 없어요. <Link href="/">홈으로 가기</Link>
      </p>
    </div>
  );
}
