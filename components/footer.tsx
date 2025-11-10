export function Footer() {
  const partners = [
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
      name: "มหาวิทยาลัยเชียงใหม่",
      link: "https://www.cmu.ac.th/",
      logo: "/images/logo/cmu.png",
    },
    {
      name: "จังหวัดเชียงใหม่",
      link: "https://www.chiangmai.go.th/",
      logo: "/images/logo/cm.jpg",
    },
  ]

  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col items-center gap-6">
          <div className="text-center">
            <h3 className="font-heading text-sm font-semibold text-foreground/80 mb-4">
              ระบบสารสนเทศการเตือนภัยน้ำท่วมเขตเมือง จังหวัดเชียงใหม่
            </h3>
          </div>

          {/* 🔹 แสดงโลโก้ */}
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
            {partners.map((partner) => (
              <a
                key={partner.name}
                href={partner.link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center gap-2 group cursor-pointer transition-transform hover:scale-105"
              >
                <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white shadow-sm flex items-center justify-center border border-primary/20 group-hover:border-primary/40 transition">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-w-[80%] max-h-[80%] object-contain"
                  />
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer   // ✅ เพิ่มบรรทัดนี้
