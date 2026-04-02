import Link from "next/link"

export function ChiangMaiLanding() {
  const partners = [
    {
      name: "สำนักงานทรัพยากรน้ำแห่งชาติ",
      link: "https://www.onwr.go.th/",
      logo: "/images/logo/สทนช.png",
    },
    {
      name: "กระทรวงการอุดมศึกษา วิทยาศาสตร์ วิจัยและนวัตกรรม",
      link: "https://www.mhesi.go.th/",
      logo: "/images/logo/HESRI.png",
    },
    {
      name: "สำนักงานคณะกรรมการส่งเสริมวิทยาศาสตร์ วิจัยและนวัตกรรม",
      link: "https://www.tsri.or.th/",
      logo: "/images/logo/TRF.png",
    },
    {
      name: "สำนักงานการวิจัยแห่งชาติ (วช.)",
      link: "https://www.nrct.go.th/",
      logo: "/images/logo/NRCT.png",
    },
    {
      name: "กรมป้องกันและบรรเทาสาธารณภัย",
      link: "https://www.disaster.go.th/",
      logo: "/images/logo/ปภ.jpg",
    },
    {
      name: "มหาวิทยาลัยเชียงใหม่",
      link: "https://www.cmu.ac.th/",
      logo: "/images/logo/cmu.png",
    },
    {
      name: "กรมชลประทาน",
      link: "https://www.rid.go.th/index.php/th/",
      logo: "/images/logo/กรมชล.png",
    },
    {
      name: "จังหวัดเชียงใหม่",
      link: "https://www.chiangmai.go.th/",
      logo: "/images/logo/cm.jpg",
    },
  ]

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#eff6ff_0%,#f8fbff_35%,#ffffff_100%)] px-6 py-16">
      <div className="mx-auto flex min-h-[calc(100vh-8rem)] max-w-6xl flex-col justify-center">
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
          {partners.map((partner) => (
            <a
              key={partner.name}
              href={partner.link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center gap-2 group cursor-pointer transition-transform hover:scale-105"
            >
              <img
                src={partner.logo}
                alt={partner.name}
                className={`object-contain transition ${
                  partner.name === "มหาวิทยาลัยเชียงใหม่"
                    ? "w-24 h-24 md:w-28 md:h-32"
                    : "w-16 h-16 md:w-20 md:h-18"
                }`}
              />
            </a>
          ))}
        </div>
        <div className="mx-auto max-w-4xl text-center">
          <p className="mb-4 inline-flex rounded-full border border-blue-200 bg-white/80 px-4 py-1 text-sm font-medium text-blue-700 shadow-sm">
            โครงการ
          </p>
          <h1 className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
            ระบบการเตือนภัยและแนวทางการป้องกัน
            <br></br>
            น้ำท่วมในเขตเมือง จังหวัดเชียงใหม่
          </h1>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2">
          <Link
            href="/chiangmai/cmflood"
            className="block rounded-3xl border border-blue-100 bg-white/90 p-8 shadow-[0_24px_80px_-32px_rgba(37,99,235,0.35)] backdrop-blur transition-all hover:-translate-y-1 hover:border-blue-300 hover:bg-blue-50/90 hover:shadow-[0_28px_90px_-32px_rgba(37,99,235,0.42)] hover:ring-4 hover:ring-blue-100"
          >
            <div className="mb-5 h-1.5 w-20 rounded-full bg-blue-500" />
            <h2 className="text-2xl font-semibold text-slate-900">
              โครงการย่อย 1 : <br></br>ระบบเตือนภัยน้ำท่วมเขตเมือง จังหวัดเชียงใหม่
            </h2>
          </Link>

          <Link
            href="/chiangmai"
            className="block rounded-3xl border border-blue-100 bg-white/90 p-8 shadow-[0_24px_80px_-32px_rgba(37,99,235,0.35)] backdrop-blur transition-all hover:-translate-y-1 hover:border-blue-300 hover:bg-blue-50/90 hover:shadow-[0_28px_90px_-32px_rgba(37,99,235,0.42)] hover:ring-4 hover:ring-blue-100"
          >
            <div className="mb-5 h-1.5 w-20 rounded-full bg-blue-500" />
            <h2 className="text-2xl font-semibold text-slate-900">
              โครงการย่อย 2 : <br></br>ระบบติดตามโครงการแก้ไขปัญหาน้ำท่วมเขตเมืองจังหวัดเชียงใหม่
            </h2>
          </Link>
        </div>
      </div>
    </main>
  )
}
