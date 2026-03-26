import { useEffect, useRef, useState } from "react";
import {
  XCircle, MessageCircle, FlaskConical, Rocket,
  Check, ChevronDown, X, Shield, Clock, PhoneOff,
} from "lucide-react";

const CTA_URL = "https://docs.google.com/forms/d/e/1FAIpQLScLwTqK1y4cm6ZDcygQZ-3PLoVX1Xd6TMh-NsXx-tv9WFJ6dw/viewform";

// ── カスタムフック: Intersection Observer ─────────────────────────────────
function useInView(options = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        observer.unobserve(el);
      }
    }, { threshold: 0.12, ...options });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return [ref, inView];
}

// ── フェードインラッパー ──────────────────────────────────────────────────
function FadeIn({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={`transition-none ${className} ${inView ? "animate-fade-in-up" : "fade-hidden"}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

// ── 緊急性バッジ ──────────────────────────────────────────────────────────
function UrgencyBadge() {
  return (
    <p className="inline-flex items-center gap-2 text-xs font-semibold text-red-400 bg-red-400/10 border border-red-400/30 rounded-full px-4 py-1.5 mb-5">
      <span className="relative flex h-2 w-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
        <span className="relative inline-flex rounded-full h-2 w-2 bg-red-400" />
      </span>
      今月末受付終了 ／ 残り3社限定
    </p>
  );
}

// ── CTAボタン共通 ─────────────────────────────────────────────────────────
function CtaButton({ label = "無料診断はこちら（3分・営業連絡なし）", size = "lg" }) {
  const base = "block w-full sm:w-auto text-center bg-cyan-400 text-slate-950 font-bold hover:bg-cyan-300 active:scale-95 transition-all shadow-lg shadow-cyan-400/20 rounded-xl";
  const sz = size === "lg" ? "px-10 py-4 text-lg" : "px-8 py-3.5 text-base";
  return (
    <a href={CTA_URL} target="_blank" rel="noopener noreferrer" className={`${base} ${sz}`}>
      {label}
    </a>
  );
}

// ── CTA直下の安心文言 ─────────────────────────────────────────────────────
function CtaTrust({ center = true }) {
  return (
    <div className={`mt-3 ${center ? "text-center" : ""}`}>
      <p className="text-sm text-green-400 font-medium">最短即日でご提案いたします</p>
      <p className="text-xs text-gray-500 mt-1">記入3分・費用ゼロ・営業連絡なし</p>
    </div>
  );
}

// ── インラインCTAバナー（中間挿入用） ────────────────────────────────────
function InlineCta({ title, sub }) {
  return (
    <FadeIn>
      <div className="my-4 border border-cyan-400/20 bg-cyan-400/5 rounded-2xl px-6 py-8 text-center">
        <UrgencyBadge />
        <p className="font-bold text-lg mb-1">{title}</p>
        <p className="text-gray-400 text-sm mb-6">{sub}</p>
        <div className="flex justify-center">
          <CtaButton />
        </div>
        <CtaTrust />
      </div>
    </FadeIn>
  );
}

// ── データ定義 ────────────────────────────────────────────────────────────
const SOCIAL_PROOF = [
  { num: "12社以上", label: "累計導入実績" },
  { num: "5業種", label: "卸売・製造・物流・小売・サービス" },
  { num: "平均▲73%", label: "繰り返し作業の削減率" },
  { num: "98%", label: "導入後の継続率" },
];

const PAIN_POINTS = [
  "毎朝1〜2時間、同じデータをExcelに手入力している",
  "担当者が辞めると、業務の引き継ぎに1ヶ月以上かかる",
  "月末・締め日だけ全員残業しても、処理が追いつかない",
  "入力ミスで取引先に謝罪・再対応が発生したことがある",
  "採用しても定着せず、今いるメンバーへの負荷が増え続けている",
  "IT化したいが、導入費用と運用コストが見合わない気がする",
];

const STEPS = [
  {
    icon: MessageCircle,
    num: "01",
    title: "無料ヒアリング（30分）",
    desc: "現状の業務をお聞きし、自動化できる箇所と削減効果の概算を無料でご提示します。話を聞くだけでも、課題の整理になります。",
  },
  {
    icon: FlaskConical,
    num: "02",
    title: "PoC・動作確認（1〜2週間）",
    desc: "実際の業務データで試作品を作成し、効果を確認してから契約。「動くかどうかわからない」というリスクをゼロにしてから進みます。",
  },
  {
    icon: Rocket,
    num: "03",
    title: "本番導入・運用開始",
    desc: "既存のPCにインストールするだけで稼働。専用サーバーもクラウド契約も不要です。月次メンテナンスも月額料金に含まれます。",
  },
];

const CASES = [
  {
    industry: "卸売業・従業員20名",
    before: "受注のたびにExcelへ手入力し、請求書作成まで毎日3時間かけていた",
    after: "受注メールが届いた瞬間に自動処理。担当者の作業は内容確認のみに",
    result: "作業時間 ▲85% ／ 入力ミス ゼロ ／ 残業がほぼなくなった",
  },
  {
    industry: "製造業・従業員45名",
    before: "基幹システムへの日報入力を7名が毎日1時間以上かけて担当していた",
    after: "現場タブレットの入力データが自動で基幹システムへ連携",
    result: "事務スタッフ 14名→6名に ／ 人件費 ▲57% ／ ミスによる手戻りがゼロに",
  },
  {
    industry: "サービス業・従業員12名",
    before: "月次集計レポートを毎月2日がかりで手作業で作成していた",
    after: "ボタンひとつで自動生成・PDF出力・関係者へのメール送付まで完了",
    result: "月16時間の作業が5分に ／ 担当者が本来の仕事に集中できるように",
  },
];

const FAQS = [
  {
    q: "既存のシステムやExcelと共存できますか？",
    a: "はい。現在お使いのExcel・基幹システム・Webシステムはそのまま使い続けられます。システムの移行や変更は一切不要です。",
  },
  {
    q: "専用サーバーやクラウド契約は必要ですか？",
    a: "不要です。現在お使いのWindowsPCで動作します。追加のIT投資なしに始められます。",
  },
  {
    q: "月額8万円に含まれるものを教えてください。",
    a: "ツールのライセンス料・月次メンテナンス・軽微な仕様変更対応が含まれます。別途請求が発生しにくい料金体系にしています。",
  },
  {
    q: "担当者が退職しても、業務は止まりませんか？",
    a: "止まりません。自動化した業務フローはドキュメント化されているため、引き継ぎは数時間で完了します。「あの人しかわからない」業務がなくなります。",
  },
  {
    q: "契約前に本当に動くか確認できますか？",
    a: "できます。契約前のPoC（試作）フェーズで実際のデータを使って動作を確認します。「動いてから契約」が基本方針です。",
  },
];

const PRICING_INCLUDES = [
  "ツールライセンス費用を含む（別途請求なし）",
  "月次メンテナンス・軽微な仕様変更対応を含む",
  "専用サーバー・クラウド契約は一切不要",
  "既存のWindowsPCで今日から稼働可能",
];

const REASSURANCES = [
  { icon: Shield, text: "費用・契約は？", sub: "診断・ヒアリングは完全無料。その場で契約を求めることはありません。" },
  { icon: PhoneOff, text: "営業はある？", sub: "不要と判断した場合、こちらから連絡することはありません。" },
  { icon: Clock, text: "時間はかかる？", sub: "フォーム記入3分、ヒアリング30分。それ以上の手間はかけません。" },
];

// ── FAQアコーディオン ─────────────────────────────────────────────────────
function FaqItem({ faq, delay }) {
  const [open, setOpen] = useState(false);
  return (
    <FadeIn delay={delay}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left bg-slate-800 border border-slate-700 hover:border-slate-600 rounded-xl px-6 py-5 transition-colors"
      >
        <div className="flex items-center justify-between gap-4">
          <span className="font-semibold text-sm md:text-base">{faq.q}</span>
          <ChevronDown
            size={18}
            className={`shrink-0 text-cyan-400 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          />
        </div>
        <div className={`overflow-hidden transition-all duration-300 ${open ? "max-h-48 mt-3" : "max-h-0"}`}>
          <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
        </div>
      </button>
    </FadeIn>
  );
}

// ── プライバシーポリシーモーダル ──────────────────────────────────────────
function PrivacyModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto p-8 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-300 transition-colors"
          aria-label="閉じる"
        >
          <X size={20} />
        </button>
        <h2 className="text-lg font-bold mb-6">プライバシーポリシー</h2>

        <section className="mb-5">
          <h3 className="text-sm font-semibold text-cyan-400 mb-2">1. 個人情報の利用目的</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            お問い合わせフォームを通じていただいた氏名・メールアドレス・会社名等の個人情報は、
            以下の目的にのみ使用します。
          </p>
          <ul className="text-gray-400 text-sm leading-relaxed mt-2 space-y-1 pl-4 list-disc">
            <li>無料診断・ヒアリングのご連絡</li>
            <li>サービスに関するご提案・お見積りのご連絡</li>
            <li>お問い合わせへの回答</li>
          </ul>
        </section>

        <section className="mb-5">
          <h3 className="text-sm font-semibold text-cyan-400 mb-2">2. 第三者への提供</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            取得した個人情報は、法令に基づく場合を除き、第三者へ提供・開示することはありません。
          </p>
        </section>

        <section className="mb-5">
          <h3 className="text-sm font-semibold text-cyan-400 mb-2">3. 個人情報の管理</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            個人情報の漏洩・紛失・改ざんを防ぐため、適切な安全管理措置を講じます。
          </p>
        </section>

        <section className="mb-5">
          <h3 className="text-sm font-semibold text-cyan-400 mb-2">4. 個人情報の開示・訂正・削除</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            ご本人からの個人情報の開示・訂正・削除のご要望には、合理的な範囲で速やかに対応いたします。
          </p>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-cyan-400 mb-2">5. お問い合わせ先</h3>
          <p className="text-gray-400 text-sm leading-relaxed">
            個人情報の取り扱いに関するお問い合わせは下記までご連絡ください。
          </p>
          <p className="text-sm mt-2">
            合同会社More Agri
            <br />
            <a href="mailto:info@more-agri.com" className="text-cyan-400 hover:underline">
              info@more-agri.com
            </a>
          </p>
        </section>
      </div>
    </div>
  );
}

// ── スティッキーCTAバー ───────────────────────────────────────────────────
function StickyCTA() {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (dismissed) return null;

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 transition-transform duration-300 ${visible ? "translate-y-0" : "translate-y-full"}`}>
      <div className="bg-slate-900/95 backdrop-blur border-t border-slate-700 px-4 py-3 flex items-center justify-between gap-3 max-w-screen-lg mx-auto">
        <p className="text-sm text-gray-300 hidden sm:block shrink-0">
          今の業務、自動化できます。<span className="text-cyan-400 font-semibold">まず診断を。</span>
        </p>
        <a
          href={CTA_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 sm:flex-none text-center bg-cyan-400 text-slate-950 px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-cyan-300 transition-colors"
        >
          無料診断はこちら（3分・営業連絡なし）
        </a>
        <button
          onClick={() => setDismissed(true)}
          className="text-gray-500 hover:text-gray-300 transition-colors shrink-0 p-1"
          aria-label="閉じる"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  );
}

// ── メインコンポーネント ──────────────────────────────────────────────────
export default function App() {
  const [showPrivacy, setShowPrivacy] = useState(false);
  return (
    <div className="min-h-screen bg-slate-950 text-white">

      {/* ===== HERO ===== */}
      <section className="relative px-6 py-20 md:py-28 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/8 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-3xl mx-auto text-center">
          <FadeIn>
            <UrgencyBadge />
          </FadeIn>
          <FadeIn delay={80}>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
              その事務作業、<br />
              <span className="text-cyan-400">まだ手でやっていますか？</span>
            </h1>
          </FadeIn>
          <FadeIn delay={140}>
            <p className="text-xl md:text-2xl font-semibold text-white mb-4">
              自動化すれば、作業時間を最大80%削減できます。
            </p>
          </FadeIn>
          <FadeIn delay={200}>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              人件費削減・残業ゼロ・入力ミス根絶を同時に実現。<br />
              初期費用0円・月額8万円から。既存PCのみで稼働。
            </p>
          </FadeIn>
          <FadeIn delay={280}>
            {/* CTA① */}
            <div className="flex justify-center">
              <CtaButton />
            </div>
            <CtaTrust />
            {/* 安心バッジ */}
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {["即日対応可", "既存システムそのまま利用可", "初期費用0円"].map((badge) => (
                <span key={badge} className="text-xs text-gray-400 bg-slate-800 border border-slate-700 rounded-full px-3 py-1">
                  ✓ {badge}
                </span>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ===== FOR WHOM ===== */}
      <section className="px-6 py-12">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <h2 className="text-xl md:text-2xl font-bold text-center mb-6 text-gray-300">
              こんな会社におすすめです
            </h2>
          </FadeIn>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                emoji: "📊",
                title: "Excel作業が多い会社",
                desc: "転記・集計・帳票作成など、Excelを使った繰り返し作業が日常的に発生している。",
              },
              {
                emoji: "🙋",
                title: "人手不足で業務が回らない会社",
                desc: "採用が難しく、今いるメンバーへの負荷が増え続けている。辞めたら回らなくなる業務がある。",
              },
              {
                emoji: "⏱️",
                title: "事務作業を減らしたい会社",
                desc: "本来やるべき仕事に時間を使えていない。ミスや確認作業に追われている。",
              },
            ].map(({ emoji, title, desc }, i) => (
              <FadeIn key={title} delay={i * 80}>
                <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-6 h-full">
                  <p className="text-3xl mb-3">{emoji}</p>
                  <p className="font-bold mb-2">{title}</p>
                  <p className="text-gray-400 text-sm leading-relaxed">{desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SOCIAL PROOF BAR ===== */}
      <section className="px-6 pb-6">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {SOCIAL_PROOF.map(({ num, label }) => (
                <div key={label} className="bg-slate-800/60 border border-slate-700 rounded-xl p-4 text-center">
                  <p className="text-xl font-bold text-cyan-400">{num}</p>
                  <p className="text-xs text-gray-400 mt-1 leading-snug">{label}</p>
                </div>
              ))}
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="px-6 pb-16 pt-4">
        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { num: "▲57%", label: "人件費削減", sub: "製造業 45名の実績" },
            { num: "▲85%", label: "作業時間削減", sub: "卸売業 20名の実績" },
            { num: "月16h→5分", label: "レポート作成時間", sub: "サービス業 12名の実績" },
          ].map(({ num, label, sub }, i) => (
            <FadeIn key={label} delay={i * 80}>
              <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5 text-center hover:border-cyan-400/40 transition-colors">
                <p className="text-2xl font-bold text-cyan-400">{num}</p>
                <p className="text-sm font-semibold mt-1">{label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{sub}</p>
              </div>
            </FadeIn>
          ))}
        </div>
      </section>

      {/* ===== PAIN ===== */}
      <section className="px-6 py-16 bg-slate-900 grid-bg">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">
              毎日の手作業、いつまで続けますか？
            </h2>
            <p className="text-center text-gray-400 text-sm mb-10">
              人を増やしても、根本的には解決しません。
            </p>
          </FadeIn>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {PAIN_POINTS.map((point, i) => (
              <FadeIn key={point} delay={i * 60}>
                <li className="flex items-start gap-3 bg-slate-800/80 border border-slate-700 rounded-xl px-5 py-4">
                  <XCircle size={16} className="text-red-400 mt-0.5 shrink-0" />
                  <span className="text-gray-300 text-sm leading-relaxed">{point}</span>
                </li>
              </FadeIn>
            ))}
          </ul>
          <FadeIn delay={400}>
            <p className="text-center text-cyan-400 font-semibold mt-8 mb-10">
              人を増やさなくても、仕事量は減らせます。それが業務自動化です。
            </p>
          </FadeIn>

          {/* CTA② 課題セクション直後 */}
          <InlineCta
            title="1つでも当てはまった方へ"
            sub="30分のヒアリングで、削減できる作業時間とコストを無料でお伝えします。"
          />
        </div>
      </section>

      {/* ===== FLOW ===== */}
      <section className="px-6 py-16 relative">
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-cyan-500/20 to-transparent" />
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">
              導入の流れ
            </h2>
            <p className="text-center text-gray-400 text-sm mb-12">
              動くことを確認してから契約。リスクゼロで始められます。
            </p>
          </FadeIn>
          <div className="flex flex-col gap-0">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              return (
                <FadeIn key={step.num} delay={i * 120}>
                  <div className="flex gap-5">
                    <div className="flex flex-col items-center shrink-0">
                      <div className="w-12 h-12 rounded-full bg-cyan-400 text-slate-950 font-bold flex items-center justify-center shadow-lg shadow-cyan-400/20">
                        <Icon size={20} />
                      </div>
                      {i < STEPS.length - 1 && (
                        <div className="w-px h-12 bg-gradient-to-b from-cyan-400/40 to-slate-700 my-1" />
                      )}
                    </div>
                    <div className="pb-10">
                      <p className="text-xs font-mono text-cyan-400 mb-0.5">{step.num}</p>
                      <p className="font-bold text-lg mb-1">{step.title}</p>
                      <p className="text-gray-400 text-sm leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== CASES ===== */}
      <section className="px-6 py-16 bg-slate-900 grid-bg">
        <div className="max-w-3xl mx-auto">
          <FadeIn>
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">
              自動化で変わった、3社の現場
            </h2>
            <p className="text-center text-gray-400 text-sm mb-10">
              いずれも、既存システムはそのまま。追加のIT投資なしに実現した成果です。
            </p>
          </FadeIn>
          <div className="flex flex-col gap-5">
            {CASES.map((c, i) => (
              <FadeIn key={c.industry} delay={i * 100}>
                <div className="bg-slate-800/80 border border-slate-700 hover:border-slate-600 rounded-xl p-6 transition-colors">
                  <p className="text-xs font-semibold text-cyan-400 tracking-wide mb-4 uppercase">
                    {c.industry}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
                    <div className="bg-slate-900/60 rounded-lg p-4">
                      <p className="text-xs text-gray-500 mb-1.5 font-medium">導入前</p>
                      <p className="text-sm text-gray-300 leading-relaxed">{c.before}</p>
                    </div>
                    <div className="bg-slate-900/60 rounded-lg p-4">
                      <p className="text-xs text-gray-500 mb-1.5 font-medium">導入後</p>
                      <p className="text-sm text-gray-300 leading-relaxed">{c.after}</p>
                    </div>
                  </div>
                  <p className="text-sm font-bold text-green-400 bg-green-400/10 border border-green-400/20 rounded-lg px-4 py-2 inline-block">
                    {c.result}
                  </p>
                </div>
              </FadeIn>
            ))}
          </div>

          {/* CTA③ 事例セクション直後 */}
          <div className="mt-10">
            <InlineCta
              title="あなたの会社でも、同じ変化が起きます。"
              sub="業種・規模・使用システムを問わず対応可能です。まずは現状をお聞かせください。"
            />
          </div>
        </div>
      </section>

      {/* ===== PRICING ===== */}
      <section className="px-6 py-16 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-cyan-500/6 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-xl mx-auto text-center">
          <FadeIn>
            <h2 className="text-2xl md:text-3xl font-bold mb-3">シンプルな料金体系</h2>
            <p className="text-gray-400 text-sm mb-8">
              初期費用ゼロ。月額固定で、予算が読みやすい設計です。
            </p>
          </FadeIn>
          <FadeIn delay={80}>
            <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-8">
              <div className="flex justify-center gap-8 mb-6">
                <div>
                  <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">初期費用</p>
                  <p className="text-4xl font-bold">0<span className="text-xl text-gray-400">円</span></p>
                </div>
                <div className="w-px bg-slate-700" />
                <div>
                  <p className="text-xs text-gray-500 mb-1 uppercase tracking-wide">月額</p>
                  <p className="text-4xl font-bold text-cyan-400">8<span className="text-xl text-gray-400">万円〜</span></p>
                </div>
              </div>
              <ul className="text-sm text-gray-400 space-y-2.5 text-left mb-8">
                {PRICING_INCLUDES.map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <Check size={15} className="text-cyan-400 shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
              {/* CTA④ 料金セクション */}
              <CtaButton />
              <CtaTrust />
              <p className="text-xs text-red-400 mt-2">※ モニター価格。残り3社で受付終了</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section className="px-6 py-16 bg-slate-900 grid-bg">
        <div className="max-w-2xl mx-auto">
          <FadeIn>
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-3">
              よくある質問
            </h2>
            <p className="text-center text-gray-400 text-sm mb-10">
              導入前の不安に、正直にお答えします。
            </p>
          </FadeIn>
          <div className="flex flex-col gap-3">
            {FAQS.map((faq, i) => (
              <FaqItem key={faq.q} faq={faq} delay={i * 60} />
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL CTA ===== */}
      <section className="px-6 py-20 relative overflow-hidden bg-gradient-to-b from-slate-900 to-slate-950">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-cyan-500/8 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-xl mx-auto text-center">
          <FadeIn>
            <UrgencyBadge />
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              今の業務量、人を増やさずに減らせます。
            </h2>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              まず30分、現状をお聞かせください。<br />
              自動化できる業務と、削減できるコストを無料でご提示します。
            </p>
          </FadeIn>

          {/* よくある不安を解消するミニブロック */}
          <FadeIn delay={80}>
            <div className="grid grid-cols-3 gap-3 mb-8">
              {REASSURANCES.map(({ icon: Icon, text, sub }) => (
                <div key={text} className="bg-slate-800/60 border border-slate-700 rounded-xl p-4">
                  <Icon size={18} className="text-cyan-400 mx-auto mb-2" />
                  <p className="text-xs font-bold mb-1">{text}</p>
                  <p className="text-xs text-gray-500 leading-snug">{sub}</p>
                </div>
              ))}
            </div>
          </FadeIn>

          {/* CTA⑤ フッター前 */}
          <FadeIn delay={160}>
            <p className="text-gray-300 text-sm font-medium mb-5">
              迷っているうちに、受付枠が埋まります。<br />
              <span className="text-white">まず話を聞くだけでも構いません。</span>
            </p>
            <div className="flex justify-center">
              <CtaButton />
            </div>
            <CtaTrust />
          </FadeIn>
        </div>
      </section>

      {/* ===== 信頼一文 ===== */}
      <div className="px-6 py-4 bg-slate-900 border-t border-slate-800 text-center">
        <p className="text-xs text-gray-500">
          中小企業を中心に業務効率化を支援しています
        </p>
      </div>

      {/* ===== FOOTER ===== */}
      <footer className="bg-slate-900 border-t border-slate-800 px-6 py-10">
        <div className="max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-center sm:text-left">
            <p className="font-bold text-white text-sm">合同会社More Agri</p>
            <a
              href="mailto:info@more-agri.com"
              className="text-gray-400 text-xs hover:text-cyan-400 transition-colors mt-1 block"
            >
              info@more-agri.com
            </a>
          </div>
          <div className="text-center sm:text-right">
            <button
              onClick={() => setShowPrivacy(true)}
              className="text-xs text-gray-500 hover:text-gray-300 transition-colors underline underline-offset-2"
            >
              プライバシーポリシー
            </button>
            <p className="text-xs text-gray-600 mt-2">
              © 2026 More Agri All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* ===== STICKY CTA ===== */}
      <StickyCTA />

      {/* ===== PRIVACY MODAL ===== */}
      {showPrivacy && <PrivacyModal onClose={() => setShowPrivacy(false)} />}

    </div>
  );
}
